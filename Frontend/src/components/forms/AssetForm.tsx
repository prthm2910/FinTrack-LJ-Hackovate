import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../context/UserContext';
import apiClient from '../../api';
import type { AssetFormData } from '../../types/forms';

interface AssetFormProps {
    onClose: () => void;
    isOpen: boolean;
}

const AssetForm: React.FC<AssetFormProps> = ({ onClose, isOpen }) => {
    const { userId } = useUser();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<AssetFormData>({
        name: '',
        type: '',
        value: 0
    });

    const assetTypes = [
        'bank_account', 'property', 'vehicle', 'jewelry', 'investment',
        'bank_deposit', 'cash', 'electronics', 'other'
    ];

    // API mutation for creating asset
    const mutation = useMutation({
        mutationFn: async (data: AssetFormData) => {
            if (!userId) throw new Error('User not logged in');
            return await apiClient.post('/api/v1/assets', {
                ...data,
                user_id: userId
            });
        },
        onSuccess: () => {
            // Refresh dashboard data using correct syntax
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['allAssets'] });

            // Close modal and reset form
            onClose();
            setFormData({ name: '', type: '', value: 0 });
        },
        onError: (error) => {
            console.error('Error adding asset:', error);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'value' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) return;

        // Submit to API
        mutation.mutate(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Add Asset</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Savings Account - HDFC"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        >
                            <option value="">Select type</option>
                            {assetTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value (₹)</label>
                        <input
                            type="number"
                            name="value"
                            value={formData.value || ''}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={mutation.isPending}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending || !userId}
                            className="flex-1 px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Adding...' : 'Add Asset'}
                        </button>
                    </div>
                </form>

                {/* Success Message (optional) */}
                {mutation.isSuccess && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-sm">
                        ✅ Asset added successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetForm;