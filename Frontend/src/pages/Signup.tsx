import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import {
    auth,
    googleProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
} from '../firebase';
import { useCreateUser } from '../api/hooks/useUserApi';

const Signup: React.FC = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Hook for creating user in database
    const createUserMutation = useCreateUser();

    // Helper function to create user in database
    const ensureUserInDatabase = async (firebaseUser: any, displayName?: string) => {
        try {
            await createUserMutation.mutateAsync({
                user_id: firebaseUser.uid,
                name: displayName || firebaseUser.displayName || firebaseUser.email || 'User',
            });
        } catch (error: any) {
            // User might already exist - that's fine for existing users signing up via different method
            if (error.response?.status !== 409) {
                throw error; // Re-throw if it's not a "user already exists" error
            }
        }
    };

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signInWithPopup(auth, googleProvider);

            // Create user in database
            await ensureUserInDatabase(result.user);

            navigate('/app/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Create user with Firebase
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update Firebase profile with full name
            if (fullname.trim()) {
                await updateProfile(result.user, {
                    displayName: fullname.trim()
                });
            }

            // Create user in database
            await ensureUserInDatabase(result.user, fullname.trim());

            navigate('/app/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-10">
                <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
                    Create your FinTrack account
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-3 border border-gray-300 rounded-md py-3 text-gray-700 hover:bg-gray-50 transition mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <GoogleIcon />
                    {isLoading ? 'Creating account...' : 'Sign up with Google'}
                </button>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-3 text-gray-500 text-sm font-medium">or</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <form onSubmit={handleEmailSignUp} className="space-y-6">
                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="fullname"
                            type="text"
                            required
                            placeholder="John Doe"
                            value={fullname}
                            onChange={e => setFullname(e.target.value)}
                            disabled={isLoading}
                            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-3 focus:border-green-600 focus:ring-2 focus:ring-green-600 focus:outline-none transition disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-3 focus:border-green-600 focus:ring-2 focus:ring-green-600 focus:outline-none transition disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            placeholder="********"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-3 focus:border-green-600 focus:ring-2 focus:ring-green-600 focus:outline-none transition disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Show additional status for database operations */}
                {createUserMutation.isPending && (
                    <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded-md text-center">
                        Setting up your account...
                    </div>
                )}

                <p className="text-center text-gray-600 mt-6 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.6 20.3H42V20H24v8h11.21C34.17 33.66 29.48 37 24 37c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.14 0 6 1.2 8.19 3.15l5.77-5.77C34.65 6.12 29.69 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20c11.39 0 19.93-8.04 19.93-19.38 0-1.31-.15-2.59-.33-3.62z"/>
        <path fill="#FF3D00" d="M6.306 14.69l6.57 4.82c1.68-3.54 5.39-6.09 9.96-6.09 3.14 0 6 1.2 8.19 3.15l5.77-5.77C34.65 6.12 29.69 4 24 4 15.99 4 9.35 8.87 6.31 14.69z"/>
        <path fill="#4CAF50" d="M24 44c5.77 0 10.65-1.92 14.22-5.21l-6.59-5.42c-2.23 1.5-5.06 2.39-8.14 2.39-4.48 0-8.17-2.93-9.51-6.91l-6.6 5.1C9.21 39.1 16.88 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.3H42V20H24v8h11.21c-.69 2.07-2.33 3.74-4.41 4.41v6.13h6.59C39.79 35.91 44 30.63 44 24c0-1.31-.15-2.59-.33-3.62z"/>
    </svg>
);

export default Signup;
