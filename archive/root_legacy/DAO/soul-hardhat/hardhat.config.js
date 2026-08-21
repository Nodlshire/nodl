require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// ─────────────────────────────────────────────────────────
//  MetaMask Wallet Integration
// ─────────────────────────────────────────────────────────
//
//  To deploy with your MetaMask wallet:
//
//  1. Open MetaMask → click the three-dot menu on your account
//  2. Select "Account Details" → "Show Private Key"
//  3. Copy the 64-character hex key (without the 0x prefix)
//  4. Create a .env file in this directory:
//
//       cp .env.example .env
//
//  5. Paste the key into .env:
//
//       DEPLOYER_PRIVATE_KEY=abc123...your64hexchars
//
//  6. Fund the wallet with testnet ETH:
//       • Sepolia faucet:      https://sepoliafaucet.com
//       • Base Sepolia faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
//       • Amoy faucet:         https://faucet.polygon.technology
//
//  7. Deploy:
//
//       npx hardhat run scripts/deploy.js --network sepolia
//
//  ⚠️  NEVER commit your .env file to version control.
// ─────────────────────────────────────────────────────────

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "shanghai",
    },
  },

  networks: {
    // Local Hardhat node (default)
    hardhat: {},

    // Ethereum Sepolia testnet
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
      chainId: 11155111,
    },

    // Base Sepolia testnet
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
      chainId: 84532,
    },

    // Polygon Amoy testnet
    amoy: {
      url: process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
      chainId: 80002,
    },
    // Polygon Mainnet
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon.drpc.org",
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
      chainId: 137,
    },
  },

  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY || "",
  },

  sourcify: {
    enabled: true,
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
  },
};
