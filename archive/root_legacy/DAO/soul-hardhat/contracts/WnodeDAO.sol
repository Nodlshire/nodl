// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SoulToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WnodeDAO is Ownable {

    SoulToken public soul;

    struct Proposal {
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
    }

    uint256 public nextProposalId = 1;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(uint256 => bool)) public hasVoted;

    constructor(address soulAddress) {
        soul = SoulToken(soulAddress);
    }

    function submitProposal(string memory description) external {
        uint256 soulId = soulIdOf(msg.sender);
        require(soul.getSoulStatus(soulId) == SoulToken.SoulStatus.VOTING, "Not a Voting Soul");

        proposals[nextProposalId] = Proposal({
            description: description,
            yesVotes: 0,
            noVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + 7 days,
            executed: false
        });

        nextProposalId++;
    }

    function vote(uint256 proposalId, bool support) external {
        uint256 soulId = soulIdOf(msg.sender);
        require(soul.getSoulStatus(soulId) == SoulToken.SoulStatus.VOTING, "Not a Voting Soul");
        require(!hasVoted[proposalId][soulId], "Already voted");

        Proposal storage p = proposals[proposalId];
        require(block.timestamp < p.endTime, "Voting ended");

        hasVoted[proposalId][soulId] = true;

        if (support) p.yesVotes++;
        else p.noVotes++;
    }

    function execute(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(!p.executed, "Already executed");
        require(block.timestamp >= p.endTime, "Voting not ended");

        p.executed = true;
    }

    function soulIdOf(address user) internal view returns (uint256) {
        uint256 balance = soul.balanceOf(user);
        require(balance == 1, "User must hold exactly one Soul");
        return soul.tokenOfOwnerByIndex(user, 0);
    }
}
