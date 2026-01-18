import type { SingleCurrencyRate } from '../api/nbpApi';

export function countTotalSessions(rates: SingleCurrencyRate[]): number {
    return rates.length - 1;
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
