const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const addresses = [
    "0xF7bB2ea845b9e56aEf9E364d6Ae05Ea88236ca40",
    "0x62eFDE5D3C2318E01237eFBb7Eac35BdC7a14D53"
  ];
  
  const providers = {
    Polygon: "https://polygon.drpc.org",
    Amoy: "https://rpc-amoy.polygon.technology",
    Sepolia: "https://ethereum-sepolia-rpc.publicnode.com",
    Ethereum: "https://eth.llamarpc.com",
    Arbitrum: "https://arbitrum.llamarpc.com",
    Base: "https://base.llamarpc.com"
  };
  
  const ERC20_ABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)"
  ];
  
  for (const addr of addresses) {
    console.log(`\n--- Contract: ${addr} ---`);
    for (const [networkName, url] of Object.entries(providers)) {
        try {
            const provider = new ethers.JsonRpcProvider(url);
            const code = await provider.getCode(addr);
            if (code && code !== "0x") {
                console.log(`[${networkName}] Contract code found!`);
                
                try {
                    const contract = new ethers.Contract(addr, ERC20_ABI, provider);
                    const name = await contract.name();
                    const symbol = await contract.symbol();
                    const decimals = await contract.decimals();
                    const totalSupply = await contract.totalSupply();
                    console.log(`   [${networkName}] Name: ${name}`);
                    console.log(`   [${networkName}] Symbol: ${symbol}`);
                    console.log(`   [${networkName}] Decimals: ${decimals}`);
                    console.log(`   [${networkName}] Total Supply: ${ethers.formatUnits(totalSupply, decimals)}`);
                } catch(e) {
                    console.log(`   [${networkName}] ERC20 calls failed.`);
                }
            }
        } catch (e) {
            // Reverted
        }
    }
  }
}

main().catch(console.error);
