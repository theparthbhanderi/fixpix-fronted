import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const statuses = [
    "Initializing AI Core...",
    "Scanning Image Structure...",
    "Removing Noise & Artifacts...",
    "Enhancing Details...",
    "Correction Color Balance...",
    "Finalizing Output..."
];

const ScanningOverlay = ({ isProcessing }) => {
    const [statusIndex, setStatusIndex] = useState(0);

    useEffect(() => {
        if (isProcessing) {
            setStatusIndex(0);
            const interval = setInterval(() => {
                setStatusIndex(prev => (prev + 1) % statuses.length);
            }, 1500); // Change text every 1.5s
            return () => clearInterval(interval);
        }
    }, [isProcessing]);

    return (
        <AnimatePresence>
            {isProcessing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl"
                >
                    {/* Laser Scanner Bar */}
                    <motion.div
                        className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                        initial={{ top: "0%" }}
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{
                            duration: 3,
                            ease: "linear",
                            repeat: Infinity
                        }}
                    />

                    {/* Scanner Grid Effect (follows the bar slightly) */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                    {/* Central Status Card */}
                    <div className="relative px-8 py-4 bg-black/80 border border-cyan-500/30 rounded-xl shadow-2xl backdrop-blur-md flex flex-col items-center gap-3">
                        <div className="flex gap-2 items-center">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                            </span>
                            <span className="text-cyan-400 font-mono text-sm tracking-widest font-bold uppercase">Processing</span>
                        </div>

                        <motion.p
                            key={statusIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-white font-medium text-lg min-w-[200px] text-center"
                        >
                            {statuses[statusIndex]}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScanningOverlay;
