import { calculateChangeDistribution } from '../src/utils/changeDistribution';

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
