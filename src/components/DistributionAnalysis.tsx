import React, { useEffect, useState } from 'react';
import { BarChart2, Table2 } from 'lucide-react';
import {
    fetchCodes,
    fetchSingleCurrencyRateForCustomPeriod,
    Period,
    SingleCurrencyRate,
} from '../api/nbpApi';
import { calculateChangeDistribution, ChangeDistributionItem } from '../utils/changeDistribution';
import { CSVLink } from 'react-csv';
import AlertMessage from './AlertMessage';

interface DistributionAnalysisProps {
    baseCurrency: string;
}

type DistributionItem = {
    range: string;
    count: number;
};

export const DistributionAnalysis: React.FC<DistributionAnalysisProps> = () => {
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [selectedCurrency1, setSelectedCurrency1] = useState<string>('');
    const [selectedCurrency2, setSelectedCurrency2] = useState<string>('');
    const [analysisPeriod, setAnalysisType] = useState<Period>('MONTH');
    const [beginDate, setBeginDate] = useState<string>();
    const [viewType, setViewType] = useState<'chart' | 'table'>('chart');
    const [currencyRate1, setCurrencyRate1] = useState<SingleCurrencyRate[]>([]);
    const [currencyRate2, setCurrencyRate2] = useState<SingleCurrencyRate[]>([]);
    const [changeDistribution, setChangeDistribution] = useState<ChangeDistributionItem[]>([]);

    useEffect(() => {
        const loadCurrencies = async () => {
            const codes = await fetchCodes();
            setCurrencies([...codes, 'PLN'].sort());
        };
        loadCurrencies();
    }, []);

    const currencyOptions = currencies.map(code => (
        <option key={code} value={code}>
            {code}
        </option>
    ));
    const currencyOptions2 = currencies.map(code => (
        <option key={code} value={code} disabled={code === selectedCurrency1}>
            {code}
        </option>
    ));

    const mapChangeDistributionToData = (data: ChangeDistributionItem[]): DistributionItem[] => {
        return data.map(({ min, max, count }) => ({
            range: `${min.toFixed(4)} to ${max.toFixed(4)}`,
            count,
        }));
    };

    const [distributionData, setDistributionData] = useState<DistributionItem[]>([]);

    useEffect(() => {
        let isCancelled = false;

        const run = async () => {
            //YYYY-MM-DD
            if (!beginDate) {
                setCurrencyRate1([]);
                return;
            }

            try {
                const data = await fetchSingleCurrencyRateForCustomPeriod(
                    new Date(beginDate),
                    analysisPeriod,
                    selectedCurrency1
                );

                if (isCancelled) {
                    return;
                }

                setCurrencyRate1(data);
            } catch {
                if (isCancelled) {
                    return;
                }

                setCurrencyRate1([]);
            }
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [selectedCurrency1, analysisPeriod, beginDate]);

    useEffect(() => {
        let isCancelled = false;

        const run = async () => {
            //YYYY-MM-DD
            if (!beginDate) {
                setCurrencyRate2([]);
                return;
            }

            try {
                const data = await fetchSingleCurrencyRateForCustomPeriod(
                    new Date(beginDate),
                    analysisPeriod,
                    selectedCurrency2
                );

                if (isCancelled) {
                    return;
                }

                setCurrencyRate2(data);
            } catch {
                if (isCancelled) {
                    return;
                }
                console.log('Failed to fetch currency 2 rates');
                setCurrencyRate2([]);
            }
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [selectedCurrency2, analysisPeriod, beginDate]);

    useEffect(() => {
        let isCancelled = false;

        const run = async () => {
            console.log('Calculating distribution');
            console.log('Currency 1 rates:', currencyRate1);
            console.log('Currency 2 rates:', currencyRate2);
            const distribution = calculateChangeDistribution(currencyRate1, currencyRate2, 14);

            if (isCancelled) {
                return;
            }

            setChangeDistribution(distribution);
            setDistributionData(mapChangeDistributionToData(distribution));
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [currencyRate1, currencyRate2]);

    const maxCount = Math.max(...distributionData.map(d => d.count));

    const pairLabel =
        selectedCurrency1 && selectedCurrency2
            ? ` - ${selectedCurrency1}/${selectedCurrency2}`
            : '';

    const allCriteriaSelected =
        !!selectedCurrency1 && !!selectedCurrency2 && !!beginDate && !!analysisPeriod;

    const noDataToShow = changeDistribution.length === 0;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {analysisPeriod === 'MONTH' ? 'Monthly' : 'Quarterly'} change distribution
            </h3>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                        </label>
                        <select
                            value={selectedCurrency1}
                            onChange={e => setSelectedCurrency1(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select currency</option>
                            {currencyOptions}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                        </label>
                        <select
                            value={selectedCurrency2}
                            onChange={e => setSelectedCurrency2(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select currency</option>
                            {currencyOptions2}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Begin date
                        </label>
                        <input
                            value={beginDate ?? ''}
                            onChange={e => setBeginDate(e.target.value || undefined)}
                            type="date"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Analysis type
                        </label>
                        <select
                            value={analysisPeriod}
                            onChange={e => setAnalysisType(e.target.value as Period)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="MONTH">Monthly</option>
                            <option value="QUARTER">Quarterly</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
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
                            Chart
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
                            Table
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart View */}
            {viewType === 'chart' && (
                <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                        Frequency Histogram of Changes{pairLabel}
                    </h4>

                    {!allCriteriaSelected && (
                        <p className="text-sm text-gray-600 mb-6">
                            Specify filters to display the chart
                        </p>
                    )}

                    {noDataToShow && <AlertMessage message="No data" />}

                    {!!allCriteriaSelected && !noDataToShow && (
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
                    )}
                </div>
            )}

            {/* Table View */}
            {viewType === 'table' && (
                <div className="overflow-x-auto">
                    {!allCriteriaSelected && (
                        <p className="text-sm text-gray-600 mb-6">
                            Specify filters to display the data
                        </p>
                    )}

                    {noDataToShow && <AlertMessage message="No data" />}

                    {!!allCriteriaSelected && !noDataToShow && (
                        <table className="w-full border-collapse border border-gray-200 rounded-lg">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                                        Interval
                                    </th>
                                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-800">
                                        Count of changes
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
                    )}
                </div>
            )}

            {/* Download CSV link */}
            {!noDataToShow && (
                <div>
                    <CSVLink
                        data={changeDistribution}
                        filename={`${selectedCurrency1}_${selectedCurrency2}_${beginDate}_${analysisPeriod}.csv`}
                        onClick={(event: any) => {
                            if (
                                !selectedCurrency1 ||
                                !selectedCurrency2 ||
                                !beginDate ||
                                !analysisPeriod
                            ) {
                                event.preventDefault();
                                console.log('Disabled');
                            }
                        }}
                    >
                        Export to CSV
                    </CSVLink>
                </div>
            )}
        </div>
    );
};
