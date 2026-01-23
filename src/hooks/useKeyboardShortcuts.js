/**
 * useKeyboardShortcuts Hook
 * 
 * Provides global keyboard shortcuts for the FixPix app.
 * 
 * Shortcuts:
 * - Ctrl/Cmd + Z: Undo
 * - Ctrl/Cmd + Shift + Z: Redo
 * - Ctrl/Cmd + S: Save/Download
 * - Ctrl/Cmd + Enter: Process/Generate
 * - Escape: Cancel current operation
 * - Space: Toggle before/after comparison
 */

import { useEffect, useCallback } from 'react';

const useKeyboardShortcuts = ({
    onUndo,
    onRedo,
    onSave,
    onProcess,
    onCancel,
    onToggleCompare,
    enabled = true
}) => {
    const handleKeyDown = useCallback((event) => {
        if (!enabled) return;

        // Don't trigger shortcuts when typing in inputs
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

        // Ctrl/Cmd + Z: Undo
        if (ctrlKey && !event.shiftKey && event.key === 'z') {
            event.preventDefault();
            onUndo?.();
            return;
        }

        // Ctrl/Cmd + Shift + Z: Redo
        if (ctrlKey && event.shiftKey && event.key === 'z') {
            event.preventDefault();
            onRedo?.();
            return;
        }

        // Ctrl/Cmd + Y: Redo (Windows style)
        if (ctrlKey && event.key === 'y') {
            event.preventDefault();
            onRedo?.();
            return;
        }

        // Ctrl/Cmd + S: Save/Download
        if (ctrlKey && event.key === 's') {
            event.preventDefault();
            onSave?.();
            return;
        }

        // Ctrl/Cmd + Enter: Process
        if (ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            onProcess?.();
            return;
        }

        // Escape: Cancel
        if (event.key === 'Escape') {
            event.preventDefault();
            onCancel?.();
            return;
        }

        // Space: Toggle compare (only when not processing)
        if (event.key === ' ' && event.target === document.body) {
            event.preventDefault();
            onToggleCompare?.();
            return;
        }
    }, [enabled, onUndo, onRedo, onSave, onProcess, onCancel, onToggleCompare]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
