/**
 * Toast Notification System - iOS Style
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastContext = createContext(null);

const VARIANTS = {
    success: {
        icon: CheckCircle,
        className: 'bg-ios-green/10 border-ios-green/20',
        iconClass: 'text-ios-green'
    },
    error: {
        icon: AlertCircle,
        className: 'bg-ios-red/10 border-ios-red/20',
        iconClass: 'text-ios-red'
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-ios-orange/10 border-ios-orange/20',
        iconClass: 'text-ios-orange'
    },
    info: {
        icon: Info,
        className: 'bg-ios-blue/10 border-ios-blue/20',
        iconClass: 'text-ios-blue'
    }
};

const Toast = ({ toast, onDismiss }) => {
    const variant = VARIANTS[toast.type] || VARIANTS.info;
    const Icon = variant.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
                "flex items-start gap-3 p-4 rounded-ios-md border bg-surface shadow-ios-md backdrop-blur-xl max-w-sm w-full",
                variant.className
            )}
        >
            <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", variant.iconClass)} />
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className="text-ios-subhead font-semibold text-text-main">{toast.title}</p>
                )}
                <p className={cn("text-ios-footnote text-text-secondary", toast.title ? "mt-0.5" : "")}>{toast.message}</p>
            </div>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-text-quaternary hover:text-text-secondary transition-colors flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

const ToastContainer = ({ toasts, dismissToast }) => {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast toast={toast} onDismiss={dismissToast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, options = {}) => {
        const id = Date.now() + Math.random();
        const toast = {
            id,
            message,
            type: options.type || 'info',
            title: options.title || null,
            duration: options.duration || 4000
        };

        setToasts((prev) => [...prev, toast]);

        if (toast.duration > 0) {
            setTimeout(() => {
                dismissToast(id);
            }, toast.duration);
        }

        return id;
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback((message, options) => addToast(message, options), [addToast]);
    toast.success = (message, options) => addToast(message, { ...options, type: 'success' });
    toast.error = (message, options) => addToast(message, { ...options, type: 'error' });
    toast.warning = (message, options) => addToast(message, { ...options, type: 'warning' });
    toast.info = (message, options) => addToast(message, { ...options, type: 'info' });

    return (
        <ToastContext.Provider value={{ toast, dismissToast }}>
            {children}
            <ToastContainer toasts={toasts} dismissToast={dismissToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context.toast;
};

export default ToastProvider;
