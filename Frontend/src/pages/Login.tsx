import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    auth,
    googleProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    getAdditionalUserInfo, // ADDED: Import this helper function
} from '../firebase';
import { useCreateUser } from '../api/hooks/useUserApi';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const createUserMutation = useCreateUser();

    // This function is now only called for brand new users
    const ensureUserInDatabase = async (firebaseUser: any) => {
        try {
            await createUserMutation.mutateAsync({
                user_id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email || 'User',
            });
        } catch (error) {
            // This error is less likely now, but good to keep for resilience
            console.log('User creation failed:', error);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signInWithPopup(auth, googleProvider);

            // CHANGED: Check if the user is new before creating a database entry
            const additionalInfo = getAdditionalUserInfo(result);
            if (additionalInfo?.isNewUser) {
                console.log("New user detected, creating profile...");
                await ensureUserInDatabase(result.user);
            } else {
                console.log("Welcome back, returning user!");
            }

            navigate('/app/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Signing in with email/password implies the user already exists.
            // The creation logic should be on your "Sign Up" page.
            await signInWithEmailAndPassword(auth, email, password);

            // REMOVED: The call to ensureUserInDatabase was removed from here.
            // A login page should not create users.

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
                    Sign In to FinTrack
                </h1>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
                )}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-3 border border-gray-300 rounded-md py-3 text-gray-700 hover:bg-gray-50 transition mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <GoogleIcon />
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-3 text-gray-500 text-sm font-medium">or</span>
                    <hr className="flex-grow border-gray-300" />
                </div>
                <form onSubmit={handleEmailPasswordSignIn} className="space-y-6">
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
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-6 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-green-600 font-medium hover:underline">
                        Create one
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

export default Login;