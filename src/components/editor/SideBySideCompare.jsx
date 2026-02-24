import React, { memo } from 'react';

/**
 * SideBySideCompare - Side-by-Side Compare Mode
 * From EDITOR_CANVAS_SPEC.md Section 3.5
 * 
 * Features:
 * - 48% / 4% gap / 48% layout
 * - Before/After labels
 * - Synchronized scaling
 */
const SideBySideCompare = memo(({ before, after }) => (
    <div className="side-by-side flex items-center justify-center w-full h-full gap-[4%] p-4">
        {/* Before Panel */}
        <div className="side-panel relative flex-1 h-full max-w-[48%] rounded-2xl overflow-hidden">
            <img
                src={before}
                alt="Before"
                className="w-full h-full object-contain"
                draggable={false}
            />
            <span className="absolute top-3 left-3 px-3 py-1.5 bg-black/50 backdrop-blur-xl rounded-2xl text-[11px] font-semibold uppercase tracking-wide text-white">
                Before
            </span>
        </div>

        {/* After Panel */}
        <div className="side-panel relative flex-1 h-full max-w-[48%] rounded-2xl overflow-hidden">
            <img
                src={after}
                alt="After"
                className="w-full h-full object-contain"
                draggable={false}
            />
            <span className="absolute top-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-xl rounded-2xl text-[11px] font-semibold uppercase tracking-wide text-white">
                After
            </span>
        </div>
    </div>
));

SideBySideCompare.displayName = 'SideBySideCompare';

export default SideBySideCompare;
