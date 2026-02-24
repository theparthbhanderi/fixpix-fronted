import React, { memo, useCallback, useMemo } from 'react';
import { useImage } from '../../context/ImageContext';
import { Sun, Contrast, Droplet } from 'lucide-react';
import { cn } from '../../lib/utils';
import AppleSlider from '../ui/AppleSlider';

/**
 * APPLE-GRADE ADJUSTMENT SLIDER WRAPPER
 * Icon-integrated design with professional controls
 */
const AppleAdjustmentSlider = memo(({
    icon: Icon,
    label,
    value,
    onChange,
    min,
    max,
    step,
    defaultValue = 1.0
}) => {
    const handleDoubleClick = useCallback(() => {
        onChange({ target: { value: defaultValue } });
    }, [onChange, defaultValue]);

    return (
        <div className={cn(
            "relative p-[var(--grid-3)] rounded-[var(--squircle-m)]",
            "bg-[var(--fill-tertiary)]",
            "transition-all duration-200"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-[var(--grid-3)]">
                <div className="flex items-center gap-[var(--grid-3)]">
                    {/* Icon */}
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        "bg-[var(--fill-secondary)]"
                    )}>
                        <Icon
                            size={16}
                            strokeWidth={2}
                            className="text-[var(--accent)]"
                        />
                    </div>

                    <span className="apple-text-headline text-[rgba(0,0,0,0.8)] dark:text-[rgba(255,255,255,0.85)]">
                        {label}
                    </span>
                </div>

                {/* Value */}
                <button
                    onDoubleClick={handleDoubleClick}
                    className={cn(
                        "apple-text-caption font-semibold tabular-nums px-2 py-1 rounded-md",
                        "bg-[var(--fill-secondary)] text-[var(--accent)]",
                        "hover:bg-[var(--fill-primary)] transition-colors"
                    )}
                    title="Double-click to reset"
                >
                    {value?.toFixed(2)}
                </button>
            </div>

            {/* Professional Slider */}
            <div className="relative h-[22px] flex items-center">
                <AppleSlider
                    value={value || defaultValue}
                    onChange={onChange}
                    min={min}
                    max={max}
                    step={step}
                    className="relative z-10"
                />
            </div>
        </div>
    );
});

AppleAdjustmentSlider.displayName = 'AppleAdjustmentSlider';

/**
 * ZONE ADJUST - Color & Light Controls
 */
const ZoneAdjust = memo(({ isMobile }) => {
    const { settings, updateSettings } = useImage();

    const handleBrightnessChange = useCallback((e) => {
        updateSettings('brightness', parseFloat(e.target.value));
    }, [updateSettings]);

    const handleContrastChange = useCallback((e) => {
        updateSettings('contrast', parseFloat(e.target.value));
    }, [updateSettings]);

    const handleSaturationChange = useCallback((e) => {
        updateSettings('saturation', parseFloat(e.target.value));
    }, [updateSettings]);

    const handleResetAll = useCallback(() => {
        updateSettings('brightness', 1.0);
        updateSettings('contrast', 1.0);
        updateSettings('saturation', 1.0);
    }, [updateSettings]);

    return (
        <div className="space-y-[var(--grid-2)] px-[var(--grid-4)]">
            <AppleAdjustmentSlider
                icon={Sun}
                label="Brightness"
                value={settings.brightness || 1.0}
                onChange={handleBrightnessChange}
                min={0.5}
                max={1.5}
                step={0.01}
                defaultValue={1.0}
            />

            <AppleAdjustmentSlider
                icon={Contrast}
                label="Contrast"
                value={settings.contrast || 1.0}
                onChange={handleContrastChange}
                min={0.5}
                max={1.5}
                step={0.01}
                defaultValue={1.0}
            />

            <AppleAdjustmentSlider
                icon={Droplet}
                label="Saturation"
                value={settings.saturation || 1.0}
                onChange={handleSaturationChange}
                min={0}
                max={2}
                step={0.01}
                defaultValue={1.0}
            />

            {/* Reset */}
            <button
                onClick={handleResetAll}
                className="apple-btn-secondary w-full mt-[var(--grid-2)]"
            >
                Reset All Adjustments
            </button>
        </div>
    );
});

ZoneAdjust.displayName = 'ZoneAdjust';

export default ZoneAdjust;
