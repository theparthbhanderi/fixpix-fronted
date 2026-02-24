import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Smile, Palette, Eraser } from 'lucide-react';
import ToolCard from '../editor/ToolCard';
import AppleSlider from '../ui/AppleSlider';
import { useImage } from '../../context/ImageContext';
import { useCommand } from '../../context/CommandContext';

/**
 * RestoreTools - Restoration Tool Panel
 * Uses new ToolCard component from EDITOR_REDESIGN_SPEC
 * 
 * Tools:
 * - Face Restoration (AI)
 * - Scratch Removal
 * - Colorize B&W
 */

// Labeled Slider Component
const LabeledSlider = memo(({ label, value, onChange, min, max, step }) => (
    <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-[var(--ios-text-secondary)]">
                {label}
            </span>
            <span className="text-[13px] font-bold tabular-nums text-[var(--accent-primary)] bg-[rgba(var(--studio-glow),0.1)] px-2 py-0.5 rounded-md">
                {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
        </div>
        <AppleSlider
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
        />
    </div>
));

LabeledSlider.displayName = 'LabeledSlider';

const RestoreTools = memo(() => {
    const { updateSettings, settings } = useImage();
    const { toggleCommand, pendingQueue } = useCommand();

    const handleFidelityChange = useCallback((e) => {
        updateSettings('fidelity', parseFloat(e.target.value));
    }, [updateSettings]);

    const handleRenderFactorChange = useCallback((e) => {
        updateSettings('render_factor', parseInt(e.target.value));
    }, [updateSettings]);

    const isToolActive = (id) => !!settings[id];
    const isToolPending = (id) => pendingQueue && id in pendingQueue;

    return (
        <div className="space-y-3">
            {/* Face Restoration */}
            <ToolCard
                id="faceRestoration"
                icon={Smile}
                title="Face Restoration"
                description="Recover facial details with AI"
                isActive={isToolActive('faceRestoration')}
                isPending={isToolPending('faceRestoration')}
                onToggle={(active) => toggleCommand('faceRestoration', active)}
            >
                <LabeledSlider
                    label="Restoration Strength"
                    value={settings.fidelity || 0.5}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleFidelityChange}
                />
            </ToolCard>

            {/* Scratch Removal */}
            <ToolCard
                id="removeScratches"
                icon={Eraser}
                title="Scratch Removal"
                description="Auto-heal scratches and dust"
                isActive={isToolActive('removeScratches')}
                isPending={isToolPending('removeScratches')}
                onToggle={(active) => toggleCommand('removeScratches', active)}
            >
                <p className="text-[13px] text-[var(--ios-text-tertiary)]">
                    Automatically detects and fills surface scratches, dust, and tears.
                </p>
            </ToolCard>

            {/* Colorize */}
            <ToolCard
                id="colorize"
                icon={Palette}
                title="Colorize B&W"
                description="Add natural color to photos"
                isActive={isToolActive('colorize')}
                isPending={isToolPending('colorize')}
                onToggle={(active) => toggleCommand('colorize', active)}
            >
                <LabeledSlider
                    label="Render Factor"
                    value={settings.render_factor || 35}
                    min={10}
                    max={45}
                    step={1}
                    onChange={handleRenderFactorChange}
                />
            </ToolCard>
        </div>
    );
});

RestoreTools.displayName = 'RestoreTools';

export default RestoreTools;
