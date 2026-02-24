import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AppleSlider — Micro-polished
 *
 * Track: 4px height, full radius
 * Track inactive: rgba(0,0,0,0.08) light / rgba(255,255,255,0.12) dark
 * Track active: #007AFF
 * Thumb: 16px circle, subtle shadow 0 2px 6px rgba(0,0,0,0.2)
 * Value text: right-aligned, accent, font-weight 600
 * Label to slider: 12px spacing
 */
const AppleSlider = memo(({
    value,
    min = 0,
    max = 100,
    onChange,
    label,
    className
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const percentage = ((value - min) / (max - min)) * 100;
    const displayValue = Number.isInteger(value) ? value : value.toFixed(1);

    const handleInputChange = (e) => {
        onChange(parseFloat(e.target.value));
    };

    return (
        <div className={className} style={{ width: '100%' }}>
            {/* Label + Value row */}
            {label && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-3)',
                }}>
                    <span style={{
                        fontSize: 13,
                        fontWeight: 500,
                        opacity: 0.7,
                    }}>
                        {label}
                    </span>
                    <span style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#007AFF',
                    }}>
                        {displayValue}
                    </span>
                </div>
            )}

            {/* Track Container */}
            <div style={{
                position: 'relative',
                height: 24,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
            }}>
                {/* Track background */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: 4,
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
                    className="bg-black/[0.08] dark:bg-white/[0.12]"
                >
                    {/* Active fill */}
                    <div
                        style={{
                            height: '100%',
                            width: `${percentage}%`,
                            background: '#007AFF',
                            borderRadius: 2,
                            transition: isDragging ? 'none' : 'width 80ms ease',
                        }}
                    />
                </div>

                {/* Thumb — 16px */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: `calc(${percentage}% - 8px)`,
                        transform: `translateY(-50%) scale(${isDragging ? 1.15 : 1})`,
                        width: 16,
                        height: 16,
                        borderRadius: 'var(--radius-sm)',
                        background: '#fff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(0,0,0,0.04)',
                        transition: 'transform 150ms ease',
                        zIndex: 10,
                    }}
                />

                {/* Invisible native input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={max <= 1 ? 0.01 : 1}
                    value={value}
                    onChange={handleInputChange}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: 30,
                        margin: 0,
                    }}
                />
            </div>
        </div>
    );
});

AppleSlider.displayName = 'AppleSlider';

export default AppleSlider;
