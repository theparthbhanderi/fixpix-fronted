/**
 * API Configuration for FixPix
 * 
 * Uses Vite environment variables for API URL configuration.
 * Set VITE_API_URL in .env file for different environments.
 * 
 * Usage:
 *   import { API_URL, MEDIA_URL, apiEndpoints } from '../lib/api';
 */

// Base API URL from environment variable
// Fallback: Use Render URL in production, localhost in development
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://fixpix-backend.onrender.com' : 'http://localhost:8000');

// Media URL (for serving uploaded/processed images)
export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || API_URL;

// Common API endpoints
export const apiEndpoints = {
    // Auth
    token: `${API_URL}/api/token/`,
    tokenRefresh: `${API_URL}/api/token/refresh/`,
    register: `${API_URL}/api/register/`,
    profile: `${API_URL}/api/profile/`,

    // Images
    images: `${API_URL}/api/images/`,
    imageDetail: (id) => `${API_URL}/api/images/${id}/`,
    processImage: (id) => `${API_URL}/api/images/${id}/process_image/`,
    downloadImage: (id) => `${API_URL}/api/images/${id}/download/`,

    // New FastAPI AI Endpoints (Running on Port 8001 for Dev/Hybrid)
    restoreFace: import.meta.env.PROD
        ? `${API_URL}/api/v1/images/restore`
        : 'http://localhost:8001/api/v1/images/restore',

    superResolution: import.meta.env.PROD
        ? `${API_URL}/api/v1/image/super-resolution`
        : 'http://localhost:8001/api/v1/image/super-resolution',

    inpaint: import.meta.env.PROD
        ? `${API_URL}/api/v1/image/inpaint`
        : 'http://localhost:8001/api/v1/image/inpaint',

    colorize: import.meta.env.PROD
        ? `${API_URL}/api/v1/image/colorize`
        : 'http://localhost:8001/api/v1/image/colorize',

    segment: import.meta.env.PROD
        ? `${API_URL}/api/v1/image/segment`
        : 'http://localhost:8001/api/v1/image/segment',

    humanParse: import.meta.env.PROD
        ? `${API_URL}/api/v1/human/parse`
        : 'http://localhost:8001/api/v1/human/parse',

    generativeEdit: import.meta.env.PROD
        ? `${API_URL}/api/v1/gen/edit`
        : 'http://localhost:8001/api/v1/gen/edit',

    // AI Generation
    generateImage: `${API_URL}/api/images/generate/`,
    generationStatus: `${API_URL}/api/images/generation_status/`,

    // Cloudflare Text-to-Image (via Django proxy)
    cloudflareGenerate: `${API_URL}/api/generate/text-to-image/`,

    // Admin Panel
    admin: {
        dashboard: `${API_URL}/api/admin/dashboard/`,
        users: `${API_URL}/api/admin/users/`,
        userAction: (id) => `${API_URL}/api/admin/users/${id}/action/`,
        jobs: `${API_URL}/api/admin/jobs/`,
    }
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

