import React, { memo, useCallback, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { COMMAND_REGISTRY } from '../../data/CommandRegistry';
import { cn } from '../../lib/utils';
import { transitions } from '../../lib/motion';

/**
 * ACTION CARD — Responsive
 *
 * Desktop: Apple-grade card with depth, glow, and material surfaces
 * Mobile (<768px): Flat minimal row with soft icon + title + toggle
 */
const ActionCard = memo(({
    id,
    title,
    description,
    icon: Icon,
    children,
    badge,
    isRecommended
}) => {
    const { toggleCommand, pendingQueue } = useCommand();
    const { settings } = useImage();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const toolConfig = COMMAND_REGISTRY[id] || {};
    const contextEnabled = !!settings[id] || id in pendingQueue;
    const [localEnabled, setLocalEnabled] = useState(contextEnabled);
    const isPending = id in pendingQueue;

    useLayoutEffect(() => {
        setLocalEnabled(contextEnabled);
    }, [contextEnabled]);

    const handleToggle = useCallback((e) => {
        e.stopPropagation();
        const newState = !localEnabled;
        setLocalEnabled(newState);
        queueMicrotask(() => toggleCommand(id, newState));
    }, [id, localEnabled, toggleCommand]);

    // ─── MOBILE: Flat minimal row ───
    if (isMobile) {
        return (
            <div
                style={{
                    padding: '14px 4px',
                    borderBottom: '0.5px solid var(--glass-border, rgba(0,0,0,0.04))',
                }}
            >
                {/* Row: Icon + Text + Toggle */}
                <div
                    onClick={handleToggle}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    {/* Soft circular icon */}
                    <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: localEnabled
                            ? 'var(--accent, #007AFF)'
                            : 'rgba(0,0,0,0.04)',
                        transition: 'background 150ms ease',
                    }}>
                        <Icon
                            size={18}
                            strokeWidth={localEnabled ? 2.2 : 1.75}
                            style={{
                                color: localEnabled ? '#fff' : 'var(--text-secondary, rgba(0,0,0,0.5))',
                                transition: 'color 150ms ease',
                            }}
                        />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                                fontSize: 15,
                                fontWeight: localEnabled ? 500 : 400,
                                color: localEnabled ? 'var(--accent, #007AFF)' : 'var(--text-primary)',
                                transition: 'color 150ms ease',
                                letterSpacing: '-0.01em',
                            }}>
                                {title}
                            </span>
                            {badge && (
                                <span style={{
                                    fontSize: 9,
                                    fontWeight: 600,
                                    padding: '1px 5px',
                                    borderRadius: 4,
                                    background: 'rgba(var(--ios-accent, 0,122,255), 0.08)',
                                    color: 'var(--accent, #007AFF)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                }}>
                                    {badge}
                                </span>
                            )}
                        </div>
                        <p style={{
                            fontSize: 12,
                            color: 'var(--text-tertiary, rgba(0,0,0,0.35))',
                            margin: '2px 0 0',
                            lineHeight: 1.3,
                        }}>
                            {description}
                        </p>
                    </div>

                    {/* iOS Toggle */}
                    <motion.div
                        whileTap={{ scale: 0.92 }}
                        style={{
                            width: 42,
                            height: 26,
                            borderRadius: 13,
                            padding: 2,
                            cursor: 'pointer',
                            flexShrink: 0,
                            background: localEnabled
                                ? 'var(--accent, #007AFF)'
                                : 'rgba(0,0,0,0.09)',
                            transition: 'background 200ms ease',
                        }}
                    >
                        <motion.div
                            animate={{ x: localEnabled ? 16 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                background: '#fff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                            }}
                        />
                    </motion.div>
                </div>

                {/* Expandable controls — minimal */}
                <AnimatePresence>
                    {localEnabled && children && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{ paddingTop: 12 }}>
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // ─── DESKTOP: Original Apple-grade card ───
    return (
        <motion.div
            layout
            className={cn(
                "relative mx-3 mb-4 last:mb-0",
                "rounded-[20px] overflow-hidden",
                "border",
                "cursor-pointer",
                "transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)]",
                localEnabled
                    ? [
                        "bg-gradient-to-br from-white/90 to-white/50 dark:from-[rgba(30,30,35,0.8)] dark:to-[rgba(20,20,25,0.6)]",
                        "border-[var(--accent)] dark:border-[var(--accent)]",
                        "shadow-[0_12px_40px_-12px_rgba(var(--ios-accent),0.3)] dark:shadow-[0_12px_40px_-12px_rgba(var(--ios-accent),0.15)]",
                        "scale-[1.02]",
                        "z-10"
                    ]
                    : [
                        "bg-white/40 dark:bg-white/5",
                        "border-white/40 dark:border-white/5",
                        "hover:bg-white/60 dark:hover:bg-white/10 hover:border-white/60 dark:hover:border-white/10",
                        "scale-100",
                        "z-0"
                    ]
            )}
            onClick={!localEnabled ? handleToggle : undefined}
        >
            {localEnabled && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[var(--accent)] opacity-[0.03] dark:opacity-[0.08] pointer-events-none"
                />
            )}

            <div
                className="flex items-center gap-4 p-4"
                onClick={localEnabled ? handleToggle : undefined}
            >
                <div className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-[16px] transition-all duration-150",
                    localEnabled
                        ? "bg-[var(--accent)] text-white shadow-md scale-110"
                        : "bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60"
                )}>
                    <Icon
                        size={22}
                        strokeWidth={localEnabled ? 2.5 : 2}
                        className="transition-transform duration-150"
                    />
                    {isPending && (
                        <div className="absolute inset-[-4px] rounded-[20px] border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                    )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <span className={cn(
                            "text-[16px] tracking-tight transition-all duration-150",
                            localEnabled
                                ? "font-semibold text-[var(--accent)] translate-x-1"
                                : "font-semibold text-[var(--ios-label)]"
                        )}>
                            {title}
                        </span>
                        <div className="flex gap-2">
                            {isPending && (
                                <span className="px-2 py-0.5 rounded-full bg-[rgba(var(--ios-accent),0.1)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                    PROCESSING
                                </span>
                            )}
                            {isRecommended && !localEnabled && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold tracking-wide">
                                    PRO
                                </span>
                            )}
                        </div>
                    </div>
                    <p className={cn(
                        "text-[13px] leading-snug mt-0.5 transition-all duration-150",
                        localEnabled
                            ? "text-[var(--ios-label-secondary)] opacity-80 translate-x-1"
                            : "text-[var(--ios-label-tertiary)]"
                    )}>
                        {description}
                    </p>
                </div>

                <motion.div
                    animate={{ rotate: localEnabled ? 180 : 0 }}
                    className={cn(
                        "w-6 h-6 flex items-center justify-center rounded-full transition-all duration-150",
                        localEnabled
                            ? "bg-[var(--accent)] text-white"
                            : "bg-transparent text-black/20 dark:text-white/20"
                    )}
                >
                    <ChevronDown size={14} strokeWidth={2.5} />
                </motion.div>
            </div>

            <AnimatePresence>
                {localEnabled && children && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={transitions.spring.stiff}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-5 pt-1">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent mb-4" />
                            <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-150">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {localEnabled && (
                <motion.div
                    layoutId="active-glow"
                    className="absolute inset-0 rounded-2xl ring-1 ring-[var(--accent)] ring-opacity-30 pointer-events-none"
                    transition={transitions.spring.stiff}
                />
            )}
        </motion.div>
    );
}, (prev, next) => {
    return prev.id === next.id &&
        prev.title === next.title &&
        prev.description === next.description &&
        prev.badge === next.badge &&
        prev.isRecommended === next.isRecommended &&
        prev.children === next.children;
});

ActionCard.displayName = 'ActionCard';
export default ActionCard;
