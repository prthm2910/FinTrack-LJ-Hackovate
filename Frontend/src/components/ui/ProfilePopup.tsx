import React from 'react';
import { Link } from 'react-router-dom';

interface ProfilePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black bg-opacity-25"
                onClick={onClose}
            ></div>

            {/* Popup - FIXED positioning to avoid clipping */}
            <div className="fixed top-16 right-4 w-80 z-50">
                <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                    <div className="flex flex-col space-y-2">
                        <Link
                            to="/app/permissions"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            onClick={onClose}
                        >
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-gray-500">
                                    verified_user
                                </span>
                                <span className="text-gray-700 font-medium">Permissions</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-400">
                                chevron_right
                            </span>
                        </Link>

                        <Link
                            to="/app/profile"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            onClick={onClose}
                        >
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-gray-500">
                                    manage_accounts
                                </span>
                                <span className="text-gray-700 font-medium">Manage Profile</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-400">
                                chevron_right
                            </span>
                        </Link>

                        <div className="border-t border-gray-100 my-2"></div>

                        <Link
                            to="/"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            onClick={onClose}
                        >
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-red-500">
                                    logout
                                </span>
                                <span className="text-red-500 font-medium">Log Out</span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex flex-col items-center text-center">
                        <img
                            alt="Profile"
                            className="w-20 h-20 rounded-full mb-4"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDATELwgYkgfSykW2XB5GDBN9_7W5cngfQ9LJ4KTgFtHlWgNm81viB7xv3so8w0p7G2roJGRiD2jYpZgHGDZbkNACIdyZU_u1oFmcDDYVI7tCwjbNjMmfpZs--mGrsFMGC6d2aOxURCQTcqWhaiNjKkBxdZeFNdwe9LmV50N5NzFL66aZ1FxTXq-fw3KZoqt1gVti_-atSkHnC36FQv-U1DSwnj47E0byx5x_djXYTZpn8CO0oehYfyWMnW1Kg-aAx_Jr3wfnc5Exrw"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">Welcome!</h3>
                        <p className="text-gray-500 mb-6">Join us to manage your finances better.</p>
                        <Link
                            to="/signup"
                            className="w-full bg-[var(--primary-color)] text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200 text-center block"
                            onClick={onClose}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePopup;
