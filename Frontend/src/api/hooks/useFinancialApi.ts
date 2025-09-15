import { useMutation, useQueryClient } from '@tanstack/react-query';
import { financialApi } from '../financialApi';
import { useUser } from '../../context/UserContext';

export const useAddTransaction = () => {
    const queryClient = useQueryClient();
    const { userId } = useUser();

    return useMutation({
        mutationFn: (transaction: any) => financialApi.addTransaction(userId!, transaction),
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
            queryClient.invalidateQueries({ queryKey: ['charts', userId] });
        },
    });
};

export const useAddAsset = () => {
    const queryClient = useQueryClient();
    const { userId } = useUser();

    return useMutation({
        mutationFn: (asset: any) => financialApi.addAsset(userId!, asset),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
        },
    });
};

export const useAddInvestment = () => {
    const queryClient = useQueryClient();
    const { userId } = useUser();

    return useMutation({
        mutationFn: (investment: any) => financialApi.addInvestment(userId!, investment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
            queryClient.invalidateQueries({ queryKey: ['charts', userId] });
        },
    });
};

export const useAddLiability = () => {
    const queryClient = useQueryClient();
    const { userId } = useUser();

    return useMutation({
        mutationFn: (liability: any) => financialApi.addLiability(userId!, liability),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
        },
    });
};
