// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./WST.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WnodeDAO Governance Contract
 * @notice On-chain DAO governance enforcing 1 vote per WUID bound Soul Token.
 */
contract WnodeDAO is Ownable {
    WST public immutable soulToken;

    struct Proposal {
        uint256 id;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
    }

    uint256 public nextProposalId = 1;
    mapping(uint256 => Proposal) public proposals;
    // proposalId => WUID => hasVoted
    mapping(uint256 => mapping(string => bool)) public wuidHasVoted;

    event ProposalCreated(uint256 indexed proposalId, string description, uint256 startTime, uint256 endTime);
    event Voted(uint256 indexed proposalId, string indexed wuid, address voter, bool support);

    constructor(address wstAddress) {
        require(wstAddress != address(0), "Invalid WST address");
        soulToken = WST(wstAddress);
    }

    /**
     * @notice Gets voting power for an address. Exactly 1 vote if holding a valid WST Soul Token.
     */
    function getVotingPower(address voter) public view returns (uint256) {
        if (soulToken.balanceOf(voter) == 1) {
            return 1;
        }
        return 0;
    }

    /**
     * @notice Creates a new DAO proposal. Requires voter to hold a WST Soul Token.
     */
    function createProposal(string memory description) external returns (uint256) {
        require(getVotingPower(msg.sender) == 1, "DAO: Must hold a WST Soul Token to create proposal");

        uint256 proposalId = nextProposalId++;
        proposals[proposalId] = Proposal({
            id: proposalId,
            description: description,
            yesVotes: 0,
            noVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + 7 days,
            executed: false
        });

        emit ProposalCreated(proposalId, description, block.timestamp, block.timestamp + 7 days);
        return proposalId;
    }

    /**
     * @notice Casts 1 vote per WUID.
     */
    function vote(uint256 proposalId, bool support) external {
        require(getVotingPower(msg.sender) == 1, "DAO: Must hold a WST Soul Token to vote");
        
        uint256 tokenId = soulToken.tokenOfOwnerByIndex(msg.sender, 0);
        string memory wuid = soulToken.soulWUID(tokenId);
        require(bytes(wuid).length > 0, "DAO: Unbound soul");
        require(!wuidHasVoted[proposalId][wuid], "DAO: WUID has already voted on this proposal");

        Proposal storage p = proposals[proposalId];
        require(block.timestamp <= p.endTime, "DAO: Voting period ended");
        require(!p.executed, "DAO: Proposal already executed");

        wuidHasVoted[proposalId][wuid] = true;

        if (support) {
            p.yesVotes += 1;
        } else {
            p.noVotes += 1;
        }

        emit Voted(proposalId, wuid, msg.sender, support);
    }
}
