import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * iOS-Style Before/After Image Comparison Slider
 * Features:
 * - Smooth dragging with visual feedback
 * - Proper mobile touch handling (no scroll/pan conflicts)
 * - touch-action: none to prevent browser gestures
 * - Exposes isSliding state to parent for gesture coordination
 */
const BeforeAfterSlider = ({ before, after, className, onSlidingChange }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const containerRef = useRef(null);
    const dragAreaRef = useRef(null);

    // Notify parent about sliding state for gesture coordination
    useEffect(() => {
        onSlidingChange?.(isDragging);
    }, [isDragging, onSlidingChange]);

    // Hide hint after first interaction
    useEffect(() => {
        if (isDragging) {
            const timer = setTimeout(() => setShowHint(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isDragging]);

    const handleMove = useCallback((clientX) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percent = Math.max(5, Math.min((x / rect.width) * 100, 95));
            setSliderPosition(percent);
        }
    }, []);

    const handleStart = useCallback((clientX) => {
        setIsDragging(true);
        handleMove(clientX);
    }, [handleMove]);

    const handleEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Mouse handlers
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        handleStart(e.clientX);
    }, [handleStart]);

    // Touch handlers with proper preventDefault
    const handleTouchStart = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        handleStart(e.touches[0].clientX);
    }, [handleStart]);

    const handleTouchMove = useCallback((e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            handleMove(e.touches[0].clientX);
        }
    }, [isDragging, handleMove]);

    const handleTouchEnd = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        handleEnd();
    }, [handleEnd]);

    // Global mouse move/up listeners
    useEffect(() => {
        const handleGlobalMove = (e) => {
            if (isDragging) {
                e.preventDefault();
                handleMove(e.clientX);
            }
        };

        const handleGlobalUp = () => {
            setIsDragging(false);
        };

        const handleGlobalTouchMove = (e) => {
            if (isDragging) {
                e.preventDefault();
                handleMove(e.touches[0].clientX);
            }
        };

        if (isDragging) {
            // Use passive: false to allow preventDefault
            window.addEventListener('mousemove', handleGlobalMove, { passive: false });
            window.addEventListener('mouseup', handleGlobalUp);
            window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
            window.addEventListener('touchend', handleGlobalUp);
            window.addEventListener('touchcancel', handleGlobalUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchmove', handleGlobalTouchMove);
            window.removeEventListener('touchend', handleGlobalUp);
            window.removeEventListener('touchcancel', handleGlobalUp);
        };
    }, [isDragging, handleMove]);

    // Attach non-passive touch listeners to drag area
    useEffect(() => {
        const dragArea = dragAreaRef.current;
        if (!dragArea) return;

        const touchStartHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleStart(e.touches[0].clientX);
        };

        const touchMoveHandler = (e) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
                handleMove(e.touches[0].clientX);
            }
        };

        const touchEndHandler = (e) => {
            e.preventDefault();
            handleEnd();
        };

        // Use passive: false to allow preventDefault on touch events
        dragArea.addEventListener('touchstart', touchStartHandler, { passive: false });
        dragArea.addEventListener('touchmove', touchMoveHandler, { passive: false });
        dragArea.addEventListener('touchend', touchEndHandler, { passive: false });

        return () => {
            dragArea.removeEventListener('touchstart', touchStartHandler);
            dragArea.removeEventListener('touchmove', touchMoveHandler);
            dragArea.removeEventListener('touchend', touchEndHandler);
        };
    }, [isDragging, handleStart, handleMove, handleEnd]);

    // Label component for consistency
    const Label = ({ type, position }) => (
        <div
            className={cn(
                "absolute px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase z-10 pointer-events-none",
                "flex items-center gap-2 leading-none",
                position
            )}
            style={{
                top: 16,
                backgroundColor: type === 'after'
                    ? 'rgb(52 199 89 / 0.9)'
                    : 'rgb(0 0 0 / 0.5)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: 'white',
                boxShadow: type === 'after'
                    ? '0 2px 8px rgb(52 199 89 / 0.4)'
                    : '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
        >
            <span
                className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    type === 'after' ? 'bg-white' : 'bg-white/60'
                )}
            />
            {type === 'before' ? 'Before' : 'After'}
        </div>
    );

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-full overflow-hidden select-none rounded-2xl",
                isDragging ? "cursor-ew-resize" : "cursor-default",
                className
            )}
            style={{
                backgroundColor: 'var(--fill-tertiary)',
                // Prevent ALL touch gestures on this container
                touchAction: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
            }}
        >
            {/* After Image (Background - Right Side) */}
            <img
                src={after}
                alt="After"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                draggable={false}
            />

            {/* After Label - Fixed position */}
            <Label type="after" position="right-4" />

            {/* Before Image (Foreground - Clipped - Left Side) */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={before}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-contain"
                    draggable={false}
                />

                {/* Before Label - Fixed position */}
                <Label type="before" position="left-4" />
            </div>

            {/* Gradient Overlays for Depth */}
            <div
                className="absolute inset-y-0 w-24 pointer-events-none z-20"
                style={{
                    left: `calc(${sliderPosition}% - 96px)`,
                    background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))'
                }}
            />
            <div
                className="absolute inset-y-0 w-24 pointer-events-none z-20"
                style={{
                    left: `${sliderPosition}%`,
                    background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.1))'
                }}
            />

            {/* Active Drag Area - Full surface for easy mobile interaction */}
            <div
                ref={dragAreaRef}
                className="absolute inset-0 cursor-ew-resize z-30"
                style={{ touchAction: 'none' }}
                onMouseDown={handleMouseDown}
            // Touch events are attached via useEffect with passive: false
            />

            {/* Divider Line */}
            <div
                className="absolute top-0 bottom-0 pointer-events-none z-40"
                style={{
                    left: `${sliderPosition}%`,
                    transform: 'translateX(-50%)',
                    width: 2,
                    background: 'white',
                    boxShadow: '0 0 16px rgba(0,0,0,0.3)'
                }}
            >
                {/* Handle */}
                <motion.div
                    className="absolute left-1/2 top-1/2 w-11 h-11 rounded-full bg-white flex items-center justify-center z-50 pointer-events-none"
                    style={{
                        x: "-50%",
                        y: "-50%",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    animate={{
                        x: "-50%",
                        y: "-50%",
                        scale: isDragging ? 1.15 : 1,
                        boxShadow: isDragging
                            ? '0 0 0 4px rgba(0, 122, 255, 0.4), 0 4px 20px rgba(0,0,0,0.35)'
                            : [
                                '0 2px 12px rgba(0,0,0,0.25)',
                                '0 0 0 6px rgba(255,255,255,0.25), 0 2px 12px rgba(0,0,0,0.25)',
                                '0 2px 12px rgba(0,0,0,0.25)'
                            ]
                    }}
                    transition={{
                        scale: { type: "spring", stiffness: 400, damping: 25 },
                        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <div className="flex items-center justify-center -space-x-[1px]">
                        <ChevronLeft
                            className="w-5 h-5"
                            style={{ color: 'var(--accent)' }}
                            strokeWidth={2.5}
                        />
                        <ChevronRight
                            className="w-5 h-5"
                            style={{ color: 'var(--accent)' }}
                            strokeWidth={2.5}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Drag Hint */}
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 0.9, y: 0 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 rounded-full text-[12px] font-medium text-white/90 z-50 pointer-events-none flex items-center gap-2"
                        style={{
                            backgroundColor: 'rgb(0 0 0 / 0.4)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)'
                        }}
                    >
                        <ChevronLeft className="w-3.5 h-3.5 opacity-60" strokeWidth={2.5} />
                        <span className="leading-none">Drag to compare</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" strokeWidth={2.5} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BeforeAfterSlider;


