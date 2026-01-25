import React, { useEffect, useState } from 'react';
import { BarChart2, Table2 } from 'lucide-react';
import {
    fetchCodes,
    fetchSingleCurrencyRateForCustomPeriod,
    Period,
    SingleCurrencyRate,
} from '../api/nbpApi';
import {
    calculateChangeDistribution,
    ChangeDistributionItem,
    getMaxPeriodBeginDate,
} from '../utils/changeDistribution';
import { CSVLink } from 'react-csv';
import AlertMessage from './AlertMessage';
import { config } from '../utils/config';
import { LoadingOverlay } from './LoadingOverlay';

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
    const [currency1Loading, setCurrency1Loading] = useState<boolean>(false);
    const [currency2Loading, setCurrency2Loading] = useState<boolean>(false);
    const [calculationLoading, setCalculationLoading] = useState<boolean>(false);

    const maxAllowedBeginDate = analysisPeriod
        ? getMaxPeriodBeginDate(analysisPeriod).toISOString().split('T')[0]
        : undefined;
    const minAllowedBeginDate = config.nbpMinAllowedDate;

    console.log(minAllowedBeginDate);

    const beginDateTooLate =
        !!beginDate && !!maxAllowedBeginDate && beginDate > maxAllowedBeginDate;
    const beginDateTooEarly =
        !!beginDate && !!minAllowedBeginDate && beginDate < minAllowedBeginDate;

    const allCriteriaSelected =
        !!selectedCurrency1 && !!selectedCurrency2 && !!beginDate && !!analysisPeriod;
    const validRequestParams = allCriteriaSelected && !beginDateTooLate && !beginDateTooEarly;

    const loading = currency1Loading || currency2Loading || calculationLoading;

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
            if (!validRequestParams) {
                setCurrencyRate1([]);
                return;
            }

            try {
                setCurrency1Loading(true);
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
            } finally {
                setCurrency1Loading(false);
            }
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [selectedCurrency1, analysisPeriod, beginDate, validRequestParams]);

    useEffect(() => {
        let isCancelled = false;

        const run = async () => {
            if (!validRequestParams) {
                setCurrencyRate2([]);
                return;
            }

            try {
                setCurrency2Loading(true);
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
                setCurrencyRate2([]);
            } finally {
                setCurrency2Loading(false);
            }
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [selectedCurrency2, analysisPeriod, beginDate, validRequestParams]);

    useEffect(() => {
        let isCancelled = false;

        const run = async () => {
            if (!validRequestParams) {
                setChangeDistribution([]);
                setDistributionData([]);
                return;
            }

            setCalculationLoading(true);
            const distribution = calculateChangeDistribution(currencyRate1, currencyRate2, 14);

            if (isCancelled) {
                return;
            }

            setChangeDistribution(distribution);
            setDistributionData(mapChangeDistributionToData(distribution));

            setCalculationLoading(false);
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [currencyRate1, currencyRate2, validRequestParams]);

    const maxCount = Math.max(...distributionData.map(d => d.count));

    const pairLabel =
        selectedCurrency1 && selectedCurrency2
            ? ` - ${selectedCurrency1}/${selectedCurrency2}`
            : '';

    const noDataToShow = changeDistribution.length === 0;

    const errorSection = (
        <>
            {beginDateTooLate && (
                <AlertMessage
                    message={`Selected period includes future - last allowed begin date is ${new Date(maxAllowedBeginDate!).toLocaleDateString()}`}
                />
            )}

            {beginDateTooEarly && (
                <AlertMessage
                    message={`Selected period exceeds archived data - earliest allowed begin date is ${new Date(minAllowedBeginDate!).toLocaleDateString()}`}
                />
            )}

            {validRequestParams && noDataToShow && <AlertMessage message="No data" />}
        </>
    );

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
                            min={minAllowedBeginDate}
                            max={maxAllowedBeginDate}
                            onChange={e => setBeginDate(e.target.value)}
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
                <div className="relative mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                        Frequency Histogram of Changes{pairLabel}
                    </h4>

                    {loading && <LoadingOverlay />}

                    {!allCriteriaSelected && (
                        <p className="text-sm text-gray-600 mb-6">
                            Specify filters to display the chart
                        </p>
                    )}

                    {errorSection}

                    {validRequestParams && !noDataToShow && (
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

                    {loading && <LoadingOverlay />}

                    {errorSection}

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
