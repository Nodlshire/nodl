// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {

    address public executor;

    constructor(address executorAddress) {
        executor = executorAddress;
    }

    modifier onlyExecutor() {
        require(msg.sender == executor, "Only Executor");
        _;
    }

    receive() external payable {}

    function send(address payable to, uint256 amount) external onlyExecutor {
        require(address(this).balance >= amount, "Insufficient funds");
        to.transfer(amount);
    }
}
