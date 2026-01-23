import React, { useContext, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Image as ImageIcon, Columns, LayoutGrid, Sparkles } from 'lucide-react';
import { ImageContext } from '../../context/ImageContext';
import Button from '../ui/Button';

const ComparisonExport = ({ isOpen, onClose }) => {
    const { originalImage, processedImage } = useContext(ImageContext);
    const canvasRef = useRef(null);
    const [layout, setLayout] = useState('side-by-side'); // 'side-by-side' | 'slider-preview'
    const [isGenerating, setIsGenerating] = useState(false);

    const generateComparison = async () => {
        if (!originalImage || !processedImage || !canvasRef.current) return;

        setIsGenerating(true);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Load images
        const loadImage = (src) => new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });

        try {
            const [beforeImg, afterImg] = await Promise.all([
                loadImage(originalImage),
                loadImage(processedImage)
            ]);

            const maxWidth = 1200;
            const maxHeight = 800;

            if (layout === 'side-by-side') {
                // Side by side layout
                const imgWidth = Math.min(beforeImg.width, maxWidth / 2);
                const imgHeight = (beforeImg.height / beforeImg.width) * imgWidth;

                canvas.width = imgWidth * 2 + 20; // 20px gap
                canvas.height = imgHeight + 80; // 80px for label

                // Background
                ctx.fillStyle = '#0a0a0a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw images
                ctx.drawImage(beforeImg, 0, 0, imgWidth, imgHeight);
                ctx.drawImage(afterImg, imgWidth + 20, 0, imgWidth, imgHeight);

                // Labels
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 24px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Before', imgWidth / 2, imgHeight + 40);
                ctx.fillText('After', imgWidth + 20 + imgWidth / 2, imgHeight + 40);

                // Branding
                ctx.fillStyle = '#888888';
                ctx.font = '14px Inter, sans-serif';
                ctx.fillText('Restored with FixPix ✨', canvas.width / 2, canvas.height - 10);
            }

            // Download
            const link = document.createElement('a');
            link.download = `fixpix-comparison-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

        } catch (error) {
            console.error('Error generating comparison:', error);
            alert('Could not generate comparison. Images may be from a different origin.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="glass-panel rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <Share2 className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-text-main">Export Comparison</h2>
                                    <p className="text-xs text-text-secondary">Share your restoration on social media</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5 text-text-secondary" />
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="bg-surface/50 rounded-2xl p-4 mb-6 border border-white/5">
                            <div className="flex gap-4 items-center justify-center">
                                <div className="relative">
                                    <img
                                        src={originalImage}
                                        alt="Before"
                                        className="w-40 h-28 object-cover rounded-lg border border-white/10"
                                    />
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">Before</span>
                                </div>
                                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                                <div className="relative">
                                    <img
                                        src={processedImage}
                                        alt="After"
                                        className="w-40 h-28 object-cover rounded-lg border border-primary/30 shadow-neon"
                                    />
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-primary/90 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">After</span>
                                </div>
                            </div>
                        </div>

                        {/* Layout Options */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-text-main mb-3">Layout Style</h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setLayout('side-by-side')}
                                    className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${layout === 'side-by-side'
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-white/10 text-text-secondary hover:border-white/20'
                                        }`}
                                >
                                    <Columns className="w-6 h-6" />
                                    <span className="text-xs font-medium">Side by Side</span>
                                </button>
                                <button
                                    disabled
                                    className="flex-1 p-4 rounded-xl border border-white/10 text-text-secondary opacity-50 cursor-not-allowed flex flex-col items-center gap-2"
                                >
                                    <LayoutGrid className="w-6 h-6" />
                                    <span className="text-xs font-medium">Slider (Coming Soon)</span>
                                </button>
                            </div>
                        </div>

                        {/* Hidden Canvas for generation */}
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Action Button */}
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full shadow-neon"
                            onClick={generateComparison}
                            disabled={!originalImage || !processedImage || isGenerating}
                        >
                            {isGenerating ? (
                                <>⏳ Generating...</>
                            ) : (
                                <><Download className="w-5 h-5 mr-2" /> Download Comparison Image</>
                            )}
                        </Button>

                        <p className="text-center text-xs text-text-secondary mt-4">
                            Perfect for Instagram, LinkedIn, and Twitter!
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ComparisonExport;
