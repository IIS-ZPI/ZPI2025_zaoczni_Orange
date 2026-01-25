import { DAYS_BY_PERIOD, Period, SingleCurrencyRate } from '../api/nbpApi';

export type ChangeDistributionItem = {
    min: number;
    max: number;
    count: number;
};

export function calculateChangeDistribution(
    currency1: SingleCurrencyRate[],
    currency2: SingleCurrencyRate[],
    desiredNumRanges: number = 14,
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

    const currencyRateChanges = finalCurrencyRate.slice(1).map((rate, index) => {
        return rate - finalCurrencyRate[index];
    });

    const globalMin = Math.min(...currencyRateChanges);
    const globalMax = Math.max(...currencyRateChanges);
    const rangeSize = Math.max(minRangeSize, (globalMax - globalMin) / desiredNumRanges);
    if (rangeSize === minRangeSize) {
        desiredNumRanges = Math.ceil((globalMax - globalMin) / rangeSize);
    }
    if (globalMin === globalMax) {
        desiredNumRanges = 1;
    }

    const changeDistribution = Array.from({ length: desiredNumRanges }, (_, i) => {
        const rangeMin = globalMin + i * rangeSize;
        const rangeMax = i === desiredNumRanges - 1 ? globalMax : globalMin + (i + 1) * rangeSize;

        const count = currencyRateChanges.filter(
            v => v >= rangeMin && (v < rangeMax || rangeMax === globalMax)
        ).length;

        return {
            min: rangeMin,
            max: rangeMax,
            count: count,
        };
    });

    return changeDistribution;
}

export function getMaxPeriodBeginDate(period: Period, maxPeriodEndDate?: Date): Date {
    const numDays = DAYS_BY_PERIOD[period];
    const beginDate = maxPeriodEndDate ? new Date(maxPeriodEndDate) : new Date();
    beginDate.setDate(beginDate.getDate() - numDays);
    return beginDate;
}
