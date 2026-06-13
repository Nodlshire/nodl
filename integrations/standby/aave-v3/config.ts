/**
 * Configuration and Feature Flags for Aave V3 Automation.
 * ALL automation capabilities are disabled by default for safety.
 */

export const AAVE_CONFIG = {
  // Feature Flags
  ENABLE_AAVE_HEALTH_MONITORING: process.env.ENABLE_AAVE_HEALTH_MONITORING === 'true' || false,
  ENABLE_AAVE_LIQUIDATIONS: process.env.ENABLE_AAVE_LIQUIDATIONS === 'true' || false,
  ENABLE_AAVE_AUTO_ROUTING: process.env.ENABLE_AAVE_AUTO_ROUTING === 'true' || false,
  ENABLE_AAVE_PRICE_MONITORING: process.env.ENABLE_AAVE_PRICE_MONITORING === 'true' || false,

  // Providers
  RPC_URLS: {
    ethereum: process.env.AAVE_MAINNET_RPC_URL || "",
    arbitrum: process.env.AAVE_ARBITRUM_RPC_URL || ""
  },

  // Supported Networks and Contract Addresses
  NETWORKS: {
    ethereum: {
      Pool: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
      PoolDataProvider: "0x7B4EB56E7CD4b454AA8ac22e171A9B6eFafc29e2",
      Oracle: "0x54586bE62E3c3580375aE3723C145253060Ca0C2",
    },
    arbitrum: {
      Pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
      PoolDataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
      Oracle: "0xb56c2F0B653B2e0b10C9b928C8580Ac5Df02C7C7",
    }
  },

  // Thresholds
  THRESHOLDS: {
    CRITICAL_HEALTH_FACTOR: 1.1,
    LIQUIDATION_HEALTH_FACTOR: 1.0,
    IDLE_BALANCE_MIN_USD: 1000,
  }
};
