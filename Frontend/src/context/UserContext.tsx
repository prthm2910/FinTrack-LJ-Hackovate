import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase'; // Your existing firebase config

// 🎯 TypeScript Interface for Context
interface UserContextType {
    user: User | null;
    userId: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

// 🔥 Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// 🎯 Provider Component
interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // 🔥 Listen to Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            // Optional: Store user info in localStorage for persistence
            if (currentUser) {
                localStorage.setItem('firebase_uid', currentUser.uid);
                localStorage.setItem('user_email', currentUser.email || '');
                localStorage.setItem('user_name', currentUser.displayName || currentUser.email || '');
            } else {
                localStorage.removeItem('firebase_uid');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_name');
            }
        });

        return () => unsubscribe();
    }, []);

    // 🔥 Sign Out Function
    const signOut = async (): Promise<void> => {
        try {
            await auth.signOut();
            // Clear localStorage
            localStorage.removeItem('firebase_uid');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_name');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // 🎯 Context Value
    const value: UserContextType = {
        user,
        userId: user?.uid || null,
        isAuthenticated: !!user,
        loading,
        signOut
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// 🔥 Custom Hook to Use Context
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// 🎯 Alternative Hook Names (for convenience)
export const useAuth = useUser;
