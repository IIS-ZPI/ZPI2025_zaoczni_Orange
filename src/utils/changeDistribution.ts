import { SingleCurrencyRate } from '../api/nbpApi';

export type ChangeDistributionItem = {
    min: number;
    max: number;
    count: number;
};

export function calculateChangeDistribution(
    currency1: SingleCurrencyRate[],
    currency2: SingleCurrencyRate[],
    numRanges: number = 14,
    minRangeSize: number = 0.0001
): ChangeDistributionItem[] {
    if ([...currency1, ...currency2].some(c => c.mid <= 0)) {
        throw new Error('Invalid currency rate value');
    }

    const dates = currency1
        .map(cur1 => cur1.effectiveDate)
        .filter(date => currency2.some(cur2 => cur2.effectiveDate === date));

    if (dates.length === 0) {
        return [];
    }

    const finalCurrencyRate = dates.map(date => {
        const cur1 = currency1.find(cur1 => cur1.effectiveDate === date)!;
        const cur2 = currency2.find(cur2 => cur2.effectiveDate === date)!;
        return cur1.mid / cur2.mid;
    });

    const globalMin = Math.min(...finalCurrencyRate);
    const globalMax = Math.max(...finalCurrencyRate);
    const rangeSize = Math.max(minRangeSize, (globalMax - globalMin) / numRanges);

    const changeDistribution = Array.from({ length: numRanges }, (_, i) => {
        const rangeMin = globalMin + i * rangeSize;
        const rangeMax = i === numRanges - 1 ? globalMax : globalMin + (i + 1) * rangeSize;

        const count = finalCurrencyRate.filter(
            v => v >= rangeMin && (v < rangeMax || rangeMax === globalMax)
        ).length;

        console.log(`(${rangeMin}, ${rangeMax}) ${count}`);

        return {
            min: rangeMin,
            max: rangeMax,
            count: count,
        };
    });

    return changeDistribution;
}
