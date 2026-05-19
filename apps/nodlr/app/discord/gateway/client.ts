import { EventEmitter } from 'events';

export class DiscordGatewayClient extends EventEmitter {
  private token: string;
  private socket: WebSocket | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastSequence: number | null = null;

  constructor(token: string) {
    super();
    this.token = token;
  }

  public connect() {
    if (this.socket || !this.token) return;

    console.log("Discord Gateway: Connecting...");
    this.socket = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");

    this.socket.onopen = () => {
      console.log("Discord Gateway: WebSocket opened");
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data.toString());
        this.handlePayload(data);
      } catch (err) {
        console.error("Discord Gateway: Failed to parse payload", err);
      }
    };

    this.socket.onclose = (event) => {
      console.log(`Discord Gateway: WebSocket closed (${event.code})`);
      this.cleanup();
      if (event.code === 4014) {
        console.warn("Discord Gateway: Disallowed Intents. Verify Portal Settings (non-fatal server error).");
        return;
      }
      if (event.code !== 1000) {
        setTimeout(() => this.connect(), 10000);
      }
    };

    this.socket.onerror = (error) => {
      console.warn("Discord Gateway: WebSocket error (non-fatal server error):", error);
    };
  }

  private handlePayload(payload: any) {
    const { op, d, t, s } = payload;
    if (s) this.lastSequence = s;

    switch (op) {
      case 10: // HELLO
        this.startHeartbeat(d.heartbeat_interval);
        this.identify();
        break;
      case 11: // HEARTBEAT ACK
        break;
      case 0: // DISPATCH
        if (['MESSAGE_CREATE', 'MESSAGE_UPDATE', 'MESSAGE_DELETE'].includes(t)) {
          this.emit('discord_event', { t, d });
        }
        break;
    }
  }

  private identify() {
    const payload = {
      op: 2,
      d: {
        token: this.token,
        intents: 33281, // GUILDS + GUILD_MESSAGES + MESSAGE_CONTENT
        properties: {
          os: 'linux',
          browser: 'nextjs',
          device: 'server'
        }
      }
    };
    this.socket?.send(JSON.stringify(payload));
  }

  private startHeartbeat(interval: number) {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      this.socket?.send(JSON.stringify({ op: 1, d: this.lastSequence }));
    }, interval);
  }

  private cleanup() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
    this.socket = null;
  }

  public disconnect() {
    this.socket?.close();
    this.cleanup();
  }
}

const globalForDiscord = global as unknown as { discordGateway: DiscordGatewayClient };
export const discordGateway = globalForDiscord.discordGateway || new DiscordGatewayClient(process.env.DISCORD_BOT_TOKEN || "");

if (process.env.NODE_ENV !== 'production') globalForDiscord.discordGateway = discordGateway;

if (process.env.DISCORD_BOT_TOKEN) {
  discordGateway.connect();
}
