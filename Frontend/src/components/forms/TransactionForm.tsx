import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../context/UserContext';
import apiClient from '../../api';
import type { TransactionFormData } from '../../types/forms';

interface TransactionFormProps {
    onClose: () => void;
    isOpen: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, isOpen }) => {
    const { userId } = useUser();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<TransactionFormData>({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        amount: 0,
        type: 'expense'
    });

    const categories = [
        'salary', 'freelance', 'bonus', 'groceries', 'utilities', 'rent',
        'dining', 'shopping', 'transportation', 'healthcare', 'entertainment',
        'education'
    ];

    // API mutation for creating transaction
    const mutation = useMutation({
        mutationFn: async (data: TransactionFormData) => {
            if (!userId) throw new Error('User not logged in');
            return await apiClient.post('/api/v1/transactions', {
                ...data,
                user_id: userId
            });
        },
        onSuccess: () => {
            // Refresh dashboard data
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['recent-transactions'] });
            queryClient.invalidateQueries({ queryKey: ['allTransactions'] });

            // Close modal and reset form
            onClose();
            setFormData({
                date: new Date().toISOString().split('T')[0],
                description: '',
                category: '',
                amount: 0,
                type: 'expense'
            });
        },
        onError: (error) => {
            console.error('Error adding transaction:', error);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) return;

        // Submit to API
        mutation.mutate({
            ...formData,
            amount: formData.type === 'expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount)
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="e.g., Grocery shopping"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount || ''}
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
                            {mutation.isPending ? 'Adding...' : 'Add Transaction'}
                        </button>
                    </div>
                </form>

                {/* Success Message (optional) */}
                {mutation.isSuccess && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-sm">
                        ✅ Transaction added successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionForm;