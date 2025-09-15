// src/api/hooks/useTransactionsApi.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../index';
import { useUser } from '../../context/UserContext';

interface FilterState {
    search: string;
    category: string;
    dateFrom: string;
    dateTo: string;
    amountMin: string;
    amountMax: string;
    type: 'all' | 'income' | 'expense';
}

export const fetchAllTransactions = async (
    userId: string,
    page: number,
    limit: number,
    filters: FilterState
) => {
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

export const useAllTransactions = (
    page: number,
    limit: number,
    filters: FilterState
) => {
    const { userId } = useUser();

    return useQuery({
        queryKey: ['allTransactions', userId, page, filters],
        queryFn: () => fetchAllTransactions(userId!, page, limit, filters),
        enabled: !!userId,
        placeholderData: (previousData) => previousData,
        staleTime: 2 * 60 * 1000,
    });
};
