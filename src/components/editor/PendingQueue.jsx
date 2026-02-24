import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { Zap, GripVertical, X, Clock } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { COMMAND_REGISTRY } from '../../data/CommandRegistry';

/**
 * PendingQueue - AI Pipeline Queue Panel
 * From EDITOR_TOOLS_SPEC.md Section 4
 * 
 * Features:
 * - Header with Zap icon, step count, time estimate
 * - Drag-reorderable queue items
 * - Remove individual items
 * - Clear all button
 */

// Time estimates per tool (in seconds)
const TOOL_TIME_ESTIMATES = {
    faceRestoration: 4,
    removeScratches: 3,
    colorize: 5,
    upscaleX: 6,
    autoEnhance: 2,
    removeBackground: 3,
    default: 3
};

const getEstimatedTime = (toolId) => {
    return TOOL_TIME_ESTIMATES[toolId] || TOOL_TIME_ESTIMATES.default;
};

const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

// Queue Item Component
const QueueItem = memo(({ item, index, onRemove }) => {
    const controls = useDragControls();
    const Tool = COMMAND_REGISTRY[item.id];
    const Icon = Tool?.icon;

    return (
        <Reorder.Item
            value={item}
            dragControls={controls}
            dragListener={false}
            className="queue-item flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.04)] rounded-xl mb-2 cursor-grab active:cursor-grabbing active:bg-[rgba(99,102,241,0.1)]"
        >
            {/* Drag Handle */}
            <div
                className="queue-drag-handle text-[var(--ios-text-tertiary)] cursor-grab hover:text-[var(--ios-text-secondary)] transition-colors"
                onPointerDown={(e) => controls.start(e)}
            >
                <GripVertical size={14} />
            </div>

            {/* Order Number */}
            <div className="w-5 h-5 flex items-center justify-center bg-[rgba(99,102,241,0.2)] text-[var(--accent-primary)] rounded-md text-[11px] font-bold">
                {index + 1}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={14} className="text-[var(--accent-primary)]" />}
                    <span className="text-[13px] font-medium text-[var(--ios-text-primary)] truncate">
                        {Tool?.label || item.id}
                    </span>
                    {item.value !== true && (
                        <span className="text-[11px] text-[var(--ios-text-tertiary)]">
                            {typeof item.value === 'number' ? `${item.value}×` : item.value}
                        </span>
                    )}
                </div>
            </div>

            {/* Time Estimate */}
            <span className="text-[11px] text-[var(--ios-text-tertiary)] flex items-center gap-1">
                <Clock size={10} />
                ~{getEstimatedTime(item.id)}s
            </span>

            {/* Remove Button */}
            <button
                onClick={() => onRemove(item.id)}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-red-500 transition-all p-1"
            >
                <X size={14} />
            </button>
        </Reorder.Item>
    );
});

QueueItem.displayName = 'QueueItem';

// Main PendingQueue Component
const PendingQueue = memo(() => {
    const { pendingQueue, toggleCommand, clearQueue } = useCommand();

    // Convert object to array for Reorder
    const items = useMemo(() =>
        Object.entries(pendingQueue).map(([id, value]) => ({
            id,
            value
        })),
        [pendingQueue]
    );

    const totalTime = useMemo(() =>
        items.reduce((sum, item) => sum + getEstimatedTime(item.id), 0),
        [items]
    );

    const handleRemove = (toolId) => {
        toggleCommand(toolId, false);
    };

    const handleReorder = (newItems) => {
        // For now, we just update visually - full reorder would need context update
        // This is a simplified version that shows the UI
    };

    if (items.length === 0) return null;

    return (
        <motion.div
            className="pending-queue mx-4 mb-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-[16px] overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
            {/* Header */}
            <div className="queue-header flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[var(--accent-primary)]" />
                    <span className="text-[13px] font-semibold text-[var(--ios-text-primary)]">
                        AI Pipeline
                    </span>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[var(--ios-text-tertiary)]">
                    <span>{items.length} {items.length === 1 ? 'step' : 'steps'}</span>
                    <span>~{formatTime(totalTime)}</span>
                    <button
                        onClick={clearQueue}
                        className="text-[var(--ios-text-tertiary)] hover:text-red-400 transition-colors text-[11px] font-medium"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Reorderable List */}
            <Reorder.Group
                axis="y"
                values={items}
                onReorder={handleReorder}
                className="p-3"
            >
                <AnimatePresence>
                    {items.map((item, index) => (
                        <QueueItem
                            key={item.id}
                            item={item}
                            index={index}
                            onRemove={handleRemove}
                        />
                    ))}
                </AnimatePresence>
            </Reorder.Group>
        </motion.div>
    );
});

PendingQueue.displayName = 'PendingQueue';

export default PendingQueue;
