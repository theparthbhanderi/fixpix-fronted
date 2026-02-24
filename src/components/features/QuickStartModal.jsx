import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Upload, Wand2, Download, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

/**
 * QuickStartModal - First-time user onboarding
 * Shows on first visit to help users understand the app
 */
const QuickStartModal = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            icon: Upload,
            iconBg: 'bg-primary/15',
            iconColor: 'text-primary',
            title: 'Upload Your Photo',
            description: 'Start by uploading an old or damaged photo. We support JPG, PNG, and WebP formats.',
        },
        {
            icon: Wand2,
            iconBg: 'bg-ios-purple/15',
            iconColor: 'text-ios-purple',
            title: 'Choose Your Enhancements',
            description: 'Select from AI-powered tools like scratch removal, colorization, face restoration, and upscaling.',
        },
        {
            icon: Sparkles,
            iconBg: 'bg-ios-orange/15',
            iconColor: 'text-ios-orange',
            title: 'Generate & Preview',
            description: 'Click Generate to process your image. Use the before/after slider to compare results.',
        },
        {
            icon: Download,
            iconBg: 'bg-ios-green/15',
            iconColor: 'text-ios-green',
            title: 'Download Your Image',
            description: 'Save your enhanced photo in PNG, JPG, or WebP format at your preferred quality.',
        },
    ];

    useEffect(() => {
        // Check if user has seen the quick start
        const hasSeenQuickStart = localStorage.getItem('fixpix_quickstart_seen');
        if (!hasSeenQuickStart) {
            // Delay showing modal to let page load
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        } else if (onClose) {
            // If already seen, notify parent immediately so subsequent tours can run
            onClose();
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('fixpix_quickstart_seen', 'true');
        setIsOpen(false);
        if (onClose) onClose();
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handleSkip = () => {
        handleClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                        onClick={handleSkip}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-32px)] md:max-w-lg max-h-[90dvh] overflow-y-auto outline-none"
                        style={{
                            paddingBottom: 'env(safe-area-inset-bottom)',
                            paddingTop: 'env(safe-area-inset-top)'
                        }}
                    >
                        <div
                            className="rounded-3xl overflow-hidden ios-card-elevated"
                            style={{ backgroundColor: 'var(--surface)' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-separator/10">
                                <h2 className="ios-headline text-text-main">
                                    Welcome to FixPix! 🎉
                                </h2>
                                <button
                                    onClick={handleSkip}
                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-fill/10 transition-colors"
                                    aria-label="Close quick start"
                                >
                                    <X className="w-5 h-5 text-text-secondary" />
                                </button>
                            </div>

                            {/* Step Content */}
                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-center"
                                    >
                                        {/* Icon */}
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center",
                                            steps[currentStep].iconBg
                                        )}>
                                            {React.createElement(steps[currentStep].icon, {
                                                className: cn("w-8 h-8", steps[currentStep].iconColor),
                                                strokeWidth: 1.75
                                            })}
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="ios-title2 text-text-main mb-2">
                                            {steps[currentStep].title}
                                        </h3>
                                        <p className="text-text-secondary text-sm max-w-sm mx-auto">
                                            {steps[currentStep].description}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Progress Dots */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {steps.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentStep(index)}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all duration-200",
                                                index === currentStep
                                                    ? "w-6 bg-primary"
                                                    : "bg-fill/30 hover:bg-fill/50"
                                            )}
                                            aria-label={`Go to step ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between p-4 border-t border-separator/20">
                                <Button variant="plain" onClick={handleSkip}>
                                    Skip Tutorial
                                </Button>
                                <Button variant="filled" onClick={handleNext}>
                                    {currentStep < steps.length - 1 ? (
                                        <>
                                            Next
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    ) : (
                                        "Get Started"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickStartModal;
