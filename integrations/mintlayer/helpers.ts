export function formatMintlayerPayload(raw: any) {
  return { ...raw, formatted: true, timestamp: Date.now() };
}

export function wipeMintlayerState(sessionData: any) {
  for (let key in sessionData) {
    delete sessionData[key];
  }
}
