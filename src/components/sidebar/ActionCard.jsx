import React, { memo, useCallback, useState, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { COMMAND_REGISTRY } from '../../data/CommandRegistry';
import { cn } from '../../lib/utils';
import { transitions } from '../../lib/motion';

/**
 * APPLE-GRADE ACTION CARD
 * 
 * Material Architecture:
 * - apple-card surface with 5-layer shadows
 * - Physical press states (scale 0.98)
 * - Inner stroke activation (no outer glow)
 * - Dense, professional layout
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
    // Context
    const { toggleCommand, pendingQueue } = useCommand();
    const { settings } = useImage();

    // Config
    const toolConfig = COMMAND_REGISTRY[id] || {};

    // Optimistic state
    const contextEnabled = !!settings[id] || id in pendingQueue;
    const [localEnabled, setLocalEnabled] = useState(contextEnabled);
    const isPending = id in pendingQueue;

    useLayoutEffect(() => {
        setLocalEnabled(contextEnabled);
    }, [contextEnabled]);

    // Toggle handler
    const handleToggle = useCallback((e) => {
        e.stopPropagation();
        const newState = !localEnabled;
        setLocalEnabled(newState);
        queueMicrotask(() => toggleCommand(id, newState));
    }, [id, localEnabled, toggleCommand]);

    return (
        <motion.div
            layout
            className={cn(
                // Base Layout & Shape
                "relative mx-3 mb-4 last:mb-0",
                "rounded-[20px] overflow-hidden", // Smooth curvature
                "border", // Border for definition
                "cursor-pointer",

                // Motion & Transition
                "transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)]", // Apple-style spring ease

                // STATE: Active Mode (The "Console" Look)
                localEnabled
                    ? [
                        "bg-gradient-to-br from-white/90 to-white/50 dark:from-[rgba(30,30,35,0.8)] dark:to-[rgba(20,20,25,0.6)]", // Glass Console
                        "border-[var(--accent)] dark:border-[var(--accent)]", // Highlight border
                        "shadow-[0_12px_40px_-12px_rgba(var(--ios-accent),0.3)] dark:shadow-[0_12px_40px_-12px_rgba(var(--ios-accent),0.15)]", // Glow
                        "scale-[1.02]", // Physical lift
                        "z-10" // Bring to front
                    ]
                    : [
                        // STATE: Idle (Compact & Quiet)
                        "bg-white/40 dark:bg-white/5",
                        "border-white/40 dark:border-white/5",
                        "hover:bg-white/60 dark:hover:bg-white/10 hover:border-white/60 dark:hover:border-white/10",
                        "scale-100",
                        "z-0"
                    ]
            )}
            onClick={!localEnabled ? handleToggle : undefined} // Only toggle ON via click, toggle OFF via switch usually (or click header)
        >
            {/* Active Background Glow (Ambient) */}
            {localEnabled && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[var(--accent)] opacity-[0.03] dark:opacity-[0.08] pointer-events-none"
                />
            )}

            {/* ═══════════════════════════════════════════════════════════
                HEADER ROW (Icon + Title + Toggle)
            ═══════════════════════════════════════════════════════════ */}
            <div
                className="flex items-center gap-4 p-4"
                onClick={localEnabled ? handleToggle : undefined} // Allow collapsing active card
            >
                {/* 1. Icon Tile */}
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

                    {/* Processing Ring */}
                    {isPending && (
                        <div className="absolute inset-[-4px] rounded-[20px] border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                    )}
                </div>

                {/* 2. Text Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <span className={cn(
                            "text-[16px] tracking-tight transition-all duration-150",
                            localEnabled
                                ? "font-semibold text-[var(--accent)] translate-x-1" // Title becomes primary
                                : "font-semibold text-[var(--ios-label)]"
                        )}>
                            {title}
                        </span>

                        {/* Badges */}
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

                    {/* Description - Fades out slightly when active to reduce noise */}
                    <p className={cn(
                        "text-[13px] leading-snug mt-0.5 transition-all duration-150",
                        localEnabled
                            ? "text-[var(--ios-label-secondary)] opacity-80 translate-x-1"
                            : "text-[var(--ios-label-tertiary)]"
                    )}>
                        {description}
                    </p>
                </div>

                {/* 3. Chevron Indicator */}
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

            {/* ═══════════════════════════════════════════════════════════
                 CONTROL BAY (Expandable)
            ═══════════════════════════════════════════════════════════ */}
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
                            {/* Separator Line */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent mb-4" />

                            {/* Controls Container */}
                            <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-150">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Glow Accent */}
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
