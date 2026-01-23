import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const MaterialCard = ({ children, className, hoverEffect = false }) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -2 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
                "bg-surface rounded-3xl p-4",
                "shadow-ios-card dark:shadow-none dark:border dark:border-separator/20",
                "transition-all duration-ios-fast",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default MaterialCard;
