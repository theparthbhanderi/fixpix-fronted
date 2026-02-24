import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import AppleToggle from '../ui/AppleToggle';
import { useCommand } from '../../context/CommandContext';

/**
 * ToolCard — Micro-polished to Apple-level spec
 *
 * Card: 22px radius, 18px padding
 * Icon container: 40px square, 12px radius, accent 10%
 * Title: 16px semibold
 * Subtitle: 13px secondary
 * Active border: soft 1px rgba(0,122,255,0.35)
 * Toggle: scale 0.9
 */

const ToolCard = memo(({
    id,
    icon: Icon,
    label,
    title,
    description,
    hasSettings = false,
    children,
    badge,
    onToggle
}) => {
    const { pendingQueue, processingState } = useCommand();

    const state = useMemo(() => {
        if (processingState?.currentStep === id) return 'processing';
        if (processingState?.completed?.includes(id)) return 'completed';
        if (pendingQueue && id in pendingQueue) return 'enabled';
        return 'idle';
    }, [id, pendingQueue, processingState]);

    const isEnabled = state !== 'idle';
    const displayLabel = label || title;

    const handleToggle = () => {
        if (state === 'processing') return;
        onToggle?.(!isEnabled);
    };

    const cardBg = {
        idle: 'var(--tool-card-bg, rgba(255,255,255,0.04))',
        enabled: 'var(--tool-card-bg, rgba(255,255,255,0.04))',
        processing: 'var(--tool-card-bg, rgba(255,255,255,0.04))',
        completed: 'var(--tool-card-bg, rgba(255,255,255,0.04))',
    }[state];

    const cardBorder = {
        idle: 'var(--tool-card-border, rgba(255,255,255,0.06))',
        enabled: 'rgba(0,122,255,0.35)',
        processing: 'rgba(0,122,255,0.35)',
        completed: 'rgba(52,199,89,0.35)',
    }[state];

    const iconBg = {
        idle: 'rgba(0,122,255,0.1)',
        enabled: '#007AFF',
        processing: '#007AFF',
        completed: '#34C759',
    }[state];

    const iconColor = state === 'idle' ? '#007AFF' : '#fff';

    return (
        <motion.div
            style={{
                borderRadius: 'var(--radius-xl)',
                border: `1px solid ${cardBorder}`,
                background: cardBg,
                transition: 'all 180ms ease',
            }}
            whileHover={{ translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            layout
        >
            {/* Main Row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: '14px 16px',
                minHeight: 60,
            }}>
                {/* Icon — 40×40, 12px radius */}
                <div style={{
                    position: 'relative',
                    width: 36, height: 36,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: iconBg,
                    color: iconColor,
                    transition: 'all 180ms ease',
                }}>
                    {state === 'processing' ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Icon size={18} strokeWidth={1.75} />
                    )}
                    {state === 'completed' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                position: 'absolute', bottom: -3, right: -3,
                                width: 14, height: 14,
                                borderRadius: 7,
                                background: '#34C759',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Check size={8} strokeWidth={2.5} color="#fff" />
                        </motion.div>
                    )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                            fontSize: 16, fontWeight: 600,
                            letterSpacing: '-0.2px',
                        }}>
                            {displayLabel}
                        </span>
                        {badge && (
                            <span style={{
                                padding: '2px 6px',
                                fontSize: 10, fontWeight: 700,
                                textTransform: 'uppercase',
                                background: 'rgba(0,122,255,0.1)',
                                color: '#007AFF',
                                borderRadius: 6,
                            }}>
                                {badge}
                            </span>
                        )}
                    </div>
                    <p style={{
                        fontSize: 13, marginTop: 2,
                        opacity: 0.5,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        {description}
                    </p>
                </div>

                {/* Toggle — scale 0.9 */}
                <div style={{ transform: 'scale(0.9)', flexShrink: 0 }}>
                    <AppleToggle
                        checked={isEnabled}
                        onChange={handleToggle}
                        disabled={state === 'processing'}
                    />
                </div>
            </div>

            {/* Expanded Settings */}
            <AnimatePresence>
                {state === 'enabled' && children && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '0 14px 14px' }}>
                            <div style={{
                                height: 1,
                                background: 'var(--glass-border)',
                                marginBottom: 'var(--space-4)',
                            }} />
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

ToolCard.displayName = 'ToolCard';

export default ToolCard;
