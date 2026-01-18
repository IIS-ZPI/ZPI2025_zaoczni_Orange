import '@testing-library/jest-dom';

// Mock fetch for test environment
global.fetch = jest.fn((url: string) => {
    // Mock data for different API endpoints
    if (url.includes('/exchangerates/tables/A/')) {
        return Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve([
                    {
                        rates: [
                            { currency: 'US dollar', code: 'USD' },
                            { currency: 'Euro', code: 'EUR' },
                            { currency: 'British pound', code: 'GBP' },
                        ],
                    },
                ]),
            status: 200,
            statusText: 'OK',
        });
    } else if (url.includes('/exchangerates/rates/A/')) {
        return Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    rates: [
                        { no: '001/A/NBP/2024', effectiveDate: '2024-01-01', mid: 4.0234 },
                        { no: '002/A/NBP/2024', effectiveDate: '2024-01-02', mid: 4.0456 },
                        { no: '003/A/NBP/2024', effectiveDate: '2024-01-03', mid: 4.0123 },
                    ],
                }),
            status: 200,
            statusText: 'OK',
        });
    }

    // Default response
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        status: 200,
        statusText: 'OK',
    });
}) as jest.Mock;

// Mock import.meta for Jest
Object.defineProperty(globalThis, 'import', {
    value: {
        meta: {
            env: {
                VITE_BACKEND_URL: process.env.VITE_BACKEND_URL || 'http://localhost:3000',
                VITE_NBP_API_BASE_URL:
                    process.env.VITE_NBP_API_BASE_URL || 'https://api.nbp.pl/api',
            },
        },
    },
    writable: false,
    configurable: true,
});

// Suppress React 18 act warnings in tests
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: unknown[]) => {
        if (typeof args[0] === 'string' && args[0].includes('act(...)')) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});
