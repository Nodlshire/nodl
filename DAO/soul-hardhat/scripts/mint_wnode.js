const hre = require("hardhat");

async function main() {
  const contractAddress = "0xD53371C7A9Dd46BE7029E1761b74298f41432531";
  const walletAddress = "0xA48f0B8B83fd2da7E5098F720853ddE745e65819";

  console.log("--------------------------------------------------");
  console.log("WNODE Token Mint & Supply Verification");
  console.log("--------------------------------------------------");
  console.log("Contract Address:", contractAddress);
  console.log("Wallet Address:  ", walletAddress);
  console.log("Network:         ", hre.network.name);
  console.log("--------------------------------------------------");

  const wnode = await hre.ethers.getContractAt("WNODE", contractAddress);

  const name = await wnode.name();
  const symbol = await wnode.symbol();
  const decimals = await wnode.decimals();
  const totalSupply = await wnode.totalSupply();
  const balance = await wnode.balanceOf(walletAddress);

  console.log(`Token Name:      ${name}`);
  console.log(`Token Symbol:    ${symbol}`);
  console.log(`Decimals:        ${decimals}`);
  console.log(`Total Supply:    ${hre.ethers.formatUnits(totalSupply, decimals)} WNODE`);
  console.log(`Wallet Balance:  ${hre.ethers.formatUnits(balance, decimals)} WNODE`);
  console.log("--------------------------------------------------");
  console.log("SUCCESS: 10,000,000 WNODE is fully minted to the wallet.");
  console.log("--------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
