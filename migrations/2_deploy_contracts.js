const Baku = artifacts.require('./Baku.sol');
const BakuTokenSale = artifacts.require('./BakuTokenSale.sol');
const Kyc = artifacts.require('./KycContract.sol');

const config = require('../config');


module.exports = async function (deployer) {
  const addr = await web3.eth.getAccounts();

  await deployer.deploy(Baku, config.INITIAL_TOKENS);
  await deployer.deploy(Kyc);
  await deployer.deploy(BakuTokenSale, 1, addr[0], Baku.address, Kyc.address);

  const bakuInstance = await Baku.deployed();
  await bakuInstance.transfer(BakuTokenSale.address, config.INITIAL_TOKENS);
}