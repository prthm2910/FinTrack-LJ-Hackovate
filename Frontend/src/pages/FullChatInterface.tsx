import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api';
import MarkdownMessage from '../components/common/MarkdownMessage';

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
    answer: string;
}

const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post('/api/v1/ai/chat', data);
    return response.data;
};

const FullChatInterface: React.FC = () => {
    const location = useLocation();
    const { userId, user } = useUser();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initialMessageSentRef = useRef(false);

    const [messages, setMessages] = useState<Message[]>(() => {
        return [
            {
                id: '1',
                sender: 'ai',
                text: `# Welcome to FinAI! 👋\n\nHi **${user?.displayName || 'there'}**! I'm your personal financial AI assistant powered by advanced AI technology.\n\n**Ready to get started?** Ask me anything about your finances!`,
                timestamp: new Date()
            }
        ];
    });

    const chatMutation = useMutation({
        mutationFn: sendChatMessage,
        onSuccess: (response) => {
            const aiMessage: Message = {
                id: Date.now().toString(),
                sender: 'ai',
                text: response.answer,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        },
        onError: (error: any) => {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                sender: 'ai',
                text: '⚠️ **I apologize, but I encountered an error** while processing your request. Please try again in a moment.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    });

    // This is now the ONLY place the AI is ever called from.
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender === 'user' && userId) {
            chatMutation.mutate({
                user_id: userId,
                question: lastMessage.text
            });
        }
    }, [messages, userId]);

    // This effect now ONLY adds the initial user message from AI Studio.
    useEffect(() => {
        const messageToSend = location.state?.sendMessage;
        if (messageToSend && userId && !initialMessageSentRef.current) {
            initialMessageSentRef.current = true;
            const userMessage: Message = {
                id: Date.now().toString(),
                sender: 'user',
                text: messageToSend,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            window.history.replaceState({}, document.title);
        }
    }, [location.state, userId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // This function now ONLY adds the user's message to the state.
    const handleSendMessage = () => {
        const textToSend = input.trim();
        if (!textToSend || !userId || chatMutation.isPending) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: textToSend,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    const quickQuestions = [
        "What's my spending this month?", "How is my investment portfolio?",
        "Show me my financial summary", "What are my biggest expenses?",
        "Give me budgeting advice", "Analyze my financial health"
    ];

    const handleQuickQuestion = (question: string) => {
        if (chatMutation.isPending || !userId) return;
        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: question,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
    };

    return (
        <div
            className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-gray-50"
            style={{ fontFamily: 'Manrope, sans-serif' }}
        >
            <div className="flex h-full grow flex-col">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-4 bg-white sticky top-0 z-10 shadow-sm">
                    <Link to="/app/dashboard">
                        <div className="flex items-center gap-4 text-gray-800">
                             <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                                <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
                             </svg>
                             <h2 className="text-gray-800 text-xl font-bold leading-tight tracking-[-0.015em]">Financio</h2>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        {chatMutation.isPending && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                AI is analyzing...
                            </div>
                        )}
                        <Link to="/app/profile">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold shadow-md">
                                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 flex justify-center py-8 px-4 min-h-0">
                    <div className="w-full max-w-4xl flex flex-col h-full">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Chat with FinAI</h1>
                            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                                Get personalized insights, analysis, and recommendations powered by advanced AI.
                            </p>
                        </div>

                        {messages.length <= 1 && (
                            <div className="mb-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <span className="material-symbols-outlined mr-2 text-blue-600">lightbulb</span>
                                    Quick Questions
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {quickQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            className="p-3 text-left border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-sm"
                                            onClick={() => handleQuickQuestion(question)}
                                            disabled={chatMutation.isPending}
                                        >
                                            <span className="text-gray-700">{question}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}
                                >
                                    {message.sender === 'ai' && (
                                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 shadow-md">
                                            <span className="material-symbols-outlined text-lg">smart_toy</span>
                                        </div>
                                    )}

                                    <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <p className="text-gray-500 text-xs font-medium mb-1 px-1">
                                            {message.sender === 'user' ? (user?.displayName || 'You') : 'FinAI Assistant'}
                                        </p>
                                        <div className={`rounded-lg px-4 py-3 shadow-sm max-w-3xl ${
                                            message.sender === 'user'
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-none'
                                                : 'bg-white rounded-tl-none text-gray-800 border border-gray-200'
                                        }`}>
                                            {message.sender === 'ai' ? (
                                                <MarkdownMessage
                                                    content={message.text}
                                                    className="text-gray-800"
                                                />
                                            ) : (
                                                <p className="text-base whitespace-pre-wrap">{message.text}</p>
                                            )}
                                            <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    {message.sender === 'user' && (
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center shrink-0 font-semibold shadow-md">
                                            {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {chatMutation.isPending && (
                                <div className="flex items-start gap-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                                        <span className="material-symbols-outlined text-lg">smart_toy</span>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <p className="text-gray-500 text-xs font-medium mb-1 px-1">FinAI Assistant</p>
                                        <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 border border-gray-200 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                </div>
                                                <span className="text-sm text-gray-600">Analyzing...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                        
                        <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm sticky bottom-0">
                            <div className="p-4">
                                <div className="relative">
                                    <textarea
                                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pl-5 pr-24 py-3 text-base resize-none min-h-[60px] max-h-32"
                                        placeholder="Ask about your finances..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={chatMutation.isPending || !userId}
                                        rows={1}
                                    />
                                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                        <button
                                            onClick={handleSendMessage}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                            disabled={chatMutation.isPending || !input.trim() || !userId}
                                        >
                                            <span className="material-symbols-outlined text-xl">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FullChatInterface;