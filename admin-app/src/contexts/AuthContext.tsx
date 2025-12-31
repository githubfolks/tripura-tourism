import React, { createContext, useContext, useState } from 'react';
import type { User, UserType } from '../types/schema';
import { mockUsers } from '../lib/mockData';

interface AuthContextType {
    user: User | null;
    login: (email: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isPartner: boolean;
    isAdmin: boolean;
    isAssetManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        // Check local storage for persisted session (simulated)
        const storedUser = localStorage.getItem('tripura_admin_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (email: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find mock user
        let validUser = mockUsers.find(u => u.email === email);

        if (!validUser) {
            // Infer role from email for demo purposes
            let role: UserType = 'PORTAL_ADMIN';
            if (email.includes('staff')) role = 'PORTAL_STAFF';
            else if (email.includes('manager')) role = 'ASSET_MANAGER';

            // Fallback for demo purposes if specific mock user not found
            const fallbackUserMap: Record<string, Partial<User>> = {
                'PORTAL_ADMIN': { id: 'admin_u1', full_name: 'Admin User' },
                'PORTAL_STAFF': { id: 'staff_u1', full_name: 'Staff Member' },
                'ASSET_MANAGER': { id: 'manager_u1', full_name: 'Asset Manager' }
            };

            const fallback = fallbackUserMap[role] || fallbackUserMap['PORTAL_ADMIN'];

            validUser = {
                id: fallback.id!,
                full_name: fallback.full_name!,
                email: email,
                user_type: role,
                partner_id: undefined,
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
            isPartner: false, // Deprecated, always false
            isAdmin: user?.user_type === 'PORTAL_ADMIN' || user?.user_type === 'PORTAL_STAFF',
            isAssetManager: user?.user_type === 'ASSET_MANAGER'
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
