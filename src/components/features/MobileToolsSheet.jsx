import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Upload, Zap, Download, Wand2, Sparkles, Sliders, Palette, Crop, Eraser } from 'lucide-react';
import { ImageContext } from '../../context/ImageContext';
import { apiEndpoints } from '../../lib/api';
import { useToast } from '../ui/Toast';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';
import ProcessingSteps from '../ui/ProcessingSteps';
import { cn } from '../../lib/utils';

/**
 * MobileToolsSheet - Theme-aware iOS-style bottom sheet
 * Uses design tokens from index.css for light/dark mode support
 */

// Tab component
const Tab = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex-1 flex flex-col items-center py-2 rounded-lg transition-colors",
            active
                ? "bg-primary/15 text-primary"
                : "text-text-secondary active:bg-fill/10"
        )}
    >
        <Icon className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">{label}</span>
    </button>
);

// Range slider with theme
const Slider = ({ label, value, min, max, step, onChange }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs">
            <span className="text-text-secondary">{label}</span>
            <span className="text-text-main font-medium">{value.toFixed(1)}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-fill/20 rounded-full appearance-none cursor-pointer accent-primary"
        />
    </div>
);

// Setting row with toggle
const SettingRow = ({ label, enabled, onChange, isLast }) => (
    <div className={cn(
        "flex items-center justify-between py-3",
        !isLast && "border-b border-separator/10"
    )}>
        <span className="text-sm text-text-main">{label}</span>
        <Toggle enabled={enabled} onChange={onChange} />
    </div>
);

