const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=== WNODE MAIN CHAIN SOUL BOUND TOKEN DEPLOYMENT ===");

  const [deployer] = await hre.ethers.getSigners();
  const network = await hre.ethers.provider.getNetwork();
  console.log("Deployer Wallet Address:", deployer.address);
  console.log("Network Chain ID:", network.chainId.toString());

  // 1. Deploy WST Contract
  console.log("\n1. Deploying WST (Wnode Soul Token) contract...");
  const WST = await hre.ethers.getContractFactory("WST");
  const wst = await WST.deploy();
  await wst.waitForDeployment();

  const wstAddress = await wst.getAddress();
  const wstDeployTxHash = wst.deploymentTransaction().hash;
  console.log("WST Contract Deployed At:", wstAddress);
  console.log("Deployment Tx Hash:", wstDeployTxHash);

  // 2. Deploy WnodeDAO Contract
  console.log("\n2. Deploying WnodeDAO governance contract...");
  const WnodeDAO = await hre.ethers.getContractFactory("WnodeDAO");
  const dao = await WnodeDAO.deploy(wstAddress);
  await dao.waitForDeployment();

  const daoAddress = await dao.getAddress();
  const daoDeployTxHash = dao.deploymentTransaction().hash;
  console.log("WnodeDAO Contract Deployed At:", daoAddress);
  console.log("DAO Deployment Tx Hash:", daoDeployTxHash);

  // 3. Mint Founder Soul Token
  const founderWUID = "100001-0426-01-AA";
  console.log(`\n3. Minting Founder Soul Token for WUID: ${founderWUID}...`);

  const mintTx = await wst.mintSoul(deployer.address, founderWUID);
  const mintReceipt = await mintTx.wait();
  const mintTxHash = mintReceipt.hash;

  const tokenId = await wst.wuidToTokenId(founderWUID);
  const boundWUID = await wst.getWUID(tokenId);

  console.log("Mint Transaction Hash:", mintTxHash);
  console.log("Minted Token ID:", tokenId.toString());
  console.log("Bound WUID:", boundWUID);

  // 4. Verify Non-Transferability & DAO Governance 1 Vote
  console.log("\n4. Verifying Soulbound Invariants...");
  const votingPower = await dao.getVotingPower(deployer.address);
  console.log("DAO Voting Power for Founder Wallet:", votingPower.toString());
  
  // Test Non-transferability
  try {
    const dummyAddr = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    await wst.transferFrom(deployer.address, dummyAddr, tokenId);
    console.error("ERROR: Transfer succeeded when it should fail!");
  } catch (e) {
    console.log("VERIFIED: Transfer reverted as non-transferable Soulbound token!");
  }

  // 5. Output Soul Record
  const soulRecord = {
    soul_id: founderWUID,
    wuid: founderWUID,
    wallet_address: deployer.address,
    soul_token_contract: wstAddress,
    dao_contract: daoAddress,
    soul_token_id: tokenId.toString(),
    soul_token_tx: mintTxHash,
    deployment_tx: wstDeployTxHash,
    chain_id: network.chainId.toString(),
    founder_soul: true,
    dao_member: true,
    voting_power: parseInt(votingPower.toString())
  };

  const outputPath = path.join(__dirname, "../soul_deployment_record.json");
  fs.writeFileSync(outputPath, JSON.stringify(soulRecord, null, 2));
  console.log("\nSoul deployment record saved to:", outputPath);
  console.log(JSON.stringify(soulRecord, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
