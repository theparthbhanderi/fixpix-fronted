import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * iOS-Style Button Component
 * 
 * Variants: filled, gray, tinted, plain, destructive, outline
 * Sizes: sm (36px), md (44px), lg (50px), iconOnly (40px) - iOS tap target optimized
 * 
 * @param {boolean} loading - Show loading spinner and disable interactions
 * @param {string} loadingText - Optional text to show while loading
 */

const Button = ({
    variant = 'filled',
    size = 'md',
    icon: Icon,
    children,
    className,
    onClick,
    type,
    disabled,
    loading = false,
    loadingText,
    fullWidth = false,
    ...props
}) => {
    const isDisabled = disabled || loading;

    // iOS-style button variants
    const variants = {
        filled: "text-white",
        gray: "text-text-main",
        tinted: "text-primary",
        plain: "text-primary",
        destructive: "text-white",
        outline: "text-text-main",
        // Legacy variants
        primary: "text-white",
        secondary: "text-text-main",
        ghost: "text-text-secondary hover:text-text-main",
        success: "text-white",
    };

    // Get background colors based on variant
    const getBackgroundStyle = () => {
        switch (variant) {
            case 'filled':
            case 'primary':
                return {
                    backgroundColor: 'rgb(var(--ios-accent))',
                    '--hover-bg': 'rgb(var(--ios-accent) / 0.9)',
                    '--active-bg': 'rgb(var(--ios-accent) / 0.8)',
                };
            case 'gray':
            case 'secondary':
                return {
                    backgroundColor: 'rgb(var(--ios-fill) / 0.15)',
                    '--hover-bg': 'rgb(var(--ios-fill) / 0.2)',
                    '--active-bg': 'rgb(var(--ios-fill) / 0.25)',
                };
            case 'tinted':
                return {
                    backgroundColor: 'rgb(var(--ios-accent) / 0.12)',
                    '--hover-bg': 'rgb(var(--ios-accent) / 0.18)',
                    '--active-bg': 'rgb(var(--ios-accent) / 0.24)',
                };
            case 'plain':
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                };
            case 'destructive':
                return {
                    backgroundColor: 'rgb(var(--ios-error))',
                    '--hover-bg': 'rgb(var(--ios-error) / 0.9)',
                };
            case 'success':
                return {
                    backgroundColor: 'rgb(var(--ios-success))',
                    '--hover-bg': 'rgb(var(--ios-success) / 0.9)',
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    border: '1px solid rgb(var(--ios-separator) / 0.3)',
                };
            default:
                return {};
        }
    };

    // iOS-optimized sizes with proper tap targets
    const sizes = {
        sm: {
            height: '36px',
            minHeight: '36px',
            padding: '0 14px',
            fontSize: '13px',
            borderRadius: '8px',
            iconSize: 'w-4 h-4',
        },
        md: {
            height: '44px',
            minHeight: '44px',
            padding: '0 20px',
            fontSize: '15px',
            borderRadius: '10px',
            iconSize: 'w-[18px] h-[18px]',
        },
        lg: {
            height: '50px',
            minHeight: '50px',
            padding: '0 24px',
            fontSize: '17px',
            borderRadius: '12px',
            iconSize: 'w-5 h-5',
        },
        // Icon-only variant for toolbar buttons
        iconOnly: {
            height: '40px',
            minHeight: '40px',
            padding: '0',
            fontSize: '15px',
            borderRadius: '10px',
            iconSize: 'w-5 h-5',
            width: '40px',
        },
    };

    const sizeConfig = sizes[size] || sizes.md;
    const isIconOnly = size === 'iconOnly';

    // Premium hover shadow for primary variants
    const isPrimaryVariant = ['filled', 'primary', 'destructive', 'success'].includes(variant);

    return (
        <motion.button
            whileTap={!isDisabled ? { scale: 0.97 } : {}}
            whileHover={!isDisabled ? { scale: 1.02, opacity: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
                "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none leading-none",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isPrimaryVariant && "hover:shadow-lg",
                variants[variant],
                isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
                fullWidth && "w-full",
                className
            )}
            style={{
                height: sizeConfig.height,
                minHeight: sizeConfig.minHeight,
                width: isIconOnly ? sizeConfig.width : undefined,
                padding: sizeConfig.padding,
                fontSize: sizeConfig.fontSize,
                borderRadius: sizeConfig.borderRadius,
                letterSpacing: '-0.2px',
                ...getBackgroundStyle(),
                '--tw-ring-color': 'rgb(var(--ios-accent) / 0.3)',
            }}
            onClick={onClick}
            type={type}
            disabled={isDisabled}
            aria-busy={loading}
            aria-disabled={isDisabled}
            {...props}
        >
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.span
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center"
                    >
                        <Loader2 className={cn("animate-spin", sizeConfig.iconSize, loadingText && "mr-2")} />
                        {loadingText && <span>{loadingText}</span>}
                    </motion.span>
                ) : (
                    <motion.span
                        key="content"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center"
                    >
                        {Icon && <Icon className={cn(isIconOnly ? "" : "mr-2 shrink-0", sizeConfig.iconSize)} strokeWidth={1.75} />}
                        {!isIconOnly && children}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default Button;

