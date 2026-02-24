import { useState, useCallback, useEffect } from 'react';

/**
 * useZoom - Unified Zoom System Hook
 * From EDITOR_CANVAS_SPEC.md Section 4.5
 * 
 * Features:
 * - Mouse wheel zoom (Ctrl/Cmd + scroll)
 * - Pinch zoom (mobile)
 * - Keyboard shortcuts (+, -, 0 for reset)
 * - Zoom limits: 0.25x to 4x
 * - Pan support
 */
const useZoom = (options = {}) => {
    const {
        minZoom = 0.25,
        maxZoom = 4,
        zoomStep = 0.25,
        initialZoom = 1
    } = options;

    const [zoom, setZoom] = useState(initialZoom);
    const [pan, setPan] = useState({ x: 0, y: 0 });

    // Clamp zoom to limits
    const clampZoom = useCallback((value) => {
        return Math.min(maxZoom, Math.max(minZoom, value));
    }, [minZoom, maxZoom]);

    // Zoom in
    const zoomIn = useCallback(() => {
        setZoom(z => clampZoom(z + zoomStep));
    }, [clampZoom, zoomStep]);

    // Zoom out
    const zoomOut = useCallback(() => {
        setZoom(z => clampZoom(z - zoomStep));
    }, [clampZoom, zoomStep]);

    // Reset to 100%
    const resetZoom = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    // Fit to screen (calculate based on container)
    const fitToScreen = useCallback(() => {
        // This would be calculated based on actual container and image dimensions
        // For now, default to 1x
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    // Set specific zoom level
    const setZoomLevel = useCallback((level) => {
        setZoom(clampZoom(level));
    }, [clampZoom]);

    // Handle pinch zoom (for mobile)
    const handlePinch = useCallback((scale) => {
        setZoom(z => clampZoom(z * scale));
    }, [clampZoom]);

    // Mouse wheel zoom
    useEffect(() => {
        const handleWheel = (e) => {
            // Only zoom if Ctrl/Cmd is pressed
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setZoom(z => clampZoom(z + delta));
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [clampZoom]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // + or = to zoom in
            if ((e.key === '+' || e.key === '=') && !e.metaKey) {
                e.preventDefault();
                zoomIn();
            }

            // - to zoom out
            if (e.key === '-' && !e.metaKey) {
                e.preventDefault();
                zoomOut();
            }

            // 0 to reset zoom
            if (e.key === '0' && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                resetZoom();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [zoomIn, zoomOut, resetZoom]);

    return {
        zoom,
        pan,
        setZoom: setZoomLevel,
        setPan,
        zoomIn,
        zoomOut,
        resetZoom,
        fitToScreen,
        handlePinch
    };
};

export default useZoom;
