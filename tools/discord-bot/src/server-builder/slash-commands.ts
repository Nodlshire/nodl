export interface SlashCommandDef {
    name: string;
    description: string;
    options?: {
        name: string;
        description: string;
        type: number;
        required?: boolean;
    }[];
}

export const SLASH_COMMANDS_LIST: SlashCommandDef[] = [
    {
        name: 'setup',
        description: 'Preview or execute 1-click Discord server setup and role provisioning',
        options: [
            {
                name: 'confirm',
                description: 'Set to true to execute full server provisioning',
                type: 5, // Boolean
                required: false
            }
        ]
    },
    {
        name: 'deploy',
        description: 'Deploy 21 channels across 10 categories'
    },
    {
        name: 'initialize',
        description: 'Initialize onboarding flow & pin Start Here guide'
    },
    {
        name: 'builder',
        description: 'Execute ServerBuilder rebuild or deployment',
        options: [
            {
                name: 'action',
                description: 'Action to perform: rebuild or deploy',
                type: 3, // String
                required: true
            }
        ]
    },
    {
        name: 'docs',
        description: 'Display canonical documentation index'
    },
    {
        name: 'search',
        description: 'Search SOT technical documentationcanon',
        options: [
            {
                name: 'query',
                description: 'Search term (e.g. zero-storage, dewi)',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'mesh',
        description: 'Display live SOT telemetry metrics and active node capacity'
    },
    {
        name: 'status',
        description: 'Report operational status of wnode.one, cmd.wnode.one, and nodld'
    }
];

export class SlashCommandDeployer {
    public static getDefinitions(): SlashCommandDef[] {
        return SLASH_COMMANDS_LIST;
    }
}
