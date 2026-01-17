import { useState } from 'react';
import { Banknote, TrendingUp, BarChart3 } from 'lucide-react';
import './App.css';
import { CurrencySelector } from './components/CurrencySelector';
import { SessionAnalysis } from './components/SessionAnalysis';
import { StatisticalMeasures } from './components/StatisticalMeasures';
import { Period } from './api/nbpApi';
import { DistributionAnalysis } from './components/DistributionAnalysis';

const DEFAULT_CURRENCY_CODE = 'USD';

function App() {
    const [selectedCurrency, setSelectedCurrency] = useState<string>(DEFAULT_CURRENCY_CODE);
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('MONTH');

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
                                    NBP Currency Analyzer
                                </h1>
                                <p className="text-sm text-gray-600">
                                    System for statistical analysis of disease states
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <div className="flex items-center text-sm text-gray-600">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                Data from NBP API
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <BarChart3 className="h-4 w-4 mr-1" />
                                Real-time analysis
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
                <StatisticalMeasures currencyCode={selectedCurrency} period={selectedPeriod} />

                {/* Distribution Analysis */}
                <DistributionAnalysis baseCurrency={selectedCurrency} />
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center text-sm text-gray-500">
                        <p>
                            © 2025 NBP Currency Analyzer. Data comes from the official API of the
                            National Bank of Poland.
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
