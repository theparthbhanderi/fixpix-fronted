import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ZoomFlashOverlay - Percentage Display on Zoom Change
 * From EDITOR_CANVAS_SPEC.md Section 4.3
 * 
 * Appears on canvas center during zoom changes
 */
const ZoomFlashOverlay = memo(({ percentage, isVisible }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                className="zoom-flash fixed top-1/2 left-1/2 z-50 px-8 py-4 bg-black/70 backdrop-blur-xl rounded-2xl"
                initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
                transition={{ duration: 0.2 }}
            >
                <span className="text-3xl font-bold text-white">
                    {percentage}%
                </span>
            </motion.div>
        )}
    </AnimatePresence>
));

ZoomFlashOverlay.displayName = 'ZoomFlashOverlay';

export default ZoomFlashOverlay;
