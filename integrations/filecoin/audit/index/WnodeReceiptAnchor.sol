/**
 * WnodeReceiptAnchor — Filecoin FVM Smart Contract
 *
 * Maps BLAKE3 canonicalHash (bytes32) → IPFS CIDv1 (string) on-chain.
 *
 * Deployed on Filecoin EVM (FEVM). Any third party can resolve a receipt
 * hash to its IPFS CID without depending on Wnode's off-chain infrastructure.
 *
 * Access control:
 *  - Only `authorizedNodes` (registered Wnode operators) may call `anchor()`.
 *  - The contract owner (Wnode DAO multisig) manages the authorized node list.
 *  - `resolve()` is public and read-only.
 *
 * Immutability:
 *  - Once anchored, a canonicalHash → CID mapping cannot be overwritten.
 *  - This enforces the one-receipt-per-hash guarantee.
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract WnodeReceiptAnchor {

    // ─── Events ──────────────────────────────────────────────────────────────

    event ReceiptAnchored(
        bytes32 indexed canonicalHash,
        string          cid,
        address indexed signerNode,
        uint256         blockTimestamp
    );

    event NodeAuthorized(address indexed node);
    event NodeRevoked(address indexed node);

    // ─── State ───────────────────────────────────────────────────────────────

    address public owner;

    mapping(bytes32 => string)  public hashToCid;         // canonicalHash → CIDv1
    mapping(bytes32 => address) public hashToSigner;      // who anchored it
    mapping(bytes32 => uint256) public hashToTimestamp;   // when it was anchored
    mapping(address => bool)    public authorizedNodes;

    // ─── Constructor ─────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        authorizedNodes[msg.sender] = true;
    }

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOwner()          { require(msg.sender == owner,               "Not owner");     _; }
    modifier onlyAuthorized()     { require(authorizedNodes[msg.sender],       "Not authorized"); _; }

    // ─── Admin ───────────────────────────────────────────────────────────────

    function authorizeNode(address node) external onlyOwner {
        authorizedNodes[node] = true;
        emit NodeAuthorized(node);
    }

    function revokeNode(address node) external onlyOwner {
        authorizedNodes[node] = false;
        emit NodeRevoked(node);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }

    // ─── Anchoring ────────────────────────────────────────────────────────────

    /**
     * Anchor a canonicalHash → CID mapping on-chain.
     * Reverts if the hash has already been anchored (immutability guarantee).
     *
     * @param canonicalHash  BLAKE3 hash of the canonical receipt JSON (bytes32)
     * @param cid            IPFS CIDv1 of the receipt CAR file (base32 string)
     */
    function anchor(bytes32 canonicalHash, string calldata cid)
        external
        onlyAuthorized
    {
        require(
            bytes(hashToCid[canonicalHash]).length == 0,
            "WnodeReceiptAnchor: already anchored"
        );
        require(bytes(cid).length > 0, "WnodeReceiptAnchor: empty CID");

        hashToCid[canonicalHash]       = cid;
        hashToSigner[canonicalHash]    = msg.sender;
        hashToTimestamp[canonicalHash] = block.timestamp;

        emit ReceiptAnchored(canonicalHash, cid, msg.sender, block.timestamp);
    }

    // ─── Resolution ───────────────────────────────────────────────────────────

    /**
     * Resolve a canonicalHash to its IPFS CID.
     * Returns empty string if not anchored.
     */
    function resolve(bytes32 canonicalHash)
        external
        view
        returns (string memory)
    {
        return hashToCid[canonicalHash];
    }

    /**
     * Resolve with full provenance.
     */
    function resolveWithProvenance(bytes32 canonicalHash)
        external
        view
        returns (
            string  memory cid,
            address        signerNode,
            uint256        anchoredAt
        )
    {
        return (
            hashToCid[canonicalHash],
            hashToSigner[canonicalHash],
            hashToTimestamp[canonicalHash]
        );
    }

    /**
     * Check if a canonicalHash has been anchored.
     */
    function isAnchored(bytes32 canonicalHash) external view returns (bool) {
        return bytes(hashToCid[canonicalHash]).length > 0;
    }
}
