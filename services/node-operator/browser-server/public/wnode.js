// Wnode Node Operator - JS Glue Code

let browserNodeVersion = "unknown";

class WnodeOperator {
    constructor() {
        this.isRunning = false;
        this.wasmInstance = null;
        this.taskCount = 0;
        this.resultCount = 0;
    }

    async loadWasm() {
        log("Loading wnode.wasm...");
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

    async submitTask(taskEnvelope) {
        this.taskCount++;
        log(`[ENGINE] Task ${taskEnvelope.task_id} submitted (action: ${taskEnvelope.action})`);

        const result = await WorkloadEngine.Execute(taskEnvelope);
        this.onResult(result);
    }

    onResult(resultEnvelope) {
        this.resultCount++;
        log(`[ENGINE] Result for ${resultEnvelope.task_id}: status=${resultEnvelope.status}, time=${resultEnvelope.execution_time_ms}ms`);

        // Display in Results panel
        const resultList = document.getElementById('resultList');
        if (this.resultCount === 1) {
            resultList.innerHTML = "";
        }
        const li = document.createElement('li');
        const outputPreview = resultEnvelope.output ? atob(resultEnvelope.output).substring(0, 60) : "";
        li.textContent = `[${new Date().toLocaleTimeString()}] ${resultEnvelope.task_id} | ${resultEnvelope.status} | ${resultEnvelope.execution_time_ms}ms | ${outputPreview}`;
        resultList.prepend(li);

        // Send result back to mesh via WebSocket
        MeshBridge.send({
            type: "task_result",
            payload: resultEnvelope
        });
    }
}

// Fetch browser manifest on load
async function loadBrowserManifest() {
    try {
        const resp = await fetch("browser-manifest.json");
        const manifest = await resp.json();
        browserNodeVersion = manifest.version;
        document.getElementById('browserVersion').textContent = browserNodeVersion;
        log("Browser Node " + browserNodeVersion + " initialized.");
    } catch (e) {
        document.getElementById('browserVersion').textContent = "Error";
        log("Failed to load browser-manifest.json: " + e.message);
    }
}

// UI Bindings
window.operator = new WnodeOperator();
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const logs = document.getElementById('logs');
const statusBadge = document.getElementById('globalStatus');

function log(msg) {
    logs.textContent += "\n" + new Date().toISOString() + " | " + msg;
    logs.scrollTop = logs.scrollHeight;
}

function setStatus(state, message) {
    statusBadge.textContent = state.charAt(0).toUpperCase() + state.slice(1);
    statusBadge.className = 'status-badge status-' + state;
    if (message) log(message);
}

btnStart.onclick = async () => {
    btnStart.disabled = true;
    try {
        if (!window.operator.wasmInstance) await window.operator.loadWasm();
        window.operator.start();
        btnStop.disabled = false;
    } catch (e) {
        setStatus("error", "Error: " + e.message);
        btnStart.disabled = false;
    }
};

btnStop.onclick = () => {
    window.operator.stop();
    btnStart.disabled = false;
    btnStop.disabled = true;
};

loadBrowserManifest();
