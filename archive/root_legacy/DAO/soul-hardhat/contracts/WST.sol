// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WST (Wnode Soul Token)
 * @notice Canonical, non-transferable Soulbound Token (SBT) for Wnode main chain identity.
 * @dev Enforces 1-to-1 mapping between address, WUID, and token. Transfers and approvals are disabled.
 */
contract WST is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId = 1;

    // Mapping: tokenId => WUID
    mapping(uint256 => string) public soulWUID;
    // Mapping: WUID => tokenId
    mapping(string => uint256) public wuidToTokenId;
    // Mapping: address => boolean (has minted)
    mapping(address => bool) public addressHasSoul;
    // Mapping: WUID => boolean (has minted)
    mapping(string => bool) public wuidHasSoul;

    event SoulMinted(address indexed owner, uint256 indexed tokenId, string wuid);

    constructor() ERC721("Wnode Soul Token", "WST") {}

    /**
     * @notice Mints a new Soulbound Token for a WUID and owner address.
     * @param to The recipient wallet address.
     * @param wuid The canonical WUID identity string.
     */
    function mintSoul(address to, string memory wuid) external onlyOwner returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(bytes(wuid).length > 0, "WUID cannot be empty");
        require(!addressHasSoul[to], "Wallet already has a Soul Token");
        require(!wuidHasSoul[wuid], "WUID already bound to a Soul Token");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        soulWUID[tokenId] = wuid;
        wuidToTokenId[wuid] = tokenId;
        addressHasSoul[to] = true;
        wuidHasSoul[wuid] = true;

        emit SoulMinted(to, tokenId, wuid);
        return tokenId;
    }

    /**
     * @notice Returns the WUID bound to a given tokenId.
     */
    function getWUID(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return soulWUID[tokenId];
    }

    /**
     * @notice Enforces Soulbound non-transferability.
     */
    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)
        internal override {
        require(from == address(0) || to == address(0), "WST: Soulbound token is non-transferable");
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    /**
     * @notice Disable approvals to maintain Soulbound integrity.
     */
    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert("WST: Approvals disabled for Soulbound tokens");
    }

    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert("WST: Approvals disabled for Soulbound tokens");
    }
}
