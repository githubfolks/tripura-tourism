import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/schema';
import { authService } from '../lib/auth';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isPartner: boolean;
    isAdmin: boolean;
    isAssetManager: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await authService.me();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    localStorage.removeItem('access_token');
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const { access_token } = await authService.login(email, password);
        localStorage.setItem('access_token', access_token);

        try {
            const userData = await authService.me();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user after login', error);
            throw new Error('Failed to fetch user profile');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isPartner: false, // Deprecated, always false
            isAdmin: user?.user_type === 'PORTAL_ADMIN' || user?.user_type === 'PORTAL_STAFF',
            isAssetManager: user?.user_type === 'ASSET_MANAGER',
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
