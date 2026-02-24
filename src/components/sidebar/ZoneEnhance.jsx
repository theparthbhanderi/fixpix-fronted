import React, { memo, useCallback, useState } from 'react';
import { useImage } from '../../context/ImageContext';
import ActionCard from './ActionCard';
import { Scaling, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * iOS Segmented Control - Performance Optimized
 */
const IOSSegmentedControl = memo(({ options, value, onChange }) => {
    const handleClick = useCallback((optionValue) => {
        onChange(optionValue);
    }, [onChange]);

    return (
        <div className="flex rounded-xl bg-black/[0.04] dark:bg-white/[0.06] p-1">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => handleClick(option.value)}
                    className={cn(
                        "flex-1 py-2.5 px-4 rounded-lg text-[13px] font-semibold transition-all duration-150",
                        value === option.value
                            ? "bg-white dark:bg-white/[0.12] text-[var(--text-primary)] shadow-sm"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                    style={{ willChange: 'transform' }}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
});

IOSSegmentedControl.displayName = 'IOSSegmentedControl';

/**
 * ZoneEnhance - Performance Optimized Enhancement Tools
 */
const ZoneEnhance = memo(({ isMobile }) => {
    const { updateSettings, settings } = useImage();

    // Memoized handler
    const handleUpscaleChange = useCallback((value) => {
        updateSettings('upscaleX', value);
    }, [updateSettings]);

    return (
        <div className="space-y-3">
            {/* Super Resolution */}
            <ActionCard
                id="upscaleX"
                title="Super Resolution"
                description="Upscale image 2x or 4x"
                icon={Scaling}
                badge="RealESRGAN"
            >
                <IOSSegmentedControl
                    options={[
                        { value: 2, label: '2x Upscale' },
                        { value: 4, label: '4x Upscale' }
                    ]}
                    value={settings.upscaleX || 2}
                    onChange={handleUpscaleChange}
                />
            </ActionCard>

            {/* Auto Enhance */}
            <ActionCard
                id="autoEnhance"
                title="Auto Enhance"
                description="Fix exposure and lighting automatically"
                icon={Sun}
            />
        </div>
    );
});

ZoneEnhance.displayName = 'ZoneEnhance';

export default ZoneEnhance;
