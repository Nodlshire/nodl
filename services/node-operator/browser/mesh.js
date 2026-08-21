// Wnode Browser Node - WebSocket Mesh Bridge

const MeshBridge = {
    socket: null,
    heartbeatInterval: null,
    taskCount: 0,

    connect: async function() {
        document.getElementById('meshConnection').textContent = "Connecting...";
        setStatus("connecting", "Connecting to mesh...");
        
        // Simulating connection delay
        setTimeout(() => {
            document.getElementById('meshConnection').textContent = "Connected";
            setStatus("running", "Connected to mesh.");
            this.announceCapabilities();
            this.startHeartbeat();
            
            // Simulate receiving a task shortly after connecting
            setTimeout(() => {
                this.receiveTask('{"id": "task-001", "action": "echo", "data": "hello"}');
            }, 3000);
            
        }, 1000);
    },

    disconnect: function() {
        document.getElementById('meshConnection').textContent = "Disconnected";
        document.getElementById('meshHeartbeat').textContent = "Never";
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        this.socket = null;
        setStatus("idle", "Disconnected from mesh.");
    },

    announceCapabilities: async function() {
        const caps = await Capabilities.getReport();
        log("Announcing capabilities to Mesh: " + caps.cores + " Cores, " + caps.memoryEstimateMB + "MB RAM");
    },

    startHeartbeat: function() {
        this.updateHeartbeatDisplay();
        this.heartbeatInterval = setInterval(() => {
            this.updateHeartbeatDisplay();
            log("Heartbeat sent to mesh.");
        }, 10000); // 10s heartbeat for demonstration
    },
    
    updateHeartbeatDisplay: function() {
        document.getElementById('meshHeartbeat').textContent = new Date().toLocaleTimeString();
    },
    
    receiveTask: function(taskJson) {
        log("Received task: " + taskJson);
        
        const taskList = document.getElementById('taskList');
        if (this.taskCount === 0) {
            taskList.innerHTML = ""; // Clear placeholder
        }
        
        this.taskCount++;
        const li = document.createElement('li');
        li.textContent = `[${new Date().toLocaleTimeString()}] Task #${this.taskCount}: ${taskJson}`;
        taskList.prepend(li); // Add to top
    }
};
