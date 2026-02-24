import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Unified Button Component
 * 
 * Variants: primary, secondary, ghost, danger
 * Sizes: sm (36px), md (44px), lg (50px), iconOnly (40px)
 * 
 * @param {string}  variant    - Button style variant
 * @param {string}  size       - Button size
 * @param {React.ElementType} icon - Optional icon component
 * @param {boolean} loading    - Show loading spinner
 * @param {string}  loadingText - Text during loading
 * @param {boolean} fullWidth  - Stretch to container width
 */

const Button = ({
    variant = 'primary',
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

    // Variant color classes
    const variantStyles = {
        primary: "text-white",
        secondary: "text-text-main",
        ghost: "text-text-secondary hover:text-text-main",
        danger: "text-white",
        // Legacy aliases (map to new names)
        filled: "text-white",
        gray: "text-text-main",
        tinted: "text-primary",
        plain: "text-text-secondary hover:text-text-main",
        destructive: "text-white",
        outline: "text-text-main",
        success: "text-white",
    };

    // Background style per variant
    const getBackgroundStyle = () => {
        switch (variant) {
            case 'primary':
            case 'filled':
                return {
                    backgroundColor: 'var(--accent)',
                };
            case 'secondary':
            case 'gray':
                return {
                    backgroundColor: 'var(--fill-secondary)',
                };
            case 'tinted':
                return {
                    backgroundColor: 'var(--accent-soft)',
                };
            case 'ghost':
            case 'plain':
                return {
                    backgroundColor: 'transparent',
                };
            case 'danger':
            case 'destructive':
                return {
                    backgroundColor: 'var(--error)',
                };
            case 'success':
                return {
                    backgroundColor: 'var(--success)',
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                };
            default:
                return { backgroundColor: 'var(--accent)' };
        }
    };

    // Sizes — iOS tap-target optimized
    const sizes = {
        sm: {
            height: '36px',
            minHeight: '36px',
            padding: '0 14px',
            fontSize: '13px',
            borderRadius: 'var(--radius-sm)',
            iconSize: 'w-4 h-4',
        },
        md: {
            height: '44px',
            minHeight: '44px',
            padding: '0 var(--space-5)',
            fontSize: '15px',
            borderRadius: 'var(--radius-lg)',
            iconSize: 'w-[18px] h-[18px]',
        },
        lg: {
            height: '50px',
            minHeight: '50px',
            padding: '0 var(--space-6)',
            fontSize: '17px',
            borderRadius: 'var(--radius-lg)',
            iconSize: 'w-5 h-5',
        },
        iconOnly: {
            height: '40px',
            minHeight: '40px',
            padding: '0',
            fontSize: '15px',
            borderRadius: 'var(--radius-sm)',
            iconSize: 'w-5 h-5',
            width: '40px',
        },
    };

    const sizeConfig = sizes[size] || sizes.md;
    const isIconOnly = size === 'iconOnly';
    const isPrimary = ['primary', 'filled', 'danger', 'destructive', 'success'].includes(variant);

    return (
        <motion.button
            whileTap={!isDisabled ? { scale: 0.97 } : {}}
            whileHover={!isDisabled ? { y: -2 } : {}}
            transition={{ type: "spring", stiffness: 500, damping: 30, duration: 0.12 }}
            className={cn(
                "inline-flex items-center justify-center font-medium select-none leading-none",
                "transition-shadow duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isPrimary && "shadow-[var(--depth-1)] hover:shadow-[var(--depth-2)]",
                variantStyles[variant],
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
                letterSpacing: '0',
                ...getBackgroundStyle(),
                '--tw-ring-color': 'rgba(0, 122, 255, 0.3)',
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
