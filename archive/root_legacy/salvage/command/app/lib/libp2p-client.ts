import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { webRTC } from '@libp2p/webrtc'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { multiaddr } from '@multiformats/multiaddr'
import { base32 } from 'multiformats/bases/base32'
import { base58btc } from 'multiformats/bases/base58'
import { acquireTabLock } from './tab-lock'
import { getHardwareDNA } from './fingerprint'
import { runWasmBenchmark } from './benchmark'

let libp2p: any = null;

export async function startNodlNode() {
  // Prevent SSR execution
  if (typeof window === "undefined") return;

  // 1. Tab Lock
  await acquireTabLock(
    async () => {
      console.log("Nodl worker starting...");
      
      // 2. Hardware DNA & Benchmark
      const { dna, trustScore } = await getHardwareDNA();
      const benchmarkOps = await runWasmBenchmark();
      
      let finalTrustScore = trustScore;
      if (benchmarkOps < 1000000) { // arbitrary threshold
        console.warn("WASM Benchmark failed to hit threshold. Reducing trust.");
        finalTrustScore = 0.1;
      }

      // 3. Start libp2p
      try {
        libp2p = await createLibp2p({
          transports: [
            webSockets() as any
          ],
          connectionEncryption: [noise()],
          streamMuxers: [mplex()],
          bases: { base32, base58btc }
        } as any);

        await libp2p.start();
        console.log('libp2p started. ID:', libp2p.peerId.toString());

        // 4. Connect to Anchor
        const anchorAddr = process.env.NEXT_PUBLIC_ANCHOR_MULTIADDR || `/ip4/127.0.0.1/tcp/10000/ws/p2p/${process.env.NEXT_PUBLIC_ANCHOR_PEER_ID || 'PEER_ID'}`;
        
        try {
          if (anchorAddr.includes('PEER_ID')) {
            console.warn("Anchor node not configured: 'PEER_ID' placeholder detected. Skipping dial.");
            return;
          }
          const ma = multiaddr(anchorAddr);
          await libp2p.dial(ma);
          console.log('Dialed Anchor node!');

          // 5. Open stream to report DNA & Benchmarks
          const stream = await libp2p.dialProtocol(ma, '/nodl/register/1.0.0');
          const encoder = new TextEncoder();
          const report = JSON.stringify({
            dna,
            trustScore: finalTrustScore,
            benchmark: benchmarkOps,
            sessionId: Math.random().toString(36).substring(7)
          });
          
          const writer = stream.sink;
          await writer([encoder.encode(report)]);
          console.log('Hardware DNA report sent.');

        } catch (dialErr) {
          console.error("Failed to dial Anchor:", dialErr);
        }

      } catch (err) {
        console.error('Failed to start libp2p:', err);
      }
    },
    () => {
      console.error("FAILED to acquire tab lock. Duplicate tab detected.");
      // Trigger UI overlay
      const event = new CustomEvent('nodl-integrity-error', { 
        detail: { message: "System Integrity Error: Machine limit reached." } 
      });
      window.dispatchEvent(event);
    }
  );
}

export async function stopNodlNode() {
  if (libp2p) {
    await libp2p.stop();
    libp2p = null;
  }
}
