import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Cpu, Download } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: UploadCloud,
            title: "Upload Photo",
            description: "Drag and drop your image. We support JPG, PNG, and HEIC formats."
        },
        {
            icon: Cpu,
            title: "AI Processing",
            description: "Our neural engine analyzes and restores your image in roughly 5-10 seconds."
        },
        {
            icon: Download,
            title: "Download Result",
            description: "Preview the comparison and download your 4K restored image instantly."
        }
    ];

    return (
        <section id="how-it-works" className="section-spacing ios-gutter bg-background">
            <div className="container-default">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="ios-title1 text-text-main mb-4"
                    >
                        How It Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-ios-body text-text-secondary"
                    >
                        Restore your photos in three simple steps.
                    </motion.p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-[2px] bg-separator/30" />

                    <div className="grid grid-cols-1 md:grid-cols-3 grid-gap-lg">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="flex flex-col items-center text-center"
                            >
                                {/* Step Circle */}
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 rounded-full bg-surface border-2 border-separator/30 shadow-ios flex items-center justify-center">
                                        <step.icon className="w-8 h-8 text-primary" />
                                    </div>

                                    {/* Step Number */}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-white text-ios-footnote font-semibold flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                </div>

                                <h3 className="text-ios-headline text-text-main mb-2">{step.title}</h3>
                                <p className="text-ios-subhead text-text-secondary max-w-xs">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
