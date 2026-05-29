// Wnode Node Operator - JS Glue Code

class WnodeOperator {
    constructor() {
        this.isRunning = false;
        this.wasmInstance = null;
    }

    async loadWasm() {
        log("Loading wnode.wasm...");
        // [PLACEHOLDER] Real implementation uses WebAssembly.instantiateStreaming
        await new Promise(r => setTimeout(r, 500)); 
        log("wnode.wasm loaded successfully.");
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        setStatus("connecting", "Operator started. Engaging mesh network...");
        MeshBridge.connect();
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        setStatus("idle", "Operator stopping...");
        MeshBridge.disconnect();
    }
}

// UI Bindings
const operator = new WnodeOperator();
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const logs = document.getElementById('logs');
const statusBadge = document.getElementById('globalStatus');

function log(msg) {
    logs.textContent += "\n" + new Date().toISOString() + " | " + msg;
    logs.scrollTop = logs.scrollHeight;
}

function setStatus(state, message) {
    // Update badge
    statusBadge.textContent = state.charAt(0).toUpperCase() + state.slice(1);
    statusBadge.className = 'status-badge status-' + state;
    
    // Log message
    if (message) log(message);
}

btnStart.onclick = async () => {
    btnStart.disabled = true;
    try {
        if (!operator.wasmInstance) await operator.loadWasm();
        operator.start();
        btnStop.disabled = false;
    } catch (e) {
        setStatus("error", "Error: " + e.message);
        btnStart.disabled = false;
    }
};

btnStop.onclick = () => {
    operator.stop();
    btnStart.disabled = false;
    btnStop.disabled = true;
};
