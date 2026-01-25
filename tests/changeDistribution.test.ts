import {
    calculateChangeDistribution,
    getMaxPeriodBeginDate,
} from '../src/utils/changeDistribution';

function buildRates(mids: number[], startDay: number = 1) {
    return mids.map((m, i) => ({
        no: `${i + 1}`,
        effectiveDate: `2020-01-${(startDay + i).toString().padStart(2, '0')}`,
        mid: m,
    }));
}

describe('calculateChangeDistribution', () => {
    test('returns desired number of ranges', () => {
        const c1 = buildRates([1, 2, 4, 8]);
        const c2 = buildRates([1, 1, 1, 1]);

        // targetRate = [0.5, 1, 1.5, 2]
        const result = calculateChangeDistribution(c1, c2, 4);

        expect(result).toHaveLength(4);
    });

    test('returns empty histogram for empty data', () => {
        const res = calculateChangeDistribution([], [], 4);
        expect(res.reduce((s, r) => s + r.count, 0)).toBe(0);
    });

    test('calculates constant distribution as single range', () => {
        const c1 = buildRates([1, 2, 3, 4]);
        const c2 = buildRates([1, 1, 1, 1]);

        const result = calculateChangeDistribution(c1, c2, 4);
        expect(result).toHaveLength(1);
        expect(result[0].min).toBeCloseTo(1, 6);
        expect(result[0].max).toBeCloseTo(1, 6);
    });

    describe('edge cases', () => {
        test('uses only intersecting dates when arrays lengths differ', () => {
            const c1 = [
                { no: '1', effectiveDate: '2020-01-01', mid: 1 },
                { no: '2', effectiveDate: '2020-01-02', mid: 2 },
                { no: '3', effectiveDate: '2020-01-03', mid: 3 },
            ];

            const c2 = [
                { no: '1', effectiveDate: '2020-01-02', mid: 2 },
                { no: '2', effectiveDate: '2020-01-03', mid: 2 },
            ];

            const res = calculateChangeDistribution(c1, c2, 3);
            // 2 intersecting dates -> 1 consecutive change
            expect(res.reduce((s, r) => s + r.count, 0)).toBe(1);
        });

        test('throws on zero currency rate for intersecting dates', () => {
            const c1 = [
                { no: '1', effectiveDate: '2020-01-01', mid: 1 },
                { no: '2', effectiveDate: '2020-01-02', mid: 2 },
            ];

            const c2 = [
                { no: '1', effectiveDate: '2020-01-01', mid: 1 },
                { no: '2', effectiveDate: '2020-01-02', mid: 0 },
            ];

            expect(() => calculateChangeDistribution(c1, c2, 2)).toThrow();
        });

        test('all identical target rates go into single bin', () => {
            const c1 = buildRates([2, 2, 2, 2]);
            const c2 = buildRates([1, 1, 1, 1]);
            const res = calculateChangeDistribution(c1, c2, 3);
            expect(res.reduce((s, r) => s + r.count, 0)).toBe(3);
            expect(res.filter(r => r.count === 3).length).toBe(1);
        });

        test('ignores non-intersecting dates', () => {
            const c1 = [
                { no: '1', effectiveDate: '2020-01-01', mid: 1 },
                { no: '2', effectiveDate: '2020-01-02', mid: 2 },
                { no: '3', effectiveDate: '2020-01-03', mid: 3 },
            ];

            const c2 = [
                { no: '1', effectiveDate: '2020-02-01', mid: 2 },
                { no: '2', effectiveDate: '2020-02-02', mid: 2 },
            ];

            const res = calculateChangeDistribution(c1, c2, 3);

            expect(res.reduce((s, r) => s + r.count, 0)).toBe(0);
        });
    });
});

describe('getMaxPeriodBeginDate', () => {
    test('subtracts days from provided end date', () => {
        const end = new Date('2025-01-08T00:00:00Z');
        const begin = getMaxPeriodBeginDate('WEEK' as any, end);
        expect(begin.toISOString().split('T')[0]).toBe('2025-01-01');
    });

    test('end date remains unchanged when begin date is calculated', () => {
        const end = new Date('2025-02-01T00:00:00Z');
        getMaxPeriodBeginDate('MONTH' as any, end);
        expect(end.toISOString().split('T')[0]).toBe('2025-02-01');
    });

    test('uses current date when end date omitted', () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2025-03-15T00:00:00Z'));
        const begin = getMaxPeriodBeginDate('TWO_WEEKS' as any);
        expect(begin.toISOString().split('T')[0]).toBe('2025-03-01');
        jest.useRealTimers();
    });

    test('works for different periods', () => {
        const end = new Date('2025-08-14T00:00:00Z');
        const beginMonth = getMaxPeriodBeginDate('MONTH' as any, end);
        // Only month with 31 days gives exactly same date in previous month
        expect(beginMonth.toISOString().split('T')[0]).toBe('2025-07-14');
        const beginYear = getMaxPeriodBeginDate('YEAR' as any, end);
        // Only non-leap year gives exactly same date in previous year
        expect(beginYear.toISOString().split('T')[0]).toBe('2024-08-14');
    });
});
