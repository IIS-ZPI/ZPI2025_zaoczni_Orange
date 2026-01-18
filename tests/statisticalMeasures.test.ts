import {
    calculateMedian,
    calculateMode,
    calculateVariance,
    calculateStandardDeviation,
} from '../src/utils/statisticalMeasures';

function buildRates(mids: number[]) {
    return mids.map((m, i) => ({
        no: `${i + 1}`,
        effectiveDate: `2020-01-${(i + 1).toString().padStart(2, '0')}`,
        mid: m,
    }));
}

describe('statisticalMeasures', () => {
    describe('calculateMedian', () => {
        test('returns NaN for empty array', () => {
            expect(calculateMedian([])).toBeNaN();
        });

        test('calculates median for odd count', () => {
            const rates = buildRates([1, 3, 2]);
            expect(calculateMedian(rates)).toBeCloseTo(2, 4);
        });

        test('calculates median for even count', () => {
            const rates = buildRates([1, 4, 3, 2]);
            expect(calculateMedian(rates)).toBeCloseTo(2.5, 4);
        });
    });

    describe('calculateMode', () => {
        test('returns NaN for empty array', () => {
            expect(calculateMode([])).toBeNaN();
        });

        test('returns NaN when all values unique', () => {
            const rates = buildRates([1, 2, 3]);
            expect(calculateMode(rates)).toBeNaN();
        });

        test('returns mode when exists', () => {
            const rates = buildRates([1, 2, 2, 3]);
            expect(calculateMode(rates)).toBeCloseTo(2, 4);
        });

        test('returns NaN on tie', () => {
            const rates = buildRates([1, 1, 2, 2]);
            expect(calculateMode(rates)).toBeNaN();
        });
    });

    describe('calculateVariance & calculateStandardDeviation', () => {
        test('returns NaN for empty array', () => {
            expect(calculateVariance([])).toBeNaN();
            expect(calculateStandardDeviation([])).toBeNaN();
        });

        test('calculates variance and stddev for simple dataset', () => {
            const rates = buildRates([1, 2, 3]);
            expect(calculateVariance(rates)).toBeCloseTo(2 / 3, 4);
            expect(calculateStandardDeviation(rates)).toBeCloseTo(Math.sqrt(2 / 3), 4);
        });
    });
});
