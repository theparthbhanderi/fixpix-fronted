import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import {
    Check, X, Undo, Redo, Minus, Plus,
    Maximize, Minimize, Download, HelpCircle,
    Eye, EyeOff, ZoomIn, ZoomOut
} from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * COMMAND DECK (Floating Top Bar)
 * 
 * A detached, glass-pill "cockpit" for high-frequency editing actions.
 * Context-aware: Switches between "Global Tools" and "Mode Actions".
 */
const ModeTopBar = () => {
    const { activeMode, exitMode, brushSize, setBrushSize } = useCommand();
    const {
        undoSettings, redoSettings, canUndo, canRedo,
        processImage, maskImage, isProcessing,
        zoom, setZoom
    } = useImage();

    const [isVisible, setIsVisible] = useState(true);
    const [lastMouseMove, setLastMouseMove] = useState(Date.now());

    // Auto-hide logic
    useEffect(() => {
        const handleMouseMove = () => {
            setLastMouseMove(Date.now());
            setIsVisible(true);
        };

        window.addEventListener('mousemove', handleMouseMove);

        const timeout = setInterval(() => {
            if (Date.now() - lastMouseMove > 3000 && !activeMode) {
                // Only auto-hide in global mode to prevent interrupting active work
                setIsVisible(false);
            }
        }, 1000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(timeout);
        };
    }, [lastMouseMove, activeMode]);

    const handleApply = async () => {
        if (activeMode === 'eraser' && maskImage) {
            await processImage({ mask: maskImage });
        }
        exitMode();
    };

    const modeLabels = {
        eraser: 'Eraser Lab',
        crop: 'Crop Tool',
        faceRestoration: 'Face Recovery',
        colorize: 'Color Lab'
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -40, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -40, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={cn(
                        "absolute top-6 left-1/2 -translate-x-1/2 z-50",
                        "flex items-center gap-1",
                        "bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl saturate-150",
                        "p-1.5 rounded-full border border-black/5 dark:border-white/10",
                        "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
                        "pointer-events-auto select-none"
                    )}
                >
                    {/* LEFT CLUSTER: History */}
                    <div className="flex items-center gap-0.5 px-1">
                        <IconButton
                            icon={Undo}
                            onClick={undoSettings}
                            disabled={!canUndo}
                            tooltip="Undo"
                        />
                        <IconButton
                            icon={Redo}
                            onClick={redoSettings}
                            disabled={!canRedo}
                            tooltip="Redo"
                        />
                    </div>

                    <Divider />

                    {/* CENTER CLUSTER: Context Aware */}
                    <div className="flex items-center gap-2 px-1 min-w-[200px] justify-center">
                        {activeMode ? (
                            // MODE CONTEXT
                            <div className="flex items-center gap-3">
                                <span className="text-[13px] font-bold text-black dark:text-white uppercase tracking-wider">
                                    {modeLabels[activeMode] || activeMode}
                                </span>

                                {activeMode === 'eraser' && (
                                    <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 rounded-lg p-0.5">
                                        <MiniButton onClick={() => setBrushSize(Math.max(5, brushSize - 10))}>
                                            <Minus size={12} />
                                        </MiniButton>
                                        <span className="text-[11px] font-medium w-6 text-center tabular-nums">
                                            {brushSize}
                                        </span>
                                        <MiniButton onClick={() => setBrushSize(Math.min(100, brushSize + 10))}>
                                            <Plus size={12} />
                                        </MiniButton>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // GLOBAL CONTEXT (Zoom & View)
                            <div className="flex items-center gap-1">
                                <IconButton
                                    icon={ZoomOut}
                                    onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}
                                    tooltip="Zoom Out"
                                />
                                <span className="text-[11px] font-semibold text-black/60 dark:text-white/60 w-10 text-center tabular-nums">
                                    {Math.round((zoom || 1) * 100)}%
                                </span>
                                <IconButton
                                    icon={ZoomIn}
                                    onClick={() => setZoom(z => Math.min(3, z + 0.1))}
                                    tooltip="Zoom In"
                                />
                            </div>
                        )}
                    </div>

                    <Divider />

                    {/* RIGHT CLUSTER: Actions */}
                    <div className="flex items-center gap-1.5 px-1">
                        {activeMode ? (
                            // MODE ACTIONS
                            <>
                                <button
                                    onClick={exitMode}
                                    className="h-7 px-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[12px] font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApply}
                                    disabled={isProcessing}
                                    className="h-7 px-3 rounded-full bg-[var(--accent)] text-white text-[12px] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                                >
                                    {isProcessing ? "Processing..." : (
                                        <>
                                            <Check size={12} strokeWidth={2.5} />
                                            Apply
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            // GLOBAL ACTIONS
                            <>
                                <IconButton icon={Maximize} tooltip="Fullscreen" />
                                <button className="h-7 px-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-[12px] font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5">
                                    <Download size={12} strokeWidth={2.5} />
                                    Export
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// UI Helpers
const IconButton = ({ icon: Icon, onClick, disabled, tooltip, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white",
            "hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-90",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            className
        )}
        title={tooltip}
    >
        <Icon size={16} strokeWidth={2.5} />
    </button>
);

const MiniButton = ({ children, onClick }) => (
    <button
        onClick={onClick}
        className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/20 text-black/70 dark:text-white/70"
    >
        {children}
    </button>
);

const Divider = () => (
    <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10 mx-1" />
);

export default ModeTopBar;
