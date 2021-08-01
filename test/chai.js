const Chai = require("chai");

Chai.use(require("chai-bn")(web3.utils.BN));

module.exports = Chai;