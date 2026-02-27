import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { useToast } from '../ui/Toast';
import ActionCard from './ActionCard';
import { Eraser, Scissors, Wand, Sparkles, ImagePlus, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDebouncedCallback } from '../../hooks/useDebounce';

/**
 * ZoneCreate - Performance Optimized Creative Tools (with Text to Image)
 */

const STYLES = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'anime', label: 'Anime' },
];



const ZoneCreate = memo(({ isMobile }) => {
    const { enterMode } = useCommand();
    const { updateSettings, generateFromText, isGenerating, generationError } = useImage();
    const toast = useToast();

    const [prompt, setPrompt] = useState('');
    const [genPrompt, setGenPrompt] = useState('');
    const [style, setStyle] = useState('realistic');

    const [showGenPanel, setShowGenPanel] = useState(true);

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
        setPrompt(value);
        debouncedUpdateSettings(value);
    }, [debouncedUpdateSettings]);

    const handleGenerate = useCallback(async () => {
        if (!genPrompt.trim()) {
            toast.warning('Please enter a prompt');
            return;
        }
        const success = await generateFromText(genPrompt, style);
        if (success) {
            toast.success('Image generated!');
        } else if (generationError) {
            toast.error(generationError);
        }
    }, [genPrompt, style, generateFromText, generationError, toast]);

    return (
        <div className="space-y-3">
            {/* ═══ Text to Image (AI) ═══ */}
            <div className={cn(
                "ios-material-card overflow-hidden",
                showGenPanel && "ring-1 ring-[#007AFF]/30"
            )}>
                <button
                    onClick={() => setShowGenPanel(!showGenPanel)}
                    className={cn(
                        "w-full p-4 flex items-center justify-between",
                        "ios-press-scale"
                    )}
                    style={{ willChange: 'transform' }}
                >
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-11 h-11 rounded-[14px] flex items-center justify-center transition-all duration-150",
                            showGenPanel
                                ? "bg-[#007AFF] text-white"
                                : "bg-purple-500/10 text-purple-500"
                        )}>
                            <ImagePlus size={20} strokeWidth={1.5} />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-2">
                                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                                    Text to Image
                                </h3>
                                <span className="ios-chip" style={{
                                    backgroundColor: 'rgba(147,51,234,0.1)',
                                    color: '#9333EA',
                                    borderColor: 'rgba(147,51,234,0.2)'
                                }}>
                                    AI
                                </span>
                            </div>
                            <p className="text-[13px] text-[var(--text-tertiary)]">
                                Generate images from text
                            </p>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: showGenPanel ? 180 : 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ opacity: 0.5 }}
                    >
                        <ChevronDown size={16} strokeWidth={1.75} />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {showGenPanel && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div className="px-4 pb-4 space-y-3">
                                <div className="h-px bg-black/[0.04] dark:bg-white/[0.08]" />

                                {/* Prompt */}
                                <textarea
                                    value={genPrompt}
                                    onChange={(e) => setGenPrompt(e.target.value)}
                                    placeholder="Describe the image you want..."
                                    disabled={isGenerating}
                                    className={cn(
                                        "w-full rounded-xl p-3 text-[14px] resize-none h-20",
                                        "bg-black/[0.03] dark:bg-white/[0.06]",
                                        "border border-black/[0.04] dark:border-white/[0.08]",
                                        "text-[var(--text-primary)]",
                                        "placeholder:text-[var(--text-tertiary)]",
                                        "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]/50",
                                        "transition-all duration-150",
                                        "disabled:opacity-50"
                                    )}
                                />

                                {/* Style */}
                                <div>
                                    <label className="text-[12px] font-medium opacity-60 mb-1.5 block">Style</label>
                                    <select
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        disabled={isGenerating}
                                        className={cn(
                                            "w-full rounded-lg px-3 py-2 text-[13px]",
                                            "bg-black/[0.03] dark:bg-white/[0.06]",
                                            "border border-black/[0.04] dark:border-white/[0.08]",
                                            "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20",
                                            "disabled:opacity-50"
                                        )}
                                        style={{ color: 'inherit', appearance: 'none', cursor: 'pointer' }}
                                    >
                                        {STYLES.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Generate Button — sticky on mobile */}
                                <motion.button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !genPrompt.trim()}
                                    whileTap={{ scale: 0.97 }}
                                    className={cn(
                                        "w-full h-11 rounded-xl text-[14px] font-semibold",
                                        "flex items-center justify-center gap-2",
                                        "transition-all duration-150",
                                        isGenerating
                                            ? "bg-[var(--accent)]/12"
                                            : genPrompt.trim()
                                                ? "bg-[#007AFF] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                                                : "bg-black/[0.03] dark:bg-white/[0.06] opacity-50",
                                        "disabled:cursor-not-allowed"
                                    )}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={14} />
                                            <span>Generate Image</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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
