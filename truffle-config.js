const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');

/* web3.eth.sendTransaction({to: "0x...", from:accounts[0], value: web3.utils.toWei("2", "ether")}) */
/* truffle migrate --network ganache_local --reset */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545
    },
    ganache_local: {
      provider: () => {
        return new HDWalletProvider({ mnemonic: process.env.MNEMONIC, providerOrUrl: 'http://127.0.0.1:7545', addressIndex: 0 });
      },
      network_id: 5777,
    }
  },
  compilers: {
    solc: {
      version: "0.8.6"
    }
  }
};
