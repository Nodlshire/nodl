// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulToken is ERC721Enumerable, Ownable {

    enum SoulStatus { LOCKED, VOTING, FROZEN }

    struct SoulData {
        string wuid;
        SoulStatus status;
    }

    mapping(uint256 => SoulData) public souls;
    uint256 public nextSoulId = 1;

    constructor() ERC721("WnodeSoul", "SOUL") {}

    function mintSoul(address to, string memory wuid) external onlyOwner {
        uint256 soulId = nextSoulId++;
        _safeMint(to, soulId);
        souls[soulId] = SoulData(wuid, SoulStatus.LOCKED);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal override {
        require(from == address(0) || to == address(0), "Soul is non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function getSoulStatus(uint256 soulId) external view returns (SoulStatus) {
        return souls[soulId].status;
    }

    function upgradeToVoting(uint256 soulId) external onlyOwner {
        require(souls[soulId].status != SoulStatus.FROZEN, "Soul frozen");
        souls[soulId].status = SoulStatus.VOTING;
    }

    function freezeSoul(uint256 soulId) external onlyOwner {
        souls[soulId].status = SoulStatus.FROZEN;
    }

    function unfreezeSoul(uint256 soulId) external onlyOwner {
        souls[soulId].status = SoulStatus.LOCKED;
    }
}
