// https://api.nbp.pl/api/exchangerates/rates/{table}/{code}/{startDate}/{endDate}/
// https://api.nbp.pl/api/exchangerates/tables/{table}/
//

import { config } from '../utils/config';
import { setUsingMockData } from '../services/mockDataStatus';

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
            setUsingMockData(true);
            throw new Error(`HTTP_${response.status}`);
        }

        return (await response.json()) as T;
    } catch (error: any) {
        if (isConnectivityError(error)) {
            setUsingMockData(true);
        }
        throw error;
    } finally {
        window.clearTimeout(timeoutId);
    }
}

function isConnectivityError(error: unknown): boolean {
    if (!error) return true;
    if (typeof error === 'string') return true;
    if (error instanceof DOMException && error.name === 'AbortError') return true;

    const message = error instanceof Error ? error.message : String(error);
    return (
        message === 'BACKEND_URL_NOT_CONFIGURED' ||
        message.toLowerCase().includes('failed to fetch')
    );
}

export async function fetchCodes(): Promise<string[]> {
    const tableA: ApiCurrencyTable[] = await backendGetJson('/exchangerates/tables/A/');

    setUsingMockData(false);
    const tableAWithType = tableA.map(table => ({ ...table, tableType: 'A' }));
    const currencyCodes = [
        ...new Set(tableAWithType.flatMap(table => table.rates.map(rate => rate.code))),
    ].sort();
    return currencyCodes;
}

export async function fetchCurrencies(): Promise<string[]> {
    const tableA: ApiCurrencyTable[] = await backendGetJson('/exchangerates/tables/A/');
    return tableA.flatMap(table => table.rates.map(rate => rate.currency));
}

export async function fetchLatestCurrencyRateBeforeDate(
    referenceDate: Date,
    currency: string
): Promise<SingleCurrencyRate | undefined> {
    if (currency === 'PLN') {
        // Fake PLN rates - this is reference currency.
        const precedingDate = new Date(referenceDate);
        precedingDate.setDate(precedingDate.getDate() - 1);

        return {
            no: '',
            effectiveDate: precedingDate.toISOString().split('T')[0],
            mid: 1.0,
        };
    }

    const dateSince = new Date(referenceDate);
    dateSince.setDate(dateSince.getDate() - 7);
    const dateUntil = new Date(referenceDate);
    dateUntil.setDate(dateUntil.getDate() - 1);

    const ratesTable: SingleCurrencyTable = await backendGetJson(
        `/exchangerates/rates/A/${currency}/${dateSince.toISOString().split('T')[0]}/${dateUntil.toISOString().split('T')[0]}`
    );

    if (ratesTable.rates.length === 0) {
        return undefined;
    }

    const precedingRate = ratesTable.rates.reduce(
        (latest, rate) => (rate.effectiveDate > latest.effectiveDate ? rate : latest),
        ratesTable.rates[0]
    );

    setUsingMockData(false);
    return precedingRate;
}

export async function fetchLatestCurrencyRateBeforePeriod(
    periodEndDate: Date,
    period: Period,
    currency: string
): Promise<SingleCurrencyRate | undefined> {
    const periodDays = DAYS_BY_PERIOD[period];
    const periodStartDate = new Date(periodEndDate);
    periodStartDate.setDate(periodEndDate.getDate() - periodDays);

    return fetchLatestCurrencyRateBeforeDate(periodStartDate, currency);
}

export async function fetchSingleCurrencyRateForDateRange(
    beginDate: Date,
    endDate: Date,
    currency: string
): Promise<SingleCurrencyRate[]> {
    if (currency === 'PLN') {
        // Fake PLN rates - this is reference currency.
        const rates: SingleCurrencyRate[] = [];
        const currentDate = new Date(beginDate);
        while (currentDate <= endDate) {
            rates.push({
                no: '',
                effectiveDate: currentDate.toISOString().split('T')[0],
                mid: 1.0,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return rates;
    }

    const ratesTable: SingleCurrencyTable = await backendGetJson(
        `/exchangerates/rates/A/${currency}/${beginDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}`
    );

    setUsingMockData(false);
    return ratesTable.rates;
}

export async function fetchSingleCurrencyRateForCustomPeriod(
    beginDate: Date,
    period: Period,
    currency: string
): Promise<SingleCurrencyRate[]> {
    const numDays = DAYS_BY_PERIOD[period];
    const endDate = new Date(beginDate);
    endDate.setDate(beginDate.getDate() + numDays);

    return fetchSingleCurrencyRateForDateRange(beginDate, endDate, currency);
}

export async function fetchSingleCurrencyRateForPeriod(
    period: Period,
    currency: string
): Promise<SingleCurrencyRate[]> {
    const today: Date = new Date();
    const numDays = DAYS_BY_PERIOD[period];
    const past = new Date();
    past.setDate(past.getDate() - numDays);

    return fetchSingleCurrencyRateForDateRange(past, today, currency);
}
