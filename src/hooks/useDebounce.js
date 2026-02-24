import { useCallback, useRef, useState, useEffect } from 'react';

/**
 * Debounced callback hook
 * Returns a function that will only execute after the specified delay
 * when called rapidly in succession
 * 
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const useDebouncedCallback = (callback, delay = 150) => {
    const timeoutRef = useRef(null);
    const callbackRef = useRef(callback);

    // Keep callback ref fresh
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callbackRef.current(...args);
        }, delay);
    }, [delay]);
};

/**
 * Debounced value hook
 * Returns a debounced version of the input value
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebouncedValue = (value, delay = 150) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Throttled callback hook
 * Returns a function that executes at most once per specified interval
 * 
 * @param {Function} callback - The function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} Throttled function
 */
export const useThrottledCallback = (callback, limit = 100) => {
    const lastRun = useRef(Date.now());
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback((...args) => {
        const now = Date.now();
        if (now - lastRun.current >= limit) {
            lastRun.current = now;
            callbackRef.current(...args);
        }
    }, [limit]);
};

export default useDebouncedCallback;
