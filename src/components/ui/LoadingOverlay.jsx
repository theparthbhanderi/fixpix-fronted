import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingOverlay = ({ isProcessing, message }) => {
    const [step, setStep] = useState(0);
    const steps = [
        "Initializing AI Engine...",
        "Analyzing Image Structure...",
        "Removing Noise & Artifacts...",
        "Enhancing Details & Colors...",
        "Finalizing Output..."
    ];

    useEffect(() => {
        let interval;
        if (isProcessing && !message) {
            setStep(0);
            interval = setInterval(() => {
                setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isProcessing, message]);

    // If neither processing nor message, don't show
    if (!isProcessing && !message) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md rounded-ios-md">
            <div className="text-center space-y-5">
                {/* iOS Style Spinner */}
                <div className="relative w-16 h-16 mx-auto">
                    <motion.div
                        className="absolute inset-0 rounded-full border-[3px] border-separator/30"
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Step Text or Message */}
                <div className="h-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={message ? 'msg' : step}
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -15, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-ios-subhead text-primary font-medium"
                        >
                            {message || steps[step]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
