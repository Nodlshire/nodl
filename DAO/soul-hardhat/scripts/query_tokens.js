const hre = require("hardhat");

async function main() {
  const addresses = [
    "0xD53371C7A9Dd46BE7029E1761b74298f41432531",
    "0xa382506695f825fe807C3f4D47aEB986046bdc57"
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
      
      if (totalSupply === treasuryBalance) {
          console.log("STATUS: 100% of supply is held by Treasury.");
      } else {
          console.log(`WARNING: Treasury holds less than total supply. Diff: ${hre.ethers.formatUnits(totalSupply - treasuryBalance, decimals)}`);
      }
    } catch (e) {
      console.error(`Error querying ${addr}: ${e.message}`);
    }
  }
}

main().catch(console.error);
