import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, Upload, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

/* ═══════════════════════════════════════════════════════
   Testimonials Data
═══════════════════════════════════════════════════════ */
const TESTIMONIALS = [
    {
        name: 'Sarah Jenkins',
        role: 'Photographer',
        content: "I recovered photos from my grandmother's wedding that we thought were lost forever. The colorization is pure magic.",
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
        stars: 5,
        accent: '#AF52DE',
        accentRgb: '175, 82, 222',
    },
    {
        name: 'Mark Thompson',
        role: 'Historian',
        content: 'The level of detail FixPix recovers from old documents is simply unprecedented. A genuine game changer for our archive.',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150',
        stars: 5,
        accent: '#007AFF',
        accentRgb: '0, 122, 255',
    },
    {
        name: 'Jessica Chen',
        role: 'Designer',
        content: 'I use this tool daily to upscale low-res assets for clients. Saves hours of manual reconstruction work every single week.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150',
        stars: 5,
        accent: '#FF9500',
        accentRgb: '255, 149, 0',
    },
    {
        name: 'David Wilson',
        role: 'Archivist',
        content: 'Finally an AI tool that respects the original grain while removing damage. The results are museum quality.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
        stars: 5,
        accent: '#34C759',
        accentRgb: '52, 199, 89',
    },
];

const STATS = [
    { target: 10000, suffix: 'K+', display: '10K+', label: 'Photos Restored' },
    { target: 49, suffix: '', display: '4.9', label: 'Average Rating' },
    { target: 50, suffix: '+', display: '50+', label: 'Countries' },
];

/* ═══════════════════════════════════════════════════════
   Star Row
═══════════════════════════════════════════════════════ */
const StarRow = ({ count }) => (
    <div style={{ display: 'flex', gap: '3px' }}>
        {[...Array(count)].map((_, i) => (
            <Star key={i} size={14} style={{ fill: '#FFD60A', color: '#FFD60A' }} />
        ))}
    </div>
);

