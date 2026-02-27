import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Zap, Eraser, Maximize2, Palette, Layers, ImagePlus, Sparkles } from 'lucide-react';

const features = [
    {
        title: 'AI Text to Image',
        description: 'Transform words into beautiful, high-resolution artwork. From realistic photography to cinematic scenes, simply describe your vision and let AI generate stunning visuals in seconds.',
        icon: ImagePlus,
        accent: '#7C3AED',
        accentSoft: 'rgba(124, 58, 237, 0.08)',
        size: 'large',
        badge: 'NEW',
    },
    {
        title: 'Auto Colorization',
        description: 'Breathe life into black & white memories. Our deep learning model adds natural, historically-accurate color.',
        icon: Palette,
        accent: '#AF52DE',
        accentSoft: 'rgba(175, 82, 222, 0.08)',
        size: 'small',
    },
    {
        title: 'Face Enhancement',
        description: 'Recover facial details — eyes, skin texture, and expressions — with incredible AI precision.',
        icon: Zap,
        accent: '#FF9500',
        accentSoft: 'rgba(255, 149, 0, 0.08)',
        size: 'small',
    },
    {
        title: 'Scratch Removal',
        description: 'Intelligently detect and fill scratches, tears, and dust marks while preserving original detail.',
        icon: Eraser,
        accent: '#007AFF',
        accentSoft: 'rgba(0, 122, 255, 0.08)',
        size: 'small',
    },
    {
        title: '4K Upscaling',
        description: 'Increase resolution up to 4× with AI super-resolution. Perfect for printing large-format photos.',
        icon: Maximize2,
        accent: '#34C759',
        accentSoft: 'rgba(52, 199, 89, 0.08)',
        size: 'small',
    },
    {
        title: 'Smart Inpainting',
        description: 'Select any unwanted area and our AI fills it seamlessly with context-aware content generation.',
        icon: Wand2,
        accent: '#FF2D55',
        accentSoft: 'rgba(255, 45, 85, 0.08)',
        size: 'small',
    },
    {
        title: 'Batch Processing',
        description: 'Restore entire albums at once. Queue multiple images and let AI process them in the background.',
        icon: Layers,
        accent: '#5AC8FA',
        accentSoft: 'rgba(90, 200, 250, 0.08)',
        size: 'small',
    },
];

/* ───── Feature Card ───── */
const FeatureCard = ({ feature, index, isSlider = false }) => (
    <motion.div
        initial={isSlider ? {} : { opacity: 0, y: 24 }}
        whileInView={isSlider ? {} : { opacity: 1, y: 0 }}
        viewport={isSlider ? undefined : { once: true, margin: '-40px' }}
        transition={isSlider ? {} : { duration: 0.5, delay: index * 0.07, ease: [0.25, 1, 0.5, 1] }}
        className={isSlider ? '' : feature.size === 'large' ? 'md:col-span-2' : ''}
        style={{
            height: '100%',
            ...(isSlider ? { width: '80vw', maxWidth: '300px', flexShrink: 0, scrollSnapAlign: 'center' } : {}),
        }}
    >
        <div
            style={{
                padding: isSlider ? '22px 20px' : 'clamp(24px, 3vw, 32px)',
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
                cursor: 'default',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--depth-2)';
                e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'var(--depth-1)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Accent glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${feature.accent}12, transparent 70%)`,
                    pointerEvents: 'none',
                }}
            />

            {/* Icon */}
            <div
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    backgroundColor: feature.accentSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: isSlider ? '14px' : 'clamp(14px, 2vw, 20px)',
                    flexShrink: 0,
                }}
            >
                <feature.icon size={22} strokeWidth={1.75} style={{ color: feature.accent }} />
            </div>

            {/* Title */}
            <h3
                style={{
                    fontSize: isSlider ? '16px' : 'clamp(17px, 2vw, 20px)',
                    fontWeight: 650,
                    letterSpacing: '-0.3px',
                    lineHeight: 1.3,
                    color: 'var(--text-primary)',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                {feature.title}
                {feature.badge && (
                    <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '6px',
                        backgroundColor: `${feature.accent}15`,
                        color: feature.accent,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        lineHeight: 1.4,
                    }}>
                        {feature.badge}
                    </span>
                )}
            </h3>

            {/* Description */}
            <p
                style={{
                    fontSize: isSlider ? '13px' : 'clamp(14px, 1.5vw, 15px)',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    flex: 1,
                }}
            >
                {feature.description}
            </p>

            {/* Accent bottom line */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '20px',
                    right: '20px',
                    height: '2px',
                    background: `linear-gradient(90deg, ${feature.accent}40, transparent)`,
                    borderRadius: 1,
                }}
            />
        </div>
    </motion.div>
);

/* ───── Mobile Slider ───── */
const MobileSlider = () => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const handleScroll = () => {
            const scrollLeft = el.scrollLeft;
            const cardWidth = el.firstChild?.offsetWidth || 280;
            const gap = 12;
            const idx = Math.round(scrollLeft / (cardWidth + gap));
            setActiveIndex(Math.min(idx, features.length - 1));
        };
        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            {/* Scrollable track */}
            <div
                ref={scrollRef}
                className="hide-scrollbar"
                style={{
                    display: 'flex',
                    gap: '12px',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    paddingBottom: '8px',
                }}
            >
                {features.map((f, i) => (
                    <FeatureCard key={i} feature={f} index={i} isSlider />
                ))}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5" style={{ marginTop: '16px' }}>
                {features.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            const el = scrollRef.current;
                            if (!el) return;
                            const cardWidth = el.firstChild?.offsetWidth || 280;
                            el.scrollTo({ left: i * (cardWidth + 12), behavior: 'smooth' });
                        }}
                        style={{
                            width: i === activeIndex ? '20px' : '7px',
                            height: '7px',
                            borderRadius: '4px',
                            backgroundColor: i === activeIndex ? 'var(--accent)' : 'var(--fill-secondary)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 250ms ease',
                            padding: 0,
                        }}
                        aria-label={`Go to feature ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

/* ───── Main Section ───── */
const FeaturesGrid = () => (
    <section
        id="features"
        className="px-0 md:px-8"
        style={{
            paddingTop: 'clamp(64px, 8vw, 120px)',
            paddingBottom: 'clamp(64px, 8vw, 120px)',
        }}
    >
        <div className="max-w-[1180px] mx-auto">
            {/* Header */}
            <div className="text-center px-5 md:px-0" style={{ marginBottom: 'clamp(36px, 5vw, 72px)' }}>
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
                        Features
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
                    Powerful AI Tools
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
                        maxWidth: '460px',
                        margin: '0 auto',
                    }}
                >
                    Our AI engine understands your photos and applies the perfect restoration — automatically.
                    {' '}Now including AI-powered text-to-image creation for limitless creativity.
                </motion.p>

                {/* Hero highlight strip */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.14, duration: 0.4 }}
                    style={{
                        marginTop: '16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(124, 58, 237, 0.06)',
                        color: '#7C3AED',
                        fontSize: '13px',
                        fontWeight: 600,
                    }}
                >
                    <Sparkles size={14} strokeWidth={2} />
                    Create from imagination — no photo required.
                </motion.div>
            </div>

            {/* Desktop: Bento Grid */}
            <div
                className="hidden md:grid grid-cols-3"
                style={{ gap: 'clamp(14px, 2vw, 20px)' }}
            >
                {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} index={index} />
                ))}
            </div>

            {/* Mobile: Horizontal Slider */}
            <div className="block md:hidden">
                <MobileSlider />
            </div>
        </div>
    </section>
);

export default FeaturesGrid;
