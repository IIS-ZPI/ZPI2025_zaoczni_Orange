import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CurrencySelectorProps {
    selectedCurrency: string;
    onCurrencyChange: (currency: string) => void;
    selectedPeriod: string;
    onPeriodChange: (period: string) => void;
}

const currencies = [
    { code: 'USD', name: 'Dolar amerykański' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Funt brytyjski' },
    { code: 'CHF', name: 'Frank szwajcarski' },
    { code: 'JPY', name: 'Jen japoński' },
    { code: 'CZK', name: 'Korona czeska' },
];

const periods = [
    { value: '1w', label: '1 tydzień' },
    { value: '2w', label: '2 tygodnie' },
    { value: '1m', label: '1 miesiąc' },
    { value: '3m', label: '1 kwartał' },
    { value: '6m', label: 'Pół roku' },
    { value: '1y', label: '1 rok' },
];

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
    selectedCurrency,
    onCurrencyChange,
    selectedPeriod,
    onPeriodChange,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Wybierz parametry analizy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waluta</label>
                    <div className="relative">
                        <select
                            value={selectedCurrency}
                            onChange={e => onCurrencyChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            {currencies.map(currency => (
                                <option key={currency.code} value={currency.code}>
                                    {currency.code} - {currency.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Okres analizy
                    </label>
                    <div className="relative">
                        <select
                            value={selectedPeriod}
                            onChange={e => onPeriodChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            {periods.map(period => (
                                <option key={period.value} value={period.value}>
                                    {period.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};
