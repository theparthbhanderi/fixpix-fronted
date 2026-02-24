import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import ZoomFlashOverlay from './ZoomFlashOverlay';

/**
 * ZoomHUD - Bottom Center Zoom Controls Pill
 * From EDITOR_CANVAS_SPEC.md Section 4.2
 * 
 * Features:
 * - Zoom out/in buttons
 * - FIT and 100% presets
 * - Current percentage display
 * - Flash overlay on zoom change
 */
const ZoomHUD = memo(({ zoom = 1, onZoomIn, onZoomOut, onFit, onReset }) => {
    const [showFlash, setShowFlash] = useState(false);
    const percentage = Math.round(zoom * 100);

    const flashPercentage = useCallback(() => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 1500);
    }, []);

    const handleZoomIn = useCallback(() => {
        onZoomIn?.();
        flashPercentage();
    }, [onZoomIn, flashPercentage]);

    const handleZoomOut = useCallback(() => {
        onZoomOut?.();
        flashPercentage();
    }, [onZoomOut, flashPercentage]);

    const handleFit = useCallback(() => {
        onFit?.();
        flashPercentage();
    }, [onFit, flashPercentage]);

    const handleReset = useCallback(() => {
        onReset?.();
        flashPercentage();
    }, [onReset, flashPercentage]);

    return (
        <>
            <motion.div
                className="zoom-hud fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center h-10 px-1 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[20px]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    boxShadow: 'var(--depth-1)'
                }}
            >
                {/* Zoom Out */}
                <button
                    onClick={handleZoomOut}
                    className="zoom-btn flex items-center justify-center w-8 h-8 rounded-2xl text-[var(--text-secondary)] hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--accent-primary)] active:scale-95 transition-all duration-150"
                >
                    <Minus size={16} />
                </button>

                <div className="zoom-divider w-px h-5 bg-[var(--glass-border)] mx-0.5" />

                {/* Fit to Screen */}
                <button
                    onClick={handleFit}
                    className="zoom-btn flex items-center justify-center h-8 px-3 rounded-2xl text-[12px] font-semibold text-[var(--text-secondary)] hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--accent-primary)] active:scale-95 transition-all duration-150"
                >
                    FIT
                </button>

                <div className="zoom-divider w-px h-5 bg-[var(--glass-border)] mx-0.5" />

                {/* 100% */}
                <button
                    onClick={handleReset}
                    className="zoom-btn flex items-center justify-center h-8 px-3 rounded-2xl text-[12px] font-semibold text-[var(--text-secondary)] hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--accent-primary)] active:scale-95 transition-all duration-150"
                >
                    100%
                </button>

                <div className="zoom-divider w-px h-5 bg-[var(--glass-border)] mx-0.5" />

                {/* Zoom In */}
                <button
                    onClick={handleZoomIn}
                    className="zoom-btn flex items-center justify-center w-8 h-8 rounded-2xl text-[var(--text-secondary)] hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--accent-primary)] active:scale-95 transition-all duration-150"
                >
                    <Plus size={16} />
                </button>

                <div className="zoom-divider w-px h-5 bg-[var(--glass-border)] mx-0.5" />

                {/* Current Percentage */}
                <span className="px-3 text-[12px] font-semibold text-[var(--text-primary)] min-w-[48px] text-center">
                    {percentage}%
                </span>
            </motion.div>

            {/* Flash Overlay */}
            <ZoomFlashOverlay percentage={percentage} isVisible={showFlash} />
        </>
    );
});

ZoomHUD.displayName = 'ZoomHUD';

export default ZoomHUD;
