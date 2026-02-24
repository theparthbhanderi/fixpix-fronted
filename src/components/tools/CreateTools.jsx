import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eraser, Scissors, Wand, Sparkles } from 'lucide-react';
import ToolCard from '../editor/ToolCard';
import { useImage } from '../../context/ImageContext';
import { useCommand } from '../../context/CommandContext';
import { useDebouncedCallback } from '../../hooks/useDebounce';
import { cn } from '../../lib/utils';

/**
 * CreateTools - Creative Tool Panel
 * Uses new ToolCard component from EDITOR_REDESIGN_SPEC
 * 
 * Tools:
 * - Magic Eraser (focus mode)
 * - Remove Background
 * - Generative Edit
 */

const CreateTools = memo(() => {
    const { updateSettings, settings } = useImage();
    const { toggleCommand, pendingQueue, enterMode } = useCommand();
    const [prompt, setPrompt] = useState('');

    // Debounced settings update
    const debouncedUpdateSettings = useDebouncedCallback((value) => {
        updateSettings('prompt', value);
    }, 200);

    const handleEraserClick = useCallback(() => {
        enterMode('eraser');
    }, [enterMode]);

    const handlePromptChange = useCallback((e) => {
        const value = e.target.value;
        setPrompt(value);
        debouncedUpdateSettings(value);
    }, [debouncedUpdateSettings]);

    const isToolActive = (id) => !!settings[id];
    const isToolPending = (id) => pendingQueue && id in pendingQueue;

    return (
        <div className="space-y-3">
            {/* Magic Eraser (Mode Button) */}
            <motion.button
                onClick={handleEraserClick}
                className={cn(
                    "w-full tool-card flex items-center gap-3 p-4",
                    "hover:bg-[rgba(var(--studio-glow),0.08)]"
                )}
                whileTap={{ scale: 0.98 }}
            >
                <div className="tool-card-icon bg-pink-500/10 text-pink-500">
                    <Eraser size={20} />
                </div>
                <div className="flex-1 text-left">
                    <span className="tool-card-title">Magic Eraser</span>
                    <p className="tool-card-description">Remove objects manually</p>
                </div>
                <span className="px-2 py-1 rounded-full bg-pink-500/10 text-pink-500 text-[11px] font-semibold">
                    Mode
                </span>
            </motion.button>

            {/* Remove Background */}
            <ToolCard
                id="removeBackground"
                icon={Scissors}
                title="Remove Background"
                description="Make background transparent"
                isActive={isToolActive('removeBackground')}
                isPending={isToolPending('removeBackground')}
                onToggle={(active) => toggleCommand('removeBackground', active)}
            />

            {/* Generative Edit */}
            <ToolCard
                id="generativeFill"
                icon={Wand}
                title="Generative Edit"
                description="Change content via prompt"
                isActive={isToolActive('generativeFill')}
                isPending={isToolPending('generativeFill')}
                onToggle={(active) => toggleCommand('generativeFill', active)}
            >
                <div className="space-y-3">
                    <textarea
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="Describe what you want to change..."
                        className={cn(
                            "w-full rounded-xl p-3 text-[14px] resize-none h-20",
                            "bg-[rgba(var(--studio-glow),0.04)]",
                            "border border-[var(--glass-border)]",
                            "text-[var(--ios-text-primary)]",
                            "placeholder:text-[var(--ios-text-tertiary)]",
                            "focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]/50",
                            "transition-all duration-150"
                        )}
                    />
                    <div className="flex items-center gap-2 text-[12px] text-[var(--ios-text-tertiary)]">
                        <Sparkles size={12} className="text-[var(--accent-primary)]" />
                        <span>Describe the change for the selected area</span>
                    </div>
                </div>
            </ToolCard>
        </div>
    );
});

CreateTools.displayName = 'CreateTools';

export default CreateTools;
