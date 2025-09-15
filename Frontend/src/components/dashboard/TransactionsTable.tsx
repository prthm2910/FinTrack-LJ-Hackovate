import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api';

interface Transaction {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    type?: string;
}

const fetchRecentTransactions = async (userId: string): Promise<Transaction[]> => {
    const response = await apiClient.get(`/api/v1/dashboard/recent-transactions`, {
        params: { user_id: userId }
    });
    return response.data;
};

const TransactionsTable: React.FC = () => {
    const { userId } = useUser();

    // Fix: Explicitly type the useQuery with Transaction[] and provide default empty array
    const {
        data: transactions = [],
        isLoading,
        error
    } = useQuery<Transaction[], Error>({
        queryKey: ['recent-transactions', userId],
        queryFn: () => fetchRecentTransactions(userId!),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="mt-12">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Recent Transactions</h2>
                <div className="bg-white border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
                    <div className="animate-pulse p-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 mb-4">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-4 bg-gray-200 rounded w-40"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="mt-12">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Recent Transactions</h2>
                <div className="bg-white border border-[var(--border-color)] rounded-xl shadow-sm p-8 text-center">
                    <p className="text-red-600">Error loading transactions. Please try again.</p>
                </div>
            </div>
        );
    }

    // No transactions state
    if (!transactions || transactions.length === 0) {
        return (
            <div className="mt-12">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Recent Transactions</h2>
                <div className="bg-white border border-[var(--border-color)] rounded-xl shadow-sm p-8 text-center">
                    <p className="text-gray-500">No transactions found. Start by adding some financial data.</p>
                </div>
            </div>
        );
    }

    // Helper functions with proper typing
    const getCategoryStyle = (category: string): string => {
        const categoryStyles: Record<string, string> = {
            'Groceries': 'text-purple-800 bg-purple-100',
            'Income': 'text-green-800 bg-green-100',
            'Housing': 'text-blue-800 bg-blue-100',
            'Dining': 'text-yellow-800 bg-yellow-100',
            'Shopping': 'text-indigo-800 bg-indigo-100',
            'Transport': 'text-pink-800 bg-pink-100',
            'Utilities': 'text-gray-800 bg-gray-100',
            'Healthcare': 'text-pink-800 bg-pink-100',
            'Entertainment': 'text-orange-800 bg-orange-100',
            'Investment': 'text-green-800 bg-green-100',
            'Salary': 'text-green-800 bg-green-100',
            'Food': 'text-yellow-800 bg-yellow-100',
            'Other': 'text-gray-800 bg-gray-100'
        };
        return categoryStyles[category] || 'text-gray-800 bg-gray-100';
    };

    const getAmountStyle = (amount: number): string => {
        return amount >= 0 ? 'text-green-600' : 'text-red-600';
    };

    const formatAmount = (amount: number): string => {
        const formatted = Math.abs(amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        return amount >= 0 ? `+${formatted}` : `-${formatted}`;
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString; // Fallback to original string
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Recent Transactions</h2>
            <div className="bg-white border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3" scope="col">Date</th>
                            <th className="px-6 py-3" scope="col">Description</th>
                            <th className="px-6 py-3" scope="col">Category</th>
                            <th className="px-6 py-3 text-right" scope="col">Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Fix: Explicitly type the transaction parameter */}
                        {transactions.map((transaction: Transaction, index: number) => (
                            <tr
                                key={`transaction-${transaction.id || index}-${transaction.date}`}
                                className={`bg-white ${index < transactions.length - 1 ? 'border-b' : ''} hover:bg-gray-50`}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {formatDate(transaction.date)}
                                </td>
                                <td className="px-6 py-4">
                                    {transaction.description || 'No description'}
                                </td>
                                <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryStyle(transaction.category)}`}>
                      {transaction.category}
                    </span>
                                </td>
                                <td className={`px-6 py-4 text-right font-medium ${getAmountStyle(transaction.amount)}`}>
                                    {formatAmount(transaction.amount)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <Link
                        className="text-sm font-medium text-[var(--primary-color)] hover:text-[var(--primary-hover-color)]"
                        to="/app/transactions"
                    >
                        View all transactions →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TransactionsTable;
