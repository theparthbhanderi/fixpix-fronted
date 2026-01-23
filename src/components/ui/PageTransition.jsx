import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition - Animated page wrapper for smooth route transitions
 * 
 * Usage:
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 */

// Fade animation (subtle)
const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

// Slide up animation (modern)
const slideUpVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

// Scale animation (app-like)
const scaleVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
};

// Slide from right (navigation feel)
const slideRightVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
};

const PageTransition = ({
    children,
    variant = 'slideUp',
    duration = 0.3,
    className = ''
}) => {
    const variants = {
        fade: fadeVariants,
        slideUp: slideUpVariants,
        scale: scaleVariants,
        slideRight: slideRightVariants
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants[variant]}
            transition={{ duration, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/**
 * AnimatedRoutes - Wrap your Routes with this for exit animations
 * 
 * Usage in App.jsx:
 * <AnimatedRoutes>
 *   <Routes>...</Routes>
 * </AnimatedRoutes>
 */
const AnimatedRoutes = ({ children }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div key={location.pathname}>
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

/**
 * Stagger children animation - for lists
 */
const StaggerContainer = ({ children, staggerDelay = 0.1, className = '' }) => (
    <motion.div
        initial="initial"
        animate="animate"
        className={className}
        variants={{
            animate: {
                transition: {
                    staggerChildren: staggerDelay
                }
            }
        }}
    >
        {children}
    </motion.div>
);

const StaggerItem = ({ children, className = '' }) => (
    <motion.div
        className={className}
        variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

export { PageTransition, AnimatedRoutes, StaggerContainer, StaggerItem };
export default PageTransition;
