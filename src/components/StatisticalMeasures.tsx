import React, { useEffect, useState } from 'react';
import { BarChart3, Calculator, TrendingUp, Activity } from 'lucide-react';
import { backendGetJson, isBackendConnectivityError } from '../services/backendApi';

interface StatisticalMeasuresProps {
    currency: string;
    period: string;
}

type StatisticalData = {
    median: string;
    mode: string;
    standardDeviation: string;
    coefficientOfVariation: string;
};

export const StatisticalMeasures: React.FC<StatisticalMeasuresProps> = ({ currency, period }) => {
    const getMockStatisticalData = (p: string): StatisticalData => {
        const base = {
            median: 4.2345 + Math.random() * 0.5,
            mode: 4.1876 + Math.random() * 0.3,
            standardDeviation: 0.0456 + Math.random() * 0.02,
            coefficientOfVariation: 1.087 + Math.random() * 0.3,
        };

        const multiplier =
            {
                '1w': 1.0,
                '2w': 1.1,
                '1m': 1.2,
                '3m': 1.4,
                '6m': 1.7,
                '1y': 2.1,
            }[p] || 1.0;

        return {
            median: (base.median * multiplier).toFixed(4),
            mode: (base.mode * multiplier).toFixed(4),
            standardDeviation: (base.standardDeviation * multiplier).toFixed(4),
            coefficientOfVariation: (base.coefficientOfVariation * multiplier).toFixed(3),
        };
    };

    const [stats, setStats] = useState<StatisticalData>(() => getMockStatisticalData(period));
    const [isMockData, setIsMockData] = useState<boolean>(false);

    useEffect(() => {
        let isCancelled = false;

        const run = async () => {
            try {
                const query = new URLSearchParams({ currency, period });
                const data = await backendGetJson<StatisticalData>(
                    `/api/statistical-measures?${query.toString()}`
                );
                if (isCancelled) return;
                setStats(data);
                setIsMockData(false);
            } catch (error) {
                if (isCancelled) return;
                setStats(getMockStatisticalData(period));
                setIsMockData(isBackendConnectivityError(error));
            }
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [currency, period]);

    const measures = [
        {
            title: 'Mediana',
            value: stats.median,
            unit: 'PLN',
            icon: BarChart3,
            description: 'Wartość środkowa kursu',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'Dominanta',
            value: stats.mode,
            unit: 'PLN',
            icon: Calculator,
            description: 'Najczęściej występująca wartość',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            title: 'Odchylenie standardowe',
            value: stats.standardDeviation,
            unit: '',
            icon: Activity,
            description: 'Miara rozproszenia danych',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            title: 'Współczynnik zmienności',
            value: stats.coefficientOfVariation,
            unit: '%',
            icon: TrendingUp,
            description: 'Względna miara zmienności',
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Miary statystyczne - {currency}
            </h3>
            {isMockData && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Dane makietowe (brak połączenia z backendem).
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
