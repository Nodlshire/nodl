export function validateCurrency(currency: string): boolean {
    const supported = ['MXN', 'BRL', 'ARS', 'COP', 'USD'];
    return supported.includes(currency);
}
