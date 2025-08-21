export const getCurrencySymbol = (currencyCode: string): string => {
    const symbols: Record<string, string> = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'CAD': 'C$',
        'AUD': 'A$',
        'JPY': '¥',
    };
    return symbols[currencyCode] || currencyCode;
};
