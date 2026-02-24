import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { useImage } from './ImageContext';
import { COMMAND_REGISTRY, RECIPES, getQueueSummary, getConflicts } from '../data/CommandRegistry';

const CommandContext = createContext();

/**
 * CommandProvider v2.0
 * Unified state management for the Intelligent Command System
 */
export const CommandProvider = ({ children }) => {
    const {
        settings,
        updateSettings,
        processImage,
        isProcessing,
        setIsMasking,
        setIsCropping,
        originalImage,
        selectedImage
    } = useImage();

    // Processing state for UI feedback (GenerateButton, ToolCard)
    const [processingState, setProcessingState] = React.useState({
        currentStep: null,
        completed: [],
        total: 0,
        progress: 0
    });

    // ─────────────────────────────────────────────────────────────
    // STATE: Interaction Logic
    // ─────────────────────────────────────────────────────────────

    const [activeMode, setActiveMode] = useState(null); // 'eraser', 'crop', null
    const [expandedZone, setExpandedZone] = useState('restore');

    // ─────────────────────────────────────────────────────────────
    // STATE: Tool Shared State
    // ─────────────────────────────────────────────────────────────

    const [brushSize, setBrushSize] = useState(30);

    // ─────────────────────────────────────────────────────────────
    // STATE: AI Operations Queue (Type B)
    // ─────────────────────────────────────────────────────────────
    // Structure: { 'faceRestoration': true, 'upscaleX': 4, ... }

    const [pendingQueue, setPendingQueue] = useState({});

    // ─────────────────────────────────────────────────────────────
    // STATE: AI Insights (Smart Analysis)
    // ─────────────────────────────────────────────────────────────

    const [aiInsights, setAiInsights] = useState({
        analyzing: false,
        analyzed: false,
        quality: null,      // 'high', 'medium', 'low'
        facesDetected: 0,
        isBlurry: false,
        hasDamage: false,
        isGrayscale: false,
        findings: [],
        recommendations: []
    });

    // ─────────────────────────────────────────────────────────────
    // ACTIONS: AI Insights
    // ─────────────────────────────────────────────────────────────

    /**
     * Analyze image and generate smart insights
     * In production, this would call the backend. For now, it's smart mock data.
     */
    const analyzeImage = useCallback((imageData) => {
        if (!imageData) return;

        setAiInsights(prev => ({ ...prev, analyzing: true }));

        // Simulate analysis delay
        setTimeout(() => {
            // Mock analysis results based on image properties
            // In production: call /api/analyze endpoint
            const mockAnalysis = {
                analyzing: false,
                analyzed: true, // Mark as complete
                quality: Math.random() > 0.5 ? 'low' : 'medium',
                facesDetected: Math.floor(Math.random() * 3), // 0, 1, or 2
                isBlurry: Math.random() > 0.6,
                hasDamage: Math.random() > 0.7,
                isGrayscale: Math.random() > 0.8,
                findings: [],
                recommendations: []
            };

            // Populate Findings & Recommendations
            if (mockAnalysis.facesDetected > 0) {
                mockAnalysis.findings.push({
                    type: 'info',
                    label: 'Faces Detected',
                    score: 85,
                    description: `${mockAnalysis.facesDetected} faces found. Restore details recommended.`
                });
                mockAnalysis.recommendations.push('faceRestoration');
            }

            if (mockAnalysis.hasDamage) {
                mockAnalysis.findings.push({
                    type: 'critical',
                    label: 'Structural Damage',
                    score: 92,
                    description: 'Scratches and defects detected on surface.'
                });
                mockAnalysis.recommendations.push('scratchRemoval');
            }

            if (mockAnalysis.quality === 'low') {
                mockAnalysis.findings.push({
                    type: 'info',
                    label: 'Low Resolution',
                    description: 'Image quality is below print standards.'
                });
            }

            // Generate recommendations based on analysis (Type B Queue)
            // Note: We just mark them as 'recommended' in state, components act on it.
            // Or we could auto-queue them if we are bold. For now, let's just expose them.

            setAiInsights(mockAnalysis);

            // Auto-queue high confidence items if desired?
            // For now, "Auto-Restore" button will use these results.

        }, 1500); // 1.5s scan time
    }, []);

    // ─────────────────────────────────────────────────────────────
    // ACTIONS: Queue Management
    // ─────────────────────────────────────────────────────────────

    /**
     * Toggle a Queue-based tool (Type B)
     */
    const toggleCommand = useCallback((commandId, value) => {
        setPendingQueue(prev => {
            const newState = { ...prev };

            if (value !== false && value !== null && value !== undefined) {
                newState[commandId] = value;
            } else {
                delete newState[commandId];
            }
            return newState;
        });
    }, []);

    /**
     * Update a Live tool (Type A)
     */
    const updateLiveCommand = useCallback((commandId, value) => {
        const tool = COMMAND_REGISTRY[commandId];
        const param = tool?.apiParam || commandId;
        updateSettings(param, value);
    }, [updateSettings]);

    /**
     * Apply a Recipe (Type D - Macro)
     */
    const applyRecipe = useCallback((recipeId) => {
        const recipe = RECIPES[recipeId];
        if (!recipe) return;

        setPendingQueue(prev => {
            const newState = { ...prev };
            recipe.commands.forEach(cmd => {
                newState[cmd.id] = cmd.value;
            });
            return newState;
        });
    }, []);

    /**
     * Clear all pending commands
     */
    const clearQueue = useCallback(() => {
        setPendingQueue({});
    }, []);

    // ─────────────────────────────────────────────────────────────
    // ACTIONS: Focus Mode (Type C)
    // ─────────────────────────────────────────────────────────────

    const enterMode = useCallback((modeName) => {
        setActiveMode(modeName);
        if (modeName === 'eraser') {
            setIsMasking(true);
            setIsCropping(false);
        } else if (modeName === 'crop') {
            setIsCropping(true);
            setIsMasking(false);
        }
    }, [setIsMasking, setIsCropping]);

    const exitMode = useCallback(() => {
        setActiveMode(null);
        setIsMasking(false);
        setIsCropping(false);
    }, [setIsMasking, setIsCropping]);

    // ─────────────────────────────────────────────────────────────
    // ACTIONS: Execution (Generate)
    // ─────────────────────────────────────────────────────────────

    // Execution lock — prevents double-click and loop re-entry
    const commitLockRef = useRef(false);

    const commitCommands = useCallback(async () => {
        const queueKeys = Object.keys(pendingQueue);
        if (queueKeys.length === 0) return;

        if (commitLockRef.current) return;
        commitLockRef.current = true;

        if (!originalImage) {
            alert('Please upload an image first.');
            commitLockRef.current = false;
            return;
        }

        const payload = {};
        Object.entries(pendingQueue).forEach(([cmdId, val]) => {
            const tool = COMMAND_REGISTRY[cmdId];
            const key = tool?.apiParam || cmdId;
            payload[key] = val;
        });

        setProcessingState({
            currentStep: queueKeys[0],
            completed: [],
            total: queueKeys.length,
            progress: 0
        });

        updateSettings(payload);

        try {
            await processImage(payload);
            setProcessingState({
                currentStep: null,
                completed: queueKeys,
                total: queueKeys.length,
                progress: 100
            });
        } catch (err) {
            console.error('Generate error:', err);
            setProcessingState({ currentStep: null, completed: [], total: 0, progress: 0 });
        } finally {
            commitLockRef.current = false;
        }

        // NOTE: Do NOT clear pendingQueue here.
        // Tools must stay selected after Generate so the user
        // can see what was applied and re-run or adjust.
    }, [pendingQueue, processImage, updateSettings, originalImage]);

    // ─────────────────────────────────────────────────────────────
    // DERIVED STATE
    // ─────────────────────────────────────────────────────────────

    const hasPendingChanges = Object.keys(pendingQueue).length > 0;
    const pendingCount = Object.keys(pendingQueue).length;
    const queueSummary = useMemo(() => getQueueSummary(pendingQueue), [pendingQueue]);
    const conflicts = useMemo(() => getConflicts(pendingQueue), [pendingQueue]);

    // ─────────────────────────────────────────────────────────────
    // EFFECT: Reset & Auto-Analyze
    // ─────────────────────────────────────────────────────────────

    // Reset insights when image changes
    React.useEffect(() => {
        setAiInsights({
            analyzing: false,
            analyzed: false,
            quality: null,      // 'high', 'medium', 'low'
            facesDetected: 0,
            isBlurry: false,
            hasDamage: false,
            isGrayscale: false,
            findings: [],
            recommendations: []
        });
    }, [selectedImage]); // Correct dependency

    // Auto-Analyze when entering Restoration Lab
    React.useEffect(() => {
        if (expandedZone === 'restore' && !aiInsights.analyzed && !aiInsights.analyzing && selectedImage) {
            analyzeImage(true);
        }
    }, [expandedZone, aiInsights.analyzed, aiInsights.analyzing, analyzeImage, selectedImage]);

    // ─────────────────────────────────────────────────────────────
    // CONTEXT VALUE
    // ─────────────────────────────────────────────────────────────

    const value = useMemo(() => ({
        // Mode
        activeMode,
        enterMode,
        exitMode,

        // Zone
        expandedZone,
        setExpandedZone,
        activeSection: expandedZone, // Alias for UI components

        // Tool State
        brushSize,
        setBrushSize,

        // Queue (Type B)
        pendingQueue,
        toggleCommand,
        clearQueue,
        hasPendingChanges,
        pendingCount,
        queueSummary,
        conflicts,
        commitCommands,
        processingState,

        // Live (Type A)
        updateLiveCommand,

        // Recipe (Type D)
        applyRecipe,

        // AI Insights
        aiInsights,
        analyzeImage
    }), [
        activeMode, enterMode, exitMode,
        expandedZone,
        brushSize,
        pendingQueue, toggleCommand, clearQueue, hasPendingChanges, pendingCount, queueSummary, conflicts, commitCommands, processingState,
        updateLiveCommand,
        applyRecipe,
        aiInsights, analyzeImage
    ]);

    return (
        <CommandContext.Provider value={value}>
            {children}
        </CommandContext.Provider>
    );
};

export const useCommand = () => {
    const context = useContext(CommandContext);
    if (!context) {
        throw new Error('useCommand must be used within a CommandProvider');
    }
    return context;
};

