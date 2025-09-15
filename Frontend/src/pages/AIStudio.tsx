import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

interface Template {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
    prompt: string;
}

const AIStudio: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();

    const categories = [
        { id: 'all', name: 'All Templates', icon: 'apps' },
        { id: 'investment', name: 'Investment', icon: 'trending_up' },
        { id: 'budgeting', name: 'Budgeting', icon: 'account_balance_wallet' },
        { id: 'loans', name: 'Loans', icon: 'credit_score' },
        { id: 'travel', name: 'Travel', icon: 'flight' },
        { id: 'retirement', name: 'Retirement', icon: 'savings' },
    ];

    const templates: Template[] = [
        {
            id: '1',
            title: 'Investment Portfolio Review',
            description: 'Get personalized advice on your investment mix and risk level',
            category: 'investment',
            icon: 'show_chart',
            prompt: 'Review my investment portfolio and suggest improvements based on my age and risk tolerance'
        },
        {
            id: '2',
            title: 'Monthly Budget Optimizer',
            description: 'Optimize your monthly spending and find areas to save money',
            category: 'budgeting',
            icon: 'pie_chart',
            prompt: 'Help me create an optimized monthly budget based on my income and expenses'
        },
        {
            id: '3',
            title: 'Loan Comparison Tool',
            description: 'Compare different loan options and find the best rates',
            category: 'loans',
            icon: 'compare',
            prompt: 'Help me compare loan options and find the best terms for my situation'
        },
        {
            id: '4',
            title: 'Travel Budget Planner',
            description: 'Plan and budget for your next vacation or business trip',
            category: 'travel',
            icon: 'luggage',
            prompt: 'Help me plan and budget for my upcoming trip including flights, hotels, and activities'
        },
        {
            id: '5',
            title: 'Emergency Fund Calculator',
            description: 'Calculate how much you should save for emergencies',
            category: 'budgeting',
            icon: 'emergency',
            prompt: 'Help me calculate the right emergency fund size for my situation'
        },
        {
            id: '6',
            title: 'Retirement Planning Guide',
            description: 'Plan your retirement savings and timeline',
            category: 'retirement',
            icon: 'elderly',
            prompt: 'Help me create a retirement savings plan based on my current age and income'
        },
        {
            id: '7',
            title: 'Debt Payoff Strategy',
            description: 'Create a plan to pay off your debts efficiently',
            category: 'loans',
            icon: 'payments',
            prompt: 'Help me create an effective debt payoff strategy for my current debts'
        },
        {
            id: '8',
            title: 'Investment Risk Assessment',
            description: 'Understand your risk tolerance and investment style',
            category: 'investment',
            icon: 'assessment',
            prompt: 'Assess my investment risk tolerance and suggest appropriate investment strategies'
        }
    ];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    const quickActions = [
        'How much should I save each month?',
        'Is now a good time to invest?',
        'Should I pay off debt or invest?',
        'How to improve my credit score?'
    ];

    // ✅ HANDLE TEMPLATE CLICK - Navigate to chat with prompt
    const handleTemplateClick = (template: Template) => {
        navigate('/app/chat', {
            state: {
                sendMessage: template.prompt
            }
        });
    };

    // ✅ HANDLE QUICK ACTION CLICK - Navigate to chat with question
    const handleQuickActionClick = (question: string) => {
        navigate('/app/chat', {
            state: {
                sendMessage: question
            }
        });
    };

    return (
        <div
            className="flex h-screen flex-col bg-gray-50 text-gray-900"
            style={{ fontFamily: 'Manrope, sans-serif' }}
        >
            <Header />
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6">
                            <span className="material-symbols-outlined">auto_awesome</span>
                            <span className="font-semibold">FinAI Studio</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Your Personal Financial AI Assistant
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Get instant, personalized financial advice using our AI-powered templates and tools.
                            Make smarter financial decisions with confidence.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Questions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickActionClick(question)}
                                    className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                                            {question}
                                        </span>
                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500">
                                            arrow_forward
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Templates</h2>
                        <div className="flex flex-wrap gap-3 mb-6">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                        selectedCategory === category.id
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-base">
                                        {category.icon}
                                    </span>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => handleTemplateClick(template)}
                                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-blue-100 group-hover:bg-blue-200 p-3 rounded-xl transition-colors">
                                        <span className="material-symbols-outlined text-blue-600 text-xl">
                                            {template.icon}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {template.title}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {template.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full capitalize">
                                        {template.category}
                                    </span>
                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500 transition-colors">
                                        arrow_forward
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Custom Chat Section */}
                    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-2xl text-blue-600">chat</span>
                            <h2 className="text-2xl font-bold text-gray-900">Custom AI Chat</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Have a specific financial question? Start a custom conversation with our AI assistant.
                        </p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                            if (input.value.trim()) {
                                handleQuickActionClick(input.value.trim());
                                input.value = '';
                            }
                        }} className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    name="message"
                                    type="text"
                                    placeholder="Ask me anything about your finances..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <span>Start Chat</span>
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIStudio;