// scripts/deploy.js
//
// Deploys the full Wnode DAO stack in dependency order:
//   1. SoulToken       — Soulbound identity NFT
//   2. WnodeToken      — Fixed-supply ERC-20
//   3. WnodeDAO        — Governance (needs SoulToken)
//   4. DAOExecutor     — Execution layer (needs WnodeDAO)
//   5. Treasury        — DAO treasury (needs DAOExecutor)
//
// Usage:
//   npx hardhat run scripts/deploy.js --network <network>

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("─────────────────────────────────────────");
  console.log("  Wnode DAO — Full Stack Deployment");
  console.log("─────────────────────────────────────────");
  console.log("Deployer:", deployer.address);
  console.log("Balance :", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");
  console.log("");

  // ── 1. SoulToken ──────────────────────────────────────
  console.log("[1/5] Deploying SoulToken...");
  const SoulToken = await hre.ethers.getContractFactory("SoulToken");
  const soulToken = await SoulToken.deploy();
  await soulToken.waitForDeployment();
  const soulTokenAddr = await soulToken.getAddress();
  console.log("       SoulToken deployed at:", soulTokenAddr);

  // ── 2. WnodeToken ─────────────────────────────────────
  console.log("[2/5] Deploying WnodeToken...");
  const WnodeToken = await hre.ethers.getContractFactory("WnodeToken");
  const wnodeToken = await WnodeToken.deploy();
  await wnodeToken.waitForDeployment();
  const wnodeTokenAddr = await wnodeToken.getAddress();
  console.log("       WnodeToken deployed at:", wnodeTokenAddr);

  // ── 3. WnodeDAO ───────────────────────────────────────
  console.log("[3/5] Deploying WnodeDAO...");
  const WnodeDAO = await hre.ethers.getContractFactory("WnodeDAO");
  const wnodeDAO = await WnodeDAO.deploy(soulTokenAddr);
  await wnodeDAO.waitForDeployment();
  const wnodeDAOAddr = await wnodeDAO.getAddress();
  console.log("       WnodeDAO deployed at:", wnodeDAOAddr);

  // ── 4. DAOExecutor ────────────────────────────────────
  console.log("[4/5] Deploying DAOExecutor...");
  const DAOExecutor = await hre.ethers.getContractFactory("DAOExecutor");
  const daoExecutor = await DAOExecutor.deploy(wnodeDAOAddr);
  await daoExecutor.waitForDeployment();
  const daoExecutorAddr = await daoExecutor.getAddress();
  console.log("       DAOExecutor deployed at:", daoExecutorAddr);

  // ── 5. Treasury ───────────────────────────────────────
  console.log("[5/5] Deploying Treasury...");
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(daoExecutorAddr);
  await treasury.waitForDeployment();
  const treasuryAddr = await treasury.getAddress();
  console.log("       Treasury deployed at:", treasuryAddr);

  // ── Summary ───────────────────────────────────────────
  console.log("");
  console.log("═════════════════════════════════════════");
  console.log("  DEPLOYMENT COMPLETE");
  console.log("═════════════════════════════════════════");
  console.log("");
  console.log("  SoulToken    :", soulTokenAddr);
  console.log("  WnodeToken   :", wnodeTokenAddr);
  console.log("  WnodeDAO     :", wnodeDAOAddr);
  console.log("  DAOExecutor  :", daoExecutorAddr);
  console.log("  Treasury     :", treasuryAddr);
  console.log("");
  console.log("  Network      :", hre.network.name);
  console.log("  Deployer     :", deployer.address);
  console.log("═════════════════════════════════════════");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
