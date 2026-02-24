import React, { memo, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MiniMap - Top Right Viewport Navigator
 * From EDITOR_CANVAS_SPEC.md Section 5.2
 * 
 * Features:
 * - Image thumbnail
 * - Viewport frame indicator
 * - Drag to pan
 * - Show when zoom > 1
 * - Fade after 2s idle
 */
const MiniMap = memo(({
    imageUrl,
    zoom = 1,
    pan = { x: 0, y: 0 },
    onPanChange,
    containerDimensions = { width: 800, height: 600 }
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const isVisible = zoom > 1;

    // Calculate viewport rectangle size and position
    const viewportStyle = useMemo(() => {
        const scale = 1 / zoom;
        const centerX = 50 - (pan.x / containerDimensions.width) * 100;
        const centerY = 50 - (pan.y / containerDimensions.height) * 100;

        return {
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            left: `${centerX}%`,
            top: `${centerY}%`,
            transform: 'translate(-50%, -50%)'
        };
    }, [zoom, pan, containerDimensions]);

    // Handle drag to pan
    const handleDrag = useCallback((e, info) => {
        if (!onPanChange) return;

        // Convert minimap position to pan offset
        const deltaX = info?.delta?.x || 0;
        const deltaY = info?.delta?.y || 0;

        onPanChange({
            x: pan.x - deltaX * zoom * 5,
            y: pan.y - deltaY * zoom * 5
        });
    }, [pan, zoom, onPanChange]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="mini-map fixed top-24 right-6 z-30 w-[120px] bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: isDragging ? 1 : 0.8, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        boxShadow: 'var(--depth-1)'
                    }}
                >
                    {/* Thumbnail */}
                    <img
                        src={imageUrl}
                        alt=""
                        className="w-full h-auto block"
                        draggable={false}
                    />

                    {/* Viewport Frame */}
                    <motion.div
                        className="absolute border-2 border-[var(--accent-primary)] bg-[rgba(99,102,241,0.1)] cursor-move"
                        style={viewportStyle}
                        drag
                        dragMomentum={false}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={() => setIsDragging(false)}
                        onDrag={handleDrag}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
});

MiniMap.displayName = 'MiniMap';

export default MiniMap;
