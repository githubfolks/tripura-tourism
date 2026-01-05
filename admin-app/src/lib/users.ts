import { api } from './api';

export interface User {
    id: string;
    email: string;
    full_name: string;
    user_type: string;
    phone: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

export const usersService = {
    getAllUsers: async (): Promise<User[]> => {
        return api.get<User[]>('/users');
    },

    createUser: async (userData: any): Promise<User> => {
        return api.post<User>('/users', userData);
    },

    updateUser: async (id: string, userData: any): Promise<User> => {
        return api.put<User>(`/users/${id}`, userData);
    },

    deleteUser: async (id: string): Promise<User> => {
        return api.delete<User>(`/users/${id}`);
    }
};
