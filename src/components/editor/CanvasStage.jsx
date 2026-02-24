import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CanvasStage - Layer 1: Premium Canvas Container
 *
 * Clean, always-dark (#1A1A1A) container.
 * No glow ring, no breathing animation, no ambient backdrop.
 * Subtle inner shadow only. Processing overlay with spinner.
 */
const CanvasStage = ({
    children,
    isProcessing = false,
    hasImage = false,
    isFocusMode = false
}) => {
    return (
        <div className="canvas-stage relative flex items-center justify-center w-full h-full">
            {/* Main Canvas Container — 22px radius, subtle inner shadow */}
            <motion.div
                className="canvas-container relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 'var(--canvas-radius)',
                    background: 'var(--canvas-bg)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    boxShadow: 'var(--shadow-canvas)',
                }}
            >
                {children}

                {/* Processing Overlay */}
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            className="processing-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default CanvasStage;
