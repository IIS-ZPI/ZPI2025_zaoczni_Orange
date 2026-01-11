import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchCodes, LABEL_BY_PERIOD, Period } from '../api/nbpApi';

interface CurrencySelectorProps {
    selectedCurrency: string;
    onCurrencyChange: (currency: string) => void;
    selectedPeriod: Period;
    onPeriodChange: (period: Period) => void;
}

const PERIODS = Object.keys(LABEL_BY_PERIOD) as Period[];

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
    selectedCurrency,
    onCurrencyChange,
    selectedPeriod,
    onPeriodChange,
}) => {
    const [codes, setCodes] = useState<string[]>([]);

    useEffect(() => {
        fetchCodes().then(setCodes);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose analysis parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <div className="relative">
                        <select
                            value={selectedCurrency}
                            onChange={e => onCurrencyChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">-- Choose currency --</option>
                            {codes.map(code => (
                                <option key={code} value={code}>
                                    {code}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Analysis period
                    </label>
                    <div className="relative">
                        <select
                            value={selectedPeriod}
                            onChange={e => onPeriodChange(e.target.value as Period)}
                            className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            {PERIODS.map(p => (
                                <option key={p} value={p}>
                                    {LABEL_BY_PERIOD[p]}
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
