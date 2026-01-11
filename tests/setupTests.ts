import '@testing-library/jest-dom';

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
