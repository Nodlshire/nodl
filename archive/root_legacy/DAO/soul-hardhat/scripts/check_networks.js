const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const addresses = [
    "0xF7bB2ea845b9e56aEf9E364d6Ae05Ea88236ca40",
    "0x62eFDE5D3C2318E01237eFBb7Eac35BdC7a14D53"
  ];
  
  const providers = {
    Polygon: new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || "https://polygon.drpc.org"),
    Amoy: new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology"),
    Sepolia: new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com")
  };
  
  const ERC20_ABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)"
  ];
  
  for (const addr of addresses) {
    console.log(`\n--- Contract: ${addr} ---`);
    for (const [networkName, provider] of Object.entries(providers)) {
        try {
            const code = await provider.getCode(addr);
            if (code && code !== "0x") {
                console.log(`[${networkName}] Contract code found!`);
                const contract = new ethers.Contract(addr, ERC20_ABI, provider);
                const name = await contract.name();
                const symbol = await contract.symbol();
                const decimals = await contract.decimals();
                const totalSupply = await contract.totalSupply();
                console.log(`   Name: ${name}`);
                console.log(`   Symbol: ${symbol}`);
                console.log(`   Decimals: ${decimals}`);
                console.log(`   Total Supply: ${ethers.formatUnits(totalSupply, decimals)}`);
            } else {
                // No code
            }
        } catch (e) {
            // Reverted
        }
    }
  }
}

main().catch(console.error);
