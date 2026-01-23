/**
 * Context Barrel Export
 * 
 * Provides clean imports for all contexts:
 * import { ImageContext, AuthContext, useTheme } from '@/context';
 */

export { ImageContext, ImageProvider, useImage } from './ImageContext';
export { default as AuthContext, AuthProvider } from './AuthContext';
export { default as ThemeContext, ThemeProvider, useTheme } from './ThemeContext';
export { default as SettingsContext, SettingsProvider, useSettings, defaultSettings } from './SettingsContext';
