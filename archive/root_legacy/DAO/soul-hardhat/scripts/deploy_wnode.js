const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const treasuryAddress = "0xA48f0B8B83fd2da7E5098F720853ddE745e65819";

  console.log("--------------------------------------------------");
  console.log("WNODE Token Deployment");
  console.log("--------------------------------------------------");
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "POL");
  
  console.log("Treasury Address:", treasuryAddress);
  console.log("--------------------------------------------------");

  const WNODE = await hre.ethers.getContractFactory("WNODE");
  
  console.log("Deploying WNODE...");
  const wnode = await WNODE.deploy(treasuryAddress);

  await wnode.waitForDeployment();

  const address = await wnode.getAddress();
  console.log("WNODE deployed to:", address);
  console.log("--------------------------------------------------");
  
  console.log("Wait for a few blocks before verification...");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
