import { useState, useCallback, useContext, useRef } from 'react';
import { ImageContext } from '../context/ImageContext';
import AuthContext from '../context/AuthContext';
import { apiEndpoints } from '../lib/api';
import { compressImage } from '../utils/imageCompression';

// Number of concurrent uploads/processes
const CONCURRENCY_LIMIT = 3;

const useBatchProcessor = () => {
    const [queue, setQueue] = useState([]);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
    const { authTokens } = useContext(AuthContext);

    // AbortController for cancel support
    const abortControllerRef = useRef(null);
    const isCancelledRef = useRef(false);

    // Add files to queue
    const addToQueue = useCallback((files) => {
        const newItems = Array.from(files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            status: 'pending', // pending, processing, completed, error, cancelled
            resultUrl: null,
            error: null,
            progress: 0
        }));
        setQueue(prev => [...prev, ...newItems]);
    }, []);

    // Remove file from queue
    const removeFromQueue = useCallback((id) => {
        setQueue(prev => prev.filter(item => item.id !== id));
    }, []);

    // Update a single item's state
    const updateItem = useCallback((id, updates) => {
        setQueue(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
    }, []);

    // Process a single item with compression
    const processItem = async (item, signal) => {
        try {
            // Check if cancelled
            if (signal?.aborted) {
                return { success: false, error: 'Cancelled', cancelled: true };
            }

            // 1. Compress image first
            const { file: compressedFile } = await compressImage(item.file, {
                maxWidth: 4096,
                maxHeight: 4096,
                quality: 0.85
            });

            if (signal?.aborted) {
                return { success: false, error: 'Cancelled', cancelled: true };
            }

            // 2. Upload
            const formData = new FormData();
            formData.append('original_image', compressedFile);
            formData.append('title', compressedFile.name);

            const uploadRes = await fetch(apiEndpoints.images, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: formData,
                signal
            });

            if (!uploadRes.ok) throw new Error('Upload failed');
            const project = await uploadRes.json();

            if (signal?.aborted) {
                return { success: false, error: 'Cancelled', cancelled: true };
            }

            // 3. Process (Auto Enhance by default for batch)
            const settings = { autoEnhance: true };

            const processRes = await fetch(apiEndpoints.processImage(project.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({ settings }),
                signal
            });

            if (!processRes.ok) throw new Error('Processing failed');
            const result = await processRes.json();

            return { success: true, resultUrl: result.processed_image };

        } catch (err) {
            if (err.name === 'AbortError') {
                return { success: false, error: 'Cancelled', cancelled: true };
            }
            console.error(err);
            return { success: false, error: err.message };
        }
    };

    // Process items concurrently with limit
    const processQueue = useCallback(async (customSettings = null) => {
        setIsBatchProcessing(true);
        isCancelledRef.current = false;
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        const itemsToProcess = queue.filter(item => item.status === 'pending');
        const total = itemsToProcess.length;
        let completed = 0;

        setProgress({ completed: 0, total, percentage: 0 });

        // Process in batches of CONCURRENCY_LIMIT
        const processBatch = async (items) => {
            const promises = items.map(async (item) => {
                if (isCancelledRef.current) {
                    updateItem(item.id, { status: 'cancelled', error: 'Cancelled by user' });
                    return;
                }

                // Update status to processing
                updateItem(item.id, { status: 'processing', progress: 0 });

                const { success, resultUrl, error, cancelled } = await processItem(item, signal);

                if (cancelled) {
                    updateItem(item.id, {
                        status: 'cancelled',
                        error: 'Cancelled by user'
                    });
                } else {
                    updateItem(item.id, {
                        status: success ? 'completed' : 'error',
                        resultUrl: success ? resultUrl : null,
                        error: error || null,
                        progress: 100
                    });
                }

                completed++;
                setProgress({
                    completed,
                    total,
                    percentage: Math.round((completed / total) * 100)
                });
            });

            await Promise.allSettled(promises);
        };

        // Split items into chunks and process
        for (let i = 0; i < itemsToProcess.length; i += CONCURRENCY_LIMIT) {
            if (isCancelledRef.current) break;

            const batch = itemsToProcess.slice(i, i + CONCURRENCY_LIMIT);
            await processBatch(batch);
        }

        setIsBatchProcessing(false);
        abortControllerRef.current = null;
    }, [queue, authTokens, updateItem]);

    // Cancel all processing
    const cancelProcessing = useCallback(() => {
        isCancelledRef.current = true;
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Mark all processing items as cancelled
        setQueue(prev => prev.map(q =>
            q.status === 'processing'
                ? { ...q, status: 'cancelled', error: 'Cancelled by user' }
                : q
        ));

        setIsBatchProcessing(false);
    }, []);

    // Retry failed items
    const retryFailed = useCallback(() => {
        setQueue(prev => prev.map(q =>
            q.status === 'error' || q.status === 'cancelled'
                ? { ...q, status: 'pending', error: null, progress: 0 }
                : q
        ));
    }, []);

    const clearQueue = useCallback(() => {
        // Revoke object URLs to prevent memory leaks
        queue.forEach(item => {
            if (item.preview) URL.revokeObjectURL(item.preview);
        });
        setQueue([]);
        setProgress({ completed: 0, total: 0, percentage: 0 });
    }, [queue]);

    const clearCompleted = useCallback(() => {
        setQueue(prev => prev.filter(item => item.status !== 'completed'));
    }, []);

    return {
        queue,
        isBatchProcessing,
        progress,
        addToQueue,
        removeFromQueue,
        processQueue,
        cancelProcessing,
        retryFailed,
        clearQueue,
        clearCompleted
    };
};

export default useBatchProcessor;
