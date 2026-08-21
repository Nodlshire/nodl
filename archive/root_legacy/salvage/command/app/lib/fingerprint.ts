/**
 * Anti-Con (DNA Hashing) module for hardware fingerprinting.
 * Generates a Hardware_DNA string and detects Virtual Machines.
 */

export async function getHardwareDNA(): Promise<{ dna: string, trustScore: number }> {
    // 0. SSR Guard
    if (typeof window === "undefined" || typeof document === "undefined") {
        return { dna: "ssr-placeholder", trustScore: 1.0 };
    }

    let components: string[] = [];
    let trustScore = 1.0;

    // 1. Canvas Fingerprinting
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("nodl_proto_v1", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("nodl_proto_v1", 4, 17);
            components.push(canvas.toDataURL());
        }
    } catch (e) { console.error("Canvas failed", e); }

    // 2. WebGL Fingerprinting & VM Detection
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                components.push(vendor);
                components.push(renderer);

                // VM Detection via WebGL
                const vmKeywords = ["software", "virtual", "vmware", "swiftshader", "llvmpipe", "microsoft basic", "google"];
                if (vmKeywords.some(k => renderer.toLowerCase().includes(k))) {
                    console.warn("VM Detected:", renderer);
                    trustScore = 0.1;
                }
            }
        }
    } catch (e) { console.error("WebGL failed", e); }

    // 3. Audio Fingerprinting
    try {
        const AudioCtxClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
            const audioCtx = new AudioCtxClass();
            const oscillator = audioCtx.createOscillator();
            const analyser = audioCtx.createAnalyser();
            const gain = audioCtx.createGain();
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(10000, audioCtx.currentTime);
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            oscillator.connect(analyser);
            analyser.connect(gain);
            gain.connect(audioCtx.destination);
            oscillator.start(0);
            components.push(analyser.frequencyBinCount.toString());
            oscillator.stop();
        }
    } catch (e) { console.error("Audio failed", e); }

    // Hash components into DNA string
    const dna = await hashString(components.join('|'));

    return { dna, trustScore };
}

async function hashString(str: string): Promise<string> {
    if (typeof crypto === "undefined" || !crypto.subtle) {
        return "insecure-hash-" + Math.random().toString(36).substring(7);
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
