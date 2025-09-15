import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useUserProfile, useUpdateProfile } from '../api/hooks/useUserApi';

interface ProfileFormData {
    name: string;
    phone: string;
    bio: string;
    password: string;
    confirmPassword: string;
}

const ProfileSettings: React.FC = () => {
    useUser();

    // API hooks - using your existing APIs only
    const { data: userProfile, isLoading, error } = useUserProfile();
    const updateProfileMutation = useUpdateProfile();

    // Form state
    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        phone: '',
        bio: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Initialize form with profile data
    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || '',
                phone: '',
                bio: '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [userProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password && formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Update profile using your existing API
            const profileUpdate: any = {
                name: formData.name,
                phone: formData.phone,
                bio: formData.bio,
            };

            await updateProfileMutation.mutateAsync(profileUpdate);

            // Clear password fields
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    };

    const handleCancel = () => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || '',
                phone: '',
                bio: '',
                password: '',
                confirmPassword: ''
            });
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600">Error loading profile: {error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50 group/design-root overflow-x-hidden"
            style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
        >
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-4">
                    <Link to="/app/dashboard">
                        <div className="flex items-center gap-4 text-gray-800">
                            <div className="size-8 text-[var(--primary-color)]">
                                <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                                    <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">Financio</h2>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/app/profile">
                            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                                {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 px-40 py-12">
                    <div className="mx-auto max-w-2xl">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                            <p className="text-gray-500 mt-1">Manage your personal information.</p>
                        </div>

                        {/* Show loading states for mutations */}
                        {updateProfileMutation.isPending && (
                            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
                                Updating profile...
                            </div>
                        )}

                        {/* Show success message */}
                        {updateProfileMutation.isSuccess && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                                Profile updated successfully!
                            </div>
                        )}

                        <div className="space-y-8">
                            {/* Profile Information */}
                            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1.5" htmlFor="name">Name</label>
                                        <input
                                            className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm h-11 px-4"
                                            id="name"
                                            name="name"
                                            placeholder="Enter your name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={updateProfileMutation.isPending}
                                        />
                                    </div>

                                    {/* Email - Read-only from Firebase */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1.5" htmlFor="email">Email</label>
                                        <input
                                            className="form-input block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm h-11 px-4"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            type="email"
                                            value={userProfile?.email || ''}
                                            readOnly
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed here. Contact support if needed.</p>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1.5" htmlFor="phone">Phone Number</label>
                                        <input
                                            className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm h-11 px-4"
                                            id="phone"
                                            name="phone"
                                            placeholder="Enter your phone number"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={updateProfileMutation.isPending}
                                        />
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1.5" htmlFor="bio">Bio</label>
                                        <textarea
                                            className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm px-4 py-3"
                                            id="bio"
                                            name="bio"
                                            placeholder="Tell us about yourself"
                                            rows={4}
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            disabled={updateProfileMutation.isPending}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1.5" htmlFor="password">New Password</label>
                                        <div className="relative">
                                            <input
                                                className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm h-11 px-4 pr-10"
                                                id="password"
                                                name="password"
                                                placeholder="Enter new password (optional)"
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                disabled={updateProfileMutation.isPending}
                                            />
                                            <button
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <span className="text-xl text-gray-400">
                                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                                </span>
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                                    </div>

                                    {/* Confirm Password */}
                                    {formData.password && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 pb-1.5" htmlFor="confirmPassword">Confirm Password</label>
                                            <div className="relative">
                                                <input
                                                    className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm h-11 px-4 pr-10"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    placeholder="Confirm new password"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    disabled={updateProfileMutation.isPending}
                                                />
                                                <button
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    <span className="text-xl text-gray-400">
                                                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-gray-100 text-gray-700 text-sm font-semibold leading-normal tracking-tight hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    type="button"
                                    disabled={updateProfileMutation.isPending}
                                >
                                    <span className="truncate">Cancel</span>
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-[var(--primary-color)] text-white text-sm font-semibold leading-normal tracking-tight hover:bg-opacity-90 transition-colors disabled:opacity-50"
                                    type="submit"
                                    disabled={updateProfileMutation.isPending}
                                >
                                    <span className="truncate">
                                        {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfileSettings;
