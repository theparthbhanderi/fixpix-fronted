import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Download } from 'lucide-react';
import { useImage } from '../../context/ImageContext';
import { cn } from '../../lib/utils';
import MobileGenerateFAB from './MobileGenerateFAB';

/**
 * iOS Pro Mobile Header
 * 
 * Premium refinements:
 * - Thinner, more minimal height
 * - Subtle blur material
 * - Minimal back button (iOS native style)
 * - Generate button inline (right side, only when features queued)
 * - Light download icon
 */
const MobileEditorHeader = ({
    title = 'Restoration',
    onBack,
    onExport,
    className
}) => {
    const { processedImage, isProcessing } = useImage();

    const showDownload = !!processedImage && !isProcessing;

    return (
        <motion.header
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50",
                "ios-pro-header",
                className
            )}
        >
            {/* Safe area spacer for notch */}
            <div className="h-safe-top" />

            {/* Header content */}
            <div className="flex items-center justify-between h-11 px-4">
                {/* Left: Minimal iOS Back button */}
                <motion.button
                    onClick={onBack}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 -ml-1 text-[var(--accent)] active:opacity-60 transition-opacity"
                >
                    <ChevronLeft size={18} strokeWidth={2} />
                    <span className="text-[15px] font-normal">Back</span>
                </motion.button>

                {/* Center: Title */}
                <h1 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold text-[var(--text-primary)] tracking-[0]">
                    {title}
                </h1>

                {/* Right: Generate + Download */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <MobileGenerateFAB />
                    <AnimatePresence>
                        {showDownload && onExport && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.14, ease: 'easeOut' }}
                                onClick={onExport}
                                whileTap={{ scale: 0.97 }}
                                className="p-1.5 -mr-1.5 active:opacity-60 transition-opacity"
                                aria-label="Export"
                            >
                                <Download
                                    size={20}
                                    strokeWidth={2}
                                    className="text-[var(--accent)]"
                                />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
};

export default MobileEditorHeader;

