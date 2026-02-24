import React, { memo, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { COMMAND_REGISTRY } from '../../data/CommandRegistry';

/**
 * GenerateButton — Apple-level micro-polish
 *
 * Height: 56px
 * Radius: 18px
 * Font: 16px semibold
 * Flat accent #007AFF (no gradient)
 * Inner highlight: inset 0 1px 0 rgba(255,255,255,0.25)
 * Hover: brightness(1.05)
 * Tap: scale(0.97)
 * Disabled: opacity 40%
 */

const TOOL_TIME_ESTIMATES = {
    faceRestoration: 4, removeScratches: 3, colorize: 5,
    upscaleX: 6, autoEnhance: 2, removeBackground: 3, default: 3
};

const calculateTotalTime = (queue) =>
    Object.keys(queue).reduce((sum, id) =>
        sum + (TOOL_TIME_ESTIMATES[id] || TOOL_TIME_ESTIMATES.default), 0);

const formatTime = (s) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    return s % 60 > 0 ? `${m}m ${s % 60}s` : `${m}m`;
};

const fadeProps = {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: { duration: 0.12 }
};

const GenerateButton = memo(() => {
    const { pendingQueue, commitCommands, processingState } = useCommand();
    const { isProcessing, isGenerating, originalImage } = useImage();
    const [showComplete, setShowComplete] = useState(false);

    const pendingCount = Object.keys(pendingQueue || {}).length;
    const totalTime = useMemo(() => calculateTotalTime(pendingQueue || {}), [pendingQueue]);

    const isBusy = isProcessing || isGenerating;
    const hasImage = !!originalImage;

    const state = useMemo(() => {
        if (showComplete) return 'complete';
        if (isBusy) return 'processing';
        if (pendingCount > 0 && hasImage) return 'ready';
        if (pendingCount > 0 && !hasImage) return 'no-image';
        return 'idle';
    }, [pendingCount, isBusy, showComplete, hasImage]);

    useEffect(() => {
        if (!isBusy && processingState?.completed?.length > 0) {
            setShowComplete(true);
            const t = setTimeout(() => setShowComplete(false), 2000);
            return () => clearTimeout(t);
        }
    }, [isBusy, processingState?.completed]);

    const handleClick = async () => {
        if (state === 'no-image') {
            // Visual feedback — the button pulses but tells user to upload
            return;
        }
        if (state !== 'ready' || isBusy) return;
        await commitCommands();
    };

    const bg = {
        idle: 'rgba(255,255,255,0.06)',
        ready: '#007AFF',
        'no-image': 'rgba(255,165,0,0.15)',
        processing: 'rgba(0,122,255,0.12)',
        complete: '#34C759',
    }[state];

    const color = {
        idle: 'inherit',
        ready: '#fff',
        'no-image': '#FF9500',
        processing: 'inherit',
        complete: '#fff',
    }[state];

    return (
        <motion.button
            onClick={handleClick}
            disabled={state === 'idle' || state === 'processing'}
            whileHover={state === 'ready' ? { filter: 'brightness(1.05)' } : {}}
            whileTap={state === 'ready' ? { scale: 0.97 } : {}}
            style={{
                position: 'relative',
                width: '100%',
                height: 56,
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                fontSize: 16,
                fontWeight: 600,
                overflow: 'hidden',
                cursor: state === 'ready' ? 'pointer' : state === 'no-image' ? 'not-allowed' : state === 'idle' ? 'not-allowed' : 'wait',
                background: bg,
                color: color,
                opacity: state === 'idle' ? 0.4 : 1,
                transition: 'all 180ms ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: state === 'ready'
                    ? 'inset 0 1px 0 rgba(255,255,255,0.25)'
                    : 'none',
            }}
        >
            <AnimatePresence mode="wait">
                {state === 'idle' && (
                    <motion.span key="idle" {...fadeProps}>Generate</motion.span>
                )}
                {state === 'no-image' && (
                    <motion.div key="no-image" {...fadeProps}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        <Sparkles size={16} />
                        <span>Upload Image First</span>
                    </motion.div>
                )}
                {state === 'ready' && (
                    <motion.div key="ready" {...fadeProps}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        <Sparkles size={16} />
                        <span>Generate ({pendingCount})</span>
                        <span style={{ fontSize: 13, opacity: 0.7 }}>~{formatTime(totalTime)}</span>
                    </motion.div>
                )}
                {state === 'processing' && (
                    <motion.div key="processing" {...fadeProps}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Loader2 size={14} className="animate-spin" />
                            <span style={{ fontSize: 14 }}>
                                Processing{processingState?.currentStep ? `: ${COMMAND_REGISTRY[processingState.currentStep]?.label || processingState.currentStep}` : '…'}
                            </span>
                            {processingState?.total > 0 && (
                                <span style={{ fontSize: 12, opacity: 0.5 }}>
                                    {(processingState.currentIndex || 0) + 1}/{processingState.total}
                                </span>
                            )}
                        </div>
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            height: 2, background: 'rgba(255,255,255,0.08)',
                        }}>
                            <motion.div
                                style={{ height: '100%', background: '#007AFF', borderRadius: '0 1px 1px 0' }}
                                initial={{ width: '0%' }}
                                animate={{
                                    width: processingState?.progress
                                        ? `${processingState.progress}%`
                                        : `${((processingState?.currentIndex || 0) / (processingState?.total || 1)) * 100}%`
                                }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            />
                        </div>
                    </motion.div>
                )}
                {state === 'complete' && (
                    <motion.div key="complete" {...fadeProps}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        <Check size={18} strokeWidth={2.5} />
                        <span>Complete!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
});

GenerateButton.displayName = 'GenerateButton';

export default GenerateButton;
