import React, { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * AppleToggle - iOS-style toggle switch
 * Matches the Settings IOSToggle: 44×26px pill, 22px thumb, spring animation
 */
const AppleToggle = memo(({
    checked = false,
    onChange,
    disabled = false,
    size = 'default' // 'default' | 'small'
}) => {
    const dims = size === 'small'
        ? { w: 36, h: 22, thumb: 18, travel: 14 }
        : { w: 44, h: 26, thumb: 22, travel: 18 };

    return (
        <motion.button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange?.(!checked)}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            style={{
                width: dims.w,
                height: dims.h,
                borderRadius: dims.h / 2,
                padding: 2,
                border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                background: checked ? 'var(--accent)' : 'var(--fill-primary)',
                opacity: disabled ? 0.5 : 1,
                transition: 'background 200ms ease',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                position: 'relative',
            }}
        >
            <motion.div
                style={{
                    width: dims.thumb,
                    height: dims.thumb,
                    borderRadius: dims.thumb / 2,
                    background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
                animate={{ x: checked ? dims.travel : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </motion.button>
    );
});

AppleToggle.displayName = 'AppleToggle';

export default AppleToggle;
