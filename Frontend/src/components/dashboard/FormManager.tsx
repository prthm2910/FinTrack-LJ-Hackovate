import React, { useState } from 'react';
import TransactionForm from '../forms/TransactionForm';
import AssetForm from '../forms/AssetForm';
import InvestmentForm from '../forms/InvestmentForm';
import LiabilityForm from '../forms/LiabilityForm'; // Add this import
import type {TransactionFormData, AssetFormData, InvestmentFormData, LiabilityFormData} from '../../types/forms';

const FormManager: React.FC = () => {
    const [activeForm, setActiveForm] = useState<string | null>(null);

    const handleAddTransaction = async (data: TransactionFormData) => {
        const response = await fetch('http://localhost:8000/api/v1/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to add transaction');
    };

    const handleAddAsset = async (data: AssetFormData) => {
        const response = await fetch('http://localhost:8000/api/v1/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to add asset');
    };

    const handleAddInvestment = async (data: InvestmentFormData) => {
        const response = await fetch('http://localhost:8000/api/v1/investments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to add investment');
    };

    // Add liability handler
    const handleAddLiability = async (data: LiabilityFormData) => {
        const response = await fetch('http://localhost:8000/api/v1/liabilities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to add liability');
    };

    return (
        <>
            {/* Add Data Buttons */}
            <div className="mb-6 flex gap-4 flex-wrap">
                <button
                    onClick={() => setActiveForm('transaction')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add Transaction
                </button>

                <button
                    onClick={() => setActiveForm('asset')}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add Asset
                </button>

                <button
                    onClick={() => setActiveForm('investment')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add Investment
                </button>

                {/* Add Liability Button */}
                <button
                    onClick={() => setActiveForm('liability')}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add Liability
                </button>
            </div>

            {/* Form Modals */}
            <TransactionForm
                isOpen={activeForm === 'transaction'}
                onClose={() => setActiveForm(null)}
                onSubmit={handleAddTransaction}
            />

            <AssetForm
                isOpen={activeForm === 'asset'}
                onClose={() => setActiveForm(null)}
                onSubmit={handleAddAsset}
            />

            <InvestmentForm
                isOpen={activeForm === 'investment'}
                onClose={() => setActiveForm(null)}
                onSubmit={handleAddInvestment}
            />

            {/* Add Liability Form */}
            <LiabilityForm
                isOpen={activeForm === 'liability'}
                onClose={() => setActiveForm(null)}
                onSubmit={handleAddLiability}
            />
        </>
    );
};

export default FormManager;
