const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const wnodeAddress = "0xD53371C7A9Dd46BE7029E1761b74298f41432531";
    const routerAddress = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // QuickSwap V2 Router
    const factoryAddress = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"; // QuickSwap V2 Factory

    // Configuration
    const amountWNODE = hre.ethers.parseUnits("5", 18);
    // Assuming 1 WNODE = 10 POL (~$3.80 based on current prices, extremely safe)
    const amountMATIC = hre.ethers.parseUnits("50", 18); 

    console.log("--------------------------------------------------");
    console.log("QuickSwap Liquidity Provision");
    console.log("--------------------------------------------------");
    console.log("Deployer:", deployer.address);
    console.log("WNODE:   ", wnodeAddress);
    console.log("Router:  ", routerAddress);
    console.log("--------------------------------------------------");

    const wnode = await hre.ethers.getContractAt("WNODE", wnodeAddress);
    const router = await hre.ethers.getContractAt([
        "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)",
        "function factory() external view returns (address)"
    ], routerAddress);

    // 1. Approve Router
    console.log("Approving Router to spend WNODE...");
    const approveTx = await wnode.approve(routerAddress, amountWNODE);
    await approveTx.wait();
    console.log("Approval Hash:", approveTx.hash);

    // 2. Add Liquidity
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 mins
    console.log(`Adding Liquidity: 5 WNODE + 50 POL...`);
    
    const addTx = await router.addLiquidityETH(
        wnodeAddress,
        amountWNODE,
        0, // amountTokenMin
        0, // amountETHMin
        deployer.address,
        deadline,
        { value: amountMATIC }
    );
    
    console.log("Add Liquidity Hash:", addTx.hash);
    await addTx.wait();
    console.log("Liquidity added successfully.");

    // 3. Get Pair Address
    const factory = await hre.ethers.getContractAt([
        "function getPair(address tokenA, address tokenB) external view returns (address)"
    ], factoryAddress);
    
    const wmaticAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    const pairAddress = await factory.getPair(wnodeAddress, wmaticAddress);
    console.log("Pool Address (Pair):", pairAddress);
    console.log("--------------------------------------------------");
}

main().catch(console.error);
