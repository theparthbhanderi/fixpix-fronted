import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Floating Action Button for mobile
 * Fixed position button for primary actions
 */
const FloatingActionButton = ({
    icon: Icon,
    onClick,
    label,
    variant = 'primary', // 'primary', 'secondary'
    position = 'bottom-right', // 'bottom-right', 'bottom-center', 'bottom-left'
    badge,
    className
}) => {
    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
        'bottom-left': 'bottom-6 left-6'
    };

    const variantStyles = {
        primary: {
            backgroundColor: 'rgb(var(--ios-accent))',
            color: 'white',
            boxShadow: '0 4px 16px rgba(var(--ios-accent) / 0.4)'
        },
        secondary: {
            backgroundColor: 'rgb(var(--ios-surface))',
            color: 'rgb(var(--ios-label))',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
        }
    };

    return (
        <motion.button
            onClick={onClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={cn(
                "fixed z-30 md:hidden",
                "rounded-2xl flex items-center justify-center gap-2",
                positionClasses[position],
                label ? "px-5 h-14" : "w-14 h-14",
                className
            )}
            style={variantStyles[variant]}
            aria-label={label || 'Action button'}
        >
            {Icon && <Icon className="w-6 h-6" strokeWidth={2} />}
            {label && <span className="font-semibold">{label}</span>}

            {/* Badge */}
            {badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ios-red text-white text-xs font-bold flex items-center justify-center">
                    {badge}
                </span>
            )}
        </motion.button>
    );
};

export default FloatingActionButton;
