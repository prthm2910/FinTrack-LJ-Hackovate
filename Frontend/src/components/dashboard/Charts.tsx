import React, { useEffect, useRef } from 'react';
import { useDashboardCharts } from '../../api/hooks/useDashboardApi';

declare global {
    interface Window {
        Chart: any;
    }
}

const Charts: React.FC = () => {
    const { data: chartsData, isLoading, error } = useDashboardCharts('6months');
    const chartsRef = useRef<{ [key: string]: any }>({});

    useEffect(() => {
        // Load Chart.js
        if (!window.Chart) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                if (chartsData) {
                    initializeCharts();
                }
            };
            document.head.appendChild(script);
        } else if (chartsData) {
            initializeCharts();
        }

        return () => {
            // Cleanup existing charts
            Object.values(chartsRef.current).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });
            chartsRef.current = {};
        };
    }, [chartsData]);

    const initializeCharts = () => {
        if (!window.Chart || !chartsData) return;

        const { Chart } = window;

        // Cleanup existing charts
        Object.values(chartsRef.current).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        chartsRef.current = {};

        // Spending Chart
        const spendingCtx = document.getElementById('spendingChart') as HTMLCanvasElement;
        if (spendingCtx) {
            chartsRef.current.spending = new Chart(spendingCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: chartsData.spending_chart.labels,
                    datasets: [{
                        label: 'Spending',
                        data: chartsData.spending_chart.data,
                        backgroundColor: 'rgba(19, 164, 236, 0.2)',
                        borderColor: 'rgba(19, 164, 236, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value: any) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context: any) {
                                    return context.dataset.label + ': $' + context.raw.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }

        // Savings Chart
        const savingsCtx = document.getElementById('savingsChart') as HTMLCanvasElement;
        if (savingsCtx) {
            chartsRef.current.savings = new Chart(savingsCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: chartsData.savings_chart.labels,
                    datasets: [{
                        label: 'Savings',
                        data: chartsData.savings_chart.data,
                        fill: false,
                        borderColor: 'rgb(7, 136, 54)',
                        backgroundColor: 'rgba(7, 136, 54, 0.1)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            ticks: {
                                callback: function(value: any) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context: any) {
                                    return context.dataset.label + ': $' + context.raw.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }

        // Investment Chart
        const investmentCtx = document.getElementById('investmentChart') as HTMLCanvasElement;
        if (investmentCtx) {
            chartsRef.current.investment = new Chart(investmentCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: chartsData.investment_chart.labels,
                    datasets: [{
                        label: 'Portfolio Value',
                        data: chartsData.investment_chart.data,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            ticks: {
                                callback: function(value: any) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context: any) {
                                    return context.dataset.label + ': $' + context.raw.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }

        // Allocation Pie Chart
        const allocationCtx = document.getElementById('allocationPieChart') as HTMLCanvasElement;
        if (allocationCtx) {
            chartsRef.current.allocation = new Chart(allocationCtx.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: chartsData.allocation_chart.labels,
                    datasets: [{
                        label: 'Allocation',
                        data: chartsData.allocation_chart.data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)',
                            'rgba(255, 159, 64, 0.7)'
                        ],
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context: any) {
                                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                    const percentage = ((context.raw / total) * 100).toFixed(1);
                                    return context.label + ': $' + context.raw.toLocaleString() + ' (' + percentage + '%)';
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="summary-card animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-64 bg-gray-100 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="summary-card col-span-full text-center py-12">
                    <p className="text-red-600">Error loading charts. Please try again later.</p>
                </div>
            </div>
        );
    }

    // No data state
    if (!chartsData) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="summary-card col-span-full text-center py-12">
                    <p className="text-gray-500">No chart data available. Add some financial data to see insights.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="summary-card col-span-1">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Spending Trends</h3>
                <canvas id="spendingChart"></canvas>
            </div>
            <div className="summary-card col-span-1">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Savings Forecast</h3>
                <canvas id="savingsChart"></canvas>
            </div>
            <div className="summary-card col-span-1 lg:col-span-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Investment Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <canvas id="investmentChart"></canvas>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h4 className="font-semibold text-gray-700 mb-2">Portfolio Allocation</h4>
                        <canvas className="max-h-64" id="allocationPieChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;
