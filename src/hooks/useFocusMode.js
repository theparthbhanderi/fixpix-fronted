import { useState, useCallback, useEffect } from 'react';

/**
 * useFocusMode - Focus Mode Hook
 * From EDITOR_CANVAS_SPEC.md Section 2
 * 
 * Features:
 * - F key toggle focus mode
 * - Escape key exit focus mode
 * - Double-click canvas to enter
 * - Click outside canvas to exit
 * - Two-finger tap toggle (mobile)
 */
const useFocusMode = () => {
    const [isFocusMode, setIsFocusMode] = useState(false);

    const enterFocus = useCallback(() => {
        setIsFocusMode(true);
        document.body.classList.add('focus-mode');
    }, []);

    const exitFocus = useCallback(() => {
        setIsFocusMode(false);
        document.body.classList.remove('focus-mode');
    }, []);

    const toggleFocus = useCallback(() => {
        if (isFocusMode) {
            exitFocus();
        } else {
            enterFocus();
        }
    }, [isFocusMode, enterFocus, exitFocus]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // F key to toggle focus mode
            if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                toggleFocus();
            }

            // Escape to exit focus mode
            if (e.key === 'Escape' && isFocusMode) {
                e.preventDefault();
                exitFocus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocusMode, toggleFocus, exitFocus]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.classList.remove('focus-mode');
        };
    }, []);

    return {
        isFocusMode,
        enterFocus,
        exitFocus,
        toggleFocus
    };
};

export default useFocusMode;
