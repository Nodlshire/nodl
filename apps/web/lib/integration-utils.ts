export type IntegrationCategory = "DeFi" | "Bridge" | "Oracle" | "Infrastructure" | "Other";

export interface IntegrationMeta {
    name: string;
    displayName: string;
    category: IntegrationCategory;
    firstLetter: string;
}

const KNOWN_CATEGORIES: Record<string, IntegrationCategory> = {
    "aave": "DeFi",
    "uniswap": "DeFi",
    "polygon": "Infrastructure",
    "chainlink": "Oracle",
    "arbitrum": "Infrastructure",
    "solana": "Infrastructure",
    "wormhole": "Bridge",
    "synapse": "Bridge",
    "layerzero": "Bridge"
};

export function getDeterministicCategory(name: string): IntegrationCategory {
    const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (KNOWN_CATEGORIES[normalized]) {
        return KNOWN_CATEGORIES[normalized];
    }
    
    // Hash string to assign a deterministic category
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
        hash |= 0; 
    }
    
    const categories: IntegrationCategory[] = ["DeFi", "Bridge", "Oracle", "Infrastructure", "Other"];
    const index = Math.abs(hash) % categories.length;
    return categories[index];
}

export function parseIntegrationMetadata(dirName: string): IntegrationMeta {
    let displayName = dirName.replace(/-/g, ' ');
    if (dirName === 'aave.legacy') {
        displayName = 'Aave';
    } else {
        // Title case for aesthetic
        displayName = displayName.replace(/\b\w/g, l => l.toUpperCase());
    }
    const firstLetter = displayName.charAt(0).toUpperCase();
    const validLetter = /^[A-Z]$/.test(firstLetter) ? firstLetter : '#';
    
    return {
        name: dirName,
        displayName,
        category: getDeterministicCategory(dirName),
        firstLetter: validLetter
    };
}
