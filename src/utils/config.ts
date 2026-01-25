// Helper function to get environment variables that works in both Vite and Jest
export function getEnvVar(name: string, fallback?: string): string | undefined {
    // Check if we're in a Node.js/Jest environment
    if (typeof process !== 'undefined' && process.env) {
        return process.env[name] || fallback;
    }

    // Check if we're in a Vite environment
    if (typeof window !== 'undefined' && (window as any).import?.meta?.env) {
        return (window as any).import.meta.env[name] || fallback;
    }

    // Try to use import.meta if available (Vite)
    try {
        return (globalThis as any).import?.meta?.env?.[name] || fallback;
    } catch {
        return fallback;
    }
}

// Environment configuration
export const config = {
    backendUrl: getEnvVar('VITE_BACKEND_URL', 'http://localhost:3000'),
    nbpApiUrl: getEnvVar('VITE_NBP_API_BASE_URL', 'https://api.nbp.pl/api'),
    nbpMinAllowedDate: getEnvVar('VITE_NBP_MIN_ALLOWED_DATE', '2002-01-02'),
} as const;
