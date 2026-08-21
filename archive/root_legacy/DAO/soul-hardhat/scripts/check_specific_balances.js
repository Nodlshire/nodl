const hre = require("hardhat");

async function main() {
  const c1 = "0xD53371C7A9Dd46BE7029E1761b74298f41432531";
  const c2 = "0xa382506695f825fe807C3f4D47aEB986046bdc57";
  
  const t1 = await hre.ethers.getContractAt("ERC20", c1);
  const t2 = await hre.ethers.getContractAt("ERC20", c2);
  
  const pairAddress = "0xBd3426ADBb4bEFF73d79fC3F242C45F0A9b3dC15"; // LP for c1
  
  const balC1_LP = await t1.balanceOf(pairAddress);
  console.log(`C1 LP Balance: ${hre.ethers.formatUnits(balC1_LP, 18)}`);
  
  // Let's also check a few other known addresses
  const deployer = "0xA48f0B8B83fd2da7E5098F720853ddE745e65819";
  const burn = "0x000000000000000000000000000000000000dEaD";
  const router = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
  
  const b1 = await t2.balanceOf(deployer);
  const b2 = await t2.balanceOf(burn);
  const b3 = await t2.balanceOf(router);
  const b4 = await t2.balanceOf(pairAddress);
  
  console.log(`C2 Deployer: ${hre.ethers.formatUnits(b1, 18)}`);
  console.log(`C2 Dead: ${hre.ethers.formatUnits(b2, 18)}`);
  console.log(`C2 Router: ${hre.ethers.formatUnits(b3, 18)}`);
  console.log(`C2 LP: ${hre.ethers.formatUnits(b4, 18)}`);
}

main().catch(console.error);
