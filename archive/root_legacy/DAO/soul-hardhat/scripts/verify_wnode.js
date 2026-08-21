const hre = require("hardhat");

async function main() {
  // Use command line argument for address if provided
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const treasuryAddress = "0xA48f0B8B83fd2da7E5098F720853ddE745e65819";

  if (!contractAddress) {
    console.error("Please set CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }

  console.log("Verifying WNODE at:", contractAddress);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [treasuryAddress],
    });
    console.log("Verification successful!");
  } catch (error) {
    console.error("Verification failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
