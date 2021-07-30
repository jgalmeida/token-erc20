pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Baku is ERC20 {
    constructor(uint256 initialSupply) ERC20("Backshop Token", "BAKU") {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }
}
