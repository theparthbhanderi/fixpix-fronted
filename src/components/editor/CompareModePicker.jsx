import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Columns, Square, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * CompareModePicker - Floating Mode Selector Pill
 * From EDITOR_CANVAS_SPEC.md Section 3.2
 * 
 * Features:
 * - 3 modes: Split, Side-by-Side, Flash
 * - Floating pill at top center of canvas
 * - Active state indicator
 */

const COMPARE_MODES = [
    { id: 'split', label: 'Split', icon: Columns },
    { id: 'side', label: 'S×S', icon: Square },
    { id: 'flash', label: 'Flash', icon: Zap }
];

const CompareModePicker = memo(({ mode, onModeChange }) => {
    return (
        <motion.div
            className="compare-mode-picker absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 p-1 bg-black/50 backdrop-blur-xl rounded-full border border-white/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            {COMPARE_MODES.map((modeOption) => {
                const Icon = modeOption.icon;
                const isActive = mode === modeOption.id;

                return (
                    <button
                        key={modeOption.id}
                        onClick={() => onModeChange(modeOption.id)}
                        className={cn(
                            'relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                            isActive
                                ? 'text-white'
                                : 'text-white/60 hover:text-white/80'
                        )}
                    >
                        {/* Active Background */}
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 bg-white/20 rounded-full"
                                layoutId="compare-mode-bg"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}

                        <Icon size={14} className="relative z-10" />
                        <span className="relative z-10">{modeOption.label}</span>
                    </button>
                );
            })}
        </motion.div>
    );
});

CompareModePicker.displayName = 'CompareModePicker';

export { COMPARE_MODES };
export default CompareModePicker;
