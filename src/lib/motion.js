/**
 * MOTION CONFIGURATION (Apple-Grade Physics)
 * 
 * Single source of truth for all animation constraints.
 * Philosophies:
 * - Springs > Easings (for interactive elements)
 * - Inertia (things should feel like they have mass)
 * - No "pops" (always exit transitions)
 */

export const transitions = {
    // 1. SPRING PRESETS
    spring: {
        // Crisp, mechanical feel (Buttons, Toggles)
        stiff: {
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8
        },
        // Floating, airy feel (Modals, Panels)
        soft: {
            type: "spring",
            stiffness: 280,
            damping: 35,
            mass: 1
        },
        // Physical, rebounding feel (Sliders, Dragging)
        elastic: {
            type: "spring",
            stiffness: 450,
            damping: 25,
            mass: 0.8
        },
        // Slow, heavy feel (Large containers)
        damp: {
            type: "spring",
            stiffness: 180,
            damping: 40,
            mass: 1.2
        },

        // ═══════════════════════════════════════════════════════════
        // NEW PRESETS FROM EDITOR_REDESIGN_SPEC.md
        // ═══════════════════════════════════════════════════════════

        // UI feedback (buttons, toggles) - Quick response
        snappy: {
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.8
        },
        // Panel slides, tab changes - Smooth transitions
        smooth: {
            type: "spring",
            stiffness: 280,
            damping: 26,
            mass: 1
        },
        // Canvas zoom, large transforms - Gentle feel
        gentle: {
            type: "spring",
            stiffness: 180,
            damping: 24,
            mass: 1.2
        },
        // Micro-interactions - Ultra fast
        micro: {
            type: "spring",
            stiffness: 600,
            damping: 35,
            mass: 0.5
        }
    },

    // 2. EASINGS (For non-interactive transitions)
    ease: {
        // Standard iOS ease-out
        out: [0.25, 1, 0.5, 1],
        // Soft enter
        inOut: [0.4, 0, 0.2, 1]
    }
};

export const variants = {
    // Standard Fade + Scale entry
    fadeScale: {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
        transition: transitions.spring.soft
    },

    // Sidebar Slide
    slidePanel: {
        initial: { x: 20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 20, opacity: 0 },
        transition: transitions.spring.soft
    },

    // Result Reveal (Shimmer)
    shimmerReveal: {
        initial: { opacity: 0, filter: "brightness(2) blur(8px)" },
        animate: { opacity: 1, filter: "brightness(1) blur(0px)" },
        transition: { duration: 0.6, ease: transitions.ease.out }
    }
};

/**
 * Haptic feedback helper logic
 * (Visual only for web, potentially hooks into Vibration API later)
 */
export const haptics = {
    tap: { scale: 0.96 },
    hover: {
        scale: 1.02,
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 25 }
    }
};

export default { transitions, variants, haptics };
