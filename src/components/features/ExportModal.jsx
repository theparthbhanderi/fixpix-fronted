import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, FileImage, Sliders } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
import { ImageContext } from '../../context/ImageContext';
import { apiEndpoints } from '../../lib/api';

const SettingsGroup = ({ label, children }) => (
    <div className="space-y-3">
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{label}</h4>
        {children}
    </div>
);

const ExportModal = ({ isOpen, onClose }) => {
    const { currentProject } = useContext(ImageContext);
    const [format, setFormat] = useState('png'); // png, jpg, webp
    const [quality, setQuality] = useState(90);

    const handleDownload = () => {
        if (!currentProject?.id) return;

        // Construct query URL
        const baseUrl = apiEndpoints.downloadImage(currentProject.id);
        const params = new URLSearchParams({
            format,
            quality: quality.toString()
        });

        window.open(`${baseUrl}?${params.toString()}`, '_blank');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-md bg-surface border border-separator/20 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-separator/20 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Download className="w-5 h-5 text-primary" />
                                Export Image
                            </h3>
                            <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            <SettingsGroup label="Format">
                                <div className="grid grid-cols-3 gap-3">
                                    {['png', 'jpg', 'webp'].map((fmt) => (
                                        <button
                                            key={fmt}
                                            onClick={() => setFormat(fmt)}
                                            className={cn(
                                                "py-2 rounded-lg border text-sm font-bold uppercase transition-all",
                                                format === fmt
                                                    ? "bg-primary text-white border-primary shadow-neon"
                                                    : "bg-white/5 text-text-secondary border-white/5 hover:bg-white/10"
                                            )}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                            </SettingsGroup>

                            <SettingsGroup label={`Quality: ${quality}%`}>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-xs text-text-secondary mt-1">
                                    <span>Small File</span>
                                    <span>Best Quality</span>
                                </div>
                            </SettingsGroup>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <p className="text-xs text-blue-200">
                                    <strong>Pro Tip:</strong> Use <strong>WebP</strong> for high quality with smaller file sizes.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-separator/20 bg-fill/5 flex gap-3">
                            <Button variant="ghost" onClick={onClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleDownload} className="flex-1 shadow-neon">
                                Download
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ExportModal;
