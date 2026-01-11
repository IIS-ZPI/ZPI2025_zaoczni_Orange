import { useState, useMemo } from 'react';
import { Banknote, TrendingUp, BarChart3 } from 'lucide-react';
import './App.css';
import { CurrencySelector } from './components/CurrencySelector';
import { SessionAnalysis } from './components/SessionAnalysis';
import { StatisticalMeasures } from './components/StatisticalMeasures';
import { DistributionAnalysis } from './components/DistributionAnalysis';

function App() {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [selectedPeriod, setSelectedPeriod] = useState('1m');

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
    console.log(dailyStats, tableRows);
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Banknote className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Analizator Walut NBP
                                </h1>
                                <p className="text-sm text-gray-600">
                                    System analizy statystycznej kursów walutowych
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <div className="flex items-center text-sm text-gray-600">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                Dane z API NBP
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <BarChart3 className="h-4 w-4 mr-1" />
                                Analizy w czasie rzeczywistym
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Currency and Period Selection */}
                <CurrencySelector
                    selectedCurrency={selectedCurrency}
                    onCurrencyChange={setSelectedCurrency}
                    selectedPeriod={selectedPeriod}
                    onPeriodChange={setSelectedPeriod}
                />

                {/* Session Analysis */}
                <SessionAnalysis currency={selectedCurrency} period={selectedPeriod} />

                {/* Statistical Measures */}
                <StatisticalMeasures currency={selectedCurrency} period={selectedPeriod} />

                {/* Distribution Analysis */}
                <DistributionAnalysis baseCurrency={selectedCurrency} />
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center text-sm text-gray-500">
                        <p>
                            © 2025 Analizator Walut NBP. Dane pochodzą z oficjalnego API Narodowego
                            Banku Polskiego.
                        </p>
                        <p className="mt-1">
                            <a
                                href="http://api.nbp.pl/"
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                api.nbp.pl
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
