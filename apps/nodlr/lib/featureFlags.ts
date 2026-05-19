/**
 * Feature Flags
 * 
 * Provides runtime toggles for simulation logic and debugging.
 * These are gated by environment variables in .env.local
 */

export const featureFlags = {
  // If true, hardcoded fixtures and mock data are disabled in the Nodlr app.
  NODLR_DISABLE_SIM: process.env.NODLR_DISABLE_SIM === 'true' || process.env.NEXT_PUBLIC_NODLR_DISABLE_SIM === 'true',
  
  // If true, hardcoded fixtures and mock data are disabled in the Command app.
  COMMAND_DISABLE_SIM: process.env.COMMAND_DISABLE_SIM === 'true' || process.env.NEXT_PUBLIC_COMMAND_DISABLE_SIM === 'true',
  
  // If true, enables diagnostic logging for machine registration and node API routes.
  NODLR_DEBUG_REGISTRATION: process.env.NODLR_DEBUG_REGISTRATION === 'true'
};

// Log current feature flag state in development
if (process.env.NODE_ENV === 'development') {
  console.log('[Feature Flags]:', featureFlags);
}
