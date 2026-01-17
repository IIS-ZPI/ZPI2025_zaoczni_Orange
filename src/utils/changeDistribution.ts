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
    if (currency1.length !== currency2.length) {
        throw new Error('Number of currency rates mismatched');
    }

    if ([...currency1, ...currency2].filter(c => c.mid <= 0).length > 0) {
        throw new Error('Invalid currency rate value');
    }

    console.log(`Calc start`);
    const finalCurrencyRate = currency1.map((cur1, idx) => {
        const cur2 = currency2[idx];

        if (cur1.effectiveDate !== cur2.effectiveDate) {
            throw new Error('Date mismatch');
        }

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
