// https://api.nbp.pl/api/exchangerates/rates/{table}/{code}/{startDate}/{endDate}/
// https://api.nbp.pl/api/exchangerates/tables/{table}/
//

const VITE_NBP_API_BASE_URL = 'https://api.nbp.pl/api';

type Currency = {
    tableType: 'A' | 'B';
    currency: string;
    code: string;
};

export type CurrencyTable = {
    rates: Currency[];
};

export type BackendApiOptions = {
    timeoutMs?: number;
};

export type SingleCurrencyTable = {
    rates: SingleCurrencyRate[];
};

export type SingleCurrencyRate = {
    no: string;
    effectiveDate: string;
    mid: number;
};

export type Period = 'WEEK' | 'TWO_WEEKS' | 'MONTH' | 'QUARTER' | 'HALF_YEAR' | 'YEAR';

const DAYS_BY_PERIOD: Record<Period, number> = {
    WEEK: 7,
    TWO_WEEKS: 14,
    MONTH: 31,
    QUARTER: 92,
    HALF_YEAR: 182,
    YEAR: 365,
};

const DEFAULT_TIMEOUT_MS = 4000;

function buildUrl(path: string): string {
    const base = VITE_NBP_API_BASE_URL?.trim();
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

export async function fetchCodes(): Promise<string[]> {
    const tableA: CurrencyTable[] = await backendGetJson('/exchangerates/tables/A/');
    const tableB: CurrencyTable[] = await backendGetJson('/exchangerates/tables/B/');

    const tableAWithType = tableA.map(table => ({ ...table, tableType: 'A' }));
    const tableBWithType = tableB.map(table => ({ ...table, tableType: 'B' }));
    const allTables = [...tableAWithType, ...tableBWithType];
    const currencyCodes = [
        ...new Set(allTables.flatMap(table => table.rates.map(rate => rate.code))),
    ];
    return currencyCodes;
}

export async function fetchSingleCurrencyRateForPeriod(
    period: Period,
    currency: Currency
): Promise<SingleCurrencyRate[]> {
    const today: Date = new Date();
    const numDays = DAYS_BY_PERIOD[period];
    const past = new Date();
    past.setDate(past.getDate() - numDays);
    const ratesTable: SingleCurrencyTable = await backendGetJson(
        `/exchangerates/rates/${currency.tableType}/${currency.code}/${past.toLocaleDateString('yyyy-MM-dd')}/${today.toLocaleDateString('yyyy-MM-dd')}`
    );

    return ratesTable.rates;
}
