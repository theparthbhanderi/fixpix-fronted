import React, { useState, useContext, useEffect } from 'react';
import { Sliders, Zap, Check, Wand2, Download, AlertCircle, Upload, Crop, Undo, Redo, RotateCcw, Sparkles, Eraser, Palette } from 'lucide-react';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';
import SmartTooltip from '../ui/SmartTooltip';
import ProcessingSteps from '../ui/ProcessingSteps';
import { cn } from '../../lib/utils';
import { ImageContext } from '../../context/ImageContext';
import { apiEndpoints } from '../../lib/api';
import { useToast } from '../ui/Toast';

// Keyboard shortcut hint badge
const KeyboardHint = ({ shortcut }) => (
    <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded border border-white/20 text-text-secondary hidden md:inline">
        {shortcut}
    </span>
);

const ToolTab = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 text-sm font-medium gap-1",
            active
                ? "bg-primary/20 text-primary shadow-sm border border-primary/20"
                : "text-text-secondary hover:bg-white/5 hover:text-text-main"
        )}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);



const RangeSlider = ({ label, value, min, max, step, onChange }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
            <span className="text-text-secondary dark:text-white/60">{label}</span>
            <span className="text-text-main dark:text-white/80">{value}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-300 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
        />
    </div>
);

const ToolsPanel = ({ isMobile, className }) => {
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
        undoSettings,
        redoSettings,
        canUndo,
        canRedo,
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

    // Fetch generation limits on mount
    useEffect(() => {
        fetchGenerationLimits();
    }, []);

    // Processing steps state
    const [processingSteps, setProcessingSteps] = useState([
        { id: 'analyze', label: 'Analyzing image', status: 'pending' },
        { id: 'enhance', label: 'Applying enhancements', status: 'pending' },
        { id: 'restore', label: 'Restoring details', status: 'pending' },
        { id: 'finalize', label: 'Finalizing output', status: 'pending' },
    ]);
    const [showProcessing, setShowProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');

    const handleDownload = () => {
        if (!currentProject?.id) return;
        const downloadUrl = apiEndpoints.downloadImage(currentProject.id);
        window.open(downloadUrl, '_blank');
        toast.success('Download started!');
    };

    const handleGenerate = async () => {
        try {
            // Show processing steps
            setShowProcessing(true);
            setProcessingStatus('Processing started');

            // Step 1: Analyzing
            setProcessingSteps(prev => prev.map(s =>
                s.id === 'analyze' ? { ...s, status: 'active' } : s
            ));
            await new Promise(r => setTimeout(r, 400));

            // Step 2: Enhance
            setProcessingSteps(prev => prev.map(s =>
                s.id === 'analyze' ? { ...s, status: 'complete' } :
                    s.id === 'enhance' ? { ...s, status: 'active' } : s
            ));
            setProcessingStatus('Applying enhancements');

            // Actual processing
            await processImage();

            // Step 3 & 4: Complete
            setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'complete' })));
            setProcessingStatus('Processing complete');

            toast.success('Image processed successfully!', { title: 'Processing Complete' });

            // Hide after delay
            setTimeout(() => {
                setShowProcessing(false);
                setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));
            }, 1500);
        } catch (err) {
            toast.error('Processing failed. Please try again.');
            setShowProcessing(false);
            setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));
        }
    };

    // Calculate action bar height dynamically
    const actionBarHeight = isMobile ? (selectedImage ? (processedImage ? '220px' : '160px') : '100px') : 'auto';

    return (
        <aside
            className={cn(
                "flex flex-col transition-all duration-300",
                isMobile
                    ? "w-full h-full relative"
                    : "w-full h-full border-l border-separator/20 bg-surface/50 overflow-hidden",
                className
            )}
            style={{
                backgroundColor: isMobile ? 'transparent' : 'rgb(var(--ios-surface) / 0.5)',
            }}
        >
            {/* ========== SECTION A: HEADER (Fixed, never scrolls) ========== */}
            <div
                className="p-4 border-b flex items-center justify-between flex-shrink-0"
                style={{ borderColor: 'rgb(var(--ios-separator) / 0.15)' }}
            >
                <h2 className="text-lg font-bold text-text-main">Adjustments</h2>
                <Button
                    variant={isCropping ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setIsCropping(!isCropping)}
                    disabled={!selectedImage || isProcessing}
                    title="Crop Image"
                    className="ml-auto"
                >
                    <Crop className="w-4 h-4 mr-2" />
                    Crop
                </Button>
            </div>

            {/* ========== SECTION: TABS (Fixed, never scrolls) ========== */}
            <div
                className="px-4 py-3 border-b flex gap-1.5 flex-shrink-0"
                style={{ borderColor: 'rgb(var(--ios-separator) / 0.1)' }}
            >
                <ToolTab
                    icon={Wand2}
                    label="Enhance"
                    active={activeTab === 'enhance'}
                    onClick={() => setActiveTab('enhance')}
                />
                <ToolTab
                    icon={Sparkles}
                    label="Magic"
                    active={activeTab === 'magic'}
                    onClick={() => setActiveTab('magic')}
                />
                <ToolTab
                    icon={Sliders}
                    label="Adjust"
                    active={activeTab === 'adjust'}
                    onClick={() => setActiveTab('adjust')}
                />
                <ToolTab
                    icon={Palette}
                    label="Filters"
                    active={activeTab === 'filters'}
                    onClick={() => setActiveTab('filters')}
                />
            </div>

            {/* ========== SECTION B: SCROLLABLE CONTENT ========== */}
            <div
                className="flex-1 overflow-y-auto min-h-0 p-5 space-y-6 overscroll-contain"
                style={{
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    // Reserve space for action bar on mobile
                    paddingBottom: isMobile ? actionBarHeight : '24px',
                }}
            >
                {activeTab === 'enhance' && (
                    <div className="space-y-6">
                        {/* Restore & Fix Section */}
                        <div className="rounded-3xl overflow-hidden bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5">
                            <div className="px-5 pt-4 pb-2">
                                <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Restore & Fix</h3>
                            </div>

                            <div className="flex flex-col">
                                <SmartTooltip
                                    title="Face Restoration"
                                    description="Automatically detects and reconstructs blurred or damaged faces using GFPGAN AI."
                                    mediaSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"
                                >
                                    <div className="w-full px-5 py-3.5 border-b border-gray-200/50 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                        <Toggle
                                            label="Face Restoration"
                                            enabled={settings.faceRestoration}
                                            onChange={(v) => updateSettings({ faceRestoration: v })}
                                        />
                                    </div>
                                </SmartTooltip>

                                <SmartTooltip
                                    title="Scratch Removal"
                                    description="Fills in cracks, scratches, and folded creases in old photographs."
                                >
                                    <div className="w-full px-5 py-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                        <Toggle
                                            label="Scratch Removal"
                                            enabled={settings.removeScratches}
                                            onChange={(v) => updateSettings({ removeScratches: v })}
                                        />
                                    </div>
                                </SmartTooltip>
                            </div>
                        </div>

                        {/* Creative Section */}
                        <div className="rounded-3xl overflow-hidden bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5">
                            <div className="px-5 pt-4 pb-2">
                                <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Creative</h3>
                            </div>
                            <SmartTooltip
                                title="AI Colorization"
                                description="Uses deep learning to guess and apply realistic colors to Black & White photos."
                            >
                                <div className="w-full px-5 py-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                    <Toggle
                                        label="Colorization"
                                        enabled={settings.colorize}
                                        onChange={(v) => updateSettings({ colorize: v })}
                                    />
                                </div>
                            </SmartTooltip>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                            <h3 className="text-xs font-bold text-text-secondary dark:text-white/60 uppercase tracking-wider mb-4">Upscaling</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 4].map((scale) => (
                                    <button
                                        key={scale}
                                        onClick={() => updateSettings({ upscaleX: scale })}
                                        className={cn(
                                            "py-2 rounded-lg border text-sm font-bold transition-all",
                                            settings.upscaleX === scale
                                                ? "bg-primary text-white border-primary shadow-neon"
                                                : "bg-white dark:bg-transparent text-text-secondary dark:text-gray-200 border-gray-300 dark:border-white/10 hover:border-primary/50 hover:text-text-main"
                                        )}
                                    >
                                        {scale === 1 ? 'Off' : `${scale}x`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'magic' && (
                    <div className="space-y-6">
                        {/* AI Image Generation Section */}
                        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                                <h3 className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    AI Image Generation
                                </h3>
                                {generationLimits && (
                                    <span className="text-[10px] text-text-secondary bg-white/10 px-2 py-0.5 rounded-full">
                                        {generationLimits.remaining}/{generationLimits.daily_limit} left today
                                    </span>
                                )}
                            </div>

                            <div className="px-5 pb-5 space-y-4">
                                {/* Prompt Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-text-secondary">Describe your image</label>
                                    <textarea
                                        value={genPrompt}
                                        onChange={(e) => {
                                            setGenPrompt(e.target.value);
                                            if (generationError) setGenerationError(null);
                                        }}
                                        placeholder="A serene Japanese garden at golden hour with cherry blossoms..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-text-main placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                        rows={3}
                                        maxLength={500}
                                        disabled={isGenerating}
                                    />
                                    <div className="flex justify-between text-[10px] text-text-tertiary">
                                        <span>{genPrompt.length}/500</span>
                                        {genPrompt.length > 450 && (
                                            <span className="text-yellow-400">Approaching limit</span>
                                        )}
                                    </div>
                                </div>

                                {/* Style Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-text-secondary">Style</label>
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
                                                    "py-2 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1.5",
                                                    genStyle === style.key
                                                        ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                                                        : "bg-white/5 text-text-secondary border-white/10 hover:bg-white/10 hover:text-text-main",
                                                    isGenerating && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                <span>{style.icon}</span>
                                                {style.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Error Display */}
                                {generationError && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-300">{generationError}</p>
                                    </div>
                                )}

                                {/* Generation Status */}
                                {isGenerating && generationStatus && (
                                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                            <p className="text-xs text-purple-300">{generationStatus}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Generate Button */}
                                <Button
                                    variant="primary"
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0"
                                    onClick={async () => {
                                        const result = await generateImage(genPrompt, genStyle);
                                        if (result) {
                                            toast.success('Image generated successfully!');
                                            setGenPrompt('');
                                        }
                                    }}
                                    disabled={isGenerating || !genPrompt.trim() || (generationLimits && generationLimits.remaining <= 0)}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate Image
                                        </>
                                    )}
                                </Button>

                                <p className="text-[10px] text-text-tertiary text-center">
                                    Generation takes 2-3 minutes. You can leave and return.
                                </p>
                            </div>
                        </div>

                        {/* Existing AI Magic Tools */}
                        <div className="p-4 rounded-2xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 space-y-5">
                            <h3 className="text-xs font-bold text-text-secondary dark:text-white/60 uppercase tracking-wider mb-2">AI Magic Tools</h3>

                            <Toggle
                                label="Auto Enhance (Magic Wand)"
                                enabled={settings.autoEnhance}
                                onChange={(v) => updateSettings({ autoEnhance: v })}
                            />

                            <Toggle
                                label="Remove Background"
                                enabled={settings.removeBackground}
                                onChange={(v) => updateSettings({ removeBackground: v })}
                            />
                            <p className="text-xs text-text-secondary bg-yellow-500/10 text-yellow-200 p-2 rounded">
                                *Note: Background removal uses AI or GrabCut fallback.
                            </p>

                            <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Object Eraser</h4>
                                <Button
                                    variant={isMasking ? "primary" : "secondary"}
                                    className="w-full"
                                    onClick={() => setIsMasking(!isMasking)}
                                >
                                    <Eraser className="w-4 h-4 mr-2" />
                                    {isMasking ? "Stop Erasing" : "Open Eraser Tool"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'adjust' && (
                    <div className="space-y-6">
                        <div className="p-4 rounded-2xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 space-y-5">
                            <h3 className="text-xs font-bold text-text-secondary dark:text-white/60 uppercase tracking-wider mb-2">Color Adjustments</h3>

                            <RangeSlider
                                label="Brightness"
                                value={settings.brightness || 1.0}
                                min={0.5} max={1.5} step={0.1}
                                onChange={(v) => updateSettings({ brightness: v })}
                            />
                            <RangeSlider
                                label="Contrast"
                                value={settings.contrast || 1.0}
                                min={0.5} max={1.5} step={0.1}
                                onChange={(v) => updateSettings({ contrast: v })}
                            />
                            <RangeSlider
                                label="Saturation"
                                value={settings.saturation || 1.0}
                                min={0.0} max={2.0} step={0.1}
                                onChange={(v) => updateSettings({ saturation: v })}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'filters' && (
                    <div className="space-y-6">
                        {/* Filter Presets */}
                        <div className="p-4 rounded-2xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10">
                            <h3 className="text-xs font-bold text-text-secondary dark:text-white/60 uppercase tracking-wider mb-4">Filter Presets</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { key: 'none', label: 'None', color: 'bg-gray-500' },
                                    { key: 'vintage', label: 'Vintage', color: 'bg-amber-600' },
                                    { key: 'cinematic', label: 'Cinematic', color: 'bg-blue-600' },
                                    { key: 'warm', label: 'Warm', color: 'bg-orange-500' },
                                    { key: 'cool', label: 'Cool', color: 'bg-cyan-500' },
                                    { key: 'bw_classic', label: 'B&W', color: 'bg-gray-600' },
                                    { key: 'fade', label: 'Fade', color: 'bg-rose-400' },
                                    { key: 'vivid', label: 'Vivid', color: 'bg-purple-500' }
                                ].map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => updateSettings({ filterPreset: filter.key })}
                                        className={cn(
                                            "py-2 px-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2",
                                            (settings.filterPreset || 'none') === filter.key
                                                ? "bg-primary/20 text-primary border-primary shadow-sm"
                                                : "bg-white dark:bg-white/5 text-text-secondary border-gray-300 dark:border-white/10 hover:bg-white/50 hover:dark:bg-white/10 hover:text-text-main"
                                        )}
                                    >
                                        <span className={cn("w-3 h-3 rounded-full", filter.color)}></span>
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Controls */}
                        <div className="p-4 rounded-2xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 space-y-5">
                            <h3 className="text-xs font-bold text-text-secondary dark:text-white/60 uppercase tracking-wider mb-2">Advanced</h3>

                            <Toggle
                                label="Auto White Balance"
                                enabled={settings.whiteBalance || false}
                                onChange={(v) => updateSettings({ whiteBalance: v })}
                            />

                            <RangeSlider
                                label="Noise Reduction"
                                value={settings.denoiseStrength || 0}
                                min={0} max={100} step={10}
                                onChange={(v) => updateSettings({ denoiseStrength: v })}
                            />
                            <p className="text-xs text-text-muted">Higher values = smoother but may lose detail</p>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <HistoryPanel />
                )}
            </div>

            {/* ========== SECTION C: STICKY ACTION BAR (Always visible) ========== */}
            <div
                className={cn(
                    "border-t space-y-3",
                    isMobile
                        ? "fixed bottom-0 left-0 right-0 z-50 p-4"
                        : "flex-shrink-0 p-6 rounded-b-3xl relative z-20"
                )}
                style={{
                    borderColor: 'rgb(var(--ios-separator) / 0.15)',
                    backgroundColor: 'rgb(var(--ios-surface))',
                    paddingBottom: isMobile ? 'calc(16px + env(safe-area-inset-bottom, 0px))' : undefined,
                    boxShadow: isMobile ? '0 -8px 24px rgba(0, 0, 0, 0.12)' : undefined,
                }}
            >
                {/* aria-live region for screen readers */}
                <div aria-live="polite" aria-atomic="true" className="sr-only">
                    {processingStatus}
                </div>

                {/* Processing Steps */}
                {showProcessing && (
                    <div className="mb-3">
                        <ProcessingSteps steps={processingSteps} />
                    </div>
                )}

                {/* Upload New Button - Secondary */}
                {selectedImage && (
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                                if (e.target.files[0]) uploadImage(e.target.files[0]);
                            }}
                        />
                        <Button
                            variant="outline"
                            size={isMobile ? "lg" : "sm"}
                            className="w-full"
                            style={{ minHeight: isMobile ? '48px' : undefined }}
                        >
                            <Upload className="w-4 h-4 mr-2" /> Upload New Image
                        </Button>
                    </div>
                )}

                {/* Primary Actions */}
                <div className="flex flex-col gap-2">
                    {/* Generate/Update Button - Primary */}
                    <Button
                        variant="primary"
                        size="lg"
                        className="shadow-xl shadow-blue-500/20 w-full !bg-primary !text-white disabled:!opacity-50 disabled:!cursor-not-allowed !rounded-2xl !h-[52px] !font-bold tracking-wide transition-all hover:!scale-[1.02] active:!scale-[0.98]"
                        style={{ minHeight: isMobile ? '52px' : '52px' }}
                        disabled={!selectedImage || isProcessing}
                        onClick={handleGenerate}
                        loading={isProcessing}
                        loadingText="Processing..."
                        data-tour="generate-btn"
                    >
                        <Zap className="w-5 h-5 mr-2" />
                        {processedImage ? "Update" : "Generate"}
                        {!isMobile && <KeyboardHint shortcut="⌘G" />}
                    </Button>

                    {/* Save Button - Success */}
                    {processedImage && (
                        <Button
                            variant="success"
                            size="lg"
                            className="shadow-lg shadow-green-500/25 w-full"
                            style={{ minHeight: isMobile ? '52px' : '48px' }}
                            onClick={handleDownload}
                            data-tour="download-btn"
                        >
                            <Download className="w-5 h-5 mr-2" /> Save
                            {!isMobile && <KeyboardHint shortcut="⌘S" />}
                        </Button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default ToolsPanel;

