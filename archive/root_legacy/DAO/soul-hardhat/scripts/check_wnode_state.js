const hre = require("hardhat");
async function main() {
    const address = "0xa382506695f825fe807C3f4D47aEB986046bdc57";
    const wnode = await hre.ethers.getContractAt("WNODE", address);
    console.log("Name:", await wnode.name());
    console.log("Symbol:", await wnode.symbol());
    console.log("Total Supply:", (await wnode.totalSupply()).toString());
    const treasury = "0xA48f0B8B83fd2da7E5098F720853ddE745e65819";
    console.log("Treasury Balance:", (await wnode.balanceOf(treasury)).toString());
}
main().catch(console.error);
