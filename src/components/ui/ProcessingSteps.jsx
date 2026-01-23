import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * ProcessingSteps Component
 * Shows step-by-step progress during image processing
 * 
 * @param {Array} steps - Array of { id, label, status: 'pending' | 'active' | 'complete' }
 * @param {string} className - Additional classes
 */
const ProcessingSteps = ({ steps, className }) => {
    return (
        <div className={cn("space-y-3", className)}>
            {steps.map((step, index) => (
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                >
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                        {step.status === 'complete' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-ios-green flex items-center justify-center"
                            >
                                <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                            </motion.div>
                        )}
                        {step.status === 'active' && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                        )}
                        {step.status === 'pending' && (
                            <div className="w-6 h-6 rounded-full border-2 border-separator/40 flex items-center justify-center">
                                <Circle className="w-3 h-3 text-text-quaternary" />
                            </div>
                        )}
                    </div>

                    {/* Label */}
                    <span
                        className={cn(
                            "text-sm font-medium transition-colors",
                            step.status === 'complete' && "text-ios-green",
                            step.status === 'active' && "text-primary",
                            step.status === 'pending' && "text-text-tertiary"
                        )}
                    >
                        {step.label}
                    </span>
                </motion.div>
            ))}
        </div>
    );
};

/**
 * Hook to manage processing steps state
 * @param {Array} initialSteps - Array of step labels
 * @returns {Object} { steps, startStep, completeStep, resetSteps, currentStep }
 */
export const useProcessingSteps = (initialSteps) => {
    const [steps, setSteps] = React.useState(
        initialSteps.map((label, index) => ({
            id: index,
            label,
            status: 'pending'
        }))
    );
    const [currentIndex, setCurrentIndex] = React.useState(-1);

    const startStep = (index) => {
        setCurrentIndex(index);
        setSteps(prev => prev.map((step, i) => ({
            ...step,
            status: i < index ? 'complete' : i === index ? 'active' : 'pending'
        })));
    };

    const completeStep = (index) => {
        setSteps(prev => prev.map((step, i) => ({
            ...step,
            status: i <= index ? 'complete' : step.status
        })));
    };

    const completeAll = () => {
        setSteps(prev => prev.map(step => ({ ...step, status: 'complete' })));
    };

    const resetSteps = () => {
        setCurrentIndex(-1);
        setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
    };

    return {
        steps,
        startStep,
        completeStep,
        completeAll,
        resetSteps,
        currentStep: currentIndex
    };
};

export default ProcessingSteps;
