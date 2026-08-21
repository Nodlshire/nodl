// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WnodeToken is ERC20, Ownable {

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18;

    constructor() ERC20("Wnode Token", "WNODE") {
        _mint(msg.sender, MAX_SUPPLY);
    }

    function mint(address, uint256) external pure {
        revert("Minting disabled");
    }
}
