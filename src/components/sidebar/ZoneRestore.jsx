import React, { memo, useCallback } from 'react';
import { useImage } from '../../context/ImageContext';
import ActionCard from './ActionCard';
import { Smile, Palette, Eraser } from 'lucide-react';
import AppleSlider from '../ui/AppleSlider';
import { cn } from '../../lib/utils';

/**
 * Labeled Slider Wrapper - Visual Hierarchy Update
 */
const LabeledSlider = memo(({ label, value, onChange, min, max, step }) => (
    <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center px-1">
            <span className="text-[13px] font-semibold text-[var(--ios-label-secondary)] tracking-tight">
                {label}
            </span>
            <span className="text-[13px] font-bold tabular-nums text-[var(--accent)] bg-[rgba(var(--ios-accent),0.08)] px-2 py-0.5 rounded-md">
                {value}
            </span>
        </div>
        <div className="relative h-[24px] flex items-center px-1">
            <AppleSlider
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
                className="relative z-10 w-full"
            />
        </div>
    </div>
));

LabeledSlider.displayName = 'LabeledSlider';

/**
 * ZONE RESTORE - Restoration Tools
 */
const ZoneRestore = memo(({ isMobile }) => {
    const { updateSettings, settings } = useImage();

    const handleFidelityChange = useCallback((e) => {
        updateSettings('fidelity', parseFloat(e.target.value));
    }, [updateSettings]);

    const handleRenderFactorChange = useCallback((e) => {
        updateSettings('render_factor', parseInt(e.target.value));
    }, [updateSettings]);

    return (
        <div className="grid gap-4">

            {/* Face Restoration - High Priority */}
            <ActionCard
                id="faceRestoration"
                title="Face Restoration"
                description="Recover facial details"
                icon={Smile}
                badge="AI"
                isRecommended={true}
            >
                <div className="p-1 space-y-4">
                    <p className="text-[13px] text-[var(--ios-label-tertiary)] leading-relaxed">
                        Enhance facial features and skin texture using high-fidelity AI models.
                    </p>
                    <LabeledSlider
                        label="Restoration Strength"
                        value={settings.fidelity || 0.5}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={handleFidelityChange}
                    />
                </div>
            </ActionCard>

            {/* Scratch Removal */}
            <ActionCard
                id="removeScratches"
                title="Scratch Removal"
                description="Auto-heal scratches"
                icon={Eraser}
            >
                <div className="p-1 space-y-4">
                    <p className="text-[13px] text-[var(--ios-label-tertiary)] leading-relaxed">
                        Detect and fill surface scratches, dust, and tears automatically.
                    </p>
                    {/* Placeholder Logic for Scratch Intensity if not in settings yet */}
                    <div className="opacity-50 text-[12px] italic text-[var(--ios-label-tertiary)]">
                        Auto-detection enabled. Intensity adjustment coming soon.
                    </div>
                </div>
            </ActionCard>

            {/* Colorize */}
            <ActionCard
                id="colorize"
                title="Colorize B&W"
                description="Add natural color"
                icon={Palette}
                badge="Pro"
            >
                <div className="p-1 space-y-4">
                    <p className="text-[13px] text-[var(--ios-label-tertiary)] leading-relaxed">
                        Convert black & white photos to color using scene recognition.
                    </p>
                    <LabeledSlider
                        label="Render Factor"
                        value={settings.render_factor || 35}
                        min={10}
                        max={45}
                        step={1}
                        onChange={handleRenderFactorChange}
                    />
                </div>
            </ActionCard>

        </div>
    );
});

ZoneRestore.displayName = 'ZoneRestore';

export default ZoneRestore;
