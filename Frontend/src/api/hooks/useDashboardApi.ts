import { useQuery } from '@tanstack/react-query';
import apiClient from '../index';
import { useUser } from '../../context/UserContext';

// API Functions
export const fetchDashboardSummary = async (userId: string) => {
    const response = await apiClient.get(`/api/v1/dashboard/summary?user_id=${userId}`);
    return response.data;
};

export const fetchRecentTransactions = async (userId: string) => {
    const response = await apiClient.get(`/api/v1/dashboard/recent-transactions?user_id=${userId}`);
    return response.data;
};

export const fetchDashboardCharts = async (userId: string, period: string = '6months') => {
    const response = await apiClient.get(`/api/v1/dashboard/charts?user_id=${userId}&period=${period}`);
    return response.data;
};

// React Query Hooks
export const useDashboardSummary = () => {
    const { userId } = useUser();

    return useQuery({
        queryKey: ['dashboardSummary', userId],
        queryFn: () => fetchDashboardSummary(userId!),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useRecentTransactions = () => {
    const { userId } = useUser();

    return useQuery({
        queryKey: ['recentTransactions', userId],
        queryFn: () => fetchRecentTransactions(userId!),
        enabled: !!userId,
        staleTime: 60 * 1000, // 1 minute
    });
};

export const useDashboardCharts = (period: string = '6months') => {
    const { userId } = useUser();

    return useQuery({
        queryKey: ['dashboardCharts', userId, period],
        queryFn: () => fetchDashboardCharts(userId!, period),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
