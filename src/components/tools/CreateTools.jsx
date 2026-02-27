import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eraser, Scissors, Wand, Sparkles, ImagePlus, Loader2, ChevronDown } from 'lucide-react';
import ToolCard from '../editor/ToolCard';
import { useImage } from '../../context/ImageContext';
import { useCommand } from '../../context/CommandContext';
import { useToast } from '../ui/Toast';
import { useDebouncedCallback } from '../../hooks/useDebounce';
import { cn } from '../../lib/utils';

/**
 * CreateTools - Creative Tool Panel
 * Uses new ToolCard component from EDITOR_REDESIGN_SPEC
 * 
 * Tools:
 * - Text to Image (AI)
 * - Magic Eraser (focus mode)
 * - Remove Background
 * - Generative Edit
 */

const STYLES = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'anime', label: 'Anime' },
];



const CreateTools = memo(() => {
    const { updateSettings, settings, generateFromText, isGenerating, generationError } = useImage();
    const { toggleCommand, pendingQueue, enterMode } = useCommand();
    const toast = useToast();

    const [prompt, setPrompt] = useState('');
    const [genPrompt, setGenPrompt] = useState('');
    const [style, setStyle] = useState('realistic');

    const [showGenPanel, setShowGenPanel] = useState(true);

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

    const isToolActive = (id) => !!settings[id];
    const isToolPending = (id) => pendingQueue && id in pendingQueue;

    return (
        <div className="space-y-3">
            {/* ═══ Text to Image (AI) ═══ */}
            <motion.div
                style={{
                    borderRadius: 'var(--radius-xl)',
                    border: `1px solid ${showGenPanel ? 'rgba(0,122,255,0.35)' : 'var(--tool-card-border, rgba(255,255,255,0.06))'}`,
                    background: 'var(--tool-card-bg, rgba(255,255,255,0.04))',
                    transition: 'all 180ms ease',
                }}
                layout
            >
                {/* Header Row */}
                <motion.button
                    onClick={() => setShowGenPanel(!showGenPanel)}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: '14px 16px',
                        minHeight: 60,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: 'inherit',
                    }}
                >
                    <div style={{
                        width: 36, height: 36,
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: showGenPanel ? '#007AFF' : 'rgba(147,51,234,0.1)',
                        color: showGenPanel ? '#fff' : '#9333EA',
                        transition: 'all 180ms ease',
                    }}>
                        <ImagePlus size={18} strokeWidth={1.75} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.2px' }}>
                                Text to Image
                            </span>
                            <span style={{
                                padding: '2px 6px',
                                fontSize: 10, fontWeight: 700,
                                textTransform: 'uppercase',
                                background: 'rgba(147,51,234,0.1)',
                                color: '#9333EA',
                                borderRadius: 6,
                            }}>
                                AI
                            </span>
                        </div>
                        <p style={{
                            fontSize: 13, marginTop: 2,
                            opacity: 0.5,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            Generate images from text prompts
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: showGenPanel ? 180 : 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ flexShrink: 0, opacity: 0.5 }}
                    >
                        <ChevronDown size={16} strokeWidth={1.75} />
                    </motion.div>
                </motion.button>

                {/* Expanded Generate Panel */}
                <AnimatePresence>
                    {showGenPanel && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{ padding: '0 14px 14px' }}>
                                <div style={{
                                    height: 1,
                                    background: 'var(--glass-border)',
                                    marginBottom: 'var(--space-4)',
                                }} />

                                {/* Prompt Textarea */}
                                <div style={{ marginBottom: 'var(--space-3)' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: 12, fontWeight: 500,
                                        opacity: 0.6,
                                        marginBottom: 6,
                                    }}>
                                        Prompt
                                    </label>
                                    <textarea
                                        value={genPrompt}
                                        onChange={(e) => setGenPrompt(e.target.value)}
                                        placeholder="Describe the image you want..."
                                        disabled={isGenerating}
                                        className={cn(
                                            "w-full rounded-xl p-3 text-[14px] resize-none h-20",
                                            "bg-[rgba(var(--studio-glow),0.04)]",
                                            "border border-[var(--glass-border)]",
                                            "text-[var(--ios-text-primary)]",
                                            "placeholder:text-[var(--ios-text-tertiary)]",
                                            "focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]/50",
                                            "transition-all duration-150",
                                            "disabled:opacity-50"
                                        )}
                                    />
                                </div>

                                {/* Style Selection */}
                                <div style={{
                                    marginBottom: 'var(--space-3)',
                                }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: 12, fontWeight: 500,
                                        opacity: 0.6,
                                        marginBottom: 6,
                                    }}>
                                        Style
                                    </label>
                                    <select
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        disabled={isGenerating}
                                        className={cn(
                                            "w-full rounded-lg px-3 py-2 text-[13px]",
                                            "bg-[rgba(var(--studio-glow),0.04)]",
                                            "border border-[var(--glass-border)]",
                                            "focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20",
                                            "transition-all duration-150",
                                            "disabled:opacity-50"
                                        )}
                                        style={{ color: 'inherit', appearance: 'none', cursor: 'pointer' }}
                                    >
                                        {STYLES.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Generate Button */}
                                <motion.button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !genPrompt.trim()}
                                    whileHover={!isGenerating && genPrompt.trim() ? { filter: 'brightness(1.05)' } : {}}
                                    whileTap={!isGenerating && genPrompt.trim() ? { scale: 0.97 } : {}}
                                    style={{
                                        width: '100%',
                                        height: 44,
                                        borderRadius: 'var(--radius-lg)',
                                        border: 'none',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: isGenerating || !genPrompt.trim() ? 'not-allowed' : 'pointer',
                                        background: isGenerating ? 'rgba(0,122,255,0.12)' : genPrompt.trim() ? '#007AFF' : 'rgba(255,255,255,0.06)',
                                        color: genPrompt.trim() && !isGenerating ? '#fff' : 'inherit',
                                        opacity: isGenerating || !genPrompt.trim() ? 0.6 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        transition: 'all 180ms ease',
                                        boxShadow: genPrompt.trim() && !isGenerating
                                            ? 'inset 0 1px 0 rgba(255,255,255,0.25)'
                                            : 'none',
                                    }}
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
            </motion.div>

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
