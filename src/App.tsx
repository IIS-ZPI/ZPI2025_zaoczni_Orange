import { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
    calculateMedian,
    calculateMode,
    calculateStandardDeviation,
    calculateVariance,
} from './utils/statisticalMeasures';
import {
    fetchCodes,
    fetchCurrencies,
    fetchSingleCurrencyRateForPeriod,
    LABEL_BY_PERIOD,
    type Currency,
    type Period,
    type SingleCurrencyRate,
} from './api/nbpApi';
import {
    countFallingSessions,
    countRisingSessions,
    countStableSessions,
} from './utils/sessionAnalysisUtil';

const PERIODS = Object.keys(LABEL_BY_PERIOD) as Period[];
const DEFAULT_CURRENCY_CODE = 'USD';
const DEFAULT_PERIOD: Period = 'MONTH';

function App() {
    const [currencyRates, setCurrencyRates] = useState<SingleCurrencyRate[]>([]);
    const [codes, setCodes] = useState<string[]>([]);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | undefined>(undefined);
    const [selectedCode, setSelectedCode] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState<Period>(DEFAULT_PERIOD);

    useEffect(() => {
        fetchCodes().then(setCodes);
        fetchCurrencies().then(data => {
            setCurrencies(data);
            setSelectedCode(DEFAULT_CURRENCY_CODE);
        });
    }, []);

    useEffect(() => {
        const fetchNbpApi = async () => {
            const nextSelectedCurrencies = currencies.filter(
                currency => currency.code === selectedCode
            );
            if (nextSelectedCurrencies.length === 0) {
                setSelectedCurrency(undefined);
                return;
            }
            const nextSelectedCurrency = nextSelectedCurrencies[0];
            setSelectedCurrency(nextSelectedCurrency);

            const nextCurrencyRates = await fetchSingleCurrencyRateForPeriod(
                selectedPeriod,
                nextSelectedCurrency
            );
            setCurrencyRates(nextCurrencyRates);
        };

        fetchNbpApi();
    }, [selectedCode, selectedPeriod]);

    const formatNumber = (value: number) => {
        if (Number.isNaN(value)) {
            return '---';
        }
        return `${value.toFixed(4)}`;
    };

    const dailyStats = useMemo(
        () => [
            { label: 'Median', value: `${formatNumber(calculateMedian(currencyRates))} PLN` },
            { label: 'Mode', value: `${formatNumber(calculateMode(currencyRates))} PLN` },
            {
                label: 'Standard deviation',
                value: `${formatNumber(calculateStandardDeviation(currencyRates))} PLN`,
            },
            { label: 'Variance', value: `${formatNumber(calculateVariance(currencyRates))} PLN` },
        ],
        [currencyRates]
    );

    const risingFallingStats = useMemo(
        () => [
            { label: 'Rising', value: `${countRisingSessions(currencyRates)}` },
            { label: 'Stable', value: `${countStableSessions(currencyRates)}` },
            { label: 'Falling', value: `${countFallingSessions(currencyRates)}` },
        ],
        [currencyRates]
    );

    const tableRows = useMemo(
        () => [
            { date: '2025-01-02', bid: '4.2100', ask: '4.2600' },
            { date: '2025-01-03', bid: '4.2188', ask: '4.2682' },
            { date: '2025-01-06', bid: '4.2311', ask: '4.2805' },
            { date: '2025-01-07', bid: '4.2270', ask: '4.2760' },
        ],
        []
    );

    return (
        <div className="page">
            <header className="hero">
                <div>
                    <p className="eyebrow">NBP Currency Preview</p>
                    <h1>Currency analizer</h1>
                    <div className="chips">
                        <span className="chip">
                            Currency: {selectedCurrency ? selectedCurrency.code : '---'}
                        </span>
                        <span className="chip">Period: {LABEL_BY_PERIOD[selectedPeriod]}</span>
                        <a href="https://api.nbp.pl/" style={{ textDecoration: 'none' }}>
                            <span className="chip chip-outline">Source: NBP</span>
                        </a>
                    </div>
                </div>
            </header>

            <section className="panel">
                <div className="panel-header">
                    <h2>Session analysis parameters</h2>
                </div>
                <div id="align">
                    <div className="left-select">
                        <label>
                            <strong>Currency:</strong>
                        </label>
                        <br></br>
                        <select
                            value={selectedCode}
                            onChange={e => setSelectedCode(e.target.value)}
                            className="select"
                        >
                            <option value="">-- Choose currency --</option>
                            {codes.map(code => (
                                <option key={code} value={code}>
                                    {code}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="left-select">
                        <label>
                            <strong>Period:</strong>
                        </label>
                        <br></br>
                        <select
                            value={selectedPeriod}
                            onChange={e => setSelectedPeriod(e.target.value as Period)}
                            className="select"
                        >
                            {PERIODS.map(p => (
                                <option key={p} value={p}>
                                    {LABEL_BY_PERIOD[p]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div id="clear" />
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <h2>Session analysis - {selectedCurrency ? selectedCurrency.code : '---'}</h2>
                </div>
                <div className="cards">
                    {risingFallingStats.map(item => (
                        <div key={item.label} className="card">
                            <p className="card-label">{item.label}</p>
                            <p className="card-value">{item.value}</p>
                            {/* <p className="card-note">TODO: podpiąć API</p> */}
                        </div>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <h2>
                        Statistical measures - {selectedCurrency ? selectedCurrency.code : '---'}
                    </h2>
                </div>
                <div className="cards">
                    {dailyStats.map(item => (
                        <div key={item.label} className="card">
                            <p className="card-label">{item.label}</p>
                            <p className="card-value">{item.value}</p>
                            {/* <p className="card-note">TODO: podpiąć API</p> */}
                        </div>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <h2>Ostatnie notowania</h2>
                    <span className="muted">Przykładowa tabela — część kolumn do uzupełnienia</span>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Bid</th>
                                <th>Ask</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map(row => (
                                <tr key={row.date}>
                                    <td>{row.date}</td>
                                    <td>{row.bid}</td>
                                    <td>{row.ask}</td>
                                    <td className="todo">TODO</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default App;
