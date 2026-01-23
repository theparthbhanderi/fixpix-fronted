import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const SmartTooltip = ({ children, title, description, mediaSrc, mediaType = 'image' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Position tooltip to the left of the trigger, centered vertically
            setPosition({
                top: rect.top + rect.height / 2 - 100, // Center vertically (roughly)
                left: rect.left - 280  // 264px width + 16px gap
            });
        }
    }, [isVisible]);

    const tooltipContent = isVisible && (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[9999] w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden"
            style={{
                top: Math.max(20, position.top),
                left: Math.max(20, position.left)
            }}
        >
            {/* Media Preview Area */}
            <div className="h-28 bg-surface-highlight flex items-center justify-center overflow-hidden relative">
                {mediaSrc ? (
                    mediaType === 'video' ? (
                        <video src={mediaSrc} autoPlay loop muted className="w-full h-full object-cover" />
                    ) : (
                        <img src={mediaSrc} alt={title} className="w-full h-full object-cover" />
                    )
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
                        <span className="text-3xl">✨</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            </div>

            {/* Text Content */}
            <div className="p-3 relative -mt-4">
                <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {description}
                </p>
            </div>
        </motion.div>
    );

    return (
        <div
            ref={triggerRef}
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {typeof document !== 'undefined' && createPortal(
                    tooltipContent,
                    document.body
                )}
            </AnimatePresence>
        </div>
    );
};

export default SmartTooltip;
