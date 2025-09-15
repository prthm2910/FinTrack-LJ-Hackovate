export interface TransactionFormData {
    date: string;
    description: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
}

export interface AssetFormData {
    name: string;
    type: string;
    value: number;
}

export interface LiabilityFormData {
    name: string;
    type: string;
    outstanding_balance: number;
}

export interface InvestmentFormData {
    name: string;
    ticker: string;
    type: string;
    quantity: number;
    current_value: number;
}

export interface UserUpdateData {
    name: string;
    credit_score: number;
    epf_balance: number;
}
