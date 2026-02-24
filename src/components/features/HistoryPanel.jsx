import React, { useContext } from 'react';
import { ImageContext } from '../../context/ImageContext';
import { Clock, CheckCircle2, Circle, Wand2, Sliders, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPanel = () => {
    const { historyLog, jumpToHistory, historyIndex } = useContext(ImageContext);

    // Helper to determine a label for the history step
    // Since we only store settings state, we infer the action from diffs potentially,
    // or just use generic labels for now. 
    // Ideally, pass an 'actionName' to setSettings in useHistory, but for V1 we'll list "Edit #N"
    // IMPROVEMENT: In future, update useHistory to accept metadata.

    // For now, let's just show "State X" which is better than nothing, 
    // but effectively we want "Original", "Change 1", "Change 2".

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border-light">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Time Machine
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                    Click to revert your image to any previous state.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {historyLog.map((step, index) => {
                        const isActive = index === historyIndex;
                        const isFuture = index > historyIndex;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: isFuture ? 0.5 : 1, x: 0 }}
                                className={`
                                    relative p-3 rounded-xl border cursor-pointer transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(var(--primary-color)/0.3)]'
                                        : 'bg-glass border-border-light hover:bg-surface-highlight'
                                    }
                                `}
                                onClick={() => jumpToHistory(index)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                        ${isActive ? 'bg-primary text-white' : 'bg-surface text-text-secondary'}
                                    `}>
                                        {index === 0 ? <RotateCcw size={14} /> : <Sliders size={14} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-text-main'}`}>
                                            {index === 0 ? "Original Image" : `Edit Step #${index}`}
                                        </p>
                                        <p className="text-xs text-text-secondary">
                                            {index === 0 ? "Started Session" : "Adjusted Settings"}
                                        </p>
                                    </div>

                                    {isActive && (
                                        <motion.div layoutId="activeCheck">
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Connector Line */}
                                {index < historyLog.length - 1 && (
                                    <div className="absolute left-[27px] top-[48px] w-[2px] h-[10px] bg-border-light z-0" />
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HistoryPanel;
