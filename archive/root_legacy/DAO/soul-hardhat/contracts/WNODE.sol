// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title WNODE Token
 * @dev Standard ERC20 token for the Wnode ecosystem.
 * Total Supply: 10,000,000 WNODE
 * No taxes, fees, or special rules.
 */
contract WNODE is ERC20 {
    constructor(address treasury) ERC20("WNODE", "WNODE") {
        // Mint the full supply to the specified treasury wallet
        _mint(treasury, 10_000_000 * 10 ** decimals());
    }
}
