import { CATALOG_API_URL, CATALOG_BASE_URL } from './api';

export const storageService = {
    upload: async (file: File): Promise<{ url: string, filename: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        // Using fetch directly because our generic api wrapper might assume JSON content-type
        // and we need browser to set multipart/form-data boundary
        const token = localStorage.getItem('access_token');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Note: The media endpoint is part of the API V1
        const response = await fetch(`${CATALOG_API_URL}/media/upload/`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || 'Image upload failed');
        }

        const data = await response.json();
        return {
            ...data,
            url: `${CATALOG_BASE_URL}${data.url}`
        };
    }
};
