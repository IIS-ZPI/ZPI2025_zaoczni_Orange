import { calculateChangeDistribution } from '../src/utils/changeDistribution';

function buildRates(mids: number[]) {
    return mids.map((m, i) => ({
        no: `${i + 1}`,
        effectiveDate: `2020-01-${(i + 1).toString().padStart(2, '0')}`,
        mid: m,
    }));
}

describe('calculateChangeDistribution', () => {
    test('distributes values into specified number of ranges', () => {
        const c1 = buildRates([1, 2, 3, 4]);
        const c2 = buildRates([1, 1, 1, 1]);

        const result = calculateChangeDistribution(c1, c2, 4);

        expect(result).toHaveLength(4);
        expect(result.map(r => r.count)).toEqual([1, 1, 1, 1]);
        expect(result[0].min).toBeCloseTo(1, 6);
        expect(result[3].max).toBeCloseTo(4, 6);
    });

    test('handles scaling by second currency array', () => {
        const c1 = buildRates([1, 2, 3, 4]);
        const c2 = buildRates([2, 2, 2, 2]);

        // targetRate = [0.5, 1, 1.5, 2]
        const result = calculateChangeDistribution(c1, c2, 4);

        expect(result).toHaveLength(4);
        expect(result.map(r => r.count)).toEqual([1, 1, 1, 1]);
    });

    describe('edge cases', () => {
        test('returns empty histogram for empty data', () => {
            const res = calculateChangeDistribution([], [], 4);
            expect(res.reduce((s, r) => s + r.count, 0)).toBe(0);
        });

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
            expect(res.reduce((s, r) => s + r.count, 0)).toBe(2);
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

            expect(res.reduce((s, r) => s + r.count, 0)).toBe(4);
            expect(res.filter(r => r.count === 4).length).toBe(1);
        });

        test('includes globalMax in the last bin', () => {
            const c1 = buildRates([1, 2, 3, 10]);
            const c2 = buildRates([1, 1, 1, 1]);
            const res = calculateChangeDistribution(c1, c2, 4);
            expect(res.reduce((s, r) => s + r.count, 0)).toBe(4);
            const maxBin = res[res.length - 1];
            expect(maxBin.count).toBeGreaterThan(0);
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
