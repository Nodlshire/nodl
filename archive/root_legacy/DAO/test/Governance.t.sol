// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {WnodeGovernor} from "../src/WnodeGovernor.sol";
import {WnodeTimelock} from "../src/WnodeTimelock.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

// Mock Token for testing
contract MockVotesToken is ERC20, ERC20Permit, ERC20Votes {
    constructor() ERC20("MockToken", "MTK") ERC20Permit("MockToken") {
        _mint(msg.sender, 1000 ether);
    }

    // Required overrides
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, ERC20Votes) returns (uint256) {
        return super.nonces(owner);
    }
}

contract GovernanceTest is Test {
    WnodeGovernor governor;
    WnodeTimelock timelock;
    MockVotesToken token;

    address admin = address(1);
    address proposer = address(2);
    address executor = address(3);
    address voter = address(4);

    uint256 minDelay = 1 hours;

    function setUp() public {
        vm.startPrank(admin);

        // 1. Deploy Token
        token = new MockVotesToken();
        token.transfer(voter, 500 ether);
        
        // Voter must delegate to themselves to have voting power
        vm.stopPrank();
        vm.prank(voter);
        token.delegate(voter);
        vm.startPrank(admin);

        // 2. Deploy Timelock
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](0);
        timelock = new WnodeTimelock(minDelay, proposers, executors, admin);

        // 3. Deploy Governor
        governor = new WnodeGovernor(IVotes(address(token)), timelock);

        // 4. Setup Roles
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        timelock.grantRole(proposerRole, address(governor));
        timelock.grantRole(executorRole, address(0)); // Anyone can execute
        timelock.revokeRole(adminRole, admin); // Admin should not have control after setup

        vm.stopPrank();
    }

    function test_Deployment() public view {
        assertEq(address(governor.token()), address(token));
        assertEq(address(governor.timelock()), address(timelock));
        assertEq(governor.votingDelay(), 7200);
        assertEq(governor.votingPeriod(), 50400);
    }

    function test_ProposalFlow() public {
        // Simple proposal: transfer 10 tokens from timelock to executor (mock)
        // (Timelock needs tokens first)
        deal(address(token), address(timelock), 10 ether);

        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);
        string memory description = "Proposal #1: Transfer tokens";

        targets[0] = address(token);
        values[0] = 0;
        calldatas[0] = abi.encodeWithSelector(ERC20.transfer.selector, executor, 10 ether);

        // 1. Propose
        vm.prank(voter);
        uint256 proposalId = governor.propose(targets, values, calldatas, description);

        assertEq(uint(governor.state(proposalId)), 0); // Pending

        // 2. Wait for voting delay
        vm.roll(block.number + governor.votingDelay() + 1);
        assertEq(uint(governor.state(proposalId)), 1); // Active

        // 3. Vote
        vm.prank(voter);
        governor.castVote(proposalId, 1); // 1 = For

        // 4. Wait for voting period
        vm.roll(block.number + governor.votingPeriod() + 1);
        assertEq(uint(governor.state(proposalId)), 4); // Succeeded

        // 5. Queue
        bytes32 descriptionHash = keccak256(bytes(description));
        governor.queue(targets, values, calldatas, descriptionHash);
        assertEq(uint(governor.state(proposalId)), 5); // Queued

        // 6. Execute (after timelock delay)
        vm.warp(block.timestamp + minDelay + 1);
        governor.execute(targets, values, calldatas, descriptionHash);
        assertEq(uint(governor.state(proposalId)), 7); // Executed

        // Verify result
        assertEq(token.balanceOf(executor), 10 ether);
    }
}
