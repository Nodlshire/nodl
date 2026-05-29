// Wnode Browser Node - Mesh Bridge (WebSocket-backed)

const MeshBridge = {
    taskCount: 0,

    connect: function() {
        document.getElementById('meshConnection').textContent = "Connecting...";

        // Wire WSClient inbound messages to this bridge
        WSClient.onMessage = (msg) => MeshBridge.onMessage(msg);

        // Open the WebSocket
        WSClient.connect();
    },

    disconnect: function() {
        WSClient.stopSimulations();
        WSClient.close();
        document.getElementById('meshConnection').textContent = "Disconnected";
        document.getElementById('meshHeartbeat').textContent = "Never";
        document.getElementById('debugSent').textContent = "None";
        document.getElementById('debugReceived').textContent = "None";
    },

    send: function(msgObj) {
        WSClient.send(msgObj);
    },

    onMessage: function(msg) {
        switch (msg.type) {
            case "internal_connected":
                document.getElementById('meshConnection').textContent = "Connected";
                setStatus("running", "Connected to mesh.");
                break;

            case "announce_ack":
                log("[MESH] Announce acknowledged by server.");
                break;

            case "task_request":
                this._receiveTask(msg.payload);
                if (window.operator) {
                    window.operator.submitTask(msg.payload);
                }
                break;

            case "mesh_ping":
                log("[MESH] Received mesh_ping, responding with mesh_pong.");
                this.send({ type: "mesh_pong", payload: {} });
                break;

            case "mesh_control":
                log("[MESH] Control command: " + JSON.stringify(msg.payload));
                break;

            default:
                log("[MESH] Unhandled message type: " + msg.type);
        }

        document.getElementById('debugReceived').textContent = msg.type;
    },

    _receiveTask: function(task) {
        const taskList = document.getElementById('taskList');
        if (this.taskCount === 0) {
            taskList.innerHTML = "";
        }

        this.taskCount++;
        const li = document.createElement('li');
        li.textContent = `[${new Date().toLocaleTimeString()}] Task #${this.taskCount}: ${task.action} (${task.task_id})`;
        taskList.prepend(li);
    }
};
