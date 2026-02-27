import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, FileImage, Image, Sparkles, Check, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ImageContext } from '../../context/ImageContext';
import { apiEndpoints } from '../../lib/api';

/* ═══════════════════════════════════════════════════════════════
   EXPORT MODAL — Premium Download Popup
   Theme-aware, responsive (desktop + mobile), dark + light mode
   ═══════════════════════════════════════════════════════════════ */

const formatOptions = [
    {
        id: 'png',
        label: 'PNG',
        desc: 'Lossless quality',
        icon: FileImage,
        badge: null,
    },
    {
        id: 'jpg',
        label: 'JPG',
        desc: 'Smaller size',
        icon: Image,
        badge: null,
    },
    {
        id: 'webp',
        label: 'WebP',
        desc: 'Best of both',
        icon: Sparkles,
        badge: 'Recommended',
    },
];

const DEFAULT_QUALITY = 90;

const ExportModal = ({ isOpen = true, onClose }) => {
    const { currentProject, processedImage, originalImage } = useContext(ImageContext);
    const [format, setFormat] = useState('png');
    const quality = DEFAULT_QUALITY;
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);
    const modalRef = useRef(null);

    const imageSource = processedImage || originalImage;
    const hasImage = !!imageSource;

    // Reset download success on open
    useEffect(() => {
        if (isOpen) setDownloadSuccess(false);
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const handleDownload = async () => {
        if (currentProject?.id) {
            const baseUrl = apiEndpoints.downloadImage(currentProject.id);
            const params = new URLSearchParams({ format, quality: quality.toString() });
            window.open(`${baseUrl}?${params.toString()}`, '_blank');
            setDownloadSuccess(true);
            setTimeout(() => onClose(), 800);
            return;
        }

        if (!imageSource) return;

        setIsDownloading(true);
        try {
            const img = new window.Image();
            img.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageSource;
            });

            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const mimeType = format === 'jpg' ? 'image/jpeg'
                : format === 'webp' ? 'image/webp'
                    : 'image/png';
            const qualityValue = format === 'png' ? undefined : quality / 100;

            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, mimeType, qualityValue);
            });

            if (!blob) throw new Error('Failed to create image blob');

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fixpix-export.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setDownloadSuccess(true);
            setTimeout(() => onClose(), 800);
        } catch (error) {
            console.error('Download failed:', error);
            try {
                const a = document.createElement('a');
                a.href = imageSource;
                a.download = `fixpix-export.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                onClose();
            } catch (fallbackError) {
                console.error('Fallback download also failed:', fallbackError);
            }
        } finally {
            setIsDownloading(false);
        }
    };



    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                    />

                    {/* Modal */}
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="export-modal-container relative z-10 w-full sm:max-w-[420px] mx-0 sm:mx-4"
                        style={{
                            borderRadius: 'var(--radius-2xl)',
                            background: 'var(--surface)',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: 'var(--depth-3)',
                            overflow: 'hidden',
                            maxHeight: '85dvh',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* ─── Header ─── */}
                        <div
                            className="export-modal-header"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '18px 20px',
                                borderBottom: '1px solid var(--border-subtle)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--accent-soft)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Download size={18} style={{ color: 'var(--accent)' }} />
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: 16,
                                        fontWeight: 650,
                                        color: 'var(--text-primary)',
                                        letterSpacing: '-0.3px',
                                        lineHeight: 1.2,
                                    }}>
                                        Export Image
                                    </h3>
                                    <p style={{
                                        fontSize: 12,
                                        color: 'var(--text-tertiary)',
                                        marginTop: 1,
                                    }}>
                                        Choose format & quality
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.05, backgroundColor: 'var(--fill-primary)' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 'var(--radius-full)',
                                    border: 'none',
                                    background: 'var(--fill-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    transition: 'background 150ms ease',
                                }}
                            >
                                <X size={16} />
                            </motion.button>
                        </div>

                        {/* ─── Body ─── */}
                        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
                            {/* Image Preview (compact) */}
                            {hasImage && (
                                <div
                                    style={{
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden',
                                        background: 'var(--fill-tertiary)',
                                        border: '1px solid var(--border-subtle)',
                                        marginBottom: 16,
                                        maxHeight: 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <img
                                        src={imageSource}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            maxHeight: 100,
                                            objectFit: 'contain',
                                        }}
                                    />
                                </div>
                            )}

                            {/* No image warning */}
                            {!hasImage && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '12px 14px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'rgba(255, 149, 0, 0.08)',
                                        border: '1px solid rgba(255, 149, 0, 0.15)',
                                        marginBottom: 20,
                                    }}
                                >
                                    <Info size={16} style={{ color: '#FF9500', flexShrink: 0 }} />
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                        <strong style={{ color: 'var(--text-primary)' }}>No image to export.</strong> Generate or upload an image first.
                                    </p>
                                </div>
                            )}

                            {/* ─── Format Selection ─── */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    display: 'block',
                                    marginBottom: 10,
                                }}>
                                    Format
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                    {formatOptions.map((f) => {
                                        const isActive = format === f.id;
                                        const Icon = f.icon;
                                        return (
                                            <motion.button
                                                key={f.id}
                                                onClick={() => setFormat(f.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="export-format-btn"
                                                style={{
                                                    position: 'relative',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    padding: '12px 6px 10px',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: isActive
                                                        ? '1.5px solid var(--accent)'
                                                        : '1px solid var(--border-subtle)',
                                                    background: isActive
                                                        ? 'var(--accent-soft)'
                                                        : 'var(--fill-tertiary)',
                                                    cursor: 'pointer',
                                                    transition: 'all 150ms ease',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {/* Active check indicator */}
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 6,
                                                            right: 6,
                                                            width: 16,
                                                            height: 16,
                                                            borderRadius: 'var(--radius-full)',
                                                            background: 'var(--accent)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Check size={10} color="#fff" strokeWidth={3} />
                                                    </motion.div>
                                                )}

                                                {/* Badge */}
                                                {f.badge && (
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: 6,
                                                        left: 6,
                                                        fontSize: 8,
                                                        fontWeight: 700,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        padding: '2px 5px',
                                                        borderRadius: 4,
                                                        background: isActive ? 'var(--accent)' : 'var(--fill-primary)',
                                                        color: isActive ? '#fff' : 'var(--text-tertiary)',
                                                    }}>
                                                        ★
                                                    </span>
                                                )}

                                                <Icon
                                                    size={22}
                                                    style={{
                                                        color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                                                        transition: 'color 150ms ease',
                                                    }}
                                                    strokeWidth={1.75}
                                                />
                                                <span style={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                                                    transition: 'color 150ms ease',
                                                }}>
                                                    {f.label}
                                                </span>
                                                <span style={{
                                                    fontSize: 11,
                                                    color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                                                    opacity: isActive ? 0.8 : 0.7,
                                                    transition: 'color 150ms ease',
                                                }}>
                                                    {f.desc}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>



                            {/* Pro Tip */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 8,
                                    padding: '10px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--accent-soft)',
                                    border: '1px solid rgba(0, 122, 255, 0.12)',
                                }}
                            >
                                <Info size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    <strong style={{ color: 'var(--accent)' }}>Pro Tip:</strong> Use <strong style={{ color: 'var(--text-primary)' }}>WebP</strong> for high quality with smaller file sizes.
                                </p>
                            </div>
                        </div>

                        {/* ─── Footer ─── */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '16px 20px',
                                borderTop: '1px solid var(--border-subtle)',
                                background: 'var(--fill-tertiary)',
                            }}
                        >
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.01, backgroundColor: 'var(--fill-primary)' }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    flex: 1,
                                    height: 44,
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-subtle)',
                                    background: 'var(--fill-secondary)',
                                    color: 'var(--text-primary)',
                                    fontSize: 15,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 150ms ease',
                                }}
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                onClick={handleDownload}
                                disabled={!hasImage || isDownloading}
                                whileHover={hasImage ? { scale: 1.01, boxShadow: '0 6px 24px rgba(0, 122, 255, 0.35)' } : {}}
                                whileTap={hasImage ? { scale: 0.98 } : {}}
                                style={{
                                    flex: 1.3,
                                    height: 44,
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    background: downloadSuccess
                                        ? 'var(--success)'
                                        : 'var(--accent)',
                                    color: '#fff',
                                    fontSize: 15,
                                    fontWeight: 600,
                                    cursor: hasImage && !isDownloading ? 'pointer' : 'not-allowed',
                                    opacity: hasImage ? 1 : 0.4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    transition: 'all 200ms ease',
                                    boxShadow: hasImage ? '0 4px 16px rgba(0, 122, 255, 0.25)' : 'none',
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {downloadSuccess ? (
                                        <motion.span
                                            key="success"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                                        >
                                            <Check size={18} strokeWidth={2.5} />
                                            Saved!
                                        </motion.span>
                                    ) : isDownloading ? (
                                        <motion.span
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                                        >
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    border: '2px solid rgba(255,255,255,0.3)',
                                                    borderTopColor: '#fff',
                                                    borderRadius: '50%',
                                                }}
                                            />
                                            Saving...
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="download"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                                        >
                                            <Download size={16} strokeWidth={2} />
                                            Download {format.toUpperCase()}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Slider + Mobile styles */}
                    <style>{`


                        /* ── Mobile: bottom sheet style ── */
                        @media (max-width: 639px) {
                            .export-modal-container {
                                border-bottom-left-radius: 0 !important;
                                border-bottom-right-radius: 0 !important;
                                border-bottom: none !important;
                                max-height: 85dvh !important;
                            }
                        }
                    `}</style>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ExportModal;
