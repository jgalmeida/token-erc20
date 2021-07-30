const Baku = artifacts.require('./Baku.sol');
const BakuCrowdSale = artifacts.require('./Crowdsale.sol');

module.exports = async function (deployer) {
  const addr = await web3.eth.getAccounts();

  await deployer.deploy(Baku, 1000000);
  await deployer.deploy(BakuCrowdSale, 1, addr[0], Baku.address);

  const bakuInstance = await Baku.deployed();
  await bakuInstance.transfer(BakuCrowdSale.address, 1000000);
}