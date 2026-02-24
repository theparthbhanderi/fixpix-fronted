/**
 * useKeyboardShortcuts Hook (Enhanced)
 * 
 * Full keyboard shortcuts for FixPix Editor
 * From EDITOR_REDESIGN_SPEC.md Section 7.5
 * 
 * Shortcuts:
 * - ⌘/Ctrl + Z: Undo
 * - ⌘/Ctrl + Shift + Z: Redo
 * - ⌘/Ctrl + S: Save/Download
 * - ⌘/Ctrl + +: Zoom In
 * - ⌘/Ctrl + -: Zoom Out
 * - ⌘/Ctrl + 0: Reset Zoom
 * - ⌘/Ctrl + Enter: Generate
 * - C: Toggle Compare
 * - E: Export
 * - 1-4: Switch Inspector Tabs
 * - Space (hold): Pan mode
 * - Escape: Cancel / Close modal
 */

import { useEffect, useCallback, useState } from 'react';

const useKeyboardShortcuts = ({
    onUndo,
    onRedo,
    onSave,
    onExport,
    onProcess,
    onCancel,
    onToggleCompare,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onTabChange,
    onPanStart,
    onPanEnd,
    enabled = true
}) => {
    const [isPanning, setIsPanning] = useState(false);

    const handleKeyDown = useCallback((event) => {
        if (!enabled) return;

        // Don't trigger shortcuts when typing in inputs
        if (event.target.tagName === 'INPUT' ||
            event.target.tagName === 'TEXTAREA' ||
            event.target.isContentEditable) {
            return;
        }

        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

        // ═══════════════════════════════════════════════════════════
        // UNDO / REDO
        // ═══════════════════════════════════════════════════════════

        // ⌘/Ctrl + Z: Undo
        if (ctrlKey && !event.shiftKey && event.key === 'z') {
            event.preventDefault();
            onUndo?.();
            return;
        }

        // ⌘/Ctrl + Shift + Z: Redo
        if (ctrlKey && event.shiftKey && event.key === 'z') {
            event.preventDefault();
            onRedo?.();
            return;
        }

        // ⌘/Ctrl + Y: Redo (Windows style)
        if (ctrlKey && event.key === 'y') {
            event.preventDefault();
            onRedo?.();
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // ZOOM CONTROLS
        // ═══════════════════════════════════════════════════════════

        // ⌘/Ctrl + +: Zoom In
        if (ctrlKey && (event.key === '+' || event.key === '=')) {
            event.preventDefault();
            onZoomIn?.();
            return;
        }

        // ⌘/Ctrl + -: Zoom Out
        if (ctrlKey && event.key === '-') {
            event.preventDefault();
            onZoomOut?.();
            return;
        }

        // ⌘/Ctrl + 0: Reset Zoom
        if (ctrlKey && event.key === '0') {
            event.preventDefault();
            onZoomReset?.();
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // ACTIONS
        // ═══════════════════════════════════════════════════════════

        // ⌘/Ctrl + S: Save/Download
        if (ctrlKey && event.key === 's') {
            event.preventDefault();
            onSave?.();
            return;
        }

        // ⌘/Ctrl + Enter: Generate/Process
        if (ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            onProcess?.();
            return;
        }

        // E: Export (without modifier)
        if (event.key === 'e' && !ctrlKey && !event.shiftKey) {
            event.preventDefault();
            onExport?.();
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // NAVIGATION
        // ═══════════════════════════════════════════════════════════

        // Escape: Cancel / Close modal
        if (event.key === 'Escape') {
            event.preventDefault();
            onCancel?.();
            return;
        }

        // C: Toggle Compare
        if (event.key === 'c' && !ctrlKey) {
            event.preventDefault();
            onToggleCompare?.();
            return;
        }

        // 1-4: Switch Inspector Tabs
        if (['1', '2', '3', '4'].includes(event.key) && !ctrlKey) {
            event.preventDefault();
            const tabs = ['restore', 'enhance', 'create', 'adjust'];
            const tabIndex = parseInt(event.key) - 1;
            onTabChange?.(tabs[tabIndex]);
            return;
        }

        // Space (hold): Pan mode
        if (event.key === ' ' && event.target === document.body) {
            event.preventDefault();
            if (!isPanning) {
                setIsPanning(true);
                onPanStart?.();
            }
            return;
        }
    }, [enabled, onUndo, onRedo, onSave, onExport, onProcess, onCancel,
        onToggleCompare, onZoomIn, onZoomOut, onZoomReset, onTabChange,
        onPanStart, isPanning]);

    const handleKeyUp = useCallback((event) => {
        // Release pan mode
        if (event.key === ' ' && isPanning) {
            setIsPanning(false);
            onPanEnd?.();
        }
    }, [isPanning, onPanEnd]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return { isPanning };
};

export default useKeyboardShortcuts;
