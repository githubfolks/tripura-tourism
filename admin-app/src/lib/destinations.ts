import { createApi, CATALOG_API_URL } from './api';
import type { Destination } from '../types/schema';

const api = createApi(CATALOG_API_URL);

export const destinationsService = {
    getAll: async (): Promise<Destination[]> => {
        return api.get<Destination[]>('/destinations/');
    },

    getById: async (id: string): Promise<Destination> => {
        return api.get<Destination>(`/destinations/id/${id}/`);
    },

    create: async (data: Partial<Destination>): Promise<Destination> => {
        return api.post<Destination>('/destinations/', data);
    },

    update: async (id: string, data: Partial<Destination>): Promise<Destination> => {
        return api.put<Destination>(`/destinations/${id}/`, data);
    },

    delete: async (id: string): Promise<void> => {
        return api.delete<void>(`/destinations/${id}/`);
    }
};
