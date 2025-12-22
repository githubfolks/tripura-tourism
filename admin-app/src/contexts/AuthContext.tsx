import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserType } from '../types/schema';
import { mockUsers } from '../lib/mockData';

interface AuthContextType {
    user: User | null;
    login: (email: string, role: UserType) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isPartner: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check local storage for persisted session (simulated)
        const storedUser = localStorage.getItem('tripura_admin_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, role: UserType) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find mock user or create a temporary one for the session
        let validUser = mockUsers.find(u => u.email === email && u.user_type === role);

        if (!validUser) {
            // Fallback for demo purposes if specific mock user not found
            validUser = {
                id: role === 'PARTNER_ADMIN' ? 'par_u1' : 'admin_u1',
                full_name: role === 'PARTNER_ADMIN' ? 'Partner User' : 'Admin User',
                email: email,
                user_type: role,
                partner_id: role === 'PARTNER_ADMIN' ? 'par1' : undefined, // Link to MakeMyTrip mock partner
                is_active: true,
                is_verified: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        }

        setUser(validUser);
        localStorage.setItem('tripura_admin_user', JSON.stringify(validUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tripura_admin_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isPartner: user?.user_type === 'PARTNER_ADMIN' || user?.user_type === 'PARTNER_USER',
            isAdmin: user?.user_type === 'PORTAL_ADMIN' || user?.user_type === 'PORTAL_STAFF'
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
