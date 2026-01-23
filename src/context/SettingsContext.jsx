/**
 * SettingsContext - Manages image editing settings with undo/redo history
 * 
 * Split from ImageContext for cleaner separation of concerns.
 * Handles all settings-related state and history management.
 */

import React, { createContext, useContext } from 'react';
import useHistory from '../hooks/useHistory';

const SettingsContext = createContext();

export const defaultSettings = {
    removeScratches: false,
    faceRestoration: false,
    upscaleX: 1,
    colorize: false,
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    autoEnhance: false,
    removeBackground: false,
    // AI settings
    filterPreset: 'none',
    whiteBalance: false,
    denoiseStrength: 0
};

export const SettingsProvider = ({ children }) => {
    const [
        settings,
        setSettings,
        undoSettings,
        redoSettings,
        canUndo,
        canRedo,
        historyLog,
        jumpToHistory,
        historyIndex
    ] = useHistory(defaultSettings);

    const updateSettings = (keyOrObject, value) => {
        let newSettings;
        if (typeof keyOrObject === 'object' && keyOrObject !== null) {
            newSettings = { ...settings, ...keyOrObject };
        } else {
            newSettings = { ...settings, [keyOrObject]: value };
        }
        setSettings(newSettings);
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    const loadSettings = (savedSettings) => {
        if (savedSettings && Object.keys(savedSettings).length > 0) {
            setSettings(savedSettings);
        } else {
            setSettings(defaultSettings);
        }
    };

    const value = {
        settings,
        updateSettings,
        resetSettings,
        loadSettings,
        undoSettings,
        redoSettings,
        canUndo,
        canRedo,
        historyLog,
        jumpToHistory,
        historyIndex,
        defaultSettings
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export default SettingsContext;
