// Wnode Browser Node - WebSocket Client

const WSClient = {
    socket: null,
    url: "wss://ws.wnode.one/ws",
    connected: false,
    reconnectAttempt: 0,
    maxBackoffMs: 30000,
    baseBackoffMs: 500,
    heartbeatInterval: null,
    nodeID: "browser-" + Math.random().toString(36).substring(2, 10),
    onMessage: null,

    connect: function(url) {
        if (url) this.url = url;
        log("[WS] Connecting to " + this.url + "...");

        try {
            // [PLACEHOLDER] In production this opens a real WebSocket:
            // this.socket = new WebSocket(this.url);
            // this.socket.onopen = () => this._onOpen();
            // this.socket.onmessage = (e) => this._onMessage(e);
            // this.socket.onclose = () => this._onClose();
            // this.socket.onerror = (e) => this._onError(e);

            // Simulated connection
            setTimeout(() => this._onOpen(), 800);
        } catch (e) {
            log("[WS] Connection error: " + e.message);
            this._scheduleReconnect();
        }
    },

    send: function(msgObj) {
        if (!this.connected) {
            log("[WS] Cannot send, not connected.");
            return;
        }

        const raw = JSON.stringify(msgObj);
        // [PLACEHOLDER] this.socket.send(raw);
        log("[WS] => " + msgObj.type);
        document.getElementById('debugSent').textContent = msgObj.type;
    },

    close: function() {
        this.connected = false;
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        // if (this.socket) this.socket.close();
        this.socket = null;
        log("[WS] Connection closed.");
    },

    _onOpen: function() {
        this.connected = true;
        this.reconnectAttempt = 0;
        log("[WS] Connected to mesh.");

        // Send announce
        this._sendAnnounce();

        // Start heartbeat
        this._startHeartbeat();

        // Notify mesh bridge
        if (this.onMessage) {
            this.onMessage({ type: "internal_connected" });
        }

        // Start simulated inbound messages
        this._startSimulations();
    },

    _onMessage: function(event) {
        try {
            const msg = JSON.parse(event.data || event);
            log("[WS] <= " + msg.type);
            document.getElementById('debugReceived').textContent = msg.type;

            if (this.onMessage) {
                this.onMessage(msg);
            }
        } catch (e) {
            log("[WS] Parse error: " + e.message);
        }
    },

    _onClose: function() {
        log("[WS] Connection lost.");
        this.connected = false;
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        this._scheduleReconnect();
    },

    _onError: function(e) {
        log("[WS] Error: " + (e.message || "unknown"));
    },

    _scheduleReconnect: function() {
        const backoffMs = Math.min(
            this.baseBackoffMs * Math.pow(2, this.reconnectAttempt),
            this.maxBackoffMs
        );
        this.reconnectAttempt++;
        log("[WS] Reconnecting in " + backoffMs + "ms (attempt " + this.reconnectAttempt + ")...");
        setTimeout(() => this.connect(), backoffMs);
    },

    _sendAnnounce: function() {
        this.send({
            type: "announce",
            payload: {
                node_id: this.nodeID,
                version: browserNodeVersion || "v0.1.0",
                capabilities: {
                    cpu_cores: navigator.hardwareConcurrency || 1,
                    gpu_available: false,
                    wasm_supported: typeof WebAssembly !== "undefined"
                }
            }
        });
    },

    _startHeartbeat: function() {
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = setInterval(() => {
            if (!this.connected) return;
            this.send({
                type: "heartbeat",
                payload: {
                    node_id: this.nodeID,
                    timestamp: new Date().toISOString(),
                    version: browserNodeVersion || "v0.1.0",
                    uptime_seconds: Math.floor(performance.now() / 1000),
                    status: "alive"
                }
            });
            document.getElementById('meshHeartbeat').textContent = new Date().toLocaleTimeString();
        }, 10000);
    },

    // Simulated inbound traffic for development
    _simIntervals: [],

    _startSimulations: function() {
        this._simIntervals.forEach(i => clearInterval(i));
        this._simIntervals = [];

        let taskIdx = 1;

        // Simulate announce_ack
        setTimeout(() => {
            this._onMessage(JSON.stringify({ type: "announce_ack", payload: {} }));
        }, 500);

        // Simulate task_request every 20s
        this._simIntervals.push(setInterval(() => {
            const id = "t-" + (taskIdx++);
            this._onMessage(JSON.stringify({
                type: "task_request",
                payload: {
                    task_id: id,
                    action: "uppercase",
                    payload: btoa("mesh compute #" + id),
                    resource_requirements: { memory_mb: 16, cpu_timeout_ms: 5000 },
                    timeout_seconds: 30,
                    metadata: { priority: 5 }
                }
            }));
        }, 20000));

        // Simulate mesh_ping every 15s
        this._simIntervals.push(setInterval(() => {
            this._onMessage(JSON.stringify({ type: "mesh_ping", payload: {} }));
        }, 15000));

        // Initial task
        setTimeout(() => {
            this._onMessage(JSON.stringify({
                type: "task_request",
                payload: {
                    task_id: "t-init",
                    action: "echo",
                    payload: btoa("hello mesh"),
                    resource_requirements: { memory_mb: 8, cpu_timeout_ms: 3000 },
                    timeout_seconds: 30,
                    metadata: { priority: 1 }
                }
            }));
        }, 3000);
    },

    stopSimulations: function() {
        this._simIntervals.forEach(i => clearInterval(i));
        this._simIntervals = [];
    }
};
