import React, { memo, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { Wand2, Sparkles, Palette, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Import new Tool Components
import {
    RestoreTools,
    EnhanceTools,
    CreateTools,
    AdjustTools
} from '../tools';

/**
 * FLOATING CAPSULE TOOLBAR - Performance Optimized
 * 
 * Optimizations:
 * - React.memo on all components
 * - Faster spring animations (500 stiffness)
 * - Memoized callbacks
 * - Reduced backdrop blur for mobile performance
 * - GPU-accelerated transforms
 */

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const CATEGORIES = [
    { id: 'restore', label: 'Restore', icon: Wand2, color: '#007AFF' },
    { id: 'enhance', label: 'Enhance', icon: Sparkles, color: '#34C759' },
    { id: 'create', label: 'Creative', icon: Palette, color: '#FF9500' },
    { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal, color: '#AF52DE' },
];

const CATEGORY_TOOL_IDS = {
    restore: ['faceRestoration', 'removeScratches', 'colorize'],
    enhance: ['upscaleX', 'autoEnhance'],
    create: ['removeBackground', 'generativeFill'],
    adjust: ['brightness', 'contrast', 'saturation'],
};

// ═══════════════════════════════════════════════════════════════
// CAPSULE ICON BUTTON - High Visibility, Performance Optimized
// ═══════════════════════════════════════════════════════════════

const CapsuleIconButton = memo(({ category, isActive, activeCount, onTap }) => {
    const { id, label, icon: Icon, color } = category;

    const handleClick = useCallback(() => {
        onTap(id);
    }, [onTap, id]);

    // Memoized styles
    const iconStyle = useMemo(() => ({
        color: isActive ? color : undefined,
        opacity: isActive ? 1 : 0.5
    }), [isActive, color]);

    return (
        <motion.button
            onClick={handleClick}
            whileTap={{ scale: 0.97 }}
            className={cn(
                "relative w-14 h-10 flex flex-col items-center justify-center gap-[1px] rounded-xl transition-all duration-150"
            )}
            style={{
                background: 'transparent',
                boxShadow: 'none',
                willChange: 'transform'
            }}
        >
            {/* Icon with high visibility */}
            <motion.div
                animate={{
                    scale: isActive ? 1.05 : 1,
                    y: isActive ? -1 : 0
                }}
                transition={{ duration: 0.12, ease: [0.25, 1, 0.5, 1] }}
                className="relative"
            >
                <Icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.75}
                    className={cn(
                        "transition-colors duration-150",
                        !isActive && "capsule-icon-inactive"
                    )}
                    style={iconStyle}
                />
            </motion.div>

            {/* Label - always visible */}
            <span className={cn(
                "text-[8px] font-medium tracking-tight transition-colors duration-150",
                isActive
                    ? "text-[var(--text-primary)]"
                    : "capsule-label-inactive"
            )}>
                {label}
            </span>

            {/* Active indicator — count badge or dot */}
            {activeCount > 0 && !isActive && (
                <div
                    className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full flex items-center justify-center"
                    style={{
                        backgroundColor: color,
                        fontSize: 9,
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1,
                        padding: '0 3px',
                    }}
                >
                    {activeCount}
                </div>
            )}
            {isActive && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.12, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute -bottom-1.5 w-1 h-1 rounded-full"
                    style={{ backgroundColor: color }}
                />
            )}
        </motion.button>
    );
});

