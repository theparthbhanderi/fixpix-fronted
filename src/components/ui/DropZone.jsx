/**
 * DropZone Component
 * 
 * A reusable drag-and-drop zone with visual feedback.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/utils';
import { validateImageFile } from '../../utils/imageCompression';
import { useToast } from './Toast';

const DropZone = ({
    children,
    onDrop,
    className,
    dropMessage = "Drop image here",
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const toast = useToast();

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);

        if (files.length === 0) return;

        const file = files[0];
        const validation = validateImageFile(file);

        if (!validation.valid) {
            toast.error(validation.error);
            return;
        }

        onDrop?.(file, files);
        toast.success('Image dropped! Processing...');
    }, [onDrop, toast]);

    return (
        <div
            className={cn("relative", className)}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {children}

            {/* Drag Overlay - iOS Style */}
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary rounded-ios-xl flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-surface rounded-ios-xl px-8 py-6 shadow-ios-lg flex flex-col items-center gap-3">
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <Upload className="w-12 h-12 text-primary" />
                            </motion.div>
                            <p className="text-ios-headline text-text-main">{dropMessage}</p>
                            <p className="text-ios-footnote text-text-secondary">
                                Supports: JPG, PNG, WebP, GIF
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DropZone;
