import { useMemo } from 'react';
import './App.css';

function App() {
    const dailyStats = useMemo(
        () => [
            { label: 'Średnia 7d', value: '4.2150 PLN' },
            { label: 'Średnia 30d', value: '4.3120 PLN' },
            { label: 'Max 30d', value: '4.4012 PLN' },
            { label: 'Min 30d', value: '4.1987 PLN' },
        ],
        []
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
                    <h1>Analizator Walut — etap 2</h1>
                    <p className="subtext">
                        Podstawowy podgląd wyglądu z danymi przykładowymi. Kilka elementów wciąż do
                        dopracowania (TODO).
                    </p>
                    <div className="chips">
                        <span className="chip">Waluta: USD</span>
                        <span className="chip">Okres: 1M</span>
                        <span className="chip chip-outline">Źródło: dummy</span>
                    </div>
                </div>
            </header>

            <section className="panel">
                <div className="panel-header">
                    <h2>Podstawowe wskaźniki</h2>
                    <span className="muted">Bez obsługi błędów — dane makietowe</span>
                </div>
                <div className="cards">
                    {dailyStats.map(item => (
                        <div key={item.label} className="card">
                            <p className="card-label">{item.label}</p>
                            <p className="card-value">{item.value}</p>
                            <p className="card-note">TODO: podpiąć API</p>
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
