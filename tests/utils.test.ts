import {
    countRisingSessions,
    countFallingSessions,
    countStableSessions,
} from '../src/utils/sessionAnalysisUtil';

// describe('Currencies API', () => {
//     describe('Currency codes from table A', () => {
//         const codes = fetchCodes();

//         test('should contain EUR', () => {
//             expect(codes).toContain('EUR');
//         });

//         test('should contain CAD', () => {
//             expect(codes).toContain('CAD');
//         });

//         test('should contain USD', () => {
//             expect(codes).toContain('USD');
//         });
//     });

//     describe('Currency codes from table B', () => {
//         const codes = fetchCodes();

//         test('should contain VES', () => {
//             expect(codes).toContain('VES');
//         });

//         test('should contain IQD', () => {
//             expect(codes).toContain('IQD');
//         });

//         test('should contain NGN', () => {
//             expect(codes).toContain('NGN');
//         });
//     });
// });

describe('Session Analysis', () => {
    describe('count rising sessions', () => {
        test('should count rising', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1512,
                },
            ];

            expect(countRisingSessions(testData)).toBe(1);
        });

        test('should not count stable', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1219,
                },
            ];

            expect(countRisingSessions(testData)).toBe(0);
        });

        test('should not count falling', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1012,
                },
            ];

            expect(countRisingSessions(testData)).toBe(0);
        });

        test('should reorder by dates', () => {
            const testData = [
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1512,
                },
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
            ];

            expect(countRisingSessions(testData)).toBe(1);
        });

        test('should count multiple sessions', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1512,
                },
                {
                    no: '003/A/NBP/2025',
                    effectiveDate: '2025-01-04',
                    mid: 4.1512,
                },
                {
                    no: '004/A/NBP/2025',
                    effectiveDate: '2025-01-05',
                    mid: 4.1819,
                },
            ];

            expect(countRisingSessions(testData)).toBe(2);
        });
    });

    describe('count falling sessions', () => {
        test('should not count rising', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1512,
                },
            ];

            expect(countFallingSessions(testData)).toBe(0);
        });

        test('should not count stable', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1219,
                },
            ];

            expect(countFallingSessions(testData)).toBe(0);
        });

        test('should count falling', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1012,
                },
            ];

            expect(countFallingSessions(testData)).toBe(1);
        });

        test('should sort by dates', () => {
            const testData = [
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1012,
                },
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
            ];

            expect(countFallingSessions(testData)).toBe(1);
        });

        test('should count multiple sessions', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1112,
                },
                {
                    no: '003/A/NBP/2025',
                    effectiveDate: '2025-01-04',
                    mid: 4.1112,
                },
                {
                    no: '004/A/NBP/2025',
                    effectiveDate: '2025-01-05',
                    mid: 4.0819,
                },
            ];

            expect(countFallingSessions(testData)).toBe(2);
        });
    });

    describe('count stable sessions', () => {
        test('should not count rising', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1512,
                },
            ];

            expect(countStableSessions(testData)).toBe(0);
        });

        test('should count stable', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1219,
                },
            ];

            expect(countStableSessions(testData)).toBe(1);
        });

        test('should not count falling', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1012,
                },
            ];

            expect(countStableSessions(testData)).toBe(0);
        });

        test('should sort by dates', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-04',
                    mid: 4.9999,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1219,
                },
            ];

            expect(countStableSessions(testData)).toBe(1);
        });

        test('should count multiple sessions', () => {
            const testData = [
                {
                    no: '001/A/NBP/2025',
                    effectiveDate: '2025-01-02',
                    mid: 4.1219,
                },
                {
                    no: '002/A/NBP/2025',
                    effectiveDate: '2025-01-03',
                    mid: 4.1219,
                },
                {
                    no: '003/A/NBP/2025',
                    effectiveDate: '2025-01-04',
                    mid: 4.1512,
                },
                {
                    no: '004/A/NBP/2025',
                    effectiveDate: '2025-01-05',
                    mid: 4.1512,
                },
            ];

            expect(countStableSessions(testData)).toBe(2);
        });
    });
});
