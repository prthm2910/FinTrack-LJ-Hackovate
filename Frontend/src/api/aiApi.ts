import apiClient from './index';
import type { AITemplate, AIChatRequest, AIChatResponse } from './types';

export const aiApi = {
    // Get AI templates
    getTemplates: async (): Promise<AITemplate[]> => {
        const response = await apiClient.get('/api/v1/ai/templates');
        return response.data;
    },

    // Chat with AI
    chatWithAI: async (chatRequest: AIChatRequest): Promise<AIChatResponse> => {
        const response = await apiClient.post('/api/v1/ai/chat', chatRequest);
        return response.data;
    },

    // Legacy ask endpoint
    askAI: async (question: string, userId: string) => {
        const response = await apiClient.post('/ask', { question, user_id: userId });
        return response.data;
    },
};
