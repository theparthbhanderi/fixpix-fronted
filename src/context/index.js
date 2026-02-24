/**
 * Context Barrel Export
 * 
 * Provides clean imports for all contexts:
 * import { ImageContext, AuthContext } from '@/context';
 */

export { ImageContext, ImageProvider, useImage } from './ImageContext';
export { default as AuthContext, AuthProvider } from './AuthContext';
