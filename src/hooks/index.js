/**
 * Hooks Barrel Export
 * 
 * Provides clean imports for all custom hooks:
 * import { useProjects, useBatchProcessor, useKeyboardShortcuts, useFocusMode, useZoom } from '@/hooks';
 */

export { default as useBatchProcessor } from './useBatchProcessor';
export { default as useHistory } from './useHistory';
export { useProjects, useDeleteProject, useRefreshProjects } from './useProjects';
export { default as useKeyboardShortcuts } from './useKeyboardShortcuts';
export { default as useFocusMode } from './useFocusMode';
export { default as useZoom } from './useZoom';
