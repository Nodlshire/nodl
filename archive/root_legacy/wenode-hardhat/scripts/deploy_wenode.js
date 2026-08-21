const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of WENODE...");

  // Get deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC");

  // Get the ContractFactory
  const WENODE = await hre.ethers.getContractFactory("WENODE");

  // Deploy the contract
  const wenode = await WENODE.deploy();

  await wenode.waitForDeployment();

  const address = await wenode.getAddress();
  console.log("WENODE deployed to:", address);

  // Verification helper log
  console.log("\nTo verify the contract, run the following command:");
  console.log(`npx hardhat verify --network polygon ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
