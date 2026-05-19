/**
 * Web Locks API implementation to ensure only one tab per browser 
 * can hold the 'nodl_worker_active' lock.
 */

export async function acquireTabLock(onAcquired: () => void, onLost: () => void) {
  if (!navigator.locks) {
    console.warn("Web Locks API not supported. Falling back to multi-tab mode.");
    onAcquired();
    return;
  }

  try {
    await navigator.locks.request('nodl_worker_active', async (lock) => {
      console.log("Tab lock acquired:", lock.name);
      onAcquired();

      // Keep the lock until the tab is closed or the promise is settled.
      // We return a promise that never resolves to hold the lock indefinitely.
      return new Promise<void>((resolve) => {
        window.addEventListener('unload', () => {
          console.log("Tab unloading, releasing lock.");
          resolve();
        });
      });
    });
  } catch (err) {
    console.error("Failed to acquire tab lock:", err);
    onLost();
  }
}
