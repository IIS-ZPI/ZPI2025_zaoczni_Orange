import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { backendGetJson, isBackendConnectivityError } from '../services/backendApi';

interface SessionAnalysisProps {
    currency: string;
    period: string;
}

type SessionData = {
    total: number;
    growth: number;
    decline: number;
    noChange: number;
};

export const SessionAnalysis: React.FC<SessionAnalysisProps> = ({ currency, period }) => {
    const getMockSessionData = (p: string): SessionData => {
        const baseData: Record<string, SessionData> = {
            '1w': { total: 5, growth: 2, decline: 2, noChange: 1 },
            '2w': { total: 10, growth: 4, decline: 5, noChange: 1 },
            '1m': { total: 22, growth: 9, decline: 11, noChange: 2 },
            '3m': { total: 66, growth: 28, decline: 32, noChange: 6 },
            '6m': { total: 132, growth: 58, decline: 68, noChange: 6 },
            '1y': { total: 264, growth: 118, decline: 132, noChange: 14 },
        };

        return baseData[p] ?? baseData['1m'];
    };

    const [sessionData, setSessionData] = useState<SessionData>(() => getMockSessionData(period));
    const [isMockData, setIsMockData] = useState<boolean>(false);

    useEffect(() => {
        let isCancelled = false;

        const run = async () => {
            try {
                const query = new URLSearchParams({ currency, period });
                const data = await backendGetJson<SessionData>(
                    `/api/session-analysis?${query.toString()}`
                );
                if (isCancelled) return;
                setSessionData(data);
                setIsMockData(false);
            } catch (error) {
                if (isCancelled) return;
                setSessionData(getMockSessionData(period));
                setIsMockData(isBackendConnectivityError(error));
            }
        };

        run();
        return () => {
            isCancelled = true;
        };
    }, [currency, period]);

    const periodLabel = useMemo(() => {
        return period === '1w'
            ? '1 tydzień'
            : period === '2w'
              ? '2 tygodnie'
              : period === '1m'
                ? '1 miesiąc'
                : period === '3m'
                  ? '1 kwartał'
                  : period === '6m'
                    ? 'pół roku'
                    : '1 rok';
    }, [period]);

    const cards = [
        {
            title: 'Sesje wzrostowe',
            value: sessionData.growth,
            percentage: ((sessionData.growth / sessionData.total) * 100).toFixed(1),
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            title: 'Sesje spadkowe',
            value: sessionData.decline,
            percentage: ((sessionData.decline / sessionData.total) * 100).toFixed(1),
            icon: TrendingDown,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            title: 'Bez zmian',
            value: sessionData.noChange,
            percentage: ((sessionData.noChange / sessionData.total) * 100).toFixed(1),
            icon: Minus,
            color: 'text-gray-600',
            bg: 'bg-gray-50',
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Analiza sesji - {currency}</h3>
            {isMockData && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Dane makietowe (brak połączenia z backendem).
                </div>
            )}
            <p className="text-sm text-gray-600 mb-6">
                Okres: {periodLabel}• Łączna liczba sesji: {sessionData.total}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
    );
};
