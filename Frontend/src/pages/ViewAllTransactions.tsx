import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api';

interface Transaction {
    id: string;
    date: string;
    name: string;
    description: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
}

interface TransactionsResponse {
    transactions: Transaction[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

interface FilterState {
    search: string;
    category: string;
    dateFrom: string;
    dateTo: string;
    amountMin: string;
    amountMax: string;
    type: 'all' | 'income' | 'expense';
}

const ITEMS_PER_PAGE = 10;

const fetchAllTransactions = async (
    userId: string,
    page: number,
    limit: number,
    filters: FilterState
): Promise<TransactionsResponse> => {
    const response = await apiClient.get(`/api/v1/transactions/all`, {
        params: {
            user_id: userId,
            page,
            limit,
            search: filters.search || undefined,
            category: filters.category || undefined,
            date_from: filters.dateFrom || undefined,
            date_to: filters.dateTo || undefined,
            amount_min: filters.amountMin || undefined,
            amount_max: filters.amountMax || undefined,
            type: filters.type !== 'all' ? filters.type : undefined,
        },
    });
    return response.data;
};

const ViewAllTransactions: React.FC = () => {
    const { userId } = useUser();
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: '',
        dateFrom: '',
        dateTo: '',
        amountMin: '',
        amountMax: '',
        type: 'all',
    });

    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    // Debounce filters to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
            setCurrentPage(1); // Reset to first page when filters change
        }, 500);

        return () => clearTimeout(timer);
    }, [filters]);

    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching
    } = useQuery<TransactionsResponse, Error>({
        queryKey: ['allTransactions', userId, currentPage, debouncedFilters],
        queryFn: () => fetchAllTransactions(userId!, currentPage, ITEMS_PER_PAGE, debouncedFilters),
        enabled: !!userId,
        placeholderData: (previousData) => previousData,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    const transactions = data?.transactions || [];
    const totalPages = data?.totalPages || 1;
    const totalCount = data?.totalCount || 0;

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            dateFrom: '',
            dateTo: '',
            amountMin: '',
            amountMax: '',
            type: 'all',
        });
    };

    const getCategoryStyle = (category: string): string => {
        const categoryStyles: { [key: string]: string } = {
            'Groceries': 'bg-purple-100 text-purple-800',
            'Income': 'bg-green-100 text-green-800',
            'Housing': 'bg-blue-100 text-blue-800',
            'Dining': 'bg-yellow-100 text-yellow-800',
            'Shopping': 'bg-indigo-100 text-indigo-800',
            'Transportation': 'bg-pink-100 text-pink-800',
            'Entertainment': 'bg-orange-100 text-orange-800',
            'Healthcare': 'bg-red-100 text-red-800',
            'Utilities': 'bg-gray-100 text-gray-800',
            'Investment': 'bg-emerald-100 text-emerald-800',
            'Other': 'bg-slate-100 text-slate-800'
        };
        return categoryStyles[category] || 'bg-slate-100 text-slate-800';
    };

    const formatAmount = (amount: number): string => {
        const formatted = Math.abs(amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        return amount >= 0 ? `+${formatted}` : `-${formatted}`;
    };

    const getAmountStyle = (amount: number): string => {
        return amount >= 0 ? 'text-green-600' : 'text-red-600';
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
            return dateString;
        }
    };

    // Generate page numbers for pagination
    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }, [currentPage, totalPages]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-slate-600">Loading transactions...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-red-600">Error loading transactions: {error.message}</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-slate-50"
            style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
        >
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-10 py-4 bg-white">
                    <Link to="/app/dashboard">
                        <div className="flex items-center gap-3 text-slate-900">
                            <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                                <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                            <h2 className="text-xl font-bold tracking-tight">Financio</h2>
                        </div>
                    </Link>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 justify-center px-6 py-8 sm:px-10 lg:px-16">
                    <div className="w-full max-w-7xl">
                        {/* Page Header & Controls */}
                        <div className="mb-8">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900">All Transactions</h1>
                                    <p className="text-sm text-slate-600 mt-1">
                                        {totalCount > 0 ? (
                                            <>Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} transactions</>
                                        ) : (
                                            'No transactions found'
                                        )}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filters {showFilters ? '▲' : '▼'}
                                </button>
                            </div>

                            {/* Search & Filter Controls */}
                            <div className={`transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Search */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
                                            <input
                                                type="text"
                                                placeholder="Search transactions..."
                                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={filters.search}
                                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                            />
                                        </div>

                                        {/* Category Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                            <select
                                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={filters.category}
                                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                            >
                                                <option value="">All Categories</option>
                                                <option value="Groceries">Groceries</option>
                                                <option value="Shopping">Shopping</option>
                                                <option value="Dining">Dining</option>
                                                <option value="Transportation">Transportation</option>
                                                <option value="Entertainment">Entertainment</option>
                                                <option value="Healthcare">Healthcare</option>
                                                <option value="Housing">Housing</option>
                                                <option value="Utilities">Utilities</option>
                                                <option value="Income">Income</option>
                                                <option value="Investment">Investment</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        {/* Type Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                            <select
                                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={filters.type}
                                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                            >
                                                <option value="all">All Types</option>
                                                <option value="income">Income</option>
                                                <option value="expense">Expense</option>
                                            </select>
                                        </div>

                                        {/* Date Range */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Date From</label>
                                            <input
                                                type="date"
                                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={filters.dateFrom}
                                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Date To</label>
                                            <input
                                                type="date"
                                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={filters.dateTo}
                                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                            />
                                        </div>

                                        {/* Amount Range */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Min Amount</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={filters.amountMin}
                                                onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Max Amount</label>
                                            <input
                                                type="number"
                                                placeholder="1000.00"
                                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={filters.amountMax}
                                                onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Loading Indicator */}
                        {isFetching && (
                            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-center">
                                Loading transactions...
                            </div>
                        )}

                        {/* Transactions Table */}
                        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                            <table className="w-full table-auto">
                                <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-600">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12">
                                            <div className="text-slate-400">
                                                <p className="text-lg font-medium">No transactions found</p>
                                                <p className="text-sm">Try adjusting your filters or add some transactions to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((transaction: Transaction) => (
                                        <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {formatDate(transaction.date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-slate-900">{transaction.name}</div>
                                                    {transaction.description && (
                                                        <div className="text-xs text-slate-500 mt-1">{transaction.description}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getCategoryStyle(transaction.category)}`}>
                                                        {transaction.category}
                                                    </span>
                                            </td>
                                            <td className={`whitespace-nowrap px-6 py-4 text-right font-semibold ${getAmountStyle(transaction.amount)}`}>
                                                {formatAmount(transaction.amount)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-slate-600">
                                    Page {currentPage} of {totalPages} ({totalCount} total transactions)
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        First
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    {pageNumbers.map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                page === currentPage
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Last
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ViewAllTransactions;
