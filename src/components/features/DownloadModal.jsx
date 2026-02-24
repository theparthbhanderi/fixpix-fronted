import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Image, FileImage, Check } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

/**
 * DownloadModal - Format and quality selection for image download
 */
const DownloadModal = ({ isOpen, onClose, onDownload, imageSrc }) => {
    const [format, setFormat] = useState('png');
    const [quality, setQuality] = useState(90);
    const [isDownloading, setIsDownloading] = useState(false);

    const formats = [
        { id: 'png', label: 'PNG', desc: 'Lossless, larger file', icon: FileImage },
        { id: 'jpg', label: 'JPG', desc: 'Compressed, smaller file', icon: Image },
        { id: 'webp', label: 'WebP', desc: 'Modern, best compression', icon: FileImage },
    ];

    const qualityPresets = [
        { value: 60, label: 'Low', desc: 'Smallest size' },
        { value: 80, label: 'Medium', desc: 'Balanced' },
        { value: 90, label: 'High', desc: 'Recommended' },
        { value: 100, label: 'Max', desc: 'Best quality' },
    ];

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await onDownload({ format, quality });
            onClose();
        } catch (err) {
            console.error('Download failed:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
                    >
                        <div
                            className="rounded-2xl overflow-hidden shadow-2xl"
                            style={{ backgroundColor: 'var(--surface)' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-separator/20">
                                <div className="flex items-center gap-2">
                                    <Download className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-text-main">
                                        Save Image
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-fill/10 transition-colors"
                                    aria-label="Close download options"
                                >
                                    <X className="w-5 h-5 text-text-secondary" />
                                </button>
                            </div>

                            <div className="p-5 space-y-5">
                                {/* Image Preview */}
                                {imageSrc && (
                                    <div className="aspect-video rounded-xl overflow-hidden bg-fill/10">
                                        <img
                                            src={imageSrc}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}

                                {/* Format Selection */}
                                <div>
                                    <label className="text-sm font-medium text-text-main mb-3 block">
                                        Format
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {formats.map((f) => (
                                            <button
                                                key={f.id}
                                                onClick={() => setFormat(f.id)}
                                                className={cn(
                                                    "p-3 rounded-xl border text-center transition-all",
                                                    format === f.id
                                                        ? "bg-primary/10 border-primary text-primary"
                                                        : "bg-fill/5 border-separator/20 text-text-secondary hover:border-separator/40"
                                                )}
                                            >
                                                <f.icon className="w-5 h-5 mx-auto mb-1" />
                                                <span className="text-sm font-medium block">{f.label}</span>
                                                <span className="text-[10px] opacity-70">{f.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quality Selection (only for jpg/webp) */}
                                {format !== 'png' && (
                                    <div>
                                        <label className="text-sm font-medium text-text-main mb-3 block">
                                            Quality
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {qualityPresets.map((q) => (
                                                <button
                                                    key={q.value}
                                                    onClick={() => setQuality(q.value)}
                                                    className={cn(
                                                        "p-2 rounded-lg border text-center transition-all",
                                                        quality === q.value
                                                            ? "bg-primary/10 border-primary text-primary"
                                                            : "bg-fill/5 border-separator/20 text-text-secondary hover:border-separator/40"
                                                    )}
                                                >
                                                    <span className="text-xs font-medium block">{q.label}</span>
                                                    <span className="text-[10px] opacity-60">{q.value}%</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 p-4 border-t border-separator/20">
                                <Button variant="gray" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="filled"
                                    onClick={handleDownload}
                                    loading={isDownloading}
                                    loadingText="Saving..."
                                    icon={Download}
                                >
                                    Download {format.toUpperCase()}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DownloadModal;
