import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
    countFallingSessions,
    countRisingSessions,
    countStableSessions,
    countTotalSessions,
    getFallingPercentage,
    getRisingPercentage,
    getStablePercentage,
} from '../utils/sessionAnalysisUtil';
import {
    fetchLatestCurrencyRateBeforePeriod,
    fetchSingleCurrencyRateForPeriod,
    LABEL_BY_PERIOD,
    Period,
    SingleCurrencyRate,
} from '../api/nbpApi';
import { CSVLink } from 'react-csv';

interface SessionAnalysisProps {
    currency: string;
    period: Period;
}

export const SessionAnalysis: React.FC<SessionAnalysisProps> = ({ currency, period }) => {
    const [sessionData, setSessionData] = useState<SingleCurrencyRate[]>();

    useEffect(() => {
        let isCancelled = false;

        const run = async () => {
            try {
                const rates = await fetchSingleCurrencyRateForPeriod(period, currency);
                const precedingRate = await fetchLatestCurrencyRateBeforePeriod(
                    new Date(),
                    period,
                    currency
                );
                setSessionData(precedingRate ? [precedingRate, ...rates] : rates);
            } catch {
                if (isCancelled) return;
            }
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [currency, period]);

    const cards = [
        {
            title: 'Rising sessions',
            value: sessionData ? countRisingSessions(sessionData) : '---',
            percentage: !sessionData
                ? '---'
                : (getRisingPercentage(sessionData)?.toFixed(1) ?? '---'),
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            title: 'Falling sessions',
            value: sessionData ? countFallingSessions(sessionData) : '---',
            percentage: !sessionData
                ? '---'
                : (getFallingPercentage(sessionData)?.toFixed(1) ?? '---'),
            icon: TrendingDown,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            title: 'Stable sessions',
            value: sessionData ? countStableSessions(sessionData) : '---',
            percentage: !sessionData
                ? '---'
                : (getStablePercentage(sessionData)?.toFixed(1) ?? '---'),
            icon: Minus,
            color: 'text-gray-600',
            bg: 'bg-gray-50',
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Session analysis - {currency}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                Period: {LABEL_BY_PERIOD[period]} • Total number of sessions:{' '}
                {sessionData ? countTotalSessions(sessionData) : '---'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {cards.map(card => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className={`${card.bg} border border-gray-200 rounded-lg p-4 transition-transform hover:scale-105`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {card.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {card.value}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{card.percentage}%</p>
                                </div>
                                <Icon className={`h-8 w-8 ${card.color}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                {sessionData && sessionData.length > 0 && (
                    <CSVLink
                        data={[
                            {
                                rising: countRisingSessions(sessionData),
                                falling: countFallingSessions(sessionData),
                                stable: countStableSessions(sessionData),
                            },
                        ]}
                        filename={`${currency}_${period}_trends.csv`}
                    >
                        Export to CSV
                    </CSVLink>
                )}
            </div>
        </div>
    );
};
