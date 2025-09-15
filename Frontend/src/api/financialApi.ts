import apiClient from './index';
import type { Transaction, Asset, Investment, Liability } from './types';

export const financialApi = {
    // Transaction operations
    addTransaction: async (userId: string, transaction: Transaction) => {
        const response = await apiClient.post(`/api/v1/transactions?user_id=${userId}`, transaction);
        return response.data;
    },

    // Asset operations
    addAsset: async (userId: string, asset: Asset) => {
        const response = await apiClient.post(`/api/v1/assets?user_id=${userId}`, asset);
        return response.data;
    },

    // Investment operations
    addInvestment: async (userId: string, investment: Investment) => {
        const response = await apiClient.post(`/api/v1/investments?user_id=${userId}`, investment);
        return response.data;
    },

    // Liability operations
    addLiability: async (userId: string, liability: Liability) => {
        const response = await apiClient.post(`/api/v1/liabilities?user_id=${userId}`, liability);
        return response.data;
    },
};
