import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Cpu, Download } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: UploadCloud,
            title: "Upload Photo",
            description: "Drag and drop your image. We support JPG, PNG, and HEIC formats.",
            step: 1,
        },
        {
            icon: Cpu,
            title: "AI Processing",
            description: "Our neural engine analyzes and restores your image in roughly 5–10 seconds.",
            step: 2,
        },
        {
            icon: Download,
            title: "Download Result",
            description: "Preview the comparison and download your 4K restored image instantly.",
            step: 3,
        },
    ];

    return (
        <section id="how-it-works" className="px-5 md:px-8" style={{ paddingTop: 'clamp(64px, 8vw, 96px)', paddingBottom: 'clamp(64px, 8vw, 96px)' }}>
            <div className="max-w-[1280px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-text-main mb-4"
                        style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.25 }}
                    >
                        How It Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
                        className="text-text-secondary"
                        style={{ fontSize: '15px', lineHeight: 1.6 }}
                    >
                        Restore your photos in three simple steps.
                    </motion.p>
                </div>

                {/* Steps — horizontal on desktop, vertical on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ delay: index * 0.1, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                            className="flex flex-col items-center text-center"
                            style={{
                                padding: '28px',
                                borderRadius: 'var(--radius-xl)',
                                backgroundColor: 'var(--floating-bg)',
                                backdropFilter: 'blur(30px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                                border: 'var(--floating-border)',
                                boxShadow: 'var(--depth-2)',
                            }}
                        >
                            {/* Step Number Badge */}
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[15px] font-semibold mb-5"
                                style={{ backgroundColor: 'var(--accent)' }}
                            >
                                {step.step}
                            </div>

                            {/* Icon */}
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                                style={{ backgroundColor: 'var(--accent-soft)' }}
                            >
                                <step.icon className="w-7 h-7" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                            </div>

                            <h3
                                className="text-text-main mb-2"
                                style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.3px', lineHeight: 1.3 }}
                            >
                                {step.title}
                            </h3>
                            <p
                                className="text-text-secondary max-w-xs"
                                style={{ fontSize: '15px', lineHeight: 1.6 }}
                            >
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
