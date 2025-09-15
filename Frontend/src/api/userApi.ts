import apiClient from './index';
import type { User } from './types';

export const userApi = {
    // Get current user profile
    getCurrentUser: async (userId: string): Promise<User> => {
        const response = await apiClient.get(`/api/v1/users/me?user_id=${userId}`);
        return response.data;
    },

    // Create new user
    createUser: async (userData: { user_id: string; name: string }): Promise<{ message: string; status: string }> => {
        const response = await apiClient.post('/api/v1/users/create', userData);
        return response.data;
    },

    // Update user profile
    updateProfile: async (userId: string, profileData: { credit_score?: number; epf_balance?: number }) => {
        const response = await apiClient.post(`/api/v1/users/update-profile?user_id=${userId}`, profileData);
        return response.data;
    },

    // Update AI permissions
    updatePermissions: async (userId: string, permissions: Record<string, boolean>) => {
        const response = await apiClient.post(`/api/v1/users/update-permissions?user_id=${userId}`, permissions);
        return response.data;
    },

    // Get profile summary
    getProfileSummary: async (userId: string) => {
        const response = await apiClient.get(`/api/v1/users/profile-summary?user_id=${userId}`);
        return response.data;
    },

    // Delete user account
    deleteAccount: async (userId: string) => {
        const response = await apiClient.delete(`/api/v1/users/delete-account?user_id=${userId}`);
        return response.data;
    },

    // Get user statistics
    getUserStats: async (userId: string) => {
        const response = await apiClient.get(`/api/v1/users/stats?user_id=${userId}`);
        return response.data;
    },
};
