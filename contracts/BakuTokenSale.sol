pragma solidity 0.8.6;

import "./Crowdsale.sol";

contract BakuCrowdsale is Crowdsale {
    constructor(
        uint256 rate, // rate in TKNbits
        address payable wallet,
        IERC20 token
    ) Crowdsale(rate, wallet, token) {}
}
