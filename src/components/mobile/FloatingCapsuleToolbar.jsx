import React, { memo, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { Wand2, Sparkles, Palette, SlidersHorizontal, Download } from 'lucide-react';

import {
    RestoreTools,
    EnhanceTools,
    CreateTools,
    AdjustTools
} from '../tools';

/**
 * PREMIUM MOBILE TOOLBAR — v4.1 (Theme Aware Edition)
 *
 * Supports both beautiful crisp Light glass and deep Dark glass.
 */

const TABS = [
    { id: 'create', label: 'Create', icon: Palette, color: '#AF52DE' },
    { id: 'restore', label: 'Restore', icon: Wand2, color: '#007AFF' },
    { id: 'enhance', label: 'Enhance', icon: Sparkles, color: '#FF9F0A' },
    { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal, color: '#30D158' },
];

const SNAP = { HALF: 48, EXPANDED: 74 };
const SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 0.7 };

// ─── PREMIUM TAB BUTTON ──────────────────────────

const TabButton = memo(({ tab, isActive, onTap }) => {
    const Icon = tab.icon;
    return (
        <motion.button
            onClick={() => onTap(tab.id)}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.08 }}
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                padding: '8px 0 6px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                position: 'relative',
            }}
        >
            {/* Icon with glow background for active state */}
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 28,
            }}>
                {isActive && (
                    <motion.div
                        layoutId="mobile-tab-glow"
                        style={{
                            position: 'absolute',
                            inset: -2,
                            borderRadius: 10,
                            background: `linear-gradient(135deg, ${tab.color}20, ${tab.color}10)`,
                            border: `1px solid ${tab.color}25`,
                        }}
                        transition={SPRING}
                    />
                )}
                <Icon
                    size={21}
                    strokeWidth={isActive ? 2.2 : 1.5}
                    style={{
                        color: isActive ? tab.color : 'var(--mc-tab-inactive)',
                        transition: 'color 150ms ease',
                        position: 'relative',
                        zIndex: 1,
                        filter: isActive ? `drop-shadow(0 0 6px ${tab.color}40)` : 'none',
                    }}
                />
            </div>

            <span style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? tab.color : 'var(--mc-tab-inactive)',
                transition: 'all 120ms ease',
                letterSpacing: '0.02em',
                lineHeight: 1,
                textTransform: 'uppercase',
            }}>
                {tab.label}
            </span>
        </motion.button>
    );
});

TabButton.displayName = 'TabButton';

// ─── PREMIUM SNAP PANEL ──────────────────────────

const SnapPanel = memo(({ activeTab, panelHeight, onClose }) => {
    const dragStartY = useRef(0);
    const [localHeight, setLocalHeight] = useState(panelHeight);

    useEffect(() => { setLocalHeight(panelHeight); }, [panelHeight]);

    const content = useMemo(() => {
        switch (activeTab) {
            case 'create': return <CreateTools />;
            case 'restore': return <RestoreTools />;
            case 'enhance': return <EnhanceTools />;
            case 'adjust': return <AdjustTools />;
            default: return null;
        }
    }, [activeTab]);

    const tabConfig = TABS.find(t => t.id === activeTab);

    const handleTouchStart = useCallback((e) => {
        dragStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback((e) => {
        const delta = dragStartY.current - e.changedTouches[0].clientY;
        if (delta > 50) setLocalHeight(SNAP.EXPANDED);
        else if (delta < -50) onClose();
    }, [onClose]);

    return (
        <motion.div
            key={activeTab}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${localHeight}vh`, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="mobile-studio-panel"
        >
            {/* Drag Handle + Title */}
            <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px 18px 0',
                    cursor: 'grab',
                    touchAction: 'none',
                    userSelect: 'none',
                    flexShrink: 0,
                }}
            >
                {/* Premium grab handle */}
                <div style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--mc-handle)',
                    marginBottom: 14,
                }} />

                {/* Section Header with accent color */}
                <div style={{
                    width: '100%',
                    paddingBottom: 12,
                    borderBottom: '1px solid var(--mc-glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    {tabConfig && (() => {
                        const TabIcon = tabConfig.icon;
                        return (
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: 10,
                                background: `linear-gradient(135deg, ${tabConfig.color}25, ${tabConfig.color}10)`,
                                border: `1px solid ${tabConfig.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <TabIcon size={16} strokeWidth={2} style={{ color: tabConfig.color }} />
                            </div>
                        );
                    })()}
                    <span style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'var(--mc-text-main)',
                        letterSpacing: '-0.02em',
                    }}>
                        {tabConfig?.label}
                    </span>
                </div>
            </div>

            {/* Content — fade+slide on tab change */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="mobile-panel-scroll"
            >
                {content}
            </motion.div>
        </motion.div>
    );
});

