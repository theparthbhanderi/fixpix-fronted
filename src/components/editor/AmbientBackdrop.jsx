import React, { memo } from 'react';

/**
 * AmbientBackdrop - Canvas Background Layer
 * From EDITOR_CANVAS_SPEC.md Section 1.4
 * 
 * Features:
 * - Radial vignette from center (darker edges)
 * - Subtle noise texture (1-2% opacity)
 * - Mix-blend overlay for premium feel
 */
const AmbientBackdrop = memo(() => (
    <div className="absolute inset-0 pointer-events-none -z-10">
        {/* Radial Vignette */}
        <div
            className="absolute inset-0"
            style={{
                background: `radial-gradient(
                    ellipse 80% 60% at 50% 45%,
                    transparent 0%,
                    rgba(0, 0, 0, 0.15) 100%
                )`
            }}
        />

        {/* Noise Texture */}
        <div
            className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
            style={{
                backgroundImage: 'url(/noise.png)',
                backgroundRepeat: 'repeat'
            }}
        />
    </div>
));

AmbientBackdrop.displayName = 'AmbientBackdrop';

export default AmbientBackdrop;
