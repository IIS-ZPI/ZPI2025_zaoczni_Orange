import { SingleCurrencyRate } from '../src/api/nbpApi';
import {
    countTotalSessions,
    countRisingSessions,
    countFallingSessions,
    countStableSessions,
    getRisingPercentage,
    getFallingPercentage,
    getStablePercentage,
} from '../src/utils/sessionAnalysisUtil';

function buildRates(mids: number[]): SingleCurrencyRate[] {
    return mids.map((m, i) => ({
        no: `${i + 1}`,
        effectiveDate: `2025-01-${(i + 1).toString().padStart(2, '0')}`,
        mid: m,
    }));
}

describe('Session Analysis', () => {
    describe('countTotalSessions', () => {
        test('should return 0 for empty rates', () => {
            const testData: SingleCurrencyRate[] = [];

            expect(countTotalSessions(testData)).toBe(0);
        });

        test('should return 0 for single rate', () => {
            const testData = buildRates([4.1219]);

            expect(countTotalSessions(testData)).toBe(0);
        });

        test('should return correct count for multiple rates', () => {
            const testData = buildRates([4.1219, 4.1512, 4.1012, 4.1219]);

            expect(countTotalSessions(testData)).toBe(3);
        });
    });

    describe('count rising sessions', () => {
        test('should count rising', () => {
            const testData = buildRates([4.1219, 4.1512]);

            expect(countRisingSessions(testData)).toBe(1);
        });

        test('should not count stable', () => {
            const testData = buildRates([4.1219, 4.1219]);

            expect(countRisingSessions(testData)).toBe(0);
        });

        test('should not count falling', () => {
            const testData = buildRates([4.1219, 4.1012]);

            expect(countRisingSessions(testData)).toBe(0);
        });

        test('should reorder by dates', () => {
            const rates = buildRates([4.1219, 4.1512]);
            const testData = [rates[1], rates[0]]; // out-of-order

            expect(countRisingSessions(testData)).toBe(1);
        });

        test('should count multiple sessions', () => {
            const testData = buildRates([4.1219, 4.1512, 4.1512, 4.1819]);

            expect(countRisingSessions(testData)).toBe(2);
        });
    });

    describe('count falling sessions', () => {
        test('should not count rising', () => {
            const testData = buildRates([4.1219, 4.1512]);

            expect(countFallingSessions(testData)).toBe(0);
        });

        test('should not count stable', () => {
            const testData = buildRates([4.1219, 4.1219]);

            expect(countFallingSessions(testData)).toBe(0);
        });

        test('should count falling', () => {
            const testData = buildRates([4.1219, 4.1012]);

            expect(countFallingSessions(testData)).toBe(1);
        });

        test('should sort by dates', () => {
            const rates = buildRates([4.1219, 4.1012]);
            const testData = [rates[1], rates[0]]; // out-of-order

            expect(countFallingSessions(testData)).toBe(1);
        });

        test('should count multiple sessions', () => {
            const testData = buildRates([4.1219, 4.1112, 4.1112, 4.0819]);

            expect(countFallingSessions(testData)).toBe(2);
        });
    });

    describe('count stable sessions', () => {
        test('should not count rising', () => {
            const testData = buildRates([4.1219, 4.1512]);

            expect(countStableSessions(testData)).toBe(0);
        });

        test('should count stable', () => {
            const testData = buildRates([4.1219, 4.1219]);

            expect(countStableSessions(testData)).toBe(1);
        });

        test('should not count falling', () => {
            const testData = buildRates([4.1219, 4.1012]);

            expect(countStableSessions(testData)).toBe(0);
        });

        test('should sort by dates', () => {
            const rates = buildRates([4.1219, 4.1219, 4.9999]);
            const testData = [rates[0], rates[2], rates[1]]; // out-of-order

            expect(countStableSessions(testData)).toBe(1);
        });

        test('should count multiple sessions', () => {
            const testData = buildRates([4.1219, 4.1219, 4.1512, 4.1512]);

            expect(countStableSessions(testData)).toBe(2);
        });
    });
});

describe('Percentage Analysis', () => {
    describe('getRisingPercentage', () => {
        test('should return undefined for empty rates', () => {
            const testData: SingleCurrencyRate[] = [];

            expect(getRisingPercentage(testData)).toBeUndefined();
        });

        test('should return undefined for single rate', () => {
            const testData = buildRates([4.1219]);

            expect(getRisingPercentage(testData)).toBeUndefined();
        });

        test('should return 100 for a single rising session', () => {
            const testData = buildRates([4.1219, 4.1512]);

            expect(getRisingPercentage(testData)).toBe(100);
        });

        test('should return 0 for no rising sessions', () => {
            const testData = buildRates([4.1219, 4.1219, 4.1012]);

            expect(getRisingPercentage(testData)).toBe(0);
        });

        test('should compute fractional rising percentage', () => {
            const testData = buildRates([4.1219, 4.1512, 4.1512, 4.1819]);

            expect(getRisingPercentage(testData)).toBeCloseTo((2 / 3) * 100, 4);
        });
    });

    describe('getFallingPercentage', () => {
        test('should return undefined for empty rates', () => {
            const testData: SingleCurrencyRate[] = [];

            expect(getFallingPercentage(testData)).toBeUndefined();
        });

        test('should return undefined for single rate', () => {
            const testData = buildRates([4.1219]);

            expect(getFallingPercentage(testData)).toBeUndefined();
        });

        test('should return 100 for a single falling session', () => {
            const testData = buildRates([4.1219, 4.1012]);

            expect(getFallingPercentage(testData)).toBe(100);
        });

        test('should return 0 for no falling sessions', () => {
            const testData = buildRates([4.1219, 4.1219, 4.1512]);

            expect(getFallingPercentage(testData)).toBe(0);
        });

        test('should compute fractional falling percentage', () => {
            const testData = buildRates([4.1219, 4.1112, 4.1112, 4.0819]);

            expect(getFallingPercentage(testData)).toBeCloseTo((2 / 3) * 100, 4);
        });
    });

    describe('getStablePercentage', () => {
        test('should return undefined for empty rates', () => {
            const testData: SingleCurrencyRate[] = [];

            expect(getStablePercentage(testData)).toBeUndefined();
        });

        test('should return undefined for single rate', () => {
            const testData = buildRates([4.1219]);

            expect(getStablePercentage(testData)).toBeUndefined();
        });

        test('should return 100 for a single stable session', () => {
            const testData = buildRates([4.1219, 4.1219]);

            expect(getStablePercentage(testData)).toBe(100);
        });

        test('should return 0 for no stable sessions', () => {
            const testData = buildRates([4.1219, 4.1512, 4.0012]);

            expect(getStablePercentage(testData)).toBe(0);
        });

        test('should compute fractional stable percentage', () => {
            const testData = buildRates([4.1219, 4.1219, 4.1512, 4.1512]);

            expect(getStablePercentage(testData)).toBeCloseTo((2 / 3) * 100, 4);
        });
    });
});
