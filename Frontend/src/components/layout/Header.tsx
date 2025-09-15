import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfilePopup from '../ui/ProfilePopup';
import CreditEPFConfigModal from "../ui/CreditEPFConfigModal.tsx";

const Header: React.FC = () => {
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false); // 👈 NEW STATE
    const [searchQuery, setSearchQuery] = useState('');

    const toggleProfilePopup = () => {
        setShowProfilePopup(!showProfilePopup);
    };
    const closeProfilePopup = () => {
        setShowProfilePopup(false);
    };

    // Keep your existing useEffect for body scroll management
    useEffect(() => {
        if (showProfilePopup) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showProfilePopup]);

    return (
        <>
            <header className="flex-shrink-0 bg-white border-b border-[var(--border-color)] shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Left: Logo + Welcome */}
                        <Link to="/app/dashboard">
                            <div className="flex items-center gap-4">
                                <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                                    <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                                <div>
                                    <h1 className="text-xl font-bold text-[var(--text-primary)]">FinTrack</h1>
                                    <p className="text-xs text-gray-500">Personal Finance</p>
                                </div>
                            </div>
                        </Link>

                        {/* Center: Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-lg mx-8">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm transition-all"
                                    placeholder="Search transactions, assets..."
                                />
                            </div>
                        </div>

                        {/* Right: Actions + Your Existing Profile */}
                        <div className="flex items-center gap-4">
                            {/* Welcome Message */}
                            <div className="hidden lg:block text-right mr-2">
                                <p className="text-sm text-gray-600">Welcome back,</p>
                                <p className="text-sm font-medium text-gray-900">Sarah! 👋</p>
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 rounded-full transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                            </button>

                            {/* 👈 NEW: Configure Credit & EPF Button */}
                            <button
                                onClick={() => setShowConfigModal(true)}
                                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">tune</span>
                                Configure
                            </button>

                            {/* Your Existing Profile Button - UNCHANGED */}
                            <div
                                className="h-10 w-10 rounded-full bg-cover bg-center cursor-pointer hover:ring-2 hover:ring-[var(--primary-color)] hover:ring-offset-2 transition-all"
                                style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDzCICpzzQuGkY-v_bBsNKknsPgd7nZqLgkC7wpa4XHc5PksWOGRcx7jPVf70bUSgnhlyQx4TVCBJR5uGZGdj5r1qKXIB6wasNKqCpk3CE8ex71c-PB6JdrsA0lJD7ZAuaZuJ04Ai133rQ7aDY9P8h6jTwHzZZlnr-zFc7ul0lZfDZGGPYZrwC_IBLFcqUa37QK2_xfcHZ04R6lq3LXLdQuKL04nmDWvXc4xTSVTaS7ZCxe2btZyM94J3cYZxmwHViKJbgeIpm-hDBQ")'}}
                                onClick={toggleProfilePopup}
                            ></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Your Existing ProfilePopup - COMPLETELY UNCHANGED */}
            <ProfilePopup
                isOpen={showProfilePopup}
                onClose={closeProfilePopup}
            />

            {/* 👈 NEW: Credit & EPF Config Modal */}
            <CreditEPFConfigModal
                isOpen={showConfigModal}
                onClose={() => setShowConfigModal(false)}
            />
        </>
    );
};

export default Header;
