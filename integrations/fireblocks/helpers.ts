export function formatFireblocksPayload(raw: any) {
  return { ...raw, formatted: true, timestamp: Date.now(), policyTag: "wnode_auto" };
}

export function wipeFireblocksState(sessionData: any) {
  for (let key in sessionData) {
    delete sessionData[key];
  }
}
