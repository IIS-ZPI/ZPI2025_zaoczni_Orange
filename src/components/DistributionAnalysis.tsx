import React, { useEffect, useState } from 'react';
import { BarChart2, Table2 } from 'lucide-react';
import { backendGetJson } from '../services/backendApi';

interface DistributionAnalysisProps {
    baseCurrency: string;
}

type DistributionItem = {
    range: string;
    count: number;
};

export const DistributionAnalysis: React.FC<DistributionAnalysisProps> = ({ baseCurrency }) => {
    const [selectedPair, setSelectedPair] = useState('EUR/USD');
    const [analysisType, setAnalysisType] = useState('monthly');
    const [viewType, setViewType] = useState<'chart' | 'table'>('chart');

    const currencyPairs = ['EUR/USD', 'USD/PLN', 'EUR/PLN', 'GBP/USD', 'USD/JPY', 'CHF/PLN'];

    const getMockDistributionData = (): DistributionItem[] => {
        return [
            { range: '-0.0136 do -0.0116', count: 0 },
            { range: '-0.0116 do -0.0097', count: 0 },
            { range: '-0.0097 do -0.0077', count: 1 },
            { range: '-0.0077 do -0.0058', count: 4 },
            { range: '-0.0058 do -0.0039', count: 10 },
            { range: '-0.0039 do -0.0019', count: 7 },
            { range: '-0.0019 do 0', count: 11 },
            { range: '0 do 0.0019', count: 9 },
            { range: '0.0019 do 0.0039', count: 11 },
            { range: '0.0039 do 0.0058', count: 8 },
            { range: '0.0058 do 0.0077', count: 5 },
            { range: '0.0077 do 0.0097', count: 1 },
            { range: '0.0097 do 0.0116', count: 3 },
            { range: '0.0116 do 0.0136', count: 1 },
        ];
    };

    const [distributionData, setDistributionData] = useState<DistributionItem[]>(() =>
        getMockDistributionData()
    );

    useEffect(() => {
        let isCancelled = false;

        const run = async () => {
            const query = new URLSearchParams({
                baseCurrency,
                pair: selectedPair,
                type: analysisType,
            });
            const data = await backendGetJson<DistributionItem[]>(
                `/api/distribution?${query.toString()}`
            );
            if (isCancelled) return;
            setDistributionData(data);
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [analysisType, baseCurrency, selectedPair]);

    const maxCount = Math.max(...distributionData.map(d => d.count));

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Rozkład zmian {analysisType === 'monthly' ? 'miesięcznych' : 'kwartalnych'}
            </h3>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Para walutowa
                    </label>
                    <select
                        value={selectedPair}
                        onChange={e => setSelectedPair(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {currencyPairs.map(pair => (
                            <option key={pair} value={pair}>
                                {pair}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Typ analizy
                    </label>
                    <select
                        value={analysisType}
                        onChange={e => setAnalysisType(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="monthly">Miesięczne</option>
                        <option value="quarterly">Kwartalne</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Widok</label>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewType('chart')}
                            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md transition-all ${
                                viewType === 'chart'
                                    ? 'bg-white shadow-sm text-blue-600'
                                    : 'text-gray-600'
                            }`}
                        >
                            <BarChart2 className="h-4 w-4 mr-1" />
                            Wykres
                        </button>
                        <button
                            onClick={() => setViewType('table')}
                            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md transition-all ${
                                viewType === 'table'
                                    ? 'bg-white shadow-sm text-blue-600'
                                    : 'text-gray-600'
                            }`}
                        >
                            <Table2 className="h-4 w-4 mr-1" />
                            Tabela
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart View */}
            {viewType === 'chart' && (
                <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                        Histogram częstości występowania zmian - {selectedPair}
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                            {distributionData.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-32 text-xs text-gray-600 font-mono">
                                        {item.range}
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <div className="flex items-center">
                                            <div
                                                className="bg-blue-500 h-6 rounded transition-all"
                                                style={{
                                                    width: `${(item.count / maxCount) * 100}%`,
                                                    minWidth: item.count > 0 ? '20px' : '0px',
                                                }}
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                {item.count}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Table View */}
            {viewType === 'table' && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                                    Przedział
                                </th>
                                <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-800">
                                    Liczba zmian
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {distributionData.map((item, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                    <td className="border border-gray-200 px-4 py-3 text-sm font-mono text-gray-700">
                                        {item.range}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">
                                        {item.count}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
