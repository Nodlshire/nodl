import { Web3Function, Web3FunctionContext } from "@gelatonetwork/web3-functions-sdk";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { storage, multiChainProvider } = context;

  // Track last execution block to avoid running too often
  const lastExecutionBlock = (await storage.get("last_execution_block")) || "0";
  const currentBlock = await multiChainProvider.default().getBlockNumber();

  if (currentBlock - parseInt(lastExecutionBlock, 10) < 50) {
    return {
      canExec: false,
      message: "Execution interval not reached yet."
    };
  }

  // Wnode gateway endpoint (MVP)
  const wnodeEndpoint = "https://gateway.wnode.network/v1/tasks/run";

  // Payload sent to Wnode
  const payload = {
    taskType: "gelato_web3_function",
    payload: {
      jobId: "example-job-id",
      network: "ethereum",
      params: {
        blockNumber: currentBlock
      }
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
      return {
        canExec: false,
        message: `Wnode gateway error: ${res.status} ${res.statusText}`
      };
    }

    const result = await res.json();

    // Save the block number to enforce rate limiting
    await storage.set("last_execution_block", currentBlock.toString());

    return {
      canExec: true,
      callData: [], // In a real example, this would contain encoded tx data
      message: `Wnode execution success. Proof: ${result.proofHash || "n/a"}`
    };
  } catch (e: any) {
    return {
      canExec: false,
      message: `Error calling Wnode: ${e.message}`
    };
  }
});
