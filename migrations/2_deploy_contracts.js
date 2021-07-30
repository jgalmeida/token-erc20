const Baku = artifacts.require('./Baku.sol');

module.exports = async function (deployer) {
  await deployer.deploy(Baku, 1000000);
}