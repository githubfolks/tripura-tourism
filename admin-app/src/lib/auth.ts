import { fetchJson } from './api';
import type { User } from '../types/schema';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8001/api/v1';

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export const authService = {
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        // Auth endpoint expects form-urlencoded data
        const response = await fetch(`${AUTH_API_URL}/login/access-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.detail || 'Login failed');
        }

        return response.json();
    },

    me: async (): Promise<User> => {
        return fetchJson<User>(`${AUTH_API_URL}/users/me`);
    }
};
