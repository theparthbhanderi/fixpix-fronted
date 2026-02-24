import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ZONES } from '../../data/CommandRegistry';

// Import zone content components
import ZoneRestore from './ZoneRestore';
import ZoneEnhance from './ZoneEnhance';
import ZoneCreate from './ZoneCreate';
import ZoneAdjust from './ZoneAdjust';
import ZoneInsight from './ZoneInsight';

/**
 * Zone content renderer
 */
const ZoneRenderer = ({ zoneId }) => {
    switch (zoneId) {
        case 'restore': return <ZoneRestore isMobile />;
        case 'enhance': return <ZoneEnhance isMobile />;
        case 'create': return <ZoneCreate isMobile />;
        case 'adjust': return <ZoneAdjust isMobile />;
        case 'insight': return <ZoneInsight isMobile />;
        default: return null;
    }
};

/**
 * MobileZoneSheet v2.0
 * Slide-up command sheet for mobile zone interactions
 */
const MobileZoneSheet = ({ isOpen, onClose, zoneId }) => {
    const activeZone = ZONES[zoneId?.toUpperCase()] || ZONES.RESTORE;
    const sheetRef = useRef(null);
    const ZoneIcon = activeZone.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ─── Backdrop ─── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
                    />

                    {/* ─── Sheet ─── */}
                    <motion.div
                        ref={sheetRef}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100 || info.velocity.y > 500) {
                                onClose();
                            }
                        }}
                        className="fixed bottom-0 left-0 right-0 z-[70] bg-black/90 backdrop-blur-2xl border-t border-white/10 rounded-t-[28px] max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* ─── Handle & Header ─── */}
                        <div className="flex flex-col items-center pt-3 pb-4 border-b border-white/5">
                            {/* Drag Handle */}
                            <div className="w-10 h-1 bg-white/20 rounded-full mb-4" />

                            {/* Zone Header */}
                            <div className="flex items-center justify-between w-full px-5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl bg-${activeZone.color || 'blue'}-500/20 flex items-center justify-center`}>
                                        <ZoneIcon size={18} className={`text-${activeZone.color || 'blue'}-400`} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-text-main">
                                            {activeZone.label}
                                        </h2>
                                        <p className="text-xs text-text-tertiary">
                                            Select tools to apply
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-text-tertiary transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* ─── Content Area ─── */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 custom-scrollbar">
                            <ZoneRenderer zoneId={zoneId} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileZoneSheet;
