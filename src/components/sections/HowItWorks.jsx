import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Sparkles, Download, ArrowRight, ArrowDown } from 'lucide-react';

const steps = [
    {
        icon: UploadCloud,
        step: '01',
        title: 'Upload Your Photo',
        description: 'Drag & drop or tap to upload. We support JPG, PNG, HEIC, and WebP — up to 25 MB.',
        accent: '#007AFF',
        accentSoft: 'rgba(0, 122, 255, 0.08)',
    },
    {
        icon: Sparkles,
        step: '02',
        title: 'AI Does the Magic',
        description: 'Our neural engine restores, colorizes, and enhances your image in under 10 seconds.',
        accent: '#AF52DE',
        accentSoft: 'rgba(175, 82, 222, 0.08)',
    },
    {
        icon: Download,
        step: '03',
        title: 'Download in 4K',
        description: 'Preview a side-by-side comparison, then download your high-resolution restored image.',
        accent: '#34C759',
        accentSoft: 'rgba(52, 199, 89, 0.08)',
    },
];

const StepCard = ({ item, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: index * 0.12, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="relative"
        style={{ flex: 1, minWidth: 0 }}
    >
        <div
            className="step-card"
            style={{
                padding: 'clamp(24px, 3vw, 32px) clamp(20px, 3vw, 28px)',
                borderRadius: 'var(--radius-2xl)',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--depth-1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 300ms ease, transform 300ms ease',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--depth-2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'var(--depth-1)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Accent top border */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${item.accent}, ${item.accent}88)`,
                    borderRadius: '3px 3px 0 0',
                }}
            />

            {/* Step label + Icon */}
            <div className="flex items-center justify-between" style={{ marginBottom: 'clamp(16px, 2vw, 24px)' }}>
                <span
                    style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        color: item.accent,
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    }}
                >
                    STEP {item.step}
                </span>
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 13,
                        backgroundColor: item.accentSoft,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <item.icon size={22} strokeWidth={1.75} style={{ color: item.accent }} />
                </div>
            </div>

            {/* Title */}
            <h3
                style={{
                    fontSize: 'clamp(17px, 2vw, 20px)',
                    fontWeight: 650,
                    letterSpacing: '-0.3px',
                    lineHeight: 1.3,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                }}
            >
                {item.title}
            </h3>

            {/* Description */}
            <p
                style={{
                    fontSize: 'clamp(14px, 1.5vw, 15px)',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                }}
            >
                {item.description}
            </p>
        </div>
    </motion.div>
);

/* Desktop: horizontal arrow | Mobile: vertical arrow */
const Connector = ({ index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 + index * 0.12, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="flex items-center justify-center"
        style={{ flexShrink: 0 }}
    >
        {/* Desktop arrow */}
        <div
            className="hidden md:flex"
            style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'var(--fill-tertiary)',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <ArrowRight size={15} strokeWidth={2.5} style={{ color: 'var(--text-tertiary)' }} />
        </div>

        {/* Mobile arrow */}
        <div
            className="flex md:hidden"
            style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--fill-tertiary)',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '4px 0',
            }}
        >
            <ArrowDown size={14} strokeWidth={2.5} style={{ color: 'var(--text-tertiary)' }} />
        </div>
    </motion.div>
);

const HowItWorks = () => (
    <section
        id="how-it-works"
        className="px-5 md:px-8"
        style={{
            paddingTop: 'clamp(64px, 8vw, 120px)',
            paddingBottom: 'clamp(64px, 8vw, 120px)',
        }}
    >
        <div className="max-w-[1180px] mx-auto">
            {/* Header */}
            <div className="text-center" style={{ marginBottom: 'clamp(40px, 6vw, 80px)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                >
                    <span
                        style={{
                            display: 'inline-block',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            color: 'var(--accent)',
                            marginBottom: '14px',
                            padding: '5px 14px',
                            borderRadius: '20px',
                            backgroundColor: 'var(--accent-soft)',
                        }}
                    >
                        How It Works
                    </span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.06, duration: 0.45 }}
                    style={{
                        fontSize: 'clamp(24px, 4vw, 36px)',
                        fontWeight: 700,
                        letterSpacing: '-0.5px',
                        lineHeight: 1.2,
                        color: 'var(--text-primary)',
                        marginBottom: '12px',
                    }}
                >
                    Three steps to a perfect photo
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    style={{
                        fontSize: 'clamp(14px, 2vw, 16px)',
                        lineHeight: 1.65,
                        color: 'var(--text-secondary)',
                        maxWidth: '420px',
                        margin: '0 auto',
                    }}
                >
                    No technical skills needed. Upload your photo and let our AI handle the rest.
                </motion.p>
            </div>

            {/* Steps — horizontal on desktop, vertical on mobile */}
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-3 md:gap-0">
                {steps.map((item, index) => (
                    <React.Fragment key={index}>
                        <StepCard item={item} index={index} />
                        {index < steps.length - 1 && <Connector index={index} />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorks;
