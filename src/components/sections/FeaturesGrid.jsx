import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Zap, MonitorPlay, Maximize2, ChevronRight } from 'lucide-react';

const features = [
    {
        title: "Auto Colorization",
        description: "Automatically add color to black and white photos using deep learning.",
        icon: Wand2,
        color: "bg-ios-purple dark:bg-ios-purple-dark",
    },
    {
        title: "Face Enhancement",
        description: "Restore facial details with incredible precision using AI.",
        icon: Zap,
        color: "bg-ios-orange dark:bg-ios-orange-dark",
    },
    {
        title: "Scratch Removal",
        description: "Intelligently fill in scratches, tears, and imperfections.",
        icon: MonitorPlay,
        color: "bg-ios-green dark:bg-ios-green-dark",
    },
    {
        title: "4K Upscaling",
        description: "Increase resolution up to 4x without any quality loss.",
        icon: Maximize2,
        color: "bg-ios-blue dark:bg-ios-blue-dark",
    }
];

const FeatureCard = ({ feature, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
        className="group ios-card cursor-pointer h-full flex flex-col justify-between"
    >
        <div className="p-1">
            {/* Icon with squircle shape */}
            <div
                className={`w-14 h-14 rounded-[14px] flex items-center justify-center mb-4 ${feature.color}`}
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
                <feature.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>

            <h3 className="ios-headline text-text-main mb-2">{feature.title}</h3>
            <p className="ios-subhead text-text-secondary leading-relaxed">{feature.description}</p>
        </div>

        {/* Learn more link */}
        <div className="mt-4 pt-4 border-t border-separator/10 flex items-center justify-between">
            <span className="ios-footnote text-primary font-medium">Learn more</span>
            <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
        </div>
    </motion.div>
);

const FeaturesGrid = () => {
    return (
        <section id="features" className="section-spacing ios-gutter bg-background">
            <div className="container-default">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="ios-title1 text-text-main mb-4"
                    >
                        Powerful AI Tools
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-ios-body text-text-secondary max-w-lg mx-auto"
                    >
                        Our AI engine understands your photos to apply the perfect restoration steps.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 grid-gap-lg">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
