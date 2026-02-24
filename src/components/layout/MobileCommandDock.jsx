import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { ZONES } from '../../data/CommandRegistry';
import { Wand2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import MobileZoneSheet from '../sidebar/MobileZoneSheet';

/**
 * MobileCommandDock v2.0
 * The "Cockpit" - Always visible bottom navigation for mobile
 */
const MobileCommandDock = () => {
    const {
        activeMode,
        pendingCount,
        commitCommands,
        hasPendingChanges,
        expandedZone,
        setExpandedZone
    } = useCommand();

    const { isProcessing } = useImage();

    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Hide dock when in Focus Mode (handled by focus controls)
    if (activeMode) return null;

    const handleZoneClick = (zoneId) => {
        setExpandedZone(zoneId);
        setIsSheetOpen(true);
    };

    // Filter out INSIGHT zone from dock (it's always visible)
    const dockZones = Object.values(ZONES).filter(z => z.id !== 'insight');

    return (
        <>
            {/* ═══════════════════════════════════════════════════════════ */}
            {/* THE DOCK (Persistent Bottom Bar) */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-0 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-xl safe-area-bottom pointer-events-none">

                <div className="max-w-md mx-auto pointer-events-auto">

                    {/* 1. Status Rail (Scan & Active Pills) */}
                    <AnimatePresence>
                        {expandedZone === 'restore' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar"
                            >
                                {/* Scan Status Pill */}
                                <div className="flex items-center gap-2 bg-background/80 border border-separator/10 rounded-full px-3 py-1.5 shadow-lg backdrop-blur-md">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--ios-accent),0.5)]" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                        AI Analysis
                                    </span>
                                </div>

                                {/* Active Recommendation Pills (Mock) */}
                                {pendingCount > 0 && (
                                    <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1.5 backdrop-blur-md">
                                        <span className="text-[10px] font-bold text-blue-500">
                                            {pendingCount} fixes queued
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-3">
                        {/* Zone Navigation Pills */}
                        <div className="flex flex-1 items-center bg-fill/5 rounded-2xl p-1.5 border border-separator/10 shadow-2xl backdrop-blur-md">
                            {dockZones.map((zone) => {
                                const Icon = zone.icon;
                                const isActive = expandedZone === zone.id && isSheetOpen;

                                return (
                                    <button
                                        key={zone.id}
                                        onClick={() => handleZoneClick(zone.id)}
                                        className={cn(
                                            "flex-1 flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all duration-200 relative",
                                            isActive
                                                ? "text-white bg-primary shadow-lg shadow-primary/20"
                                                : "text-text-tertiary active:bg-fill/10"
                                        )}
                                    >
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive ? "text-white" : "")} />
                                        <span className={cn(
                                            "text-[9px] font-semibold mt-1 uppercase tracking-tight",
                                            isActive ? "text-white" : ""
                                        )}>
                                            {zone.label}
                                        </span>

                                        {/* Active indicator dot */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeZone"
                                                className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Primary Action: Generate Button */}
                        <motion.button
                            onClick={commitCommands}
                            disabled={!hasPendingChanges || isProcessing}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "relative h-14 w-14 rounded-2xl font-bold flex items-center justify-center transition-all duration-300 overflow-hidden shrink-0",
                                hasPendingChanges && !isProcessing
                                    ? "bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30"
                                    : "bg-fill/5 text-text-tertiary"
                            )}
                        >
                            {/* Pulse ring */}
                            {hasPendingChanges && !isProcessing && (
                                <motion.div
                                    className="absolute inset-0 rounded-2xl border-2 border-primary/50"
                                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}

                            {/* Badge */}
                            {hasPendingChanges && !isProcessing && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background shadow-lg z-10"
                                >
                                    {pendingCount}
                                </motion.div>
                            )}

                            {isProcessing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Wand2 size={22} className={hasPendingChanges ? "animate-pulse" : ""} />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ZONE SHEET (Slide-up Layer 1) */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <MobileZoneSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                zoneId={expandedZone}
            />
        </>
    );
};

export default MobileCommandDock;
