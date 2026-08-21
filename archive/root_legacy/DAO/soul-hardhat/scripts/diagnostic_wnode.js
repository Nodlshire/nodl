const hre = require("hardhat");
async function main() {
    const contractAddress = "0xa382506695f825fe807C3f4D47aEB986046bdc57";
    const walletAddress = "0xA48f0B8B83fd2da7E5098F720853ddE745e65819";
    
    console.log("--------------------------------------------------");
    console.log("WNODE ERC-20 Diagnostic Report");
    console.log("--------------------------------------------------");
    console.log("Contract:", contractAddress);
    console.log("Wallet:  ", walletAddress);
    console.log("--------------------------------------------------");

    const wnode = await hre.ethers.getContractAt("WNODE", contractAddress);

    try {
        const name = await wnode.name();
        console.log("name():         ", name);
    } catch (e) { console.log("name():          FAILED", e.message); }

    try {
        const symbol = await wnode.symbol();
        console.log("symbol():       ", symbol);
    } catch (e) { console.log("symbol():        FAILED", e.message); }

    try {
        const decimals = await wnode.decimals();
        console.log("decimals():     ", decimals.toString());
    } catch (e) { console.log("decimals():      FAILED", e.message); }

    try {
        const totalSupply = await wnode.totalSupply();
        console.log("totalSupply():  ", hre.ethers.formatUnits(totalSupply, 18), "WNODE");
    } catch (e) { console.log("totalSupply():   FAILED", e.message); }

    try {
        const balance = await wnode.balanceOf(walletAddress);
        console.log("balanceOf():    ", hre.ethers.formatUnits(balance, 18), "WNODE");
    } catch (e) { console.log("balanceOf():     FAILED", e.message); }

    try {
        const allowance = await wnode.allowance(walletAddress, walletAddress);
        console.log("allowance():    ", hre.ethers.formatUnits(allowance, 18), "WNODE");
    } catch (e) { console.log("allowance():     FAILED", e.message); }

    console.log("--------------------------------------------------");
}
main().catch(console.error);
