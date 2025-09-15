import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../api';
import MarkdownMessage from '../common/MarkdownMessage';

interface Message {
    id: string;
    sender: 'ai' | 'user';
    text: string;
    timestamp: Date;
}

interface ChatRequest {
    user_id: string;
    question: string;
}

interface ChatResponse {
    user_id: string;
    question: string;
    answer: string;
}

function isUserMessage(sender: string): sender is 'user' {
    return sender === 'user';
}

const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post('/api/v1/ai/chat', data);
    return response.data;
};

const Chatbot: React.FC = () => {
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'ai' as const,  // ✅ FIX: Use 'as const' to prevent type widening
            text: 'Hello! 👋 I\'m your **personal financial AI assistant**. I can help you:\n\n• Analyze your spending patterns\n• Review your investment portfolio\n• Answer questions about your finances\n• Provide personalized recommendations\n\nWhat would you like to know about your finances today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const { userId } = useUser();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const chatMutation = useMutation({
        mutationFn: sendChatMessage,
        onSuccess: (response) => {
            const aiMessage: Message = {
                id: Date.now().toString(),
                sender: 'ai' as const,  // ✅ FIX: Use 'as const'
                text: response.answer,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        },
        onError: (error) => {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                sender: 'ai' as const,  // ✅ FIX: Use 'as const'
                text: '⚠️ **Sorry, I encountered an error.** Please try again or contact support if the issue persists.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChatbot = () => {
        setIsChatbotOpen(!isChatbotOpen);
    };

    const closeChatbot = () => {
        setIsChatbotOpen(false);
    };

    const minimizeChatbot = () => {
        setIsMinimized(!isMinimized);
    };

    const maximizeChatbot = () => {
        // Pass current messages to full chat interface
        navigate('/app/chat', { state: { messages } });
    };

    const handleSendMessage = () => {
        if (!input.trim() || !userId || chatMutation.isPending) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user' as const,  // ✅ FIX: Use 'as const'
            text: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        // Send to AI API
        chatMutation.mutate({
            user_id: userId,
            question: input.trim()
        });

        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <div className="fixed bottom-5 right-5 z-50">
                <button
                    className="bg-[var(--primary-color)] text-white rounded-full p-4 shadow-lg hover:bg-[var(--primary-hover-color)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] relative group"
                    onClick={toggleChatbot}
                >
                    <span className="material-symbols-outlined">smart_toy</span>
                    {chatMutation.isPending && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                    {!isChatbotOpen && (
                        <div className="absolute -top-2 -left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Chat with FinAI
                        </div>
                    )}
                </button>
            </div>

            {/* Chat Interface */}
            <div className={`fixed bottom-20 right-5 z-40 bg-white rounded-xl shadow-2xl border border-[var(--border-color)] w-96 transition-all duration-300 ease-in-out transform ${
                isChatbotOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            } ${isMinimized ? 'h-16 overflow-hidden' : ''}`}>

                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-[var(--border-color)] rounded-t-xl">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center">
                        <span className="material-symbols-outlined mr-2 text-[var(--primary-color)]">smart_toy</span>
                        FinAI Assistant
                        {chatMutation.isPending && (
                            <span className="ml-2 text-xs text-blue-600 animate-pulse">Thinking...</span>
                        )}
                    </h3>
                    <div className="flex items-center gap-1">
                        <button
                            className="p-1 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none transition-colors"
                            onClick={minimizeChatbot}
                            title="Minimize"
                        >
                            <span className="material-symbols-outlined text-lg">minimize</span>
                        </button>
                        <button
                            className="p-1 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none transition-colors"
                            onClick={maximizeChatbot}
                            title="Open full chat"
                        >
                            <span className="material-symbols-outlined text-lg">open_in_full</span>
                        </button>
                        <button
                            className="p-1 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none transition-colors"
                            onClick={closeChatbot}
                            title="Close"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 h-80 overflow-y-auto bg-gray-50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start gap-3 mb-4 ${
                                message.sender === 'user' ? 'justify-end' : ''  // ✅ This will work now!
                            }`}
                        >
                            {message.sender === 'ai' && (  // ✅ This will work now!
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-base">smart_toy</span>
                                </div>
                            )}

                            <div className={`rounded-lg p-3 max-w-xs shadow-sm ${
                                message.sender === 'user'  // ✅ This will work now!
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                                {message.sender === 'ai' ? (  // ✅ This will work now!
                                    <MarkdownMessage
                                        content={message.text}
                                        className={isUserMessage(message.sender) ? 'text-white' : 'text-gray-900'}
                                    />
                                ) : (
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                )}
                                <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>

                            {message.sender === 'user' && (  // ✅ This will work now!
                                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 text-sm font-bold">
                                    U
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {chatMutation.isPending && (
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-2 rounded-full h-8 w-8 flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">smart_toy</span>
                            </div>
                            <div className="bg-white rounded-lg p-3 max-w-xs border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span className="text-xs text-gray-600">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-[var(--border-color)] bg-white rounded-b-xl">
                    <div className="relative">
                        <input
                            className="w-full border-gray-300 rounded-full pl-4 pr-12 py-2 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] text-sm transition-all"
                            placeholder="Ask about your finances..."
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={chatMutation.isPending || !userId}
                        />
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--primary-color)] text-white rounded-full p-1.5 hover:bg-[var(--primary-hover-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSendMessage}
                            disabled={chatMutation.isPending || !input.trim() || !userId}
                        >
                            <span className="material-symbols-outlined text-lg">send</span>
                        </button>
                    </div>
                    {!userId && (
                        <p className="text-xs text-red-500 mt-1">Please sign in to use AI chat</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chatbot;
