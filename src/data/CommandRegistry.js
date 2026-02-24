/**
 * FixPix Command Registry v2.0
 * Single Source of Truth for the Intelligent Command System
 * 
 * Tool Types:
 *   Type A (live)  - Instant visual update, no Generate needed
 *   Type B (queue) - Added to pending queue, executed on Generate
 *   Type C (mode)  - Canvas takeover, focus mode
 *   Type D (recipe) - Macro that triggers multiple queue items
 * 
 * Zones: restore, enhance, create, adjust, utilities
 */

import {
    Sparkles, Zap, Eraser, Crop, Sliders,
    Wand2, Droplet, Sun, Contrast, Layers,
    Smile, Palette, CloudFog, Scaling, Scissors,
    SunDim, Ticket
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// ZONES DEFINITION
// ─────────────────────────────────────────────────────────────

export const ZONES = {
    INSIGHT: { id: 'insight', label: 'Insight', icon: Sparkles, color: 'amber' },
    RESTORE: { id: 'restore', label: 'Restore', icon: Zap, color: 'blue' },
    ENHANCE: { id: 'enhance', label: 'Enhance', icon: Wand2, color: 'purple' },
    CREATE: { id: 'create', label: 'Creative', icon: Layers, color: 'pink' },
    ADJUST: { id: 'adjust', label: 'Adjust', icon: Sliders, color: 'green' },
};

// ─────────────────────────────────────────────────────────────
// COMMAND REGISTRY
// ─────────────────────────────────────────────────────────────

export const COMMAND_REGISTRY = {
    // ═══════════════════════════════════════════════════════════
    // RESTORE ZONE (Type B - Queue Operations)
    // ═══════════════════════════════════════════════════════════

    faceRestoration: {
        id: 'faceRestoration',
        type: 'queue',
        zone: 'restore',
        label: 'Face Restoration',
        description: 'Recover facial details using GFPGAN',
        icon: Smile,
        apiParam: 'faceRestoration',
        badge: 'GFPGAN',
        hasSettings: true,
        settings: {
            fidelity: { type: 'slider', min: 0, max: 1, step: 0.1, default: 0.5, label: 'Fidelity' }
        }
    },

    removeScratches: {
        id: 'removeScratches',
        type: 'queue',
        zone: 'restore',
        label: 'Scratch Removal',
        description: 'Repair cracks, dust, and damage',
        icon: Ticket,
        apiParam: 'removeScratches'
    },

    colorize: {
        id: 'colorize',
        type: 'queue',
        zone: 'restore',
        label: 'Colorize Photo',
        description: 'Add realistic color to B&W images',
        icon: Palette,
        apiParam: 'colorize',
        badge: 'DeOldify',
        hasSettings: true,
        settings: {
            render_factor: { type: 'slider', min: 10, max: 45, step: 1, default: 35, label: 'Artistic Factor' }
        }
    },

    dehaze: {
        id: 'dehaze',
        type: 'queue',
        zone: 'restore',
        label: 'Dehaze',
        description: 'Remove fog and atmospheric haze',
        icon: CloudFog,
        apiParam: 'dehaze'
    },

    // ═══════════════════════════════════════════════════════════
    // ENHANCE ZONE (Type B - Queue Operations)
    // ═══════════════════════════════════════════════════════════

    upscaleX: {
        id: 'upscaleX',
        type: 'queue',
        zone: 'enhance',
        label: 'Super Resolution',
        description: 'Upscale image 2x or 4x',
        icon: Scaling,
        apiParam: 'upscaleX',
        badge: 'RealESRGAN',
        hasOptions: true,
        options: [
            { label: '2x', value: 2 },
            { label: '4x', value: 4 }
        ]
    },

    autoEnhance: {
        id: 'autoEnhance',
        type: 'queue',
        zone: 'enhance',
        label: 'Auto Enhance',
        description: 'Fix exposure and lighting automatically',
        icon: SunDim,
        apiParam: 'autoEnhance'
    },

    // ═══════════════════════════════════════════════════════════
    // CREATIVE ZONE (Mixed Types)
    // ═══════════════════════════════════════════════════════════

    magic_eraser: {
        id: 'magic_eraser',
        type: 'mode', // Type C
        zone: 'create',
        label: 'Magic Eraser',
        description: 'Remove unwanted objects by painting',
        icon: Eraser,
        modeName: 'eraser',
        modeColor: 'pink'
    },

    removeBackground: {
        id: 'removeBackground',
        type: 'queue',
        zone: 'create',
        label: 'Remove Background',
        description: 'Make background transparent',
        icon: Scissors,
        apiParam: 'removeBackground',
        badge: 'AI'
    },

    generativeFill: {
        id: 'generativeFill',
        type: 'queue',
        zone: 'create',
        label: 'Generative Edit',
        description: 'Change content via text prompt',
        icon: Wand2,
        apiParam: 'generativeFill',
        badge: 'SDXL',
        hasPrompt: true
    },

    // ═══════════════════════════════════════════════════════════
    // ADJUST ZONE (Type A - Live Operations)
    // ═══════════════════════════════════════════════════════════

    brightness: {
        id: 'brightness',
        type: 'live',
        zone: 'adjust',
        label: 'Brightness',
        icon: Sun,
        min: 0.5,
        max: 1.5,
        step: 0.05,
        defaultValue: 1.0,
        apiParam: 'brightness'
    },

    contrast: {
        id: 'contrast',
        type: 'live',
        zone: 'adjust',
        label: 'Contrast',
        icon: Contrast,
        min: 0.5,
        max: 1.5,
        step: 0.05,
        defaultValue: 1.0,
        apiParam: 'contrast'
    },

    saturation: {
        id: 'saturation',
        type: 'live',
        zone: 'adjust',
        label: 'Saturation',
        icon: Droplet,
        min: 0,
        max: 2,
        step: 0.1,
        defaultValue: 1.0,
        apiParam: 'saturation'
    },

    // ═══════════════════════════════════════════════════════════
    // UTILITIES (Type C - Mode Operations)
    // ═══════════════════════════════════════════════════════════

    crop: {
        id: 'crop',
        type: 'mode',
        zone: 'utilities',
        label: 'Crop & Rotate',
        description: 'Resize and rotate image',
        icon: Crop,
        modeName: 'crop',
        modeColor: 'blue'
    }
};

// ─────────────────────────────────────────────────────────────
// SMART RECIPES (Type D - Macros)
// ─────────────────────────────────────────────────────────────

export const RECIPES = {
    fix_all: {
        id: 'fix_all',
        label: '✨ Magic Fix',
        description: 'Auto-detect and fix all issues',
        icon: Sparkles,
        commands: [
            { id: 'faceRestoration', value: true },
            { id: 'upscaleX', value: 2 }
        ]
    },
    old_photo: {
        id: 'old_photo',
        label: '🎞️ Old Photo',
        description: 'Restore vintage photographs',
        icon: Palette,
        commands: [
            { id: 'faceRestoration', value: true },
            { id: 'removeScratches', value: true },
            { id: 'colorize', value: true }
        ]
    },
    portrait_pro: {
        id: 'portrait_pro',
        label: '👤 Portrait Pro',
        description: 'Enhance portrait photos',
        icon: Smile,
        commands: [
            { id: 'faceRestoration', value: true },
            { id: 'upscaleX', value: 2 },
            { id: 'autoEnhance', value: true }
        ]
    }
};

// ─────────────────────────────────────────────────────────────
// CONFLICT RULES
// ─────────────────────────────────────────────────────────────

const CONFLICT_RULES = [
    {
        tools: ['crop', 'upscaleX'],
        message: 'Crop before upscaling for best results',
        severity: 'warning'
    },
    {
        tools: ['removeBackground', 'colorize'],
        message: 'Background removal may affect colorization',
        severity: 'info'
    }
];

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Get all tools in a specific zone
 */
export const getToolsByZone = (zoneId) => {
    return Object.values(COMMAND_REGISTRY).filter(tool => tool.zone === zoneId);
};

/**
 * Get tool by ID
 */
export const getToolById = (toolId) => {
    return COMMAND_REGISTRY[toolId] || null;
};

/**
 * Check for conflicts in pending queue
 */
export const getConflicts = (pendingQueue) => {
    const activeTools = Object.keys(pendingQueue);
    const conflicts = [];

    CONFLICT_RULES.forEach(rule => {
        const matchingTools = rule.tools.filter(t => activeTools.includes(t));
        if (matchingTools.length >= 2) {
            conflicts.push({
                tools: matchingTools,
                message: rule.message,
                severity: rule.severity
            });
        }
    });

    return conflicts;
};

/**
 * Generate queue summary text for tooltip
 */
export const getQueueSummary = (pendingQueue) => {
    const items = Object.entries(pendingQueue).map(([id, value]) => {
        const tool = COMMAND_REGISTRY[id];
        if (!tool) return null;

        if (typeof value === 'number') {
            return `${tool.label} (${value}x)`;
        }
        return tool.label;
    }).filter(Boolean);

    return items.join(' + ');
};

/**
 * Get all queue-type tools (for Generate button logic)
 */
export const getQueueTools = () => {
    return Object.values(COMMAND_REGISTRY).filter(tool => tool.type === 'queue');
};

/**
 * Get all live-type tools
 */
export const getLiveTools = () => {
    return Object.values(COMMAND_REGISTRY).filter(tool => tool.type === 'live');
};

/**
 * Get all mode-type tools
 */
export const getModeTools = () => {
    return Object.values(COMMAND_REGISTRY).filter(tool => tool.type === 'mode');
};
