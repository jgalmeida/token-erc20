import React, { Component } from "react";
import BakuToken from "./contracts/Baku.json";
import BakuTokenSale from "./contracts/BakuTokensale.json";
import Kyc from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";
class App extends Component {
  state = { loaded: false, tokenSaleAddress: '', userTokens: 0, weiRaised: 0, tokenSaleRemainingSupply: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.baku = new this.web3.eth.Contract(
        BakuToken.abi,
        BakuToken.networks[this.networkId] && BakuToken.networks[this.networkId].address,
      );

      this.bakuTokenSale = new this.web3.eth.Contract(
        BakuTokenSale.abi,
        BakuTokenSale.networks[this.networkId] && BakuTokenSale.networks[this.networkId].address,
      );

      this.kyc = new this.web3.eth.Contract(
        Kyc.abi,
        Kyc.networks[this.networkId] && Kyc.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({ loaded: true, tokenSaleAddress: BakuTokenSale.networks[this.networkId].address }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value
    });
  }

  handleKycWhitelisting = async () => {
    await this.kyc.methods.setKycCompleted(this.state.kycAddress).send({ from: this.accounts[0] });
    alert('KYC completed for: ' + this.state.kycAddress);
  }

  updateUserTokens = async () => {
    const userTokens = await this.baku.methods.balanceOf(this.accounts[0]).call();
    const weiRaised = await this.bakuTokenSale.methods.weiRaised().call();
    const tokenSaleRemainingSupply = await this.baku.methods.balanceOf(BakuTokenSale.networks[this.networkId].address).call();

    this.setState({ userTokens, weiRaised, tokenSaleRemainingSupply })
  }

  listenToTokenTransfer = () => {
    this.baku.events.Transfer({to: this.accounts[0]}).on('data', () => {
      this.updateUserTokens();
    });
  }

  handleBuyMore = async () => {
    await this.bakuTokenSale.methods.buyTokens(this.accounts[0]).send({ from: this.accounts[0], value: this.web3.utils.toWei("1", "wei")});
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Baku Token Sale</h1>
        <p>Get your Baku Tokens!</p>
        <h2>Kyc Whitelisting</h2>
        Address to whitelist: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type="button" onClick={this.handleKycWhitelisting}> Add to whitelist</button>
        <h2>Buy Tokens</h2>
        <p>If you Want to buy tokens send Wei to this address: {this.state.tokenSaleAddress}</p>
        <p>You currently have {this.state.userTokens}</p>
        <p>Token Sale Remaining Supply {this.state.tokenSaleRemainingSupply}</p>
        <button type="button" onClick={this.handleBuyMore}>Buy more!</button>
      </div>
    );
  }
}

export default App;
