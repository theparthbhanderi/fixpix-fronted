import React, { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * CanvasGlow - Breathing Glow Ring Around Canvas
 * From EDITOR_CANVAS_SPEC.md Section 1.5
 * 
 * Features:
 * - 40px blur, accent color at 5-8% opacity
 * - Breathing animation: 4s cycle (idle), 1.5s (processing)
 * - Scales subtly with opacity changes
 */

// Glow animation variants
const glowVariants = {
    idle: {
        opacity: [0.4, 0.6, 0.4],
        scale: [1, 1.01, 1],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    },
    processing: {
        opacity: [0.5, 0.8, 0.5],
        scale: [1, 1.02, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    },
    hover: {
        opacity: 0.7,
        scale: 1.02,
        transition: { duration: 0.3 }
    }
};

const CanvasGlow = memo(({ isProcessing = false, isHovered = false }) => (
    <motion.div
        className="canvas-glow absolute inset-[-40px] pointer-events-none -z-5 rounded-[40px]"
        variants={glowVariants}
        animate={isProcessing ? 'processing' : isHovered ? 'hover' : 'idle'}
        style={{
            background: `radial-gradient(
                ellipse at center,
                rgba(99, 102, 241, 0.08) 0%,
                transparent 70%
            )`,
            filter: 'blur(40px)'
        }}
    />
));

CanvasGlow.displayName = 'CanvasGlow';

export default CanvasGlow;
