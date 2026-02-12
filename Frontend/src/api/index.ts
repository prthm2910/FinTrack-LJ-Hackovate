// src/api/index.ts
import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/',
    timeout: 300000, // 100 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies if needed
});

// Request interceptor to automatically add auth tokens
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);

        // Optional: Handle specific error cases
        if (error.response?.status === 401) {
            // Handle unauthorized - maybe redirect to login
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
