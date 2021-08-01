const BN = web3.utils.BN;
const expect = require('./chai').expect;

const config = require('../config');

const BakuTokenSale = artifacts.require("./BakuTokenSale.sol");
const Baku = artifacts.require("./Baku.sol");
const Kyc = artifacts.require("./KycContract.sol");

contract("BAKU Token Sale test", async (accounts) => {
  let bakuTokenSaleContractInstance;
  let bakuContractInstance;
  let kycContractInstance;
	const [deployerAccount, recipient, anotherAccount] = accounts;

	beforeEach(async () => {
    bakuTokenSaleContractInstance = await BakuTokenSale.deployed();
    bakuContractInstance = await Baku.deployed();
    kycContractInstance = await Kyc.deployed();
	});

	it("should not have tokens in deployer account", async () => {
		expect(await bakuContractInstance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(new BN(0));
	});

	it("all tokens should be in the token sale contract by default", async () => {
		expect(await bakuContractInstance.balanceOf(bakuTokenSaleContractInstance.address)).to.be.a.bignumber.equal(await bakuContractInstance.totalSupply());
	});

	it("all should be possible to buy tokens", async () => {
    const balanceBefore = await bakuContractInstance.balanceOf(deployerAccount);

    await kycContractInstance.setKycCompleted(deployerAccount, { from: deployerAccount });
    await bakuTokenSaleContractInstance.sendTransaction({ from: deployerAccount, value: web3.utils.toWei("1", "wei")});

    expect(await bakuContractInstance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
	});
})
