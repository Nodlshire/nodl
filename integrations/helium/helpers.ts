export function parseHntAmount(rawAmount: string): number {
    return parseInt(rawAmount) / 100000000;
}
