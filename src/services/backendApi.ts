import { config } from '../utils/config';

export type BackendApiOptions = {
    timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 4000;

function buildUrl(path: string): string {
    const base = config.backendUrl?.trim();
    if (!base) {
        throw new Error('BACKEND_URL_NOT_CONFIGURED');
    }

    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
}

export async function backendGetJson<T>(path: string, options: BackendApiOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
        const url = buildUrl(path);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP_${response.status}`);
        }

        return (await response.json()) as T;
    } finally {
        window.clearTimeout(timeoutId);
    }
}

export function isBackendConnectivityError(error: unknown): boolean {
    if (!error) return true;
    if (typeof error === 'string') return true;
    if (error instanceof DOMException && error.name === 'AbortError') return true;

    const message = error instanceof Error ? error.message : String(error);
    return (
        message === 'BACKEND_URL_NOT_CONFIGURED' ||
        message.startsWith('HTTP_') ||
        message.toLowerCase().includes('failed to fetch')
    );
}
