/**
 * API Configuration (TypeScript)
 */

// API base URL from environment variable or fallback to localhost
export const API_URL: string = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://fixpix-backend.onrender.com' : 'http://localhost:8000');
export const MEDIA_URL: string = API_URL;

// Centralized API endpoints
export const apiEndpoints = {
    // Auth
    login: `${API_URL}/api/token/`,
    refresh: `${API_URL}/api/token/refresh/`,
    register: `${API_URL}/api/register/`,

    // Images / Projects
    images: `${API_URL}/api/images/`,
    processImage: (id: number | string) => `${API_URL}/api/images/${id}/process/`,
    exportImage: (id: number | string, format: string, quality: number) =>
        `${API_URL}/api/images/${id}/export/?format=${format}&quality=${quality}`,
    deleteImage: (id: number | string) => `${API_URL}/api/images/${id}/`,
} as const;

// Helper to get full media URL
export function getMediaUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${MEDIA_URL}${path}`;
}

// Types for API responses
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
}
