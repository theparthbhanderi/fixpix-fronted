import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FocusExitHint - Bottom Center Hint in Focus Mode
 * From EDITOR_CANVAS_SPEC.md Section 2.5
 * 
 * Shows "Press F or Escape to exit" with fadeInOut animation
 */
const FocusExitHint = memo(({ isVisible }) => {
    const [showHint, setShowHint] = useState(false);

    // Show hint briefly when entering focus mode
    useEffect(() => {
        if (isVisible) {
            setShowHint(true);
            const timer = setTimeout(() => setShowHint(false), 3000);
            return () => clearTimeout(timer);
        } else {
            setShowHint(false);
        }
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && showHint && (
                <motion.div
                    className="focus-exit-hint fixed bottom-6 left-1/2 z-50"
                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -10, x: '-50%' }}
                    transition={{ duration: 0.3 }}
                    style={{
                        padding: '8px 16px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderRadius: 'var(--radius-xl)',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    Press <kbd className="px-1.5 py-0.5 mx-1 bg-white/10 rounded text-white font-medium">F</kbd>
                    or <kbd className="px-1.5 py-0.5 mx-1 bg-white/10 rounded text-white font-medium">Esc</kbd>
                    to exit
                </motion.div>
            )}
        </AnimatePresence>
    );
});

FocusExitHint.displayName = 'FocusExitHint';

export default FocusExitHint;
