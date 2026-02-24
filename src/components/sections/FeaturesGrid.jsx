import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Zap, MonitorPlay, Maximize2 } from 'lucide-react';

const features = [
    {
        title: "Auto Colorization",
        description: "Automatically add color to black and white photos using deep learning.",
        icon: Wand2,
    },
    {
        title: "Face Enhancement",
        description: "Restore facial details with incredible precision using AI.",
        icon: Zap,
    },
    {
        title: "Scratch Removal",
        description: "Intelligently fill in scratches, tears, and imperfections.",
        icon: MonitorPlay,
    },
    {
        title: "4K Upscaling",
        description: "Increase resolution up to 4x without any quality loss.",
        icon: Maximize2,
    },
];

const FeatureCard = ({ feature, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
        className="h-full"
        style={{
            padding: 'var(--space-7)',
            borderRadius: 'var(--radius-2xl)',
            backgroundColor: 'var(--card-bg)',
            border: 'var(--card-border)',
            boxShadow: 'var(--depth-1)',
            transition: 'transform 250ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 250ms cubic-bezier(0.25, 1, 0.5, 1)',
        }}
    >
        {/* Icon — monochrome accent tint */}
        <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
            style={{
                backgroundColor: 'var(--accent-soft)',
            }}
        >
            <feature.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
        </div>

        <h3
            className="text-text-main mb-2"
            style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.3px', lineHeight: 1.3 }}
        >
            {feature.title}
        </h3>
        <p
            className="text-text-secondary"
            style={{ fontSize: '15px', lineHeight: 1.6 }}
        >
            {feature.description}
        </p>
    </motion.div>
);

const FeaturesGrid = () => {
    return (
        <section id="features" className="px-5 md:px-8" style={{ paddingTop: 'clamp(64px, 8vw, 96px)', paddingBottom: 'clamp(64px, 8vw, 96px)' }}>
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
                        Powerful AI Tools
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
                        className="text-text-secondary max-w-lg mx-auto"
                        style={{ fontSize: '15px', lineHeight: 1.6 }}
                    >
                        Our AI engine understands your photos to apply the perfect restoration steps.
                    </motion.p>
                </div>

                {/* 3-column grid desktop, single-column mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
