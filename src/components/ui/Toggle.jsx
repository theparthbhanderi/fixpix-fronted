import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Unified iOS-style Toggle Switch Component
 * 
 * Features:
 * - Smooth spring animation
 * - iOS-accurate sizing (51x31 with 27px knob)
 * - Green active state (#34C759 light / #30D158 dark)
 * - Optional inline label
 * - Size variants: 'default' | 'small'
 * 
 * @param {boolean} enabled - Current toggle state
 * @param {function} onChange - Callback when toggled, receives new state
 * @param {string} [label] - Optional label text
 * @param {string} [size='default'] - Size variant: 'default' | 'small'
 * @param {boolean} [disabled=false] - Disable the toggle
 * @param {string} [className] - Additional wrapper classes
 */
const Toggle = ({
    enabled,
    onChange,
    label,
    size = 'default',
    disabled = false,
    className
}) => {
    const isSmall = size === 'small';

    // iOS-accurate dimensions
    // Default: 51x31 track, 27px knob, 2px inset
    // Small: 44x26 track, 22px knob, 2px inset
    const dimensions = isSmall
        ? { width: 44, height: 26, knob: 22, inset: 2 }
        : { width: 51, height: 31, knob: 27, inset: 2 };

    // Calculate travel distance: track width - knob size - (inset * 2)
    const travel = dimensions.width - dimensions.knob - (dimensions.inset * 2);

    const handleClick = () => {
        if (!disabled) {
            onChange(!enabled);
        }
    };

    const toggleButton = (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                "relative rounded-full transition-colors duration-200 flex-shrink-0",
                disabled && "opacity-50 cursor-not-allowed",
                !disabled && "cursor-pointer"
            )}
            style={{
                width: dimensions.width,
                height: dimensions.height,
                padding: dimensions.inset,
                backgroundColor: enabled
                    ? 'var(--toggle-active, #34C759)'
                    : 'rgba(120, 120, 128, 0.16)'
            }}
        >
            <motion.span
                className="block rounded-full bg-white"
                style={{
                    width: dimensions.knob,
                    height: dimensions.knob,
                    boxShadow: '0 3px 1px rgba(0, 0, 0, 0.06), 0 3px 8px rgba(0, 0, 0, 0.15)'
                }}
                animate={{
                    x: enabled ? travel : 0
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
            />
        </button>
    );

    // If label is provided, wrap in a flex container
    if (label) {
        return (
            <div className={cn("flex items-center justify-between gap-3", className)}>
                <span className="text-sm font-medium text-text-main leading-none">{label}</span>
                {toggleButton}
            </div>
        );
    }

    // Return just the toggle button
    return toggleButton;
};

// Add CSS variable for dark mode active color
if (typeof document !== 'undefined' && !document.getElementById('toggle-styles')) {
    const style = document.createElement('style');
    style.id = 'toggle-styles';
    style.textContent = `
        :root {
            --toggle-active: #34C759;
        }
        .dark {
            --toggle-active: #30D158;
        }
    `;
    document.head.appendChild(style);
}

export default Toggle;