CapsuleIconButton.displayName = 'CapsuleIconButton';

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const FloatingCapsuleToolbar = memo(() => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeCategory, setActiveCategory] = useState(() => {
        try { return localStorage.getItem('fixpix-editor-tab'); } catch { return null; }
    });
    const dragControls = useDragControls();
    const panelRef = useRef(null);

    const { setExpandedZone, pendingQueue } = useCommand();
    const { isProcessing } = useImage();

    // Sync with command context
    useEffect(() => {
        if (activeCategory) {
            setExpandedZone(activeCategory);
        }
    }, [activeCategory, setExpandedZone]);

    // ─────────────────────────────────────────────────────────────
    // HANDLERS - Memoized
    // ─────────────────────────────────────────────────────────────

    const handleIconTap = useCallback((categoryId) => {
        if (activeCategory === categoryId && isExpanded) {
            setIsExpanded(false);
            setActiveCategory(null);
            try { localStorage.removeItem('fixpix-editor-tab'); } catch { }
        } else {
            setActiveCategory(categoryId);
            setIsExpanded(true);
            try { localStorage.setItem('fixpix-editor-tab', categoryId); } catch { }
        }
    }, [activeCategory, isExpanded]);

    const handleClose = useCallback(() => {
        setIsExpanded(false);
        setActiveCategory(null);
    }, []);

    const handleBackdropTap = useCallback((e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }, [handleClose]);

    const handleDragEnd = useCallback((event, info) => {
        if (info.velocity.y > 300 || info.offset.y > 100) {
            handleClose();
        }
    }, [handleClose]);

    const handleDragStart = useCallback((e) => {
        dragControls.start(e);
    }, [dragControls]);

    // ─────────────────────────────────────────────────────────────
    // TOOL CONTENT RENDERER - Memoized
    // ─────────────────────────────────────────────────────────────
    const toolContent = useMemo(() => {
        switch (activeCategory) {
            case 'restore': return <RestoreTools />;
            case 'enhance': return <EnhanceTools />;
            case 'create': return <CreateTools />;
            case 'adjust': return <AdjustTools />;
            default: return null;
        }
    }, [activeCategory]);

    const activeConfig = useMemo(() =>
        CATEGORIES.find(c => c.id === activeCategory),
        [activeCategory]);

    const activeColor = activeConfig?.color || '#007AFF';
    const ActiveIcon = activeConfig?.icon;

    // Count active tools per category
    const categoryToolCounts = useMemo(() => {
        const counts = {};
        for (const cat of CATEGORIES) {
            const toolIds = CATEGORY_TOOL_IDS[cat.id] || [];
            counts[cat.id] = toolIds.filter(id => pendingQueue && id in pendingQueue).length;
        }
        return counts;
    }, [pendingQueue]);

    // Memoized animation configs
    const panelAnimation = useMemo(() => ({
        initial: { y: 24, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 12, opacity: 0 },
        transition: {
            duration: 0.22,
            ease: [0.25, 1, 0.5, 1]
        }
    }), []);

    const capsuleAnimation = useMemo(() => ({
        initial: { y: 40, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: {
            duration: 0.2,
            ease: [0.25, 1, 0.5, 1],
            delay: 0.05
        }
    }), []);

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════
    return (
        <>
            {/* BACKDROP - Dims background when expanded */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-40 bg-black/[0.03]"
                        onClick={handleBackdropTap}
                    />
                )}
            </AnimatePresence>

            {/* EXPANDED TOOL PANEL - Slides up above capsule */}
            <AnimatePresence>
                {isExpanded && activeCategory && (
                    <motion.div
                        ref={panelRef}
                        {...panelAnimation}
                        drag="y"
                        dragControls={dragControls}
                        dragListener={false}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.1}
                        onDragEnd={handleDragEnd}
                        className="fixed left-3 right-3 z-50 floating-tool-panel"
                        style={{
                            bottom: 'calc(env(safe-area-inset-bottom, 20px) + 84px)',
                            marginBottom: 12,
                            maxHeight: '50vh',
                            willChange: 'transform',
                            opacity: isProcessing ? 0.5 : 1,
                            pointerEvents: isProcessing ? 'none' : 'auto',
                            transition: 'opacity 180ms ease',
                        }}
                    >
                        {/* Drag Handle */}
                        <div className="flex justify-center pt-2 pb-0.5">
                            <div className="w-7 h-1 rounded-full bg-current opacity-15" />
                        </div>

                        {/* Panel Header */}
                        <div
                            className="flex items-center justify-between px-4 py-1.5 border-b border-black/5 dark:border-white/5"
                            onPointerDown={handleDragStart}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${activeColor}15` }}
                                >
                                    {ActiveIcon && (
                                        <ActiveIcon size={18} style={{ color: activeColor }} strokeWidth={2} />
                                    )}
                                </div>
                                <span className="text-[15px] font-semibold text-[var(--text-primary)]">
                                    {activeConfig?.label}
                                </span>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10"
                            >
                                <X size={16} strokeWidth={2.5} className="text-[var(--text-secondary)]" />
                            </motion.button>
                        </div>

                        {/* Panel Content */}
                        <div className="px-4 pt-2 pb-4 overflow-y-auto overscroll-contain space-y-2" style={{ maxHeight: 'calc(50vh - 48px)' }}>
                            {toolContent}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FLOATING CAPSULE - Always visible, 4 icons */}
            <motion.div
                {...capsuleAnimation}
                className="fixed left-4 right-4 z-50 floating-capsule"
                style={{
                    bottom: 'calc(env(safe-area-inset-bottom, 20px) + 16px)',
                    willChange: 'transform'
                }}
            >
                {/* Icons container */}
                <div className="flex items-center justify-evenly py-1">
                    {CATEGORIES.map((category) => (
                        <CapsuleIconButton
                            key={category.id}
                            category={category}
                            isActive={activeCategory === category.id && isExpanded}
                            activeCount={categoryToolCounts[category.id] || 0}
                            onTap={handleIconTap}
                        />
                    ))}
                </div>
            </motion.div>
        </>
    );
});

FloatingCapsuleToolbar.displayName = 'FloatingCapsuleToolbar';

export default FloatingCapsuleToolbar;
