import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommand } from '../../context/CommandContext';

/**
 * RestorationOverlay
 * Visualizes AI detections on top of the image (Faces, Scratches).
 * Uses normalized coordinates (0-1) to be responsive.
 */
const RestorationOverlay = () => {
    const { aiInsights, expandedZone } = useCommand();
    const { findings, analyzed, facesDetected } = aiInsights;

    // Only show if analyzed and in Restore zone
    if (!analyzed || expandedZone !== 'restore') return null;

    // Mock coordinates for demonstration
    // In real app, these come from backend analysis
    const mockFaces = Array.from({ length: facesDetected }).map((_, i) => ({
        id: i,
        x: 0.3 + (i * 0.2), // Spread horizontally
        y: 0.3 + (i * 0.1),
        width: 0.15,
        height: 0.15
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <AnimatePresence>
                {/* Face Markers */}
                {mockFaces.map((face, i) => (
                    <motion.div
                        key={`face-${face.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.5 + (i * 0.2), duration: 0.5, ease: "easeOut" }}
                        className="absolute border-2 border-primary/40 shadow-sm rounded-2xl backdrop-blur-[1px]"
                        style={{
                            left: `${face.x * 100}%`,
                            top: `${face.y * 100}%`,
                            width: `${face.width * 100}%`,
                            height: `${face.height * 100}%`
                        }}
                    >
                        {/* Simplified Label */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md shadow-sm text-text-main text-[10px] font-bold px-2 py-1 rounded-full border border-separator/10 whitespace-nowrap opacity-0 animate-fade-in" style={{ animationDelay: `${0.8 + (i * 0.2)}s`, animationFillMode: 'forwards' }}>
                            Face Detected
                        </div>
                    </motion.div>
                ))}

                {/* Scratch Heatmap (Abstract mock) */}
                {aiInsights.hasDamage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute top-[20%] right-[20%] w-[15%] h-[20%] bg-red-500/20 blur-xl rounded-full mix-blend-screen"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default RestorationOverlay;