/* ═══════════════════════════════════════════════════════
   Testimonial Card
═══════════════════════════════════════════════════════ */
const TestimonialCard = ({ t, index, isSlider = false }) => (
    <motion.div
        initial={isSlider ? {} : { opacity: 0, y: 40, filter: 'blur(6px)' }}
        whileInView={isSlider ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={isSlider ? undefined : { once: true, margin: '-30px' }}
        transition={isSlider ? {} : { delay: index * 0.1, duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
        style={{
            height: '100%',
            ...(isSlider ? { width: '85vw', maxWidth: '340px', flexShrink: 0, scrollSnapAlign: 'center' } : {}),
        }}
    >
        <div
            style={{
                padding: isSlider ? '24px 22px' : 'clamp(24px, 3vw, 32px)',
                borderRadius: '20px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 300ms ease, transform 300ms ease, border-color 300ms ease',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 20px 48px rgba(${t.accentRgb}, 0.15), 0 4px 16px rgba(0,0,0,0.06)`;
                e.currentTarget.style.borderColor = `rgba(${t.accentRgb}, 0.4)`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
        >
            {/* Ambient corner glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '-40px',
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(${t.accentRgb}, 0.08) 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }}
            />

            {/* Quote icon */}
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    backgroundColor: `rgba(${t.accentRgb}, 0.12)`,
                    border: `1px solid rgba(${t.accentRgb}, 0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    flexShrink: 0,
                }}
            >
                <Quote size={16} strokeWidth={2} style={{ color: t.accent }} />
            </div>

            {/* Stars */}
            <div style={{ marginBottom: '14px' }}>
                <StarRow count={t.stars} />
            </div>

            {/* Quote text */}
            <p
                style={{
                    fontSize: isSlider ? '14px' : 'clamp(14px, 1.5vw, 16px)',
                    lineHeight: 1.75,
                    color: 'var(--text-primary)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    flex: 1,
                    marginBottom: '20px',
                }}
            >
                &ldquo;{t.content}&rdquo;
            </p>

            {/* Author row */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-subtle)',
                }}
            >
                <img
                    src={t.image}
                    alt={t.name}
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `2px solid rgba(${t.accentRgb}, 0.35)`,
                        flexShrink: 0,
                        transition: 'transform 250ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div>
                    <p style={{ fontSize: '14px', fontWeight: 650, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {t.name}
                    </p>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: `rgba(${t.accentRgb}, 0.85)`, lineHeight: 1.4, marginTop: '2px' }}>
                        {t.role}
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════
   Count-up Stat
═══════════════════════════════════════════════════════ */
const CountUpStat = ({ stat, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-40px' });
    const [displayed, setDisplayed] = useState('0');

    useEffect(() => {
        if (!isInView) return;
        // Just animate to the display string after brief delay
        const timeout = setTimeout(() => {
            setDisplayed(stat.display);
        }, index * 120);
        return () => clearTimeout(timeout);
    }, [isInView, stat.display, index]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: index * 0.12, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            style={{ textAlign: 'center', minWidth: '100px' }}
        >
            <p
                style={{
                    fontSize: 'clamp(32px, 4vw, 48px)',
                    fontWeight: 800,
                    letterSpacing: '-1.5px',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, var(--accent) 0%, #AF52DE 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    transition: 'all 400ms ease',
                }}
            >
                {displayed}
            </p>
            <p
                style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-tertiary)',
                    marginTop: '6px',
                    letterSpacing: '0.3px',
                }}
            >
                {stat.label}
            </p>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════
   Mobile Slider
═══════════════════════════════════════════════════════ */
const MobileSlider = () => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const handleScroll = () => {
            const cardWidth = el.firstChild?.offsetWidth || 300;
            const idx = Math.round(el.scrollLeft / (cardWidth + 14));
            setActiveIndex(Math.min(idx, TESTIMONIALS.length - 1));
        };
        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
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
            >
                {TESTIMONIALS.map((t, i) => (
                    <TestimonialCard key={i} t={t} index={i} isSlider />
                ))}
            </div>
            {/* Dot nav */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '18px' }}>
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

/* ═══════════════════════════════════════════════════════
   Main Section
═══════════════════════════════════════════════════════ */
const Testimonials = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleCTA = () => navigate(user ? '/app/restoration' : '/login');

    return (
        <section
            id="testimonials"
            style={{
                paddingTop: 'clamp(80px, 10vw, 140px)',
                paddingBottom: 'clamp(80px, 10vw, 140px)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* ── Ambient background ── */}
            {/* Radial left glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '5%',
                    right: '-8%',
                    width: '45vw',
                    height: '45vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(175, 82, 222, 0.06) 0%, transparent 65%)',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-8%',
                    width: '40vw',
                    height: '40vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 65%)',
                    pointerEvents: 'none',
                }}
            />
            {/* Subtle dot grid */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'radial-gradient(circle, var(--border-subtle, rgba(0,0,0,0.06)) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    pointerEvents: 'none',
                    opacity: 0.5,
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
                }}
            />

            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* ── Section Header ── */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 80px)' }}>
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
                                marginBottom: '16px',
                                padding: '5px 16px',
                                borderRadius: '20px',
                                backgroundColor: 'var(--accent-soft)',
                            }}
                        >
                            TESTIMONIALS
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.07, duration: 0.55 }}
                        style={{
                            fontSize: 'clamp(28px, 4.5vw, 44px)',
                            fontWeight: 800,
                            letterSpacing: '-0.9px',
                            lineHeight: 1.15,
                            color: 'var(--text-primary)',
                            marginBottom: '14px',
                        }}
                    >
                        Loved by Users{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #AF52DE 0%, #007AFF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Worldwide
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.13, duration: 0.45 }}
                        style={{
                            fontSize: 'clamp(15px, 1.8vw, 17px)',
                            lineHeight: 1.65,
                            color: 'var(--text-secondary)',
                            maxWidth: '460px',
                            margin: '0 auto',
                        }}
                    >
                        Photographers, designers, and families trust FixPix to restore their memories.
                    </motion.p>
                </div>

                {/* ── Desktop 2×2 Grid ── */}
                <div
                    className="hidden md:grid"
                    style={{
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '24px',
                    }}
                >
                    {TESTIMONIALS.map((t, i) => (
                        <TestimonialCard key={i} t={t} index={i} />
                    ))}
                </div>

                {/* ── Mobile Slider ── */}
                <div className="block md:hidden">
                    <MobileSlider />
                </div>

                {/* ── Stats Row ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    style={{
                        marginTop: 'clamp(48px, 7vw, 80px)',
                        padding: 'clamp(28px, 4vw, 48px) clamp(24px, 5vw, 64px)',
                        borderRadius: '20px',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 'clamp(24px, 6vw, 80px)',
                        flexWrap: 'wrap',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Faint inner glow */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,122,255,0.03) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }}
                    />
                    {/* Dividers between stats */}
                    {STATS.map((stat, i) => (
                        <React.Fragment key={i}>
                            <CountUpStat stat={stat} index={i} />
                            {i < STATS.length - 1 && (
                                <div
                                    style={{
                                        width: '1px',
                                        height: '40px',
                                        backgroundColor: 'var(--border-subtle)',
                                        flexShrink: 0,
                                    }}
                                    className="hidden sm:block"
                                />
                            )}
                        </React.Fragment>
                    ))}
                </motion.div>

                {/* ── Final CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ delay: 0.25, duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                    style={{
                        textAlign: 'center',
                        marginTop: 'clamp(48px, 7vw, 80px)',
                    }}
                >
                    <p
                        style={{
                            fontSize: 'clamp(16px, 2vw, 20px)',
                            color: 'var(--text-secondary)',
                            marginBottom: '24px',
                            fontWeight: 400,
                            letterSpacing: '-0.2px',
                        }}
                    >
                        Restore your memories today.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '14px',
                            flexWrap: 'wrap',
                        }}
                    >
                        {/* Primary CTA */}
                        <button
                            onClick={handleCTA}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '9px',
                                padding: '14px 32px',
                                borderRadius: '50px',
                                background: 'linear-gradient(135deg, #007AFF 0%, #AF52DE 100%)',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: 650,
                                letterSpacing: '-0.2px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 6px 24px rgba(0, 122, 255, 0.3)',
                                transition: 'transform 200ms ease, box-shadow 200ms ease, filter 200ms ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 122, 255, 0.4)';
                                e.currentTarget.style.filter = 'brightness(1.08)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 122, 255, 0.3)';
                                e.currentTarget.style.filter = 'none';
                            }}
                            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
                        >
                            <Upload size={17} strokeWidth={2} />
                            Upload Image
                        </button>

                        {/* Secondary CTA */}
                        <button
                            onClick={handleCTA}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '9px',
                                padding: '13px 28px',
                                borderRadius: '50px',
                                background: 'transparent',
                                color: 'var(--text-primary)',
                                fontSize: '16px',
                                fontWeight: 600,
                                letterSpacing: '-0.2px',
                                border: '1.5px solid var(--border-color, var(--border-subtle))',
                                cursor: 'pointer',
                                transition: 'transform 200ms ease, border-color 200ms ease, background 200ms ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = 'var(--accent)';
                                e.currentTarget.style.background = 'var(--accent-soft)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.borderColor = 'var(--border-color, var(--border-subtle))';
                                e.currentTarget.style.background = 'transparent';
                            }}
                            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        >
                            <Play size={16} strokeWidth={2} style={{ fill: 'currentColor' }} />
                            Explore Demo
                        </button>
                    </div>

                    {/* Trust micro badges */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'clamp(12px, 3vw, 28px)',
                            marginTop: '18px',
                            flexWrap: 'wrap',
                        }}
                    >
                        {[
                            { icon: '✔', label: '100% Private' },
                            { icon: '⚡', label: 'Under 10s' },
                            { icon: '📷', label: 'Up to 4K Output' },
                        ].map(({ icon, label }) => (
                            <span
                                key={label}
                                style={{
                                    fontSize: '13px',
                                    color: 'var(--text-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                }}
                            >
                                {icon} {label}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
