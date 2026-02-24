import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Undo2,
    Redo2,
    ZoomIn,
    ZoomOut,
    Columns,
    Download,
    Sparkles,
    ChevronDown
} from 'lucide-react';
import { useImage } from '../../context/ImageContext';
import { useCommand } from '../../context/CommandContext';

/**
 * FloatingCommandBar - Layer 2: Top Pill Toolbar
 * 
 * Features:
 * - Glass morphism background
 * - Auto-hide after 3s idle (desktop only)
 * - Fade in on mouse movement
 * - Contains: Undo, Redo, Zoom, Compare, Export, Generate
 * 
 * From EDITOR_REDESIGN_SPEC.md Section 2.1 & 7.1
 */
const FloatingCommandBar = ({ onExport, onGenerate, isProcessing = false }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [zoomDropdownOpen, setZoomDropdownOpen] = useState(false);

    const {
        undo,
        redo,
        canUndo,
        canRedo,
        zoom,
        setZoom,
        showComparison,
        setShowComparison
    } = useImage();

    const { pendingQueue } = useCommand();

    // Auto-hide logic (3s timeout)
    useEffect(() => {
        let hideTimeout;

        const handleActivity = () => {
            setIsVisible(true);
            clearTimeout(hideTimeout);

            if (!isProcessing) {
                hideTimeout = setTimeout(() => setIsVisible(false), 3000);
            }
        };

        // Initial timeout
        handleActivity();

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            clearTimeout(hideTimeout);
        };
    }, [isProcessing]);

    // Always visible during processing
    useEffect(() => {
        if (isProcessing) {
            setIsVisible(true);
        }
    }, [isProcessing]);

    const zoomOptions = [50, 75, 100, 125, 150, 200, 300];
    const currentZoomPercent = Math.round((zoom || 1) * 100);

    const handleZoomIn = () => setZoom?.(Math.min((zoom || 1) + 0.25, 3));
    const handleZoomOut = () => setZoom?.(Math.max((zoom || 1) - 0.25, 0.5));

    return (
        <motion.div
            className={`floating-command-bar ${!isVisible ? 'hidden' : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : -20
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {/* Undo/Redo Group */}
            <div className="flex items-center gap-1">
                <button
                    className={`command-bar-btn ${!canUndo ? 'opacity-40 cursor-not-allowed' : ''}`}
                    onClick={undo}
                    disabled={!canUndo}
                    title="Undo (⌘Z)"
                >
                    <Undo2 size={18} />
                </button>
                <button
                    className={`command-bar-btn ${!canRedo ? 'opacity-40 cursor-not-allowed' : ''}`}
                    onClick={redo}
                    disabled={!canRedo}
                    title="Redo (⌘⇧Z)"
                >
                    <Redo2 size={18} />
                </button>
            </div>

            <div className="command-bar-divider" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
                <button
                    className="command-bar-btn"
                    onClick={handleZoomOut}
                    title="Zoom Out (⌘-)"
                >
                    <ZoomOut size={16} />
                </button>

                <div className="relative">
                    <button
                        className="command-bar-btn min-w-[60px]"
                        onClick={() => setZoomDropdownOpen(!zoomDropdownOpen)}
                    >
                        <span className="text-[13px] font-semibold tabular-nums">
                            {currentZoomPercent}%
                        </span>
                        <ChevronDown size={14} />
                    </button>

                    <AnimatePresence>
                        {zoomDropdownOpen && (
                            <motion.div
                                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[var(--glass-bg-solid)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl shadow-lg py-1 min-w-[80px] z-50"
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                            >
                                {zoomOptions.map((z) => (
                                    <button
                                        key={z}
                                        className={`w-full px-3 py-2 text-left text-[13px] hover:bg-[rgba(var(--studio-glow),0.1)] transition-colors ${z === currentZoomPercent ? 'text-[var(--accent-primary)] font-semibold' : ''
                                            }`}
                                        onClick={() => {
                                            setZoom?.(z / 100);
                                            setZoomDropdownOpen(false);
                                        }}
                                    >
                                        {z}%
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    className="command-bar-btn"
                    onClick={handleZoomIn}
                    title="Zoom In (⌘+)"
                >
                    <ZoomIn size={16} />
                </button>
            </div>

            <div className="command-bar-divider" />

            {/* Compare Toggle */}
            <button
                className={`command-bar-btn ${showComparison ? 'bg-[rgba(var(--studio-glow),0.15)] text-[var(--accent-primary)]' : ''}`}
                onClick={() => setShowComparison?.(!showComparison)}
                title="Compare Before/After (C)"
            >
                <Columns size={16} />
                <span className="hidden sm:inline">Compare</span>
            </button>

            {/* Export */}
            <button
                className="command-bar-btn"
                onClick={onExport}
                title="Export (E)"
            >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
            </button>

            {/* Generate Button */}
            <button
                className={`command-bar-btn primary ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                onClick={onGenerate}
                disabled={isProcessing || pendingQueue?.length === 0}
                title="Generate (⌘Enter)"
            >
                {isProcessing ? (
                    <>
                        <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <Sparkles size={16} />
                        <span>
                            Generate
                            {pendingQueue?.length > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[11px]">
                                    {pendingQueue.length}
                                </span>
                            )}
                        </span>
                    </>
                )}
            </button>
        </motion.div>
    );
};

export default FloatingCommandBar;
