/**
 * API Configuration for FixPix
 * 
 * Uses Vite environment variables for API URL configuration.
 * Set VITE_API_URL in .env file for different environments.
 * 
 * Usage:
 *   import { API_URL, MEDIA_URL, apiEndpoints } from '../lib/api';
 */

// Base API URL from environment variable or default to localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Media URL (for serving uploaded/processed images)
export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || API_URL;

// Common API endpoints
export const apiEndpoints = {
    // Auth
    token: `${API_URL}/api/token/`,
    tokenRefresh: `${API_URL}/api/token/refresh/`,
    register: `${API_URL}/api/register/`,

    // Images
    images: `${API_URL}/api/images/`,
    imageDetail: (id) => `${API_URL}/api/images/${id}/`,
    processImage: (id) => `${API_URL}/api/images/${id}/process_image/`,
    downloadImage: (id) => `${API_URL}/api/images/${id}/download/`,

    // AI Generation
    generateImage: `${API_URL}/api/images/generate/`,
    generationStatus: `${API_URL}/api/images/generation_status/`,
};

// Helper to build full media URL
export const getMediaUrl = (path) => {
    if (!path) return null;
    // If path already starts with http, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Otherwise, prepend media URL
    return `${MEDIA_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default {
    API_URL,
    MEDIA_URL,
    apiEndpoints,
    getMediaUrl
};

