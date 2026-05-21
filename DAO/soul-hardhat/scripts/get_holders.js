const hre = require("hardhat");

async function main() {
  const addresses = [
    "0xD53371C7A9Dd46BE7029E1761b74298f41432531",
    "0xa382506695f825fe807C3f4D47aEB986046bdc57"
  ];
  
  for (const addr of addresses) {
    console.log(`\n--- Holders for ${addr} ---`);
    const token = await hre.ethers.getContractAt("ERC20", addr);
    
    // Get all Transfer events
    const filter = token.filters.Transfer();
    const currentBlock = await hre.ethers.provider.getBlockNumber();
    // Assuming deployed recently, querying last 40000 blocks
    const events = await token.queryFilter(filter, 0, "latest");
    
    const balances = {};
    for (const event of events) {
      const from = event.args[0];
      const to = event.args[1];
      const value = event.args[2];
      
      if (!balances[from]) balances[from] = 0n;
      if (!balances[to]) balances[to] = 0n;
      
      balances[from] -= value;
      balances[to] += value;
    }
    
    // Print holders with > 0 balance
    for (const [holder, balance] of Object.entries(balances)) {
      if (balance > 0n && holder !== hre.ethers.ZeroAddress) {
        console.log(`Holder: ${holder} | Balance: ${hre.ethers.formatUnits(balance, 18)} WNODE`);
      }
    }
  }
}

main().catch(console.error);
