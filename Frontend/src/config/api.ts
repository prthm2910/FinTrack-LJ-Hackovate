const API_BASE_URL = "http://localhost:8000";
const CURRENT_USER_ID = "your_firebase_uid_here"; // Replace with actual Firebase UID

export const api = {
    // User endpoints
    getCurrentUser: () =>
        fetch(`${API_BASE_URL}/api/v1/users/me?user_id=${CURRENT_USER_ID}`),

    updateUserProfile: (data: {credit_score: number, epf_balance: number}) =>
        fetch(`${API_BASE_URL}/api/v1/users/update-profile?user_id=${CURRENT_USER_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),

    // Dashboard endpoints
    getDashboardSummary: () =>
        fetch(`${API_BASE_URL}/api/v1/dashboard/summary?user_id=${CURRENT_USER_ID}`),

    getRecentTransactions: () =>
        fetch(`${API_BASE_URL}/api/v1/dashboard/recent-transactions?user_id=${CURRENT_USER_ID}`),

    getAllTransactions: () =>
        fetch(`${API_BASE_URL}/api/v1/transactions?user_id=${CURRENT_USER_ID}`),

    // Add data endpoints
    addTransaction: (data: any) =>
        fetch(`${API_BASE_URL}/api/v1/transactions?user_id=${CURRENT_USER_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),

    addAsset: (data: any) =>
        fetch(`${API_BASE_URL}/api/v1/assets?user_id=${CURRENT_USER_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),

    addInvestment: (data: any) =>
        fetch(`${API_BASE_URL}/api/v1/investments?user_id=${CURRENT_USER_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),

    addLiability: (data: any) =>
        fetch(`${API_BASE_URL}/api/v1/liabilities?user_id=${CURRENT_USER_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),

    // AI endpoints
    chatWithAI: (message: string) =>
        fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: message, user_id: CURRENT_USER_ID })
        }),

    getAITemplates: () =>
        fetch(`${API_BASE_URL}/api/v1/ai/templates`)
};
