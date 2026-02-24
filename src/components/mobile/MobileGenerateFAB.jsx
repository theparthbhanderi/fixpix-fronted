import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';

/**
 * MobileGenerateFAB - Inline Generate button for mobile header
 * 
 * Renders INSIDE the header area as a light text-style button.
 * Only visible when features are queued — feels native, not heavy.
 */
const MobileGenerateFAB = memo(() => {
    const { pendingQueue, commitCommands } = useCommand();
    const { isProcessing, isGenerating, originalImage } = useImage();

    const stepCount = pendingQueue ? Object.keys(pendingQueue).length : 0;
    const isBusy = isProcessing || isGenerating;
    const hasImage = !!originalImage;
    const showButton = stepCount > 0 || isBusy;

    const state = useMemo(() => {
        if (isBusy) return 'processing';
        if (stepCount > 0 && hasImage) return 'ready';
        if (stepCount > 0 && !hasImage) return 'no-image';
        return 'idle';
    }, [stepCount, isBusy, hasImage]);

    const handleGenerate = async () => {
        if (state !== 'ready' || isBusy) return;
        if (commitCommands) await commitCommands();
    };

    if (!showButton) return null;

    return (
        <AnimatePresence>
            <motion.button
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
                onClick={handleGenerate}
                disabled={state !== 'ready'}
                whileTap={state === 'ready' ? { scale: 0.96 } : {}}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '0',
                    border: 'none',
                    background: 'none',
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: state === 'ready' ? 'pointer' : 'default',
                    color: state === 'ready'
                        ? 'var(--accent, #007AFF)'
                        : state === 'no-image'
                            ? '#FF9500'
                            : 'var(--text-tertiary, rgba(0,0,0,0.3))',
                    opacity: state === 'processing' ? 0.5 : 1,
                    transition: 'color 200ms ease, opacity 200ms ease',
                    whiteSpace: 'nowrap',
                }}
            >
                {state === 'processing' ? (
                    <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                ) : (
                    <Sparkles size={16} strokeWidth={2} />
                )}
                <span>
                    {state === 'processing' && 'Processing...'}
                    {state === 'ready' && `Generate`}
                    {state === 'no-image' && 'No Image'}
                </span>
                {state === 'ready' && stepCount > 0 && (
                    <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        minWidth: 18,
                        height: 18,
                        lineHeight: '18px',
                        textAlign: 'center',
                        borderRadius: 9,
                        background: 'var(--accent, #007AFF)',
                        color: '#fff',
                    }}>
                        {stepCount}
                    </span>
                )}
            </motion.button>
        </AnimatePresence>
    );
});

MobileGenerateFAB.displayName = 'MobileGenerateFAB';

export default MobileGenerateFAB;
