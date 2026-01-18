import type { SingleCurrencyRate } from '../api/nbpApi';

export function calculateMedian(rates: SingleCurrencyRate[]): number {
    if (rates.length === 0) {
        return NaN;
    }

    rates.sort((a, b) => a.mid - b.mid);

    if (rates.length % 2 === 0) {
        return (rates[rates.length / 2 - 1].mid + rates[rates.length / 2].mid) / 2;
    }

    return rates[Math.floor(rates.length / 2)].mid;
}

export function calculateMode(rates: SingleCurrencyRate[]): number {
    if (rates.length === 0) return NaN;

    const frequencyMap = new Map<number, number>();
    for (const rate of rates) {
        frequencyMap.set(rate.mid, (frequencyMap.get(rate.mid) || 0) + 1);
    }

    let maxCount = 0;
    let mode: number = NaN;
    for (const [value, count] of frequencyMap.entries()) {
        if (count > maxCount) {
            maxCount = count;
            mode = value;
        } else if (count === maxCount) {
            mode = NaN;
        }
    }

    return maxCount === 1 ? NaN : mode;
}

export function calculateVariance(rates: SingleCurrencyRate[]): number {
    if (rates.length === 0) {
        return NaN;
    }

    const avg =
        rates
            .map(rate => rate.mid)
            .reduce((sum, val) => {
                return sum + val;
            }) / rates.length;

    const variance =
        rates.map(rate => rate.mid).reduce((cum, val) => Math.pow(val - avg, 2) + cum) /
        rates.length;

    return variance;
}
export function calculateStandardDeviation(rates: SingleCurrencyRate[]): number {
    if (rates.length === 0) {
        return NaN;
    }

    return Math.sqrt(calculateVariance(rates));
}
