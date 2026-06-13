import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import Fuse from 'fuse.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
dotenv.config();

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

let fuse;
function getFuse() {
    if (!fuse) {
        fuse = new Fuse(knowledgeBase, {
            keys: ['file', 'content'],
            includeScore: true,
            threshold: 0.6, // lower score = better match, 0.0 is perfect
            ignoreLocation: true
        });
    }
    return fuse;
}

function findBestMatch(query) {
    // Normalize query: lowercase and remove punctuation
    query = query.toLowerCase().replace(/[^\w\s]/g, '').trim();
    if (!query) return null;

    const results = getFuse().search(query);
    if (results.length > 0) {
        // Return the highest-scoring match if score is below the threshold
        const best = results[0];
        if (best.score <= 0.6) {
            return best.item;
        }
    }
    return null;
}

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

    const match = findBestMatch(query);
    
    if (match && match.originalContent) {
        const responseText = match.originalContent.substring(0, 1900);
        msg.reply(`I found some relevant information in my knowledge base:\n\n${responseText}...`);
    } else {
        msg.reply("I couldn't find any relevant information regarding that query in my knowledge base.");
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
