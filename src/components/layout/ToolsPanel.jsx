import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Wand2 } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import ZoneRestore from '../sidebar/ZoneRestore';
import ZoneEnhance from '../sidebar/ZoneEnhance';
import ZoneCreate from '../sidebar/ZoneCreate';
import ZoneAdjust from '../sidebar/ZoneAdjust';
import GenerateButton from '../editor/GenerateButton';
import { cn } from '../../lib/utils';

/**
 * APPLE-GRADE TOOLS PANEL
 * 
 * Architecture:
 * - Panel surface with 7-layer shadow
 * - Spring accordion physics
 * - Dense tool grouping
 * - Physical press states
 * - No outer glows
 */

// ═══════════════════════════════════════════════════════════════════════════
// ACCORDION SECTION - Software-grade collapsible
// ═══════════════════════════════════════════════════════════════════════════

const AccordionSection = memo(({ title, isOpen, onClick, children, pendingCount }) => {
    // Spring physics for accordion
    const springConfig = useMemo(() => ({
        type: "spring",
        stiffness: 380,
        damping: 32,
        mass: 0.8
    }), []);

    return (
        <div className="relative mb-[var(--space-s)]">
            {/* Section Header Button - Increased Height & Breathability */}
            <button
                onClick={onClick}
                className={cn(
                    "w-full flex items-center justify-between",
                    "px-[var(--space-l)] py-[var(--space-m)]", // Larger touch target
                    "transition-colors duration-[var(--duration-fast)]",
                    "group"
                )}
            >
                <div className="flex items-center gap-[var(--space-m)]">
                    {/* Section Title - Larger & Bolder */}
                    <span className={cn(
                        "text-[15px] tracking-wide font-semibold",
                        isOpen
                            ? "text-[var(--ios-label)]"
                            : "text-[var(--ios-label-secondary)] group-hover:text-[var(--ios-label)]"
                    )}>
                        {title}
                    </span>

                    {/* Pending Badge */}
                    {pendingCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[rgba(var(--ios-accent),0.1)] text-[var(--accent)] text-[10px] font-bold">
                            {pendingCount}
                        </span>
                    )}
                </div>

                {/* Chevron - Spring rotation */}
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={springConfig}
                    className="opacity-40 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronDown size={16} strokeWidth={2.5} />
                </motion.div>
            </button>

            {/* Collapsible Content - Spring physics */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: springConfig,
                            opacity: { duration: 0.2 }
                        }}
                        className="overflow-hidden"
                    >
                        {/* More breathing room for content */}
                        <div className="pb-[var(--space-l)] pt-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle Separator - Only visible when closed or not last */}
            {!isOpen && <div className="h-px bg-black/5 dark:bg-white/5 mx-[var(--space-l)]" />}
        </div>
    );
});

AccordionSection.displayName = 'AccordionSection';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN TOOLS PANEL
// ═══════════════════════════════════════════════════════════════════════════

const ToolsPanel = () => {
    const {
        expandedZone,
        setExpandedZone,
        pendingCount,
        pendingQueue,
        hasPendingChanges,
        commitCommands
    } = useCommand();

    const { isProcessing } = useImage();

    // Zone toggle handler
    const toggleZone = (zone) => {
        setExpandedZone(expandedZone === zone ? null : zone);
    };

    // Count pending per zone
    const getZonePending = (zoneTools) => {
        return zoneTools.filter(t => t in pendingQueue).length;
    };

    const buttonEnabled = hasPendingChanges && !isProcessing;

    return (
        <div className="flex flex-col h-full glass-panel-floating rounded-[var(--radius-xl)] transition-all duration-300">
            {/* ═══════════════════════════════════════════════════════════
                PANEL HEADER
            ═══════════════════════════════════════════════════════════ */}
            <header className="flex items-center gap-[var(--space-m)] px-[var(--space-l)] py-[var(--space-l)] border-b border-black/5 dark:border-white/5 backdrop-blur-md rounded-t-[var(--radius-xl)]">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    <Wand2 size={16} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-[17px] font-bold tracking-tight text-[var(--ios-label)]">
                        Restoration Lab
                    </h2>
                    <p className="text-[11px] font-medium text-[var(--ios-label-tertiary)] uppercase tracking-wider">
                        AI Studio
                    </p>
                </div>
            </header>

            {/* ═══════════════════════════════════════════════════════════
                ACCORDION TOOL GROUPS
            ═══════════════════════════════════════════════════════════ */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2">
                {/* Restore & Repair */}
                <AccordionSection
                    title="Restore & Repair"
                    isOpen={expandedZone === 'restore'}
                    onClick={() => toggleZone('restore')}
                    pendingCount={getZonePending(['faceRestoration', 'removeScratches', 'colorize'])}
                >
                    <ZoneRestore />
                </AccordionSection>

                {/* Enhance & Upscale */}
                <AccordionSection
                    title="Enhance & Upscale"
                    isOpen={expandedZone === 'enhance'}
                    onClick={() => toggleZone('enhance')}
                    pendingCount={getZonePending(['upscale', 'denoise', 'sharpen'])}
                >
                    <ZoneEnhance />
                </AccordionSection>

                {/* Creative Studio */}
                <AccordionSection
                    title="Creative Studio"
                    isOpen={expandedZone === 'create'}
                    onClick={() => toggleZone('create')}
                    pendingCount={getZonePending(['styleTransfer', 'backgroundRemove'])}
                >
                    <ZoneCreate />
                </AccordionSection>

                {/* Color & Light */}
                <AccordionSection
                    title="Color & Light"
                    isOpen={expandedZone === 'adjust'}
                    onClick={() => toggleZone('adjust')}
                    pendingCount={0}
                >
                    <ZoneAdjust />
                </AccordionSection>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                GENERATE BUTTON - Primary CTA (Dominant)
            ═══════════════════════════════════════════════════════════ */}
            <div className="p-[var(--space-l)] border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-b-[var(--radius-xl)]">
                <GenerateButton
                    onCommit={commitCommands}
                    pendingCount={pendingCount}
                    isProcessing={isProcessing}
                    disabled={!hasPendingChanges}
                />
            </div>
        </div>
    );
};

export default ToolsPanel;
