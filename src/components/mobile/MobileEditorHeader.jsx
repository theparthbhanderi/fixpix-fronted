import { motion } from 'framer-motion';
import { ChevronLeft, Download, FilePlus2 } from 'lucide-react';
import { useImage } from '../../context/ImageContext';
import MobileGenerateFAB from './MobileGenerateFAB';

/**
 * Mobile Header — Premium Frosted Glass
 * Height: 44px + safe area. Frosted glass with gradient accent.
 */
const MobileEditorHeader = ({
    title = 'FixPix',
    onBack,
    onExport,
    onReset,
}) => {
    const { processedImage, originalImage, isProcessing } = useImage();
    const showDownload = (!!processedImage || !!originalImage) && !isProcessing;

    return (
        <header
            className="mobile-premium-header"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
            }}
        >
            {/* Safe area spacer */}
            <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

            {/* Header bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 48,
                padding: '0 14px',
            }}>
                {/* Left: Back */}
                <motion.button
                    onClick={onBack}
                    whileTap={{ scale: 0.94 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: 'var(--accent, #007AFF)',
                        fontSize: 15,
                        fontWeight: 500,
                        padding: 0,
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    <ChevronLeft size={20} strokeWidth={2.25} />
                    <span>Back</span>
                </motion.button>

                {/* Center: Title */}
                <h1 style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                    letterSpacing: '-0.025em',
                    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent, #007AFF) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    {title}
                </h1>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MobileGenerateFAB />

                    {showDownload && onExport && (
                        <motion.button
                            onClick={onExport}
                            whileTap={{ scale: 0.92 }}
                            aria-label="Export"
                            className="header-action-btn"
                        >
                            <Download size={17} strokeWidth={2} />
                        </motion.button>
                    )}

                    {originalImage && onReset && (
                        <motion.button
                            onClick={onReset}
                            whileTap={{ scale: 0.92 }}
                            aria-label="New Project"
                            className="header-action-btn"
                        >
                            <FilePlus2 size={16} strokeWidth={2} />
                        </motion.button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default MobileEditorHeader;
