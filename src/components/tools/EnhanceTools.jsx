import React, { memo, useCallback } from 'react';
import { Scaling, Sun } from 'lucide-react';
import ToolCard from '../editor/ToolCard';
import { useImage } from '../../context/ImageContext';
import { useCommand } from '../../context/CommandContext';
import { cn } from '../../lib/utils';

/**
 * EnhanceTools - Enhancement Tool Panel
 * Uses new ToolCard component from EDITOR_REDESIGN_SPEC
 * 
 * Tools:
 * - Super Resolution (2x/4x upscale)
 * - Auto Enhance
 */

// Segmented Control Component
const SegmentedControl = memo(({ options, value, onChange }) => (
    <div className="flex rounded-xl bg-[rgba(var(--studio-glow),0.06)] p-1">
        {options.map((option) => (
            <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={cn(
                    "flex-1 py-2.5 px-4 rounded-lg text-[13px] font-semibold transition-all duration-150",
                    value === option.value
                        ? "bg-[var(--glass-bg-solid)] text-[var(--ios-text-primary)] shadow-sm"
                        : "text-[var(--ios-text-secondary)] hover:text-[var(--ios-text-primary)]"
                )}
            >
                {option.label}
            </button>
        ))}
    </div>
));

SegmentedControl.displayName = 'SegmentedControl';

const EnhanceTools = memo(() => {
    const { updateSettings, settings } = useImage();
    const { toggleCommand, pendingQueue } = useCommand();

    const handleUpscaleChange = useCallback((value) => {
        updateSettings('upscaleX', value);
    }, [updateSettings]);

    const isToolActive = (id) => !!settings[id];
    const isToolPending = (id) => pendingQueue && id in pendingQueue;

    return (
        <div className="space-y-3">
            {/* Super Resolution */}
            <ToolCard
                id="upscaleX"
                icon={Scaling}
                title="Super Resolution"
                description="Upscale image 2x or 4x"
                isActive={isToolActive('upscaleX')}
                isPending={isToolPending('upscaleX')}
                onToggle={(active) => toggleCommand('upscaleX', active ? (settings.upscaleX > 1 ? settings.upscaleX : 2) : false)}
            >
                <SegmentedControl
                    options={[
                        { value: 2, label: '2x Upscale' },
                        { value: 4, label: '4x Upscale' }
                    ]}
                    value={settings.upscaleX || 2}
                    onChange={handleUpscaleChange}
                />
            </ToolCard>

            {/* Auto Enhance */}
            <ToolCard
                id="autoEnhance"
                icon={Sun}
                title="Auto Enhance"
                description="Fix exposure and lighting automatically"
                isActive={isToolActive('autoEnhance')}
                isPending={isToolPending('autoEnhance')}
                onToggle={(active) => toggleCommand('autoEnhance', active)}
            />
        </div>
    );
});

EnhanceTools.displayName = 'EnhanceTools';

export default EnhanceTools;
