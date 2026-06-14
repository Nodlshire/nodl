const store: Record<string, { timestamp: number, result: any }> = {};

export function hasKey(key: string) {
    return !!store[key];
}

export function setKey(key: string, result: any) {
    store[key] = { timestamp: Date.now(), result };
}

export function getResult(key: string) {
    return store[key]?.result;
}

export function getAllKeys(): string[] {
    return Object.keys(store);
}
