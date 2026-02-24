import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Keyboard Shortcuts Help Modal
 * Opens with '?' key, shows available shortcuts
 */
const KeyboardShortcutsHelp = () => {
    const [isOpen, setIsOpen] = useState(false);

    const shortcuts = [
        { keys: ['⌘', 'G'], description: 'Generate/Process image' },
        { keys: ['⌘', 'S'], description: 'Save/Download image' },
        { keys: ['⌘', 'Z'], description: 'Undo last change' },
        { keys: ['⌘', '⇧', 'Z'], description: 'Redo change' },
        { keys: ['Space'], description: 'Toggle before/after comparison' },
        { keys: ['Esc'], description: 'Cancel current operation' },
        { keys: ['?'], description: 'Show this help' },
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Open with '?' key (Shift + /)
            if (e.key === '?' || (e.shiftKey && e.key === '/')) {
                e.preventDefault();
                setIsOpen(true);
            }
            // Close with Escape
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div
                            className="rounded-2xl overflow-hidden shadow-2xl"
                            style={{ backgroundColor: 'var(--surface)' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-separator/20">
                                <div className="flex items-center gap-2">
                                    <Command className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-text-main">
                                        Keyboard Shortcuts
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-fill/10 transition-colors"
                                    aria-label="Close shortcuts help"
                                >
                                    <X className="w-5 h-5 text-text-secondary" />
                                </button>
                            </div>

                            {/* Shortcuts List */}
                            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                                {shortcuts.map((shortcut, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <span className="text-sm text-text-secondary">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, keyIndex) => (
                                                <kbd
                                                    key={keyIndex}
                                                    className={cn(
                                                        "inline-flex items-center justify-center min-w-[28px] h-7 px-2",
                                                        "text-xs font-medium text-text-main",
                                                        "bg-fill/10 border border-separator/30 rounded-md",
                                                        "shadow-sm"
                                                    )}
                                                >
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-separator/20 text-center">
                                <p className="text-xs text-text-tertiary">
                                    Press <kbd className="px-1.5 py-0.5 text-[10px] bg-fill/10 rounded">?</kbd> anytime to show this help
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default KeyboardShortcutsHelp;
