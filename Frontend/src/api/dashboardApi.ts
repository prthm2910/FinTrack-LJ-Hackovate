import apiClient from './index';
import type { DashboardSummary, ChartData } from './types';

export const dashboardApi = {
    // Get complete dashboard overview
    getDashboardOverview: async (userId: string) => {
        const response = await apiClient.get(`/api/v1/dashboard?user_id=${userId}`);
        return response.data;
    },

    // Get dashboard summary
    getDashboardSummary: async (userId: string): Promise<DashboardSummary> => {
        const response = await apiClient.get(`/api/v1/dashboard/summary?user_id=${userId}`);
        return response.data;
    },

    // Get charts data
    getChartsData: async (userId: string, period: string = '6months'): Promise<ChartData> => {
        const response = await apiClient.get(`/api/v1/dashboard/charts?user_id=${userId}&period=${period}`);
        return response.data;
    },

    // Get category breakdown
    getCategoryBreakdown: async (userId: string, period: string = '3months') => {
        const response = await apiClient.get(`/api/v1/dashboard/charts/category-breakdown?user_id=${userId}&period=${period}`);
        return response.data;
    },

    // Get income vs expense data
    getIncomeVsExpense: async (userId: string, period: string = '6months') => {
        const response = await apiClient.get(`/api/v1/dashboard/charts/income-vs-expense?user_id=${userId}&period=${period}`);
        return response.data;
    },

    // Get recent transactions
    getRecentTransactions: async (userId: string) => {
        const response = await apiClient.get(`/api/v1/dashboard/recent-transactions?user_id=${userId}`);
        return response.data;
    },
};
