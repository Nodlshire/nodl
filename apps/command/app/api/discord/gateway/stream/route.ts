import { discordGateway } from "../../../../discord/gateway/client";

export async function GET() {
  let controllerRef: ReadableStreamDefaultController | null = null;
  let heartbeat: NodeJS.Timeout;

  const onEvent = (event: any) => {
    if (!controllerRef) return;
    try {
      console.log("SSE FORWARD:", event?.t);
      const data = `data: ${JSON.stringify(event)}\n\n`;
      controllerRef.enqueue(new TextEncoder().encode(data));
    } catch (e) {
      // Stream likely closed
    }
  };

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;
      discordGateway.on('discord_event', onEvent);
      
      heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode("event: ping\ndata: {}\n\n"));
        } catch (e) {
          // Stream likely closed
        }
      }, 15000);
    },
    cancel() {
      discordGateway.off('discord_event', onEvent);
      clearInterval(heartbeat);
      controllerRef = null;
    }
  });
  
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
