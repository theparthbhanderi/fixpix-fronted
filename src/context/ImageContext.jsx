import React, { createContext, useContext, useState, useRef } from 'react';
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

    // Execution lock — prevents concurrent/looping processImage calls
    const processingLockRef = useRef(false);

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
                    console.warn("Backend upload failed:", response.status, response.statusText);
                    // Keep local preview — don't clear originalImage
                    // User can still use local processing features
                    if (response.status === 401) {
                        console.warn("Session expired — local editing still available.");
                    }
                }
            } catch (error) {
                console.warn("Backend upload unavailable:", error.message);
                // Keep local preview — don't clear originalImage
                // User can still use local processing features
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

    // Helper to fetch blob from URL
    const fetchImageBlob = async (url) => {
        const response = await fetch(url);
        return await response.blob();
    };

    const processImage = async (additionalData = {}) => {
        if (!originalImage) return;

        if (processingLockRef.current) return;
        processingLockRef.current = true;

        setIsProcessing(true);
        let currentBlob = null;
        let currentImageSrc = originalImage;

        // Sanitize input
        const payloadData = (additionalData && typeof additionalData === 'object' && !additionalData.nativeEvent)
            ? additionalData
            : {};

        // Merge payload overrides into settings so pipeline uses the latest toggles
        const effectiveSettings = { ...settings, ...payloadData };

        try {
            // Get initial blob from original image
            if (typeof currentImageSrc === 'string') {
                currentBlob = await fetchImageBlob(currentImageSrc);
            } else {
                currentBlob = currentImageSrc;
            }

            // PIPELINE EXECUTION — uses effectiveSettings (settings + payload overrides)

            // A. FACE RESTORATION
            if (effectiveSettings.faceRestoration) {
                const formData = new FormData();
                formData.append('file', currentBlob);
                formData.append('mode', 'quality');
                formData.append('upscale', 'true');
                formData.append('fidelity', '0.5');

                const response = await fetch(apiEndpoints.restoreFace, { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Face Restoration failed');

                const data = await response.json();
                const base64 = `data:image/jpeg;base64,${data.restored_image}`;
                currentBlob = await fetchImageBlob(base64);
            }

            // B. UPSCALING
            if (effectiveSettings.upscaleX > 1) {
                const formData = new FormData();
                formData.append('file', currentBlob);
                formData.append('scale', effectiveSettings.upscaleX);

                const response = await fetch(apiEndpoints.superResolution, { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Super Resolution failed');

                const data = await response.json();
                const base64 = `data:image/jpeg;base64,${data.upscaled_image}`;
                currentBlob = await fetchImageBlob(base64);
            }

            // C. COLORIZATION
            if (effectiveSettings.colorize) {
                const formData = new FormData();
                formData.append('image', currentBlob, 'image.png');
                formData.append('render_factor', '35');

                const response = await fetch(apiEndpoints.colorize, { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Colorization failed');

                const data = await response.json();
                const base64 = `data:image/jpeg;base64,${data.colorized_image}`;
                currentBlob = await fetchImageBlob(base64);
            }

            // D. BACKGROUND REMOVAL
            if (effectiveSettings.removeBackground) {
                const formData = new FormData();
                formData.append('image', currentBlob, 'image.png');

                const response = await fetch(apiEndpoints.segment, { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Background Removal failed');

                const data = await response.json();
                const base64 = `data:image/png;base64,${data.segmented_image || data.mask}`;
                currentBlob = await fetchImageBlob(base64);
            }

            // E. MASK INPAINTING (Removal)
            if (payloadData.mask) {
                const formData = new FormData();
                formData.append('image', currentBlob, 'image.png');
                const maskBlob = await fetchImageBlob(payloadData.mask);
                formData.append('mask', maskBlob, 'mask.png');

                const response = await fetch(apiEndpoints.inpaint, { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Object Removal failed');

                const data = await response.json();
                const base64 = `data:image/jpeg;base64,${data.inpainted_image}`;
                currentBlob = await fetchImageBlob(base64);
            }

            // Final Result
            const finalUrl = URL.createObjectURL(currentBlob);
            setProcessedImage(finalUrl);

            // We should also update proper project state if possible, but for "Quick Tools" we might just show result.
            // Ideally we upload this result as a new "processed_image" to the backend Project to save state.
            // But for now, client-side blob display is fast and works.

        } catch (error) {
            console.error("Error processing:", error);
            if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                alert('AI Server is not reachable. Please make sure the AI backend (port 8001) is running.');
            } else {
                alert(`Processing Error: ${error.message}`);
            }
        } finally {
            setIsProcessing(false);
            processingLockRef.current = false;
        }
    };

    const [isHistoryAction, setIsHistoryAction] = useState(false);

    // Effect to auto-process when settings change due to Undo/Redo
    React.useEffect(() => {
        if (isHistoryAction && currentProject && !isProcessing && !processingLockRef.current) {
            processImage();
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

    const toggleTheme = React.useCallback(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    // CRITICAL: Memoize context value to prevent consumer re-renders
    const contextValue = React.useMemo(() => ({
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
    }), [
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
        isMasking,
        maskImage,
        handleUndo,
        handleRedo,
        canUndo,
        canRedo,
        historyLog,
        handleJumpToHistory,
        historyIndex,
        theme,
        toggleTheme,
        isGenerating,
        generationStatus,
        generationError,
        generationLimits,
        generateImage,
        fetchGenerationLimits
    ]);

    return (
        <ImageContext.Provider value={contextValue}>
            {children}
        </ImageContext.Provider>
    );
};

export const useImage = () => useContext(ImageContext);