SnapPanel.displayName = 'SnapPanel';

// ─── FLOATING ACTION DOCK ────────────────────────

const FloatingActionDock = memo(({ onExport, isPanelOpen }) => {
    const { processedImage, originalImage, isProcessing } = useImage();
    const { pendingQueue, commitCommands } = useCommand();

    const hasImage = !!originalImage;
    const hasProcessed = !!processedImage;
    const hasAnyImage = hasImage || hasProcessed;
    const stepCount = pendingQueue ? Object.keys(pendingQueue).length : 0;
    const canGenerate = stepCount > 0 && hasImage && !isProcessing;

    if (!hasImage || isPanelOpen) return null;

    const handleGenerate = async () => {
        if (canGenerate && commitCommands) await commitCommands();
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.95 }}
            transition={SPRING}
            className="mobile-action-pill"
        >
            {canGenerate && (
                <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={handleGenerate}
                    className="generate-gradient-btn"
                >
                    <Sparkles size={14} strokeWidth={2.25} />
                    Generate
                </motion.button>
            )}

            {hasAnyImage && (
                <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={onExport}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 18px', border: 'none', borderRadius: 999,
                        background: 'var(--mc-glass-border)',
                        color: 'var(--mc-text-main)',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    <Download size={14} strokeWidth={2} />
                    Save
                </motion.button>
            )}
        </motion.div>
    );
});

FloatingActionDock.displayName = 'FloatingActionDock';

// ─── MAIN COMPONENT ─────────────────────────────

const FloatingCapsuleToolbar = memo(({ onExport }) => {
    const [activeTab, setActiveTab] = useState('create');
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [panelHeight, setPanelHeight] = useState(SNAP.HALF);

    const { setExpandedZone } = useCommand();
    const { isProcessing } = useImage();

    useEffect(() => {
        if (activeTab) setExpandedZone(activeTab);
    }, [activeTab, setExpandedZone]);

    const handleTabTap = useCallback((tabId) => {
        if (activeTab === tabId && isPanelOpen) {
            setIsPanelOpen(false);
        } else {
            setActiveTab(tabId);
            setPanelHeight(SNAP.HALF);
            setIsPanelOpen(true);
        }
    }, [activeTab, isPanelOpen]);

    const handleClose = useCallback(() => {
        setIsPanelOpen(false);
    }, []);

    return (
        <>
            <AnimatePresence>
                <FloatingActionDock onExport={onExport} isPanelOpen={isPanelOpen} />
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {isPanelOpen && activeTab && (
                    <SnapPanel
                        activeTab={activeTab}
                        panelHeight={panelHeight}
                        onClose={handleClose}
                    />
                )}
            </AnimatePresence>

            {/* ─── DARK/LIGHT GLASS TAB BAR ─── */}
            <div className="mobile-studio-tabbar">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 54,
                    opacity: isProcessing ? 0.35 : 1,
                    pointerEvents: isProcessing ? 'none' : 'auto',
                    transition: 'opacity 200ms ease',
                }}>
                    {TABS.map((tab) => (
                        <TabButton
                            key={tab.id}
                            tab={tab}
                            isActive={activeTab === tab.id}
                            onTap={handleTabTap}
                        />
                    ))}
                </div>
            </div>
        </>
    );
});

FloatingCapsuleToolbar.displayName = 'FloatingCapsuleToolbar';
export default FloatingCapsuleToolbar;
