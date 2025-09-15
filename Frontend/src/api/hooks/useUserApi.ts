import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../userApi';
import {useUser as useUserContext} from '../../context/UserContext';

export const useCurrentUser = () => {
    const { userId } = useUserContext();

    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => userApi.getCurrentUser(userId!),
        enabled: !!userId,
    });
};

export const useCreateUser = () => {
    return useMutation({
        mutationFn: (userData: { user_id: string; name: string }) =>
            userApi.createUser(userData),
        onSuccess: (data) => {
            console.log('User created in database:', data);
        },
        onError: (error: any) => {
            // User might already exist - that's OK
            if (error.response?.status !== 409) {
                console.error('Error creating user:', error);
            }
        },
    });
};

export const useUserProfile = () => {
    const { userId } = useUserContext();

    return useQuery({
        queryKey: ['userProfile', userId],
        queryFn: () => userApi.getCurrentUser(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { userId } = useUserContext();

    return useMutation({
        mutationFn: (profileData: any) => userApi.updateProfile(userId!, profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
        },
    });
};

export const useUpdatePermissions = () => {
    const queryClient = useQueryClient();
    const { userId } = useUserContext();

    return useMutation({
        mutationFn: (permissions: Record<string, boolean>) =>
            userApi.updatePermissions(userId!, permissions),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
        },
    });
};
