import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../context/UserContext';
import apiClient from '../../api';
import type { LiabilityFormData } from '../../types/forms';

interface LiabilityFormProps {
    onClose: () => void;
    isOpen: boolean;
}

const LiabilityForm: React.FC<LiabilityFormProps> = ({ onClose, isOpen }) => {
    const { userId } = useUser();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<LiabilityFormData>({
        name: '',
        type: '',
        outstanding_balance: 0
    });

    const liabilityTypes = [
        'student_loan', 'credit_card', 'personal_loan', 'mortgage',
        'auto_loan', 'business_loan', 'medical_debt', 'other'
    ];

    // API mutation for creating liability
    const mutation = useMutation({
        mutationFn: async (data: LiabilityFormData) => {
            if (!userId) throw new Error('User not logged in');
            return await apiClient.post('/api/v1/liabilities', {
                ...data,
                user_id: userId
            });
        },
        onSuccess: () => {
            // Refresh dashboard data using correct syntax
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['allLiabilities'] });

            // Close modal and reset form
            onClose();
            setFormData({ name: '', type: '', outstanding_balance: 0 });
        },
        onError: (error) => {
            console.error('Error adding liability:', error);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'outstanding_balance' ? parseFloat(value) || 0 : value
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
                    <h2 className="text-xl font-bold text-gray-900">Add Liability</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Liability Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Student Loan - SBI"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Liability Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        >
                            <option value="">Select type</option>
                            {liabilityTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.replace('_', ' ').split(' ').map(word =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Outstanding Balance (₹)</label>
                        <input
                            type="number"
                            name="outstanding_balance"
                            value={formData.outstanding_balance || ''}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter the current amount you owe</p>
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
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Adding...' : 'Add Liability'}
                        </button>
                    </div>
                </form>

                {/* Success Message (optional) */}
                {mutation.isSuccess && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-sm">
                        ✅ Liability added successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiabilityForm;