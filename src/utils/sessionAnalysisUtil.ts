import type { SingleCurrencyRate } from '../api/nbpApi';

export function countTotalSessions(rates: SingleCurrencyRate[]): number {
    return Math.max(0, rates.length - 1);
}

export function countRisingSessions(rates: SingleCurrencyRate[]): number {
    rates.sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));

    let count = 0;
    for (let i = 1; i < rates.length; i++) {
        if (rates[i].mid > rates[i - 1].mid) {
            count++;
        }
    }
    return count;
}

export function countFallingSessions(rates: SingleCurrencyRate[]): number {
    rates.sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));

    let count = 0;
    for (let i = 1; i < rates.length; i++) {
        if (rates[i].mid < rates[i - 1].mid) {
            count++;
        }
    }
    return count;
}

export function countStableSessions(rates: SingleCurrencyRate[]): number {
    rates.sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));

    let count = 0;
    for (let i = 1; i < rates.length; i++) {
        if (rates[i].mid === rates[i - 1].mid) {
            count++;
        }
    }
    return count;
}

export function getRisingPercentage(rates: SingleCurrencyRate[]): number | undefined {
    const totalSessions = countTotalSessions(rates);
    if (totalSessions === 0) {
        return undefined;
    }
    return (countRisingSessions(rates) / totalSessions) * 100;
}

export function getFallingPercentage(rates: SingleCurrencyRate[]): number | undefined {
    const totalSessions = countTotalSessions(rates);
    if (totalSessions === 0) {
        return undefined;
    }
    return (countFallingSessions(rates) / totalSessions) * 100;
}

export function getStablePercentage(rates: SingleCurrencyRate[]): number | undefined {
    const totalSessions = countTotalSessions(rates);
    if (totalSessions === 0) {
        return undefined;
    }
    return (countStableSessions(rates) / totalSessions) * 100;
}
