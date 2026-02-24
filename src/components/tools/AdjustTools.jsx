import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sun, Contrast, Droplet, RotateCcw } from 'lucide-react';
import AppleSlider from '../ui/AppleSlider';
import { useImage } from '../../context/ImageContext';
import { cn } from '../../lib/utils';

/**
 * AdjustTools - Adjustment Tool Panel
 * Direct controls (not using ToolCard for adjustments)
 * 
 * Controls:
 * - Brightness
 * - Contrast  
 * - Saturation
 * - Reset All
 */

// Adjustment Slider with Icon
const AdjustmentSlider = memo(({
    icon: Icon,
    label,
    value,
    onChange,
    min,
    max,
    step,
    defaultValue = 1.0
}) => {
    const handleReset = useCallback(() => {
        onChange({ target: { value: defaultValue } });
    }, [onChange, defaultValue]);

    return (
        <div className={cn(
            "relative p-4 rounded-2xl",
            "bg-[rgba(var(--studio-glow),0.04)]",
            "border border-[var(--glass-border)]"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        "bg-[rgba(var(--studio-glow),0.1)]"
                    )}>
                        <Icon size={16} className="text-[var(--accent-primary)]" />
                    </div>
                    <span className="text-[14px] font-semibold text-[var(--ios-text-primary)]">
                        {label}
                    </span>
                </div>

                {/* Value Badge */}
                <button
                    onClick={handleReset}
                    className={cn(
                        "text-[13px] font-bold tabular-nums px-2 py-1 rounded-md",
                        "bg-[rgba(var(--studio-glow),0.08)] text-[var(--accent-primary)]",
                        "hover:bg-[rgba(var(--studio-glow),0.15)] transition-colors"
                    )}
                    title="Click to reset"
                >
                    {value?.toFixed(2)}
                </button>
            </div>

            {/* Slider */}
            <AppleSlider
                value={value || defaultValue}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
            />
        </div>
    );
});

AdjustmentSlider.displayName = 'AdjustmentSlider';

const AdjustTools = memo(() => {
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
        <div className="space-y-3">
            <AdjustmentSlider
                icon={Sun}
                label="Brightness"
                value={settings.brightness || 1.0}
                onChange={handleBrightnessChange}
                min={0.5}
                max={1.5}
                step={0.01}
                defaultValue={1.0}
            />

            <AdjustmentSlider
                icon={Contrast}
                label="Contrast"
                value={settings.contrast || 1.0}
                onChange={handleContrastChange}
                min={0.5}
                max={1.5}
                step={0.01}
                defaultValue={1.0}
            />

            <AdjustmentSlider
                icon={Droplet}
                label="Saturation"
                value={settings.saturation || 1.0}
                onChange={handleSaturationChange}
                min={0}
                max={2}
                step={0.01}
                defaultValue={1.0}
            />

            {/* Reset All Button */}
            <motion.button
                onClick={handleResetAll}
                className={cn(
                    "w-full flex items-center justify-center gap-2 h-11",
                    "rounded-xl border border-[var(--glass-border)]",
                    "text-[14px] font-medium text-[var(--ios-text-secondary)]",
                    "hover:bg-[rgba(var(--studio-glow),0.06)] transition-colors"
                )}
                whileTap={{ scale: 0.97 }}
            >
                <RotateCcw size={16} />
                Reset All Adjustments
            </motion.button>
        </div>
    );
});

AdjustTools.displayName = 'AdjustTools';

export default AdjustTools;
