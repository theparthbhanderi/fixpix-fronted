/**
 * Global TypeScript Type Definitions for FixPix
 * 
 * This file contains shared types used across the application.
 * As you migrate files to TypeScript, import types from here.
 */

// ============================================
// Image Processing Types
// ============================================

export interface ImageSettings {
    removeScratches: boolean;
    faceRestoration: boolean;
    upscaleX: number;
    colorize: boolean;
    brightness: number;
    contrast: number;
    saturation: number;
    autoEnhance: boolean;
    removeBackground: boolean;
    filterPreset: FilterPreset;
    whiteBalance: boolean;
    denoiseStrength: number;
}

export type FilterPreset =
    | 'none'
    | 'vintage'
    | 'cinematic'
    | 'warm'
    | 'cool'
    | 'bw_classic'
    | 'bw_noir'
    | 'fade'
    | 'vivid';

// ============================================
// Project Types
// ============================================

export interface Project {
    id: number;
    title: string;
    original_image: string;
    processed_image: string | null;
    settings: ImageSettings;
    created_at: string;
    updated_at: string;
    status: ProjectStatus;
}

export type ProjectStatus = 'pending' | 'processing' | 'completed' | 'error';

// ============================================
// Auth Types
// ============================================

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

// ============================================
// Batch Processing Types
// ============================================

export interface BatchItem {
    id: string;
    file: File;
    preview: string;
    status: BatchItemStatus;
    resultUrl: string | null;
    error: string | null;
    progress: number;
}

export type BatchItemStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'error'
    | 'cancelled';

export interface BatchProgress {
    completed: number;
    total: number;
    percentage: number;
}

// ============================================
// Toast Types
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    title?: string;
    duration: number;
}

// ============================================
// Theme Types
// ============================================

export type Theme = 'light' | 'dark';

// ============================================
// API Response Types
// ============================================

export interface ApiError {
    message: string;
    code?: string;
    field?: string;
}

export interface ProcessImageResponse {
    processed_image: string;
    settings_applied: ImageSettings;
}
