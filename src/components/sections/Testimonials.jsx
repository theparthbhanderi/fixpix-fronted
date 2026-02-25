import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: 'Sarah Jenkins',
        role: 'Photographer',
        content: 'I recovered photos from my grandmother\'s wedding that we thought were lost forever. The colorization is pure magic.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
        stars: 5,
        accent: '#AF52DE',
    },
    {
        name: 'Mark Thompson',
        role: 'Historian',
        content: 'The level of detail FixPix recovers from century-old documents is simply unprecedented. A genuine game changer for our archive.',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150',
        stars: 5,
        accent: '#007AFF',
    },
    {
        name: 'Jessica Chen',
        role: 'Designer',
        content: 'I use this tool daily to upscale low-res assets from clients. Saves me hours of manual reconstruction work every single week.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150',
        stars: 5,
        accent: '#FF9500',
    },
    {
        name: 'David Wilson',
        role: 'Archivist',
        content: 'Finally, an AI tool that respects the original grain while removing damage. The results are museum-quality.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
        stars: 5,
        accent: '#34C759',
    },
];

const StarRow = ({ count }) => (
    <div className="flex gap-0.5">
        {[...Array(count)].map((_, i) => (
            <Star key={i} size={14} style={{ fill: '#FFD60A', color: '#FFD60A' }} />
        ))}
    </div>
);

/* ───── Card (shared between grid and slider) ───── */
const TestimonialCard = ({ t, index, isSlider = false }) => (
    <motion.div
        initial={isSlider ? {} : { opacity: 0, y: 24 }}
        whileInView={isSlider ? {} : { opacity: 1, y: 0 }}
        viewport={isSlider ? undefined : { once: true, margin: '-30px' }}
        transition={isSlider ? {} : { delay: index * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        style={{
            height: '100%',
            ...(isSlider ? { width: '85vw', maxWidth: '340px', flexShrink: 0, scrollSnapAlign: 'center' } : {}),
        }}
    >
        <div
            style={{
                padding: isSlider ? '24px 22px' : 'clamp(24px, 3vw, 32px)',
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
                    top: '-30px',
                    left: '-30px',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${t.accent}10, transparent 70%)`,
                    pointerEvents: 'none',
                }}
            />

            {/* Quote icon */}
            <div
                style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: `${t.accent}14`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                    flexShrink: 0,
                }}
            >
                <Quote size={16} strokeWidth={2} style={{ color: t.accent }} />
            </div>

            {/* Stars */}
            <div style={{ marginBottom: '12px' }}>
                <StarRow count={t.stars} />
            </div>

            {/* Quote */}
            <p
                style={{
                    fontSize: isSlider ? '14px' : 'clamp(14px, 1.6vw, 16px)',
                    lineHeight: 1.7,
                    color: 'var(--text-primary)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    flex: 1,
                    marginBottom: '18px',
                }}
            >
                &ldquo;{t.content}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3" style={{ marginTop: 'auto' }}>
                <img
                    src={t.image}
                    alt={t.name}
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `2px solid ${t.accent}30`,
                        flexShrink: 0,
                    }}
                />
                <div>
                    <p style={{ fontSize: '13px', fontWeight: 620, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {t.name}
                    </p>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                        {t.role}
                    </p>
                </div>
            </div>
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
            const cardWidth = el.firstChild?.offsetWidth || 300;
            const gap = 14;
            const idx = Math.round(scrollLeft / (cardWidth + gap));
            setActiveIndex(Math.min(idx, TESTIMONIALS.length - 1));
        };
        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            {/* Scrollable track */}
            <div
                ref={scrollRef}
                style={{
                    display: 'flex',
                    gap: '14px',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    paddingBottom: '8px',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                }}
                className="hide-scrollbar"
            >
                {TESTIMONIALS.map((t, i) => (
                    <TestimonialCard key={i} t={t} index={i} isSlider />
                ))}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2" style={{ marginTop: '18px' }}>
                {TESTIMONIALS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            const el = scrollRef.current;
                            if (!el) return;
                            const cardWidth = el.firstChild?.offsetWidth || 300;
                            el.scrollTo({ left: i * (cardWidth + 14), behavior: 'smooth' });
                        }}
                        style={{
                            width: i === activeIndex ? '22px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: i === activeIndex ? 'var(--accent)' : 'var(--fill-secondary)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 250ms ease',
                            padding: 0,
                        }}
                        aria-label={`Go to testimonial ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

/* ───── Main Section ───── */
const Testimonials = () => (
    <section
        id="testimonials"
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
                        Testimonials
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
                    Loved by Users
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
                    Photographers, historians, and designers trust FixPix to restore what matters most.
                </motion.p>
            </div>

            {/* Desktop: 2×2 grid */}
            <div
                className="hidden md:grid grid-cols-2"
                style={{ gap: '20px' }}
            >
                {TESTIMONIALS.map((t, index) => (
                    <TestimonialCard key={index} t={t} index={index} />
                ))}
            </div>

            {/* Mobile: horizontal slider */}
            <div className="block md:hidden">
                <MobileSlider />
            </div>

            {/* Trust bar */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-6 md:gap-10 px-5 md:px-0"
                style={{ marginTop: 'clamp(36px, 5vw, 56px)' }}
            >
                {[
                    { value: '10K+', label: 'Photos Restored' },
                    { value: '4.9', label: 'Average Rating' },
                    { value: '50+', label: 'Countries' },
                ].map((stat, i) => (
                    <div key={i} className="text-center" style={{ minWidth: '90px' }}>
                        <p
                            style={{
                                fontSize: 'clamp(22px, 3vw, 28px)',
                                fontWeight: 750,
                                color: 'var(--accent)',
                                lineHeight: 1.2,
                                letterSpacing: '-0.5px',
                            }}
                        >
                            {stat.value}
                        </p>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-tertiary)', marginTop: '4px' }}>
                            {stat.label}
                        </p>
                    </div>
                ))}
            </motion.div>
        </div>
    </section>
);

export default Testimonials;
