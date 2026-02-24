import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FlashCompare - Flash Toggle Compare Mode
 * From EDITOR_CANVAS_SPEC.md Section 3.6
 * 
 * Features:
 * - Tap/click to toggle between before/after
 * - Crossfade animation (150ms)
 * - Current state label
 * - "Tap to toggle" hint
 */
const FlashCompare = memo(({ before, after }) => {
    const [showAfter, setShowAfter] = useState(true);

    return (
        <div
            className="flash-compare relative w-full h-full cursor-pointer select-none"
            onClick={() => setShowAfter(!showAfter)}
        >
            <AnimatePresence mode="wait">
                <motion.img
                    key={showAfter ? 'after' : 'before'}
                    src={showAfter ? after : before}
                    alt={showAfter ? 'After' : 'Before'}
                    className="absolute inset-0 w-full h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    draggable={false}
                />
            </AnimatePresence>

            {/* Current State Label */}
            <motion.span
                className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/50 backdrop-blur-xl rounded-2xl text-[11px] font-semibold uppercase tracking-wide text-white z-10"
                key={showAfter ? 'after-label' : 'before-label'}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
            >
                {showAfter ? 'After' : 'Before'}
            </motion.span>

            {/* Tap to Toggle Hint */}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/40 backdrop-blur-xl rounded-2xl text-[10px] font-medium text-white/60 z-10">
                Tap to toggle
            </span>
        </div>
    );
});

FlashCompare.displayName = 'FlashCompare';

export default FlashCompare;
