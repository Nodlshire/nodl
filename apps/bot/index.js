import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Bot online as ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  const text = msg.content.toLowerCase();

  if (text === "!juicebox") {
    msg.reply("🚀 Support Wnode on Juicebox: https://juicebox.money/v2/p/wnode");
  }

  if (text === "!about") {
    msg.reply("WNODE is building sovereign compute for everyone.");
  }

  if (text === "!faq") {
    msg.reply("FAQ: https://wnode.one/faq");
  }

  if (text === "!join") {
    msg.reply("Join the Wnode community: https://discord.gg/5BNhsfg5Br");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
