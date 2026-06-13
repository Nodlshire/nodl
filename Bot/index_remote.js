import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
dotenv.config();
import { initRAG, askQuestion } from './rag/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const knowledgeDir = path.join(__dirname, 'knowledge');
let knowledgeBase = [];

async function loadKnowledge() {
    try {
        const files = fs.readdirSync(knowledgeDir);

        for (const file of files) {
            const fullPath = path.join(knowledgeDir, file);
            
            if (file.endsWith('.md')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                knowledgeBase.push({
                    file,
                    content: content.toLowerCase(),
                    originalContent: content
                });
            } else if (file.endsWith('.pdf')) {
                try {
                    const dataBuffer = fs.readFileSync(fullPath);
                    const data = await pdf(dataBuffer);
                    if (data && data.text) {
                        const content = data.text;
                        knowledgeBase.push({
                            file,
                            content: content.toLowerCase(),
                            originalContent: content
                        });
                    }
                } catch (e) {
                    console.error(`Failed to parse PDF ${file}:`, e.message);
                }
            }
        }

        console.log(`Loaded ${knowledgeBase.length} knowledge files.`);
    } catch (err) {
        console.error("Error loading knowledge base:", err);
    }
}

await loadKnowledge();
await initRAG(knowledgeBase);


client.once('ready', () => {
    console.log(`Bot online as ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;

    const text = msg.content.toLowerCase().trim();
    if (text === '!juicebox') {
        msg.reply("🚀 Support Wnode on Juicebox: https://juicebox.money/v2/p/wnode");
        return;
    } else if (text === '!about') {
        msg.reply("WNODE is building sovereign compute for everyone.");
        return;
    } else if (text === '!faq') {
        msg.reply("FAQ: https://wnode.one/faq");
        return;
    } else if (text === '!join') {
        msg.reply("Join the Wnode community: https://discord.gg/5BNhsfg5Br");
        return;
    }

    // Treat any other message as a knowledge base query
    const query = msg.content.trim();
    if (!query) return;

    try {
        const answer = await askQuestion(query);
        msg.reply(answer);
    } catch (err) {
        console.error("Error processing RAG query:", err);
        msg.reply("I encountered an error while searching for an answer.");
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
