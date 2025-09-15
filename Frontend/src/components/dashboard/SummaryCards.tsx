import React from 'react';
import { useDashboardSummary } from '../../api/hooks/useDashboardApi';

const SummaryCards: React.FC = () => {
    const { data, isLoading, error } = useDashboardSummary();

    // Loading state
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="summary-card animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
                Error loading dashboard summary. Please try again.
            </div>
        );
    }

    // No data state
    if (!data) {
        return (
            <div className="mb-8 p-4 bg-yellow-100 text-yellow-700 rounded-md">
                No financial data available. Add some transactions to see your summary.
            </div>
        );
    }

    // Build cards with real data
    const cards = [
        {
            title: 'Total Assets',
            value: `$${data.total_assets.toLocaleString()}`,
            icon: 'trending_up',
            change: '+5%',
            changeType: 'positive' as const,
            period: 'vs last month'
        },
        {
            title: 'Total Liabilities',
            value: `$${data.total_liabilities.toLocaleString()}`,
            icon: 'trending_down',
            change: '-2%',
            changeType: 'negative' as const,
            period: 'vs last month'
        },
        {
            title: 'EPF Balance',
            value: `$${data.epf_balance.toLocaleString()}`,
            change: '+3%',
            changeType: 'positive' as const,
            period: 'this quarter'
        },
        {
            title: 'Credit Score',
            value: data.credit_score?.toString() || 'N/A',
            change: '+1%',
            changeType: 'positive' as const,
            period: 'since last check'
        },
        {
            title: 'Investment Portfolio',
            value: `$${data.investment_portfolio.toLocaleString()}`,
            icon: 'show_chart',
            change: '+4%',
            changeType: 'positive' as const,
            period: 'this month'
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="summary-card">
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-[var(--text-secondary)]">{card.title}</p>
                            {card.icon && (
                                <span className={`material-symbols-outlined ${
                                    card.icon === 'trending_up' ? 'text-green-500' :
                                        card.icon === 'trending_down' ? 'text-red-500' : 'text-green-500'
                                }`}>
                                    {card.icon}
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{card.value}</p>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm">
                            <span className={`font-semibold flex items-center ${
                                card.changeType === 'positive' ? 'text-[var(--success-color)]' : 'text-[var(--danger-color)]'
                            }`}>
                                <span className="material-symbols-outlined text-base mr-1">
                                    {card.changeType === 'positive' ? 'arrow_upward' : 'arrow_downward'}
                                </span>
                                {card.change}
                            </span>
                            <span className="text-gray-500 ml-1">{card.period}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
