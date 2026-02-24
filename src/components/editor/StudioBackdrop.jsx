import React from 'react';

/**
 * StudioBackdrop - Layer 0: Canvas background
 * Uses CSS tokens: --canvas-bg and --canvas-gradient
 * Light mode: soft neutral surface
 * Dark mode: cinematic dark gradient
 */
const StudioBackdrop = () => {
    return (
        <div className="studio-backdrop">
            {/* Mode-aware gradient */}
            <div className="studio-gradient" />
            {/* Very subtle noise texture */}
            <div className="studio-noise" />
        </div>
    );
};

export default StudioBackdrop;
