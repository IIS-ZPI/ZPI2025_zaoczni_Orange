import React, { useEffect, useState } from 'react';
import { BarChart3, Calculator, TrendingUp, Activity } from 'lucide-react';
import {
    calculateMedian,
    calculateMode,
    calculateStandardDeviation,
    calculateVariance,
} from '../utils/statisticalMeasures';
import { fetchSingleCurrencyRateForPeriod, Period, SingleCurrencyRate } from '../api/nbpApi';
import { CSVLink } from 'react-csv';

interface StatisticalMeasuresProps {
    currencyCode: string;
    period: Period;
}

export const StatisticalMeasures: React.FC<StatisticalMeasuresProps> = ({
    currencyCode,
    period,
}) => {
    const [currencyRates, setCurrencyRates] = useState<SingleCurrencyRate[]>([]);

    useEffect(() => {
        fetchSingleCurrencyRateForPeriod(period, currencyCode).then(setCurrencyRates);
    }, [currencyCode, period]);

    const formatNumber = (value: number) => {
        if (Number.isNaN(value)) {
            return '---';
        }
        return `${value.toFixed(4)}`;
    };

    useEffect(() => {
        let isCancelled = false;

        const run = async () => {
            try {
                const data = await fetchSingleCurrencyRateForPeriod(period, currencyCode);
                if (isCancelled) return;
                setCurrencyRates(data);
            } catch {
                if (isCancelled) return;
                setCurrencyRates([]);
            }
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [currencyCode, period]);

    const measures = [
        {
            title: 'Median',
            value: formatNumber(calculateMedian(currencyRates)),
            unit: 'PLN',
            icon: BarChart3,
            description: 'Mid-point price',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'Mode',
            value: formatNumber(calculateMode(currencyRates)),
            unit: 'PLN',
            icon: Calculator,
            description: 'The most frequently occurring value',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            title: 'Standard Deviation',
            value: formatNumber(calculateStandardDeviation(currencyRates)),
            unit: '',
            icon: Activity,
            description: 'A measure of data dispersion',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            title: 'Variance',
            value: formatNumber(calculateVariance(currencyRates)),
            unit: '',
            icon: TrendingUp,
            description: 'Relative measure of volatility',
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Statistical measures - {currencyCode}
                </h3>
                <div className="flex justify-end">
                    {currencyRates && currencyRates.length > 0 && (
                        <CSVLink
                            className="CSV_Button"
                            data={[
                                {
                                    median: calculateMedian(currencyRates),
                                    mode: calculateMode(currencyRates),
                                    standardDeviation: calculateStandardDeviation(currencyRates),
                                    variance: calculateVariance(currencyRates),
                                },
                            ]}
                            filename={`${currencyCode}_${period}_stats.csv`}
                        >
                            {/* <Download /> */}
                            Export to CSV
                        </CSVLink>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {measures.map(measure => {
                    const Icon = measure.icon;
                    return (
                        <div
                            key={measure.title}
                            className={`${measure.bg} border border-gray-200 rounded-lg p-4 transition-transform hover:scale-105`}
                        >
                            <div className="flex items-center mb-3">
                                <Icon className={`h-6 w-6 ${measure.color} mr-2`} />
                                <h4 className="font-semibold text-gray-800">{measure.title}</h4>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">
                                {measure.value} {measure.unit}
                            </p>
                            <p className="text-sm text-gray-600">{measure.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
