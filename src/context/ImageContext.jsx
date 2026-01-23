import React, { createContext, useContext, useState } from 'react';
import useHistory from '../hooks/useHistory';
import AuthContext from './AuthContext';
import { apiEndpoints, getMediaUrl } from '../lib/api';
import { compressImage, validateImageFile, formatFileSize } from '../utils/imageCompression';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
    const [originalImage, setOriginalImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [isMasking, setIsMasking] = useState(false);
    const [maskImage, setMaskImage] = useState(null);

    // AI Generation state
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');
    const [generationError, setGenerationError] = useState(null);
    const [generationLimits, setGenerationLimits] = useState(null);

    // Cleanup object URLs to prevent memory leaks
    React.useEffect(() => {
        return () => {
            if (originalImage && originalImage.startsWith('blob:')) {
                URL.revokeObjectURL(originalImage);
            }
        };
    }, [originalImage]);

    const defaultSettings = {
        removeScratches: false,
        faceRestoration: false,
        upscaleX: 1,
        colorize: false,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        autoEnhance: false,
        removeBackground: false,
        // New AI settings
        filterPreset: 'none',
        whiteBalance: false,
        denoiseStrength: 0
    };

    const [settings, setSettings, undoSettings, redoSettings, canUndo, canRedo, historyLog, jumpToHistory, historyIndex] = useHistory(defaultSettings);

    const { authTokens } = useContext(AuthContext);

    const uploadImage = async (file) => {
        // Validate file first
        const validation = validateImageFile(file);
        if (!validation.valid) {
            console.error('Validation failed:', validation.error);
            return;
        }

        // Create local preview immediately
        const url = URL.createObjectURL(file);
        setOriginalImage(url);
        setProcessedImage(null);
        setIsProcessing(true); // Show loading state during compression
        // Reset history
        setSettings(defaultSettings);

        try {
            // Compress image before upload
            const { file: compressedFile, originalSize, compressedSize, wasResized } = await compressImage(file, {
                maxWidth: 4096,
                maxHeight: 4096,
                quality: 0.85
            });

            // Log compression results
            const savings = originalSize - compressedSize;
            // Compression complete - savings logged only in development
            if (wasResized) {
                // Image was resized to fit within 4096x4096
            }

            // Upload compressed file to server
            const formData = new FormData();
            formData.append('original_image', compressedFile);
            formData.append('title', compressedFile.name);

            try {
                const response = await fetch(apiEndpoints.images, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + (authTokens?.access || '')
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    setCurrentProject(data);
                } else {
                    console.error("Upload failed:", response.status, response.statusText);
                    if (response.status === 401) {
                        alert("Session expired. Please Logout and Login again.");
                    } else {
                        const errText = await response.text();
                        alert(`Upload Failed (${response.status}): ${errText || response.statusText}`);
                    }
                    setOriginalImage(null);
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                alert(`Upload Connection Error: ${error.message}`);
                setOriginalImage(null);
            }
        } catch (compressionError) {
            console.error("Error compressing image:", compressionError);
            alert(`Image Compression Error: ${compressionError.message}`);
            setOriginalImage(null);
        } finally {
            setIsProcessing(false);
        }
    }


    const fetchProjects = async () => {
        try {
            const response = await fetch(apiEndpoints.images, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + (authTokens?.access || '')
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error("Failed to fetch projects");
                return [];
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        }
    };

    const processImage = async (additionalData = {}) => {
        if (!currentProject) {
            alert("No active project found. Please re-upload the image.");
            return;
        }

        // Sanitize input
        const payloadData = (additionalData && typeof additionalData === 'object' && !additionalData.nativeEvent)
            ? additionalData
            : {};

        setIsProcessing(true);

        try {
            const body = {
                settings: settings,
                ...payloadData
            };

            const response = await fetch(apiEndpoints.processImage(currentProject.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + (authTokens?.access || '')
                },
                body: JSON.stringify(body)
            });

            if (response.status === 202 || response.ok) {
                // Poll for completion
                const pollPromise = new Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = 60; // 60 seconds timeout

                    const checkStatus = async () => {
                        try {
                            const statusRes = await fetch(apiEndpoints.imageDetail(currentProject.id), {
                                headers: {
                                    'Authorization': 'Bearer ' + (authTokens?.access || '')
                                }
                            });

                            if (!statusRes.ok) throw new Error("Failed to check status");

                            const data = await statusRes.json();

                            if (data.status === 'completed') {
                                resolve(data);
                            } else if (data.status === 'failed') {
                                reject(new Error("Processing failed on server."));
                            } else {
                                attempts++;
                                if (attempts > maxAttempts) {
                                    reject(new Error("Processing timed out."));
                                } else {
                                    setTimeout(checkStatus, 1000);
                                }
                            }
                        } catch (e) {
                            reject(e);
                        }
                    };

                    checkStatus();
                });

                const finalData = await pollPromise;
                // Use getMediaUrl to ensure we have a full absolute URL
                const processedUrl = getMediaUrl(finalData.processed_image);
                setProcessedImage(`${processedUrl}?t=${Date.now()}`);
                setCurrentProject(finalData);

            } else {
                console.error("Processing failed:", response.status, response.statusText);
                const errText = await response.text();
                // Handle 503 specifically
                if (response.status === 503) {
                    alert(`Service Unavailable: ${errText}`);
                } else {
                    alert(`Server Error (${response.status}): ${errText || response.statusText}`);
                }
            }
        } catch (error) {
            console.error("Error processing:", error);
            alert(`Processing Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const [isHistoryAction, setIsHistoryAction] = useState(false);

    // Effect to auto-process when settings change due to Undo/Redo
    React.useEffect(() => {
        if (isHistoryAction && currentProject && !isProcessing) {
            processImage(); // Re-process with restored settings
            setIsHistoryAction(false);
        }
    }, [settings, isHistoryAction]);

    const handleUndo = () => {
        setIsHistoryAction(true);
        undoSettings();
    };

    const handleRedo = () => {
        setIsHistoryAction(true);
        redoSettings();
    };

    const handleJumpToHistory = (index) => {
        setIsHistoryAction(true);
        jumpToHistory(index);
    };

    const updateSettings = (keyOrObject, value) => {
        let newSettings;
        if (typeof keyOrObject === 'object' && keyOrObject !== null) {
            newSettings = { ...settings, ...keyOrObject };
        } else {
            newSettings = { ...settings, [keyOrObject]: value };
        }
        setSettings(newSettings);
    };

    const loadProject = (project) => {
        setCurrentProject(project);
        setOriginalImage(project.original_image);
        setProcessedImage(project.processed_image);
        if (project.settings && Object.keys(project.settings).length > 0) {
            setSettings(project.settings);
        } else {
            setSettings(defaultSettings);
        }
    };

    /**
     * Fetch user's generation limits from the API
     */
    const fetchGenerationLimits = async () => {
        // Only fetch if authenticated
        if (!authTokens?.access) {
            return null;
        }

        try {
            const response = await fetch(apiEndpoints.generationStatus, {
                headers: {
                    'Authorization': 'Bearer ' + authTokens.access
                }
            });
            if (response.ok) {
                const data = await response.json();
                setGenerationLimits(data);
                return data;
            }
        } catch (error) {
            console.error('Failed to fetch generation limits:', error);
        }
        return null;
    };

    /**
     * Generate an image from a text prompt using DeepFloyd IF
     * @param {string} prompt - Text description of image to generate
     * @param {string} style - 'photorealistic' | 'artistic' | 'anime'
     * @returns {Promise<object>} Generated project data
     */
    const generateImage = async (prompt, style = 'photorealistic') => {
        if (!prompt?.trim()) {
            setGenerationError('Please enter a prompt');
            return null;
        }

        // Check if user is authenticated
        if (!authTokens?.access) {
            setGenerationError('Please log in to use AI generation');
            return null;
        }

        setIsGenerating(true);
        setGenerationError(null);
        setGenerationStatus('Starting generation...');
        setOriginalImage(null);
        setProcessedImage(null);
        setCurrentProject(null);

        try {
            // Start generation
            const response = await fetch(apiEndpoints.generateImage, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.access
                },
                body: JSON.stringify({ prompt: prompt.trim(), style })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setGenerationError('Session expired. Please log in again.');
                    setIsGenerating(false);
                    return null;
                }
                const errorData = await response.json();
                if (response.status === 429) {
                    setGenerationError(`Daily limit reached (${errorData.daily_limit} generations). Try again tomorrow.`);
                } else if (response.status === 400) {
                    setGenerationError(errorData.error || 'Invalid prompt');
                } else {
                    setGenerationError(errorData.error || 'Generation failed');
                }
                setIsGenerating(false);
                return null;
            }

            const data = await response.json();
            const projectId = data.project_id;

            // Update limits
            if (data.remaining !== undefined) {
                setGenerationLimits(prev => prev ? { ...prev, remaining: data.remaining } : null);
            }

            setGenerationStatus('Generating image... This may take 2-3 minutes.');

            // Poll for completion (5-minute timeout)
            const maxAttempts = 300; // 5 minutes at 1 second intervals
            let attempts = 0;

            const pollResult = await new Promise((resolve, reject) => {
                const checkStatus = async () => {
                    try {
                        const statusRes = await fetch(apiEndpoints.imageDetail(projectId), {
                            headers: {
                                'Authorization': 'Bearer ' + (authTokens?.access || '')
                            }
                        });

                        if (!statusRes.ok) throw new Error('Failed to check status');

                        const statusData = await statusRes.json();

                        if (statusData.status === 'completed') {
                            resolve(statusData);
                        } else if (statusData.status === 'failed') {
                            reject(new Error('Generation failed. Please try a different prompt.'));
                        } else {
                            attempts++;
                            if (attempts > maxAttempts) {
                                reject(new Error('Generation timed out. Please try again.'));
                            } else {
                                // Update status message with elapsed time
                                const elapsed = Math.floor(attempts / 60);
                                const mins = elapsed > 0 ? `${elapsed}m ` : '';
                                const secs = attempts % 60;
                                setGenerationStatus(`Generating image... (${mins}${secs}s elapsed)`);
                                setTimeout(checkStatus, 1000);
                            }
                        }
                    } catch (e) {
                        reject(e);
                    }
                };
                checkStatus();
            });

            // Success - display result
            const processedUrl = getMediaUrl(pollResult.processed_image);
            setProcessedImage(`${processedUrl}?t=${Date.now()}`);
            setCurrentProject(pollResult);
            setGenerationStatus('Generation complete!');

            // Refresh limits
            fetchGenerationLimits();

            return pollResult;

        } catch (error) {
            console.error('Generation error:', error);
            setGenerationError(error.message || 'Generation failed');
            return null;
        } finally {
            setIsGenerating(false);
            // Clear status after a delay
            setTimeout(() => setGenerationStatus(''), 2000);
        }
    };

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'dark';
    });

    React.useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ImageContext.Provider
            value={{
                selectedImage: originalImage,
                originalImage,
                processedImage,
                isProcessing,
                settings,
                uploadImage,
                processImage,
                updateSettings,
                loadProject,
                currentProject,
                isCropping,
                setIsCropping,
                isMasking,
                setIsMasking,
                maskImage,
                setMaskImage,
                undoSettings: handleUndo,
                redoSettings: handleRedo,
                canUndo,
                canRedo,
                setOriginalImage,
                historyLog,
                jumpToHistory: handleJumpToHistory,
                historyIndex,
                theme,
                toggleTheme,
                // AI Generation
                isGenerating,
                generationStatus,
                generationError,
                generationLimits,
                generateImage,
                fetchGenerationLimits,
                setGenerationError
            }}
        >
            {children}
        </ImageContext.Provider>
    );
};

export const useImage = () => useContext(ImageContext);
