const Chai = require("chai");

const Baku = artifacts.require("./Baku.sol");

const BN = web3.utils.BN;

Chai.use(require("chai-bn")(web3.utils.BN));

const expect = Chai.expect;

contract("BAKU test", async (accounts) => {
	let contractInstance;
	const [deployerAccount, recipient, anotherAccount] = accounts;

	beforeEach(async () => {
		contractInstance = await Baku.deployed();
	});

	it("all tokens should be in my account", async () => {
		const totalSupply = await contractInstance.totalSupply();
		const balance = await contractInstance.balanceOf(accounts[0]);

		expect(balance).to.be.a.bignumber.equal(totalSupply);
	});

	it("it possible to send tokens between accounts", async () => {
		const totalSupply = await contractInstance.totalSupply();
    const tokensToSend = 1;

		expect(await contractInstance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(
			totalSupply
		);

    await contractInstance.transfer(recipient, tokensToSend);

    expect(await contractInstance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(totalSupply.sub(new BN(tokensToSend)));
    expect(await contractInstance.balanceOf(recipient)).to.be.a.bignumber.equal(new BN(tokensToSend));
	});

	it("is not possible to send more tokens than available in total", async () => {
    const deployerBalance = await contractInstance.balanceOf(deployerAccount);

    try {
      await contractInstance.transfer(recipient, new BN(deployerBalance + 1));
      expect.fail();
    } catch(e) {
      expect(await contractInstance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(deployerBalance);
      expect(e.message).to.have.string('ERC20: transfer amount exceeds balance');
    }
	});
});
