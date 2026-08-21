// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DAOExecutor is Ownable {

    address public dao;

    constructor(address daoAddress) {
        dao = daoAddress;
    }

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO");
        _;
    }

    function executeCall(address target, uint256 value, bytes calldata data)
        external onlyDAO returns (bytes memory) {
        (bool success, bytes memory result) = target.call{value: value}(data);
        require(success, "Execution failed");
        return result;
    }
}