const MobileToolsSheet = ({ isOpen, onClose }) => {
    const {
        selectedImage,
        isProcessing,
        processImage,
        processedImage,
        settings,
        updateSettings,
        uploadImage,
        currentProject,
        isCropping,
        setIsCropping,
        isMasking,
        setIsMasking,
        // AI Generation
        isGenerating,
        generationStatus,
        generationError,
        generationLimits,
        generateImage,
        fetchGenerationLimits,
        setGenerationError
    } = useContext(ImageContext);

    const [activeTab, setActiveTab] = useState('enhance');
    const [genPrompt, setGenPrompt] = useState('');
    const [genStyle, setGenStyle] = useState('photorealistic');
    const toast = useToast();
    const dragControls = useDragControls();

    // Fetch generation limits on mount
    useEffect(() => {
        if (isOpen) {
            fetchGenerationLimits();
        }
    }, [isOpen]);

    const [processingSteps, setProcessingSteps] = useState([
        { id: 'analyze', label: 'Analyzing', status: 'pending' },
        { id: 'enhance', label: 'Enhancing', status: 'pending' },
        { id: 'finalize', label: 'Finalizing', status: 'pending' },
    ]);
    const [showProcessing, setShowProcessing] = useState(false);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    const handleDownload = () => {
        if (!currentProject?.id) return;
        window.open(apiEndpoints.downloadImage(currentProject.id), '_blank');
        toast.success('Download started!');
    };

    const handleGenerate = async () => {
        try {
            setShowProcessing(true);
            setProcessingSteps(s => s.map(x => x.id === 'analyze' ? { ...x, status: 'active' } : x));
            await new Promise(r => setTimeout(r, 300));
            setProcessingSteps(s => s.map(x =>
                x.id === 'analyze' ? { ...x, status: 'complete' } :
                    x.id === 'enhance' ? { ...x, status: 'active' } : x
            ));
            await processImage();
            setProcessingSteps(s => s.map(x => ({ ...x, status: 'complete' })));
            toast.success('Done!');
            setTimeout(() => {
                setShowProcessing(false);
                setProcessingSteps(s => s.map(x => ({ ...x, status: 'pending' })));
            }, 1000);
        } catch (e) {
            toast.error('Failed');
            setShowProcessing(false);
            setProcessingSteps(s => s.map(x => ({ ...x, status: 'pending' })));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* Sheet - Uses theme tokens */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                        drag="y"
                        dragControls={dragControls}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.3 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100 || info.velocity.y > 500) onClose();
                        }}
                        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl"
                        style={{
                            height: '85dvh',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            backgroundColor: 'rgb(var(--ios-surface))',
                        }}
                    >
                        {/* ═══════ HEADER (flex-shrink-0) ═══════ */}
                        <div className="flex-shrink-0">
                            {/* Drag Handle */}
                            <div
                                className="py-3 cursor-grab active:cursor-grabbing"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <div
                                    className="w-9 h-1 rounded-full mx-auto"
                                    style={{ backgroundColor: 'rgb(var(--ios-fill) / 0.3)' }}
                                />
                            </div>

                            {/* Title */}
                            <div className="flex items-center justify-between px-5 pb-3">
                                <h2
                                    className="text-lg font-semibold"
                                    style={{ color: 'rgb(var(--ios-label))' }}
                                >
                                    Editing Tools
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                                    style={{ backgroundColor: 'rgb(var(--ios-fill) / 0.1)' }}
                                >
                                    <X className="w-4 h-4" style={{ color: 'rgb(var(--ios-label-secondary))' }} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1 px-4 pb-2">
                                <Tab icon={Wand2} label="Enhance" active={activeTab === 'enhance'} onClick={() => setActiveTab('enhance')} />
                                <Tab icon={Sparkles} label="Magic" active={activeTab === 'magic'} onClick={() => setActiveTab('magic')} />
                                <Tab icon={Sliders} label="Adjust" active={activeTab === 'adjust'} onClick={() => setActiveTab('adjust')} />
                                <Tab icon={Palette} label="Filters" active={activeTab === 'filters'} onClick={() => setActiveTab('filters')} />
                            </div>
                        </div>

                        {/* ═══════ SCROLLABLE CONTENT (flex-1) ═══════ */}
                        <div
                            className="flex-1 overflow-y-auto px-4 pt-2 pb-4"
                            style={{
                                WebkitOverflowScrolling: 'touch',
                                overscrollBehavior: 'contain',
                            }}
                        >
                            {activeTab === 'enhance' && (
                                <div className="space-y-4">
                                    {/* Restore & Fix */}
                                    <div>
                                        <p
                                            className="text-[10px] font-bold uppercase tracking-wider mb-2"
                                            style={{ color: 'rgb(var(--ios-label-tertiary))' }}
                                        >
                                            Restore & Fix
                                        </p>
                                        <div
                                            className="rounded-xl px-4"
                                            style={{ backgroundColor: 'rgb(var(--ios-fill) / 0.05)' }}
                                        >
                                            <SettingRow label="Face Restoration" enabled={settings.faceRestoration} onChange={v => updateSettings({ faceRestoration: v })} />
                                            <SettingRow label="Scratch Removal" enabled={settings.removeScratches} onChange={v => updateSettings({ removeScratches: v })} isLast />
                                        </div>
                                    </div>

                                    {/* Creative */}
                                    <div>
                                        <p
                                            className="text-[10px] font-bold uppercase tracking-wider mb-2"
                                            style={{ color: 'rgb(var(--ios-label-tertiary))' }}
                                        >
                                            Creative
                                        </p>
                                        <div
                                            className="rounded-xl px-4"
                                            style={{ backgroundColor: 'rgb(var(--ios-fill) / 0.05)' }}
                                        >
                                            <SettingRow label="Colorization" enabled={settings.colorize} onChange={v => updateSettings({ colorize: v })} isLast />
                                        </div>
                                    </div>

                                    {/* Upscaling */}
                                    <div>
                                        <p
                                            className="text-[10px] font-bold uppercase tracking-wider mb-2"
                                            style={{ color: 'rgb(var(--ios-label-tertiary))' }}
                                        >
                                            Upscaling
                                        </p>
                                        <div className="flex gap-2">
                                            {[1, 2, 4].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateSettings({ upscaleX: s })}
                                                    className={cn(
                                                        "flex-1 py-3 rounded-xl text-sm font-semibold transition-colors",
                                                        settings.upscaleX === s
                                                            ? "bg-primary text-white"
                                                            : "text-text-secondary"
                                                    )}
                                                    style={settings.upscaleX !== s ? { backgroundColor: 'rgb(var(--ios-fill) / 0.08)' } : undefined}
                                                >
                                                    {s === 1 ? 'Off' : `${s}×`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Crop */}
                                    <div>
                                        <p
                                            className="text-[10px] font-bold uppercase tracking-wider mb-2"
                                            style={{ color: 'rgb(var(--ios-label-tertiary))' }}
                                        >
                                            Tools
                                        </p>
                                        <button
                                            onClick={() => { setIsCropping(!isCropping); onClose(); }}
                                            className={cn(
                                                "w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2",
                                                isCropping ? "bg-primary text-white" : "text-text-secondary"
                                            )}
                                            style={!isCropping ? { backgroundColor: 'rgb(var(--ios-fill) / 0.08)' } : undefined}
                                        >
                                            <Crop className="w-4 h-4" /> Crop Image
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'magic' && (
                                <div className="space-y-4">
                                    {/* AI Image Generation Section */}
                                    <div
                                        className="rounded-xl p-4 space-y-4"
                                        style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))' }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p
                                                className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                                                style={{ color: 'rgb(168, 85, 247)' }}
                                            >
                                                <Sparkles className="w-3.5 h-3.5" />
                                                AI Image Generation
                                            </p>
                                            {generationLimits && (
                                                <span className="text-[9px] text-text-secondary bg-white/10 px-2 py-0.5 rounded-full">
                                                    {generationLimits.remaining}/{generationLimits.daily_limit} left
                                                </span>
                                            )}
                                        </div>

                                        {/* Prompt Input */}
                                        <textarea
                                            value={genPrompt}
                                            onChange={(e) => {
                                                setGenPrompt(e.target.value);
                                                if (generationError) setGenerationError(null);
                                            }}
                                            placeholder="Describe your image..."
                                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-text-main placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            rows={2}
                                            maxLength={500}
                                            disabled={isGenerating}
                                        />

                                        {/* Style Selector */}
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { key: 'photorealistic', label: 'Photo', icon: '📷' },
                                                { key: 'artistic', label: 'Artistic', icon: '🎨' },
                                                { key: 'anime', label: 'Anime', icon: '✨' },
                                            ].map((style) => (
                                                <button
                                                    key={style.key}
                                                    onClick={() => setGenStyle(style.key)}
                                                    disabled={isGenerating}
                                                    className={cn(
                                                        "py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1",
                                                        genStyle === style.key
                                                            ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                                                            : "bg-white/5 text-text-secondary border border-white/10"
                                                    )}
                                                >
                                                    <span>{style.icon}</span>
                                                    {style.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Error/Status */}
                                        {generationError && (
                                            <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg">{generationError}</p>
                                        )}
                                        {isGenerating && generationStatus && (
                                            <div className="flex items-center gap-2 text-xs text-purple-300">
                                                <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                                {generationStatus}
                                            </div>
                                        )}

                                        {/* Generate Button */}
                                        <button
                                            onClick={async () => {
                                                const result = await generateImage(genPrompt, genStyle);
                                                if (result) {
                                                    toast.success('Image generated!');
                                                    setGenPrompt('');
                                                    onClose();
                                                }
                                            }}
                                            disabled={isGenerating || !genPrompt.trim() || (generationLimits && generationLimits.remaining <= 0)}
                                            className={cn(
                                                "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                                                (isGenerating || !genPrompt.trim())
                                                    ? "bg-purple-500/30 text-white/50 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                            )}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4" />
                                                    Generate Image
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[9px] text-text-tertiary text-center">
                                            Takes 2-3 minutes
                                        </p>
                                    </div>

                                    {/* Existing Magic Tools */}
                                    <div
                                        className="rounded-xl px-4"
                                        style={{ backgroundColor: 'rgb(var(--ios-fill) / 0.05)' }}
                                    >
                                        <SettingRow label="Auto Enhance" enabled={settings.autoEnhance} onChange={v => updateSettings({ autoEnhance: v })} />
                                        <SettingRow label="Remove Background" enabled={settings.removeBackground} onChange={v => updateSettings({ removeBackground: v })} isLast />
                                    </div>
                                    <button
                                        onClick={() => { setIsMasking(!isMasking); onClose(); }}
                                        className={cn(
                                            "w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2",
                                            isMasking ? "bg-primary text-white" : "text-text-secondary"
                                        )}
                                        style={!isMasking ? { backgroundColor: 'rgb(var(--ios-fill) / 0.08)' } : undefined}
                                    >
                                        <Eraser className="w-4 h-4" /> Object Eraser
                                    </button>
                                </div>
                            )}

                            {activeTab === 'adjust' && (
                                <div
                                    className="space-y-5 rounded-xl p-4"
                                    style={{ backgroundColor: 'rgb(var(--ios-fill) / 0.05)' }}
                                >
                                    <Slider label="Brightness" value={settings.brightness || 1} min={0.5} max={1.5} step={0.1} onChange={v => updateSettings({ brightness: v })} />
                                    <Slider label="Contrast" value={settings.contrast || 1} min={0.5} max={1.5} step={0.1} onChange={v => updateSettings({ contrast: v })} />
                                    <Slider label="Saturation" value={settings.saturation || 1} min={0} max={2} step={0.1} onChange={v => updateSettings({ saturation: v })} />
                                </div>
                            )}

                            {activeTab === 'filters' && (
                                <div className="grid grid-cols-3 gap-2">
                                    {['none', 'vintage', 'cinematic', 'warm', 'cool', 'bw'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => updateSettings({ filterPreset: f })}
                                            className={cn(
                                                "py-3 rounded-xl text-xs font-medium capitalize",
                                                (settings.filterPreset || 'none') === f
                                                    ? "bg-primary text-white"
                                                    : "text-text-secondary"
                                            )}
                                            style={(settings.filterPreset || 'none') !== f ? { backgroundColor: 'rgb(var(--ios-fill) / 0.08)' } : undefined}
                                        >
                                            {f === 'bw' ? 'B&W' : f === 'none' ? 'None' : f}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ═══════ ACTION BAR (flex-shrink-0, ALWAYS visible) ═══════ */}
                        <div
                            className="flex-shrink-0 px-4 pt-3 space-y-2"
                            style={{
                                backgroundColor: 'rgb(var(--ios-surface))',
                                paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 12px))',
                                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
                                borderTop: '1px solid rgb(var(--ios-separator) / 0.15)',
                            }}
                        >
                            {showProcessing && <ProcessingSteps steps={processingSteps} />}

                            {/* Upload */}
                            {selectedImage && (
                                <label className="block relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])}
                                    />
                                    <div
                                        className="w-full py-3 rounded-xl text-center text-sm font-medium flex items-center justify-center gap-2"
                                        style={{
                                            border: '1px solid rgb(var(--ios-separator) / 0.3)',
                                            color: 'rgb(var(--ios-label-secondary))',
                                        }}
                                    >
                                        <Upload className="w-4 h-4" /> Upload New
                                    </div>
                                </label>
                            )}

                            {/* Generate - PRIMARY CTA */}
                            <button
                                onClick={handleGenerate}
                                disabled={!selectedImage || isProcessing}
                                className={cn(
                                    "w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all",
                                    (!selectedImage || isProcessing)
                                        ? "bg-primary/30 text-white/50 cursor-not-allowed"
                                        : "bg-primary text-white shadow-lg shadow-primary/30 active:scale-[0.98]"
                                )}
                            >
                                <Zap className="w-5 h-5" />
                                {isProcessing ? 'Processing...' : processedImage ? 'Update' : 'Generate'}
                            </button>

                            {/* Save */}
                            {processedImage && (
                                <button
                                    onClick={handleDownload}
                                    className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-violet-500/20 active:scale-[0.98] transition-all tracking-wide"
                                >
                                    <Download className="w-5 h-5" /> Save
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileToolsSheet;
