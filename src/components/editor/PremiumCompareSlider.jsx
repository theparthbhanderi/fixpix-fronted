import React, { useState, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * PremiumCompareSlider - Split Slider Compare Mode
 * From EDITOR_CANVAS_SPEC.md Section 3.3
 * 
 * Features:
 * - Draggable split divider with handle
 * - Magnetic snap to center (within 5%)
 * - Before/After labels on drag
 * - Haptic feedback on mobile
 * - clipPath for smooth clipping
 */
const PremiumCompareSlider = memo(({ before, after }) => {
    const [position, setPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    // Magnetic snap to center
    const handleRelease = useCallback(() => {
        setIsDragging(false);
        // Snap to center if within 5%
        if (Math.abs(position - 50) < 5) {
            setPosition(50);
            // Haptic feedback on mobile
            if ('vibrate' in navigator) navigator.vibrate(10);
        }
    }, [position]);

    // Smooth position tracking
    const handleMove = useCallback((clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        setPosition(Math.max(2, Math.min(98, x)));
    }, []);

    // Mouse handlers
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            handleMove(e.clientX);
        }
    }, [isDragging, handleMove]);

    const handleMouseUp = useCallback(() => {
        handleRelease();
    }, [handleRelease]);

    // Touch handlers
    const handleTouchStart = useCallback((e) => {
        setIsDragging(true);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (isDragging && e.touches[0]) {
            handleMove(e.touches[0].clientX);
        }
    }, [isDragging, handleMove]);

    const handleTouchEnd = useCallback(() => {
        handleRelease();
    }, [handleRelease]);

    // Global mouse events
    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    return (
        <div
            ref={containerRef}
            className="compare-slider relative w-full h-full overflow-hidden cursor-ew-resize touch-none select-none"
        >
            {/* After (background) */}
            <img
                src={after}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                alt="After"
                draggable={false}
            />

            {/* Before (clipped) */}
            <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
                <img
                    src={before}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    alt="Before"
                    draggable={false}
                />
            </div>

            {/* Labels - Show on drag */}
            <AnimatePresence>
                {isDragging && (
                    <>
                        <motion.span
                            className="compare-label absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-xl rounded-2xl text-[11px] font-semibold uppercase tracking-wide text-white z-10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            Before
                        </motion.span>
                        <motion.span
                            className="compare-label absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-xl rounded-2xl text-[11px] font-semibold uppercase tracking-wide text-white z-10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            After
                        </motion.span>
                    </>
                )}
            </AnimatePresence>

            {/* Divider Line */}
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-white z-20"
                style={{
                    left: `${position}%`,
                    transform: 'translateX(-50%)',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
                }}
            />

            {/* Handle */}
            <motion.div
                className="compare-handle absolute top-1/2 w-11 h-11 flex items-center justify-center gap-[-2px] bg-white rounded-full cursor-grab active:cursor-grabbing z-30"
                style={{
                    left: `${position}%`,
                    transform: 'translate(-50%, -50%)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                animate={{
                    scale: isDragging ? 1.15 : 1,
                    boxShadow: isDragging
                        ? '0 0 0 4px rgba(99, 102, 241, 0.3), 0 8px 24px rgba(0,0,0,0.3)'
                        : '0 4px 12px rgba(0,0,0,0.2)'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <ChevronLeft size={14} className="text-[var(--accent-primary)]" strokeWidth={2.5} />
                <ChevronRight size={14} className="text-[var(--accent-primary)]" strokeWidth={2.5} />
            </motion.div>
        </div>
    );
});

PremiumCompareSlider.displayName = 'PremiumCompareSlider';

export default PremiumCompareSlider;
