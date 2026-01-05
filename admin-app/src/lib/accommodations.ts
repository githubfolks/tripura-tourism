import { createApi, CATALOG_API_URL } from './api';
import type { Accommodation } from '../types/schema';

// We need to define AccommodationCreate based on schema.ts or infer it, 
// for now manually matching the expected backend payload relative to schema.
export interface AccommodationCreate {
    name: string;
    description?: string;
    type?: string;
    base_price: number;
    base_occupancy?: number;
    extra_boarder_price?: number;
    max_occupancy?: number;
    total_units?: number;
    is_active?: boolean;
    destination_id: string;
}

export const accommodationsService = {
    getAll: async (destinationId?: string): Promise<Accommodation[]> => {
        const query = destinationId ? `?destination_id=${destinationId}` : '';
        return createApi(CATALOG_API_URL).get<Accommodation[]>(`/accommodations/${query}`);
    },

    getById: async (id: string): Promise<Accommodation> => {
        return createApi(CATALOG_API_URL).get<Accommodation>(`/accommodations/${id}/`);
    },

    create: async (data: AccommodationCreate): Promise<Accommodation> => {
        return createApi(CATALOG_API_URL).post<Accommodation>('/accommodations/', data);
    },

    update: async (id: string, data: Partial<AccommodationCreate>): Promise<Accommodation> => {
        return createApi(CATALOG_API_URL).put<Accommodation>(`/accommodations/${id}/`, data);
    },

    delete: async (id: string): Promise<void> => {
        return createApi(CATALOG_API_URL).delete<void>(`/accommodations/${id}/`);
    }
};
