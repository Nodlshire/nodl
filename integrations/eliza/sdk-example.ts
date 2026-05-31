// Example Eliza skill/plugin calling Wnode for external compute

export const wnodeTask = {
  name: "wnodeTask",
  description: "Send a compute task to the Wnode decentralized execution mesh",

  async run(runtime, message) {
    const wnodeEndpoint = "https://gateway.wnode.network/v1/tasks/run";

    const payload = {
      taskType: "eliza_agent_task",
      payload: {
        agentId: runtime.agentId || "example-agent-id",
        input: message.content || "No input provided"
      }
    };

    try {
      const res = await fetch(wnodeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        return `Wnode error: ${res.status} ${res.statusText}`;
      }

      const result = await res.json();

      return `Wnode task completed. Output: ${JSON.stringify(
        result.output || {}
      )}`;
    } catch (err) {
      return `Error calling Wnode: ${err.message}`;
    }
  }
};
