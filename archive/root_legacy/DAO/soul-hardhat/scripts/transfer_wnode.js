const hre = require("hardhat");
async function main() {
    const address = "0xa382506695f825fe807C3f4D47aEB986046bdc57";
    const wnode = await hre.ethers.getContractAt("WNODE", address);
    const amount = "1000000000000000000";
    const to = "0xA48f0B8B83fd2da7E5098F720853ddE745e65819";
    
    console.log(`Transferring ${amount} WNODE to ${to}...`);
    const tx = await wnode.transfer(to, amount);
    console.log("Transaction sent. Hash:", tx.hash);
    
    console.log("Waiting for confirmation...");
    await tx.wait();
    console.log("Transfer complete.");
}
main().catch(console.error);
