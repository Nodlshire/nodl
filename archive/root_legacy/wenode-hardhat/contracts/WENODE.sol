// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title WENODE Token
 * @dev Simple standard ERC20 token with no extra logic, fully compatible with PinkSale.
 */
contract WENODE is ERC20 {
    /**
     * @dev Constructor that mints the entire supply of 10,000,000 WEX tokens (with 18 decimals)
     * to the deployer address.
     */
    constructor() ERC20("WENODE", "WEX") {
        _mint(msg.sender, 10_000_000 * 10 ** decimals());
    }
}
