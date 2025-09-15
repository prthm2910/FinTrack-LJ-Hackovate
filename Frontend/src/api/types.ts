// User Types
export interface User {
    user_id: string;
    name: string;
    email: string;
    credit_score: number;
    epf_balance: number;
    permissions: {
        perm_assets: boolean;
        perm_liabilities: boolean;
        perm_transactions: boolean;
        perm_investments: boolean;
        perm_credit_score: boolean;
        perm_epf_balance: boolean;
    };
}

// Financial Types
export interface Transaction {
    date: string;
    description: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
}

export interface Asset {
    name: string;
    type: string;
    value: number;
}

export interface Investment {
    name: string;
    ticker: string;
    type: string;
    quantity: number;
    current_value: number;
    purchase_date?: string;
}

export interface Liability {
    name: string;
    type: string;
    outstanding_balance: number;
}

// Dashboard Types
export interface DashboardSummary {
    total_assets: number;
    total_liabilities: number;
    epf_balance: number;
    credit_score: number;
    investment_portfolio: number;
}

export interface ChartData {
    spending_chart: {
        labels: string[];
        data: number[];
    };
    savings_chart: {
        labels: string[];
        data: number[];
    };
    investment_chart: {
        labels: string[];
        data: number[];
    };
    allocation_chart: {
        labels: string[];
        data: number[];
    };
    period: string;
}

// AI Types
export interface AITemplate {
    id: string;
    title: string;
    category: string;
    icon: string;
    description: string;
}

export interface AIChatRequest {
    question: string;
    user_id: string;
}

export interface AIChatResponse {
    response: string;
    user_id: string;
    context_used: boolean;
}
