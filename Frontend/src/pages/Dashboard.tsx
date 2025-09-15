import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Header from '../components/layout/Header';
import SummaryCards from '../components/dashboard/SummaryCards';
import Charts from '../components/dashboard/Charts';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import Chatbot from '../components/dashboard/Chatbot';
import FormManager from "../components/dashboard/FormManager";

const Dashboard: React.FC = () => {
    const { user, isAuthenticated, loading } = useUser();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Please sign in to view your dashboard.</p>
                    <Link to="/login" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex h-screen flex-col bg-gray-50 text-gray-900"
            style={{ fontFamily: 'Manrope, sans-serif' }}
        >
            <Header />
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
                        <p className="text-gray-500 mt-1">
                            Welcome back, {user?.displayName || user?.email}! Here's your comprehensive financial overview.
                        </p>
                    </div>

                    <FormManager />

                    {/* Dynamic Summary Cards */}
                    <SummaryCards />

                    {/* FinAI Studio Section */}
                    <div className="mb-8">
                        <Link to="/app/ai-studio">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-white/20 rounded-full p-4">
                                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5C14.8 3.4 14.4 3.4 14.2 3.5L9 7V9C9 9.6 9.4 10 10 10S11 9.6 11 9V8.5L12 8L13 8.5V9C13 9.6 13.4 10 14 10S15 9.6 15 9ZM12 15L8 12V19C8 19.6 8.4 20 9 20H15C15.6 20 16 19.6 16 19V12L12 15Z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">FinAI Studio</h2>
                                            <p className="text-white/90 text-lg">Get personalized financial advice powered by AI</p>
                                            <p className="text-white/70 text-sm mt-1">Ask about investments, budgeting, loans, travel finance & more</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">24/7</div>
                                            <div className="text-sm text-white/70">Available</div>
                                        </div>
                                        <div className="bg-white/20 rounded-full p-3">
                                            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">AI-Powered Insights</h2>
                        <p className="text-gray-500">Actionable insights from your financial data.</p>
                    </div>

                    {/* Dynamic Charts */}
                    <Charts />

                    {/* Dynamic Transactions Table */}
                    <TransactionsTable />
                </div>
            </main>
            <Chatbot />
        </div>
    );
};

export default Dashboard;
