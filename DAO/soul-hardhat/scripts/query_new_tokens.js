const hre = require("hardhat");

async function main() {
  const addresses = [
    "0xF7bB2ea845b9e56aEf9E364d6Ae05Ea88236ca40",
    "0x62eFDE5D3C2318E01237eFBb7Eac35BdC7a14D53"
  ];
  
  const treasury = "0xA48f0B8B83fd2da7E5098F720853ddE745e65819";
  
  for (const addr of addresses) {
    console.log(`\n--- Contract: ${addr} ---`);
    try {
      const token = await hre.ethers.getContractAt("ERC20", addr);
      const name = await token.name();
      const symbol = await token.symbol();
      const decimals = await token.decimals();
      const totalSupply = await token.totalSupply();
      const treasuryBalance = await token.balanceOf(treasury);
      
      console.log(`Name: ${name}`);
      console.log(`Symbol: ${symbol}`);
      console.log(`Decimals: ${decimals}`);
      console.log(`Total Supply: ${hre.ethers.formatUnits(totalSupply, decimals)}`);
      console.log(`Treasury Balance (${treasury}): ${hre.ethers.formatUnits(treasuryBalance, decimals)}`);
      
    } catch (e) {
      console.error(`Error querying ${addr}: ${e.message}`);
    }
  }
}

main().catch(console.error);
