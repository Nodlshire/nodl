const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const addresses = [
    "0xF7bB2ea845b9e56aEf9E364d6Ae05Ea88236ca40",
    "0x62eFDE5D3C2318E01237eFBb7Eac35BdC7a14D53"
  ];
  
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || "https://polygon.drpc.org");
  
  const ERC20_ABI_STRING = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)"
  ];
  const ERC20_ABI_BYTES32 = [
      "function name() view returns (bytes32)",
      "function symbol() view returns (bytes32)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)"
  ];
  
  for (const addr of addresses) {
    console.log(`\n--- Contract: ${addr} ---`);
    const contractStr = new ethers.Contract(addr, ERC20_ABI_STRING, provider);
    const contractBytes = new ethers.Contract(addr, ERC20_ABI_BYTES32, provider);
    
    let name = "UNKNOWN";
    let symbol = "UNKNOWN";
    let decimals = 18;
    let totalSupply = 0n;
    
    try {
        name = await contractStr.name();
    } catch (e) {
        try {
            const n = await contractBytes.name();
            name = ethers.decodeBytes32String(n);
        } catch(e2) {
            name = "Failed to parse name";
        }
    }
    
    try {
        symbol = await contractStr.symbol();
    } catch (e) {
        try {
            const s = await contractBytes.symbol();
            symbol = ethers.decodeBytes32String(s);
        } catch(e2) {
            symbol = "Failed to parse symbol";
        }
    }
    
    try {
        decimals = await contractStr.decimals();
    } catch (e) {
        console.log("Decimals failed");
    }
    
    try {
        totalSupply = await contractStr.totalSupply();
    } catch (e) {
        console.log("Total Supply failed");
    }
    
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
    console.log(`Total Supply: ${ethers.formatUnits(totalSupply, decimals)}`);
  }
}

main().catch(console.error);
