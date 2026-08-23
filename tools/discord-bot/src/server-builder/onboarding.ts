export class OnboardingManager {
    public static getStartHereEmbed(): any {
        return {
            title: '⚡ Welcome to Wnode Sovereign Compute Mesh',
            color: 0x3b82f6,
            description: 'Wnode is a sovereign compute + wireless (DeWi) mesh. Turn any device into an income-generating node.',
            fields: [
                {
                    name: '🚀 Essential Quick Links',
                    value: '• **Run a Node**: [nodlr.wnode.one](https://nodlr.wnode.one)\n• **Read the Docs**: [wnode.one/docs](https://wnode.one/docs)\n• **Command UI**: [cmd.wnode.one](https://cmd.wnode.one)',
                    inline: false
                },
                {
                    name: '📌 Getting Started Checklist',
                    value: '1. **Node Operators**: Head to `#getting-started` to download `nodl-desktop` or `nodl-core`.\n2. **Developers**: Head to `#sdk` and check `#jobs-envelope` to deploy WASM workloads.\n3. **DeWi Participants**: Check `#dewi-updates` for LoRaWAN and 5G gateway guides.\n4. **Bot Assistance**: Execute `!help` or `!search <term>` in `#bot-commands`.',
                    inline: false
                }
            ],
            timestamp: new Date().toISOString()
        };
    }

    public static getWelcomeScreenConfig(): any {
        return {
            welcome_channels: [
                { channel_id: 'getting-started', description: 'Download binary and start earning daily USD' },
                { channel_id: 'general', description: 'Join community sovereign compute discussions' },
                { channel_id: 'contributions', description: 'Share improvements, experiments, and proposals' },
                { channel_id: 'bot-commands', description: 'Execute !docs and !search SOT documentation' }
            ]
        };
    }

    public static getContributionsWelcomeEmbed(): any {
        return {
            title: '🧩 Welcome to #contributions — the innovation hub of Wnode!',
            color: 0x3b82f6,
            description: 'This channel is where ideas become reality. Share improvements, experiments, and creative contributions that strengthen the Wnode Mesh.',
            fields: [
                {
                    name: '📌 Use this space for:',
                    value: '• Feature suggestions and new capabilities\n• UX or onboarding enhancements\n• Architecture or design proposals\n• Documentation improvements\n• Anything that helps evolve the ecosystem',
                    inline: false
                },
                {
                    name: '💡 Active Builders:',
                    value: 'If you’re actively building, link your work or describe what you’re working on — others may join in or offer feedback.',
                    inline: false
                }
            ],
            footer: {
                text: 'Keep discussions constructive, focused, and forward-looking. Every idea here helps make Wnode faster, smarter, and more resilient.'
            },
            timestamp: new Date().toISOString()
        };
    }
}
