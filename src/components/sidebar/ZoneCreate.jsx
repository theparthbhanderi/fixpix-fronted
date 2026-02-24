import React, { memo, useState, useCallback } from 'react';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import ActionCard from './ActionCard';
import { Eraser, Scissors, Wand, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDebouncedCallback } from '../../hooks/useDebounce';

/**
 * ZoneCreate - Performance Optimized Creative Tools
 */
const ZoneCreate = memo(({ isMobile }) => {
    const { enterMode } = useCommand();
    const { updateSettings } = useImage();
    const [prompt, setPrompt] = useState('');

    // Debounced settings update
    const debouncedUpdateSettings = useDebouncedCallback((value) => {
        updateSettings('prompt', value);
    }, 200);

    // Memoized handlers
    const handleEraserClick = useCallback(() => {
        enterMode('eraser');
    }, [enterMode]);

    const handlePromptChange = useCallback((e) => {
        const value = e.target.value;
        setPrompt(value);  // Immediate visual feedback
        debouncedUpdateSettings(value);  // Debounced state update
    }, [debouncedUpdateSettings]);

    return (
        <div className="space-y-3">
            {/* Magic Eraser (Mode Trigger) */}
            <button
                onClick={handleEraserClick}
                className={cn(
                    "w-full ios-material-card p-4",
                    "flex items-center justify-between",
                    "ios-press-scale"
                )}
                style={{ willChange: 'transform' }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[14px] bg-pink-500/10 text-pink-500 flex items-center justify-center">
                        <Eraser size={20} strokeWidth={1.5} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                            Magic Eraser
                        </h3>
                        <p className="text-[13px] text-[var(--text-tertiary)]">
                            Remove objects manually
                        </p>
                    </div>
                </div>
                <span className="ios-chip" style={{
                    backgroundColor: 'rgba(255, 45, 85, 0.1)',
                    color: '#FF2D55',
                    borderColor: 'rgba(255, 45, 85, 0.2)'
                }}>
                    Mode
                </span>
            </button>

            {/* Background Removal */}
            <ActionCard
                id="removeBackground"
                title="Remove Background"
                description="Make background transparent"
                icon={Scissors}
            />

            {/* Generative Edit */}
            <ActionCard
                id="generativeFill"
                title="Generative Edit"
                description="Change content via prompt"
                icon={Wand}
                badge="SDXL"
            >
                <div className="space-y-3">
                    <textarea
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="Describe what you want to change..."
                        className={cn(
                            "w-full rounded-xl p-3 text-[14px] resize-none h-20",
                            "bg-black/[0.03] dark:bg-white/[0.06]",
                            "border border-black/[0.04] dark:border-white/[0.08]",
                            "text-[var(--text-primary)]",
                            "placeholder:text-[var(--text-tertiary)]",
                            "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]/50",
                            "transition-all duration-150"
                        )}
                    />
                    <div className="flex items-center gap-2 text-[12px] text-[var(--text-tertiary)]">
                        <Sparkles size={12} className="text-[var(--accent)]" />
                        <span>Describe the change for the selected area</span>
                    </div>
                </div>
            </ActionCard>
        </div>
    );
});

ZoneCreate.displayName = 'ZoneCreate';

export default ZoneCreate;
