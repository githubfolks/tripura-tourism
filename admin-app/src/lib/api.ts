export class ApiError extends Error {
    constructor(public status: number, public message: string, public data?: any) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
        // @ts-ignore
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new ApiError(response.status, data.detail || 'API request failed', data);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8000/api/v1';
export const CATALOG_API_URL = import.meta.env.VITE_CATALOG_API_URL || 'http://localhost:8002/api/v1';
export const CATALOG_BASE_URL = CATALOG_API_URL.replace('/api/v1', '');
export const INVENTORY_API_URL = import.meta.env.VITE_INVENTORY_API_URL || 'http://localhost:8003/api/v1';
export const BOOKING_API_URL = import.meta.env.VITE_BOOKING_API_URL || 'http://localhost:8004/api/v1';

export const createApi = (baseUrl: string) => ({
    get: <T>(endpoint: string) => fetchJson<T>(`${baseUrl}${endpoint}`),
    post: <T>(endpoint: string, body: any) => fetchJson<T>(`${baseUrl}${endpoint}`, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: any) => fetchJson<T>(`${baseUrl}${endpoint}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => fetchJson<T>(`${baseUrl}${endpoint}`, { method: 'DELETE' }),
});

export const api = createApi(AUTH_API_URL);
