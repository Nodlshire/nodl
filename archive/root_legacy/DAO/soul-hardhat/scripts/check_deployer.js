const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  const deployerAddress = signers[0].address;
  console.log(`Deployer Address: ${deployerAddress}`);
  
  const c2 = "0xa382506695f825fe807C3f4D47aEB986046bdc57";
  const t2 = await hre.ethers.getContractAt("ERC20", c2);
  
  const b = await t2.balanceOf(deployerAddress);
  console.log(`Deployer C2 Balance: ${hre.ethers.formatUnits(b, 18)}`);
}

main().catch(console.error);
