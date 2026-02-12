import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';

interface CreditEPFConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreditEPFConfigModal: React.FC<CreditEPFConfigModalProps> = ({ isOpen, onClose }) => {
    const { userId } = useUser();
    const [creditScore, setCreditScore] = useState(750);
    const [epfBalance, setEpfBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            setIsLoading(true);
            fetchCurrentValues();
        }
    }, [isOpen, userId]);

    const fetchCurrentValues = async () => {
        if (!userId) return;
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/me?user_id=${userId}`);
            if (response.ok) {
                const userData = await response.json();
                setCreditScore(userData.credit_score || 750);
                setEpfBalance(userData.epf_balance || 0);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!userId) {
            alert('User not found. Please sign in again.');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/update-profile?user_id=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credit_score: creditScore,
                    epf_balance: epfBalance
                }),
            });

            if (response.ok) {
                onClose();
                window.location.reload();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Failed to update profile: ${error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Configure Financial Profile</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Credit Score
                            </label>
                            <input
                                type="number"
                                min="300"
                                max="999"
                                value={creditScore}
                                onChange={(e) => setCreditScore(parseInt(e.target.value) || 0)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 750"
                            />
                            <p className="text-xs text-gray-500 mt-1">Range: 300-850</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                EPF Balance (₹)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={epfBalance}
                                onChange={(e) => setEpfBalance(parseFloat(e.target.value) || 0)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 50000.00"
                            />
                            <p className="text-xs text-gray-500 mt-1">Your current EPF/PF balance</p>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreditEPFConfigModal;