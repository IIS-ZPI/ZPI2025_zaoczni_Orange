// https://api.nbp.pl/api/exchangerates/rates/{table}/{code}/{startDate}/{endDate}/
// https://api.nbp.pl/api/exchangerates/tables/{table}/
//

import { config } from '../utils/config';

export type Currency = {
    tableType: 'A' | 'B';
    currency: string;
    code: string;
};

export type ApiCurrency = {
    currency: string;
    code: string;
};

export type ApiCurrencyTable = {
    rates: ApiCurrency[];
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

export const LABEL_BY_PERIOD: Record<Period, string> = {
    WEEK: 'last week',
    TWO_WEEKS: 'last 2 weeks',
    MONTH: 'last month',
    QUARTER: 'last quarter',
    HALF_YEAR: 'last half of year',
    YEAR: 'last year',
};

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
    const base = config.nbpApiUrl?.trim();
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
    const tableA: ApiCurrencyTable[] = await backendGetJson('/exchangerates/tables/A/');
    const tableB: ApiCurrencyTable[] = await backendGetJson('/exchangerates/tables/B/');

    const tableAWithType = tableA.map(table => ({ ...table, tableType: 'A' }));
    const tableBWithType = tableB.map(table => ({ ...table, tableType: 'B' }));
    const allTables = [...tableAWithType, ...tableBWithType];
    const currencyCodes = [
        ...new Set(allTables.flatMap(table => table.rates.map(rate => rate.code))),
    ];
    return currencyCodes;
}

export async function fetchCurrencies(): Promise<Currency[]> {
    const tableA: ApiCurrencyTable[] = await backendGetJson('/exchangerates/tables/A/');
    const tableB: ApiCurrencyTable[] = await backendGetJson('/exchangerates/tables/B/');

    return [
        ...tableA.flatMap(table =>
            table.rates.map(rate => ({
                currency: rate.currency,
                code: rate.code,
                tableType: 'A' as const,
            }))
        ),
        ...tableB.flatMap(table =>
            table.rates.map(rate => ({
                currency: rate.currency,
                code: rate.code,
                tableType: 'B' as const,
            }))
        ),
    ];
}

export async function fetchSingleCurrencyRateForPeriod(
    period: Period,
    currency: Currency
): Promise<SingleCurrencyRate[]> {
    console.log(currency);
    const today: Date = new Date();
    const numDays = DAYS_BY_PERIOD[period];
    const past = new Date();
    past.setDate(past.getDate() - numDays);
    const ratesTable: SingleCurrencyTable = await backendGetJson(
        `/exchangerates/rates/${currency.tableType}/${currency.code}/${past.toISOString().split('T')[0]}/${today.toISOString().split('T')[0]}`
    );

    return ratesTable.rates;
}
