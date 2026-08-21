/**
 * Wnode AI — Provider Loader
 */

/**
 * Returns the active provider name.
 * Locked to "tiny-local" for Phase 3d.
 */
function getProvider() {
  return "tiny-local";
}

module.exports = { getProvider };
