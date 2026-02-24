import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useCommand } from '../../context/CommandContext';
import { Wand2, Sparkles, Palette, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import ZoneRestore from '../sidebar/ZoneRestore';
import ZoneEnhance from '../sidebar/ZoneEnhance';
import ZoneCreate from '../sidebar/ZoneCreate';
import ZoneAdjust from '../sidebar/ZoneAdjust';

/**
 * iOS Pro Mobile Bottom Sheet
 * 
 * Premium refinements:
 * - More rounded top corners (28px)
 * - Stronger separation shadow
 * - Animated grab handle with pulse
 * - Elastic spring motion
 * - Three states: collapsed, half, full
 * - Soft blur behind sheet
 */

const CATEGORIES = [
    { id: 'restore', label: 'Restore', icon: Wand2 },
    { id: 'enhance', label: 'Enhance', icon: Sparkles },
    { id: 'create', label: 'Creative', icon: Palette },
    { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal },
];

const SHEET_STATES = {
    COLLAPSED: 72,    // Just the category bar
    HALF: 360,        // Half screen with tools
    FULL: 560,        // Full screen detailed controls
};

const MobileToolSheet = () => {
    const [sheetHeight, setSheetHeight] = useState(SHEET_STATES.HALF);
    const [activeCategory, setActiveCategory] = useState('restore');
    const [isDragging, setIsDragging] = useState(false);
    const dragControls = useDragControls();
    const sheetRef = useRef(null);

    const { setExpandedZone } = useCommand();

    useEffect(() => {
        setExpandedZone(activeCategory);
    }, [activeCategory, setExpandedZone]);

    const handleDragEnd = (event, info) => {
        setIsDragging(false);
        const velocity = info.velocity.y;
        const offset = info.offset.y;

        // Elastic snap to nearest state
        if (velocity > 400 || offset > 80) {
            // Swipe down
            if (sheetHeight === SHEET_STATES.FULL) {
                setSheetHeight(SHEET_STATES.HALF);
            } else {
                setSheetHeight(SHEET_STATES.COLLAPSED);
            }
        } else if (velocity < -400 || offset < -80) {
            // Swipe up
            if (sheetHeight === SHEET_STATES.COLLAPSED) {
                setSheetHeight(SHEET_STATES.HALF);
            } else {
                setSheetHeight(SHEET_STATES.FULL);
            }
        }
    };

    const handleCategoryTap = (categoryId) => {
        setActiveCategory(categoryId);
        if (sheetHeight === SHEET_STATES.COLLAPSED) {
            setSheetHeight(SHEET_STATES.HALF);
        }
    };

    const handleGrabHandleTap = () => {
        // Cycle through states on tap
        if (sheetHeight === SHEET_STATES.COLLAPSED) {
            setSheetHeight(SHEET_STATES.HALF);
        } else if (sheetHeight === SHEET_STATES.HALF) {
            setSheetHeight(SHEET_STATES.FULL);
        } else {
            setSheetHeight(SHEET_STATES.HALF);
        }
    };

    const renderToolContent = () => {
        switch (activeCategory) {
            case 'restore':
                return <ZoneRestore isMobile={true} />;
            case 'enhance':
                return <ZoneEnhance isMobile={true} />;
            case 'create':
                return <ZoneCreate isMobile={true} />;
            case 'adjust':
                return <ZoneAdjust isMobile={true} />;
            default:
                return <ZoneRestore isMobile={true} />;
        }
    };

    return (
        <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-50 ios-pro-sheet"
            initial={{ y: '100%' }}
            animate={{
                height: sheetHeight,
                y: 0
            }}
            transition={{
                type: 'spring',
                stiffness: 350,
                damping: 32,
                mass: 0.8
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
        >
            {/* ═══════════════════════════════════════════════════════════════
                GRAB HANDLE - Animated, tappable
            ═══════════════════════════════════════════════════════════════ */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={(e) => dragControls.start(e)}
                onClick={handleGrabHandleTap}
            >
                <motion.div
                    className="w-9 h-[5px] rounded-full bg-black/15 dark:bg-white/25"
                    animate={{
                        width: isDragging ? 48 : 36,
                        opacity: isDragging ? 0.6 : 1
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════════
                CATEGORY SWITCHER - Refined segmented control
            ═══════════════════════════════════════════════════════════════ */}
            <div className="absolute top-8 left-0 right-0 px-4">
                <div className="flex items-center justify-around bg-black/[0.03] dark:bg-white/[0.06] rounded-xl p-1">
                    {CATEGORIES.map(({ id, label, icon: Icon }) => (
                        <motion.button
                            key={id}
                            onClick={() => handleCategoryTap(id)}
                            whileTap={{ scale: 0.96 }}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all duration-200",
                                activeCategory === id
                                    ? "bg-white dark:bg-white/15 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                                    : ""
                            )}
                        >
                            <Icon
                                size={18}
                                strokeWidth={1.75}
                                className={cn(
                                    "transition-colors",
                                    activeCategory === id
                                        ? "text-[var(--accent)]"
                                        : "text-[var(--text-tertiary)]"
                                )}
                            />
                            <span className={cn(
                                "text-[12px] font-semibold tracking-[-0.1px]",
                                activeCategory === id
                                    ? "text-[var(--text-primary)]"
                                    : "text-[var(--text-tertiary)]"
                            )}>
                                {label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                TOOL CONTENT - Animated transitions
            ═══════════════════════════════════════════════════════════════ */}
            <AnimatePresence mode="wait">
                {sheetHeight > SHEET_STATES.COLLAPSED && (
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                        className="absolute top-[72px] left-0 right-0 bottom-0 px-4 pb-safe overflow-y-auto overscroll-contain"
                    >
                        {renderToolContent()}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MobileToolSheet;
