import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2, Zap, Eraser, Maximize2, Palette,
    Layers, Sparkles, Upload, ArrowRight,
    ChevronLeft, ChevronRight,
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════
   Feature Data
═══════════════════════════════════════════════════════ */
const features = [
    {
        id: 'colorization',
        title: 'Auto Colorization',
        description: 'Bring life back to black & white photos with realistic, historically-accurate AI color mapping.',
        icon: Palette,
        accent: '#AF52DE',
        accentRgb: '175, 82, 222',
        preview: {
            before: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=60&w=400&auto=format&fit=crop&sat=-100',
            after: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=60&w=400&auto=format&fit=crop',
        },
    },
    {
        id: 'face',
        title: 'Face Enhancement',
        description: 'Recover lost facial details, skin texture, and expression clarity — instantly with AI precision.',
        icon: Zap,
        accent: '#FF9500',
        accentRgb: '255, 149, 0',
        preview: {
            before: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=60&w=400&auto=format&fit=crop&sat=-60&blur=4',
            after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=60&w=400&auto=format&fit=crop',
        },
    },
    {
        id: 'scratch',
        title: 'Scratch Removal',
        description: 'Intelligently detect and remove damage, dust marks, and tears while preserving every original detail.',
        icon: Eraser,
        accent: '#007AFF',
        accentRgb: '0, 122, 255',
        preview: null,
    },
    {
        id: 'upscale',
        title: '4K Upscaling',
        description: 'Enhance resolution up to 4× without losing sharpness. Perfect for printing large-format memories.',
        icon: Maximize2,
        accent: '#34C759',
        accentRgb: '52, 199, 89',
        preview: {
            before: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=20&w=200&auto=format&fit=crop',
            after: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
        },
    },
    {
        id: 'inpaint',
        title: 'Smart Inpainting',
        description: 'Select any unwanted object or blemish and our AI fills it seamlessly with context-aware content.',
        icon: Wand2,
        accent: '#FF2D55',
        accentRgb: '255, 45, 85',
        preview: null,
    },
    {
        id: 'batch',
        title: 'Batch Processing',
        description: 'Restore entire photo albums in one click. Queue multiple images and let AI work in the background.',
        icon: Layers,
        accent: '#5AC8FA',
        accentRgb: '90, 200, 250',
        preview: null,
    },
];

/* ═══════════════════════════════════════════════════════
   Mini Before/After Preview (hover-activated)
═══════════════════════════════════════════════════════ */
const MiniPreview = ({ before, after, accent }) => {
    const [pos, setPos] = useState(50);
    const ref = useRef(null);
    const dragging = useRef(false);

    const handleMove = (clientX) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setPos(Math.max(5, Math.min((x / rect.width) * 100, 95)));
    };

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                width: '100%',
                height: '108px',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'ew-resize',
                userSelect: 'none',
                touchAction: 'none',
                backgroundColor: 'var(--fill-tertiary)',
            }}
            onMouseDown={(e) => { dragging.current = true; handleMove(e.clientX); }}
            onMouseMove={(e) => { if (dragging.current) handleMove(e.clientX); }}
            onMouseUp={() => { dragging.current = false; }}
            onMouseLeave={() => { dragging.current = false; }}
        >
            {/* After (bg) */}
            <img
                src={after}
                alt="After"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                draggable={false}
            />
            {/* Before (clipped left) */}
            <div
                style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)`, overflow: 'hidden' }}
            >
                <img
                    src={before}
                    alt="Before"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    draggable={false}
                />
            </div>
            {/* Labels */}
            <span style={{
                position: 'absolute', top: 6, left: 7, fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.8px', textTransform: 'uppercase', color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px',
                backdropFilter: 'blur(6px)', pointerEvents: 'none',
            }}>Before</span>
            <span style={{
                position: 'absolute', top: 6, right: 7, fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.8px', textTransform: 'uppercase', color: 'white',
                backgroundColor: `rgba(${accent === '#34C759' ? '52,199,89' : '0,0,0'}, 0.6)`,
                borderRadius: 4, padding: '2px 6px',
                backdropFilter: 'blur(6px)', pointerEvents: 'none',
            }}>After</span>
            {/* Divider */}
            <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${pos}%`, transform: 'translateX(-50%)',
                width: 2, background: 'white',
                boxShadow: '0 0 8px rgba(0,0,0,0.4)',
                pointerEvents: 'none',
            }} />
            {/* Handle */}
            <div style={{
                position: 'absolute', top: '50%', left: `${pos}%`,
                transform: 'translate(-50%, -50%)',
                width: 22, height: 22, borderRadius: '50%',
                background: 'white', display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                pointerEvents: 'none',
            }}>
                <div style={{ display: 'flex', gap: 0 }}>
                    <ChevronLeft size={10} strokeWidth={2.5} style={{ color: '#007AFF' }} />
                    <ChevronRight size={10} strokeWidth={2.5} style={{ color: '#007AFF' }} />
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════
   Feature Card
═══════════════════════════════════════════════════════ */
const FeatureCard = ({ feature, index, onCardClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
            style={{ height: '100%' }}
        >
            <div
                onClick={() => onCardClick(feature.id)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '24px',
                    borderRadius: 'var(--radius-2xl)',
                    /* glass card */
                    backgroundColor: 'var(--surface)',
                    border: hovered
                        ? `1px solid rgba(${feature.accentRgb}, 0.35)`
                        : '1px solid var(--border-subtle)',
                    boxShadow: hovered
                        ? `0 16px 48px -8px rgba(${feature.accentRgb}, 0.18), 0 6px 20px rgba(0,0,0,0.08)`
                        : 'var(--depth-1)',
                    transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
                    transition: 'transform 280ms cubic-bezier(0.25,1,0.5,1), box-shadow 280ms ease, border-color 280ms ease, background-color 200ms ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Accent glow corner */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: -30,
                        right: -30,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, rgba(${feature.accentRgb}, ${hovered ? 0.15 : 0.08}), transparent 70%)`,
                        transition: 'opacity 280ms ease',
                        pointerEvents: 'none',
                    }}
                />

                {/* Bottom accent line */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: hovered
                            ? `linear-gradient(90deg, rgba(${feature.accentRgb}, 0.7), rgba(${feature.accentRgb}, 0.1))`
                            : `linear-gradient(90deg, rgba(${feature.accentRgb}, 0.25), transparent)`,
                        transition: 'opacity 280ms ease',
                        pointerEvents: 'none',
                    }}
                />

                {/* Icon */}
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        backgroundColor: `rgba(${feature.accentRgb}, ${hovered ? 0.18 : 0.10})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 14,
                        flexShrink: 0,
                        transition: 'background-color 280ms ease',
                    }}
                >
                    <feature.icon
                        size={22}
                        strokeWidth={1.75}
                        style={{ color: feature.accent }}
                    />
                </div>

                {/* Title */}
                <h3
                    style={{
                        fontSize: '17px',
                        fontWeight: 650,
                        letterSpacing: '-0.3px',
                        lineHeight: 1.3,
                        color: 'var(--text-primary)',
                        marginBottom: 8,
                    }}
                >
                    {feature.title}
                </h3>

                {/* Description */}
                <p
                    style={{
                        fontSize: '14px',
                        lineHeight: 1.65,
                        color: 'var(--text-secondary)',
                        flex: 1,
                        marginBottom: feature.preview ? 14 : 0,
                    }}
                >
                    {feature.description}
                </p>

                {/* Mini Before/After Preview */}
                {feature.preview && (
                    <MiniPreview
                        before={feature.preview.before}
                        after={feature.preview.after}
                        accent={feature.accent}
                    />
                )}

                {/* Try it arrow */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        marginTop: 14,
                        fontSize: '13px',
                        fontWeight: 600,
                        color: feature.accent,
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? 'translateX(0)' : 'translateX(-4px)',
                        transition: 'opacity 220ms ease, transform 220ms ease',
                    }}
                >
                    Try it now
                    <ArrowRight size={13} strokeWidth={2.5} />
                </div>
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════
   Mobile horizontal slider
═══════════════════════════════════════════════════════ */
const MobileSlider = ({ features, onCardClick }) => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const handleScroll = () => {
            const idx = Math.round(el.scrollLeft / (el.firstChild?.offsetWidth + 12 || 292));
            setActiveIndex(Math.min(idx, features.length - 1));
        };
        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => el.removeEventListener('scroll', handleScroll);
    }, [features.length]);

    return (
        <div>
            <div
                ref={scrollRef}
                style={{
                    display: 'flex',
                    gap: '12px',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    paddingBottom: '8px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {features.map((f, i) => (
                    <div
                        key={f.id}
                        onClick={() => onCardClick(f.id)}
                        style={{
                            width: '80vw',
                            maxWidth: 300,
                            flexShrink: 0,
                            scrollSnapAlign: 'center',
                            padding: '20px',
                            borderRadius: 'var(--radius-2xl)',
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: 'var(--depth-1)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            backgroundColor: `rgba(${f.accentRgb}, 0.12)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 12,
                        }}>
                            <f.icon size={20} strokeWidth={1.75} style={{ color: f.accent }} />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 650, letterSpacing: '-0.3px', color: 'var(--text-primary)', marginBottom: 6 }}>
                            {f.title}
                        </h3>
                        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', flex: 1 }}>
                            {f.description}
                        </p>
                        {f.preview && (
                            <div style={{ marginTop: 12 }}>
                                <MiniPreview before={f.preview.before} after={f.preview.after} accent={f.accent} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* Dot indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: 16 }}>
                {features.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            const el = scrollRef.current;
                            if (!el) return;
                            el.scrollTo({ left: i * ((el.firstChild?.offsetWidth || 280) + 12), behavior: 'smooth' });
                        }}
                        style={{
                            width: i === activeIndex ? 20 : 7,
                            height: 7,
                            borderRadius: 4,
                            backgroundColor: i === activeIndex ? 'var(--accent)' : 'var(--fill-secondary)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 250ms ease',
                            padding: 0,
                        }}
                        aria-label={`Feature ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════
   Main Section
═══════════════════════════════════════════════════════ */
const FeaturesGrid = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (!user) {
            navigate('/login', { state: { from: '/app/restoration' } });
        } else {
            navigate('/app/restoration');
        }
    };

    const handleUploadClick = () => {
        if (!user) {
            navigate('/login', { state: { from: '/app/restoration' } });
        } else {
            navigate('/app/restoration');
        }
    };

    return (
        <section
            id="features"
            style={{
                paddingTop: 'clamp(80px, 10vw, 128px)',
                paddingBottom: 'clamp(80px, 10vw, 128px)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Ambient background glow */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
                        radial-gradient(ellipse 60% 50% at 80% 20%, rgba(175,82,222,0.05), transparent 60%),
                        radial-gradient(ellipse 50% 40% at 20% 80%, rgba(0,122,255,0.04), transparent 60%)
                    `,
                    pointerEvents: 'none',
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
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: 'clamp(48px, 6vw, 80px)',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                color: 'var(--accent)',
                                marginBottom: '16px',
                                padding: '5px 16px',
                                borderRadius: 999,
                                backgroundColor: 'var(--accent-soft)',
                                border: '1px solid rgba(0,122,255,0.15)',
                            }}
                        >
                            Features
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.08 }}
                        style={{
                            fontSize: 'clamp(28px, 4.5vw, 44px)',
                            fontWeight: 750,
                            letterSpacing: '-1px',
                            lineHeight: 1.15,
                            color: 'var(--text-primary)',
                            marginBottom: '14px',
                        }}
                    >
                        Powerful AI Tools
                        <br />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, var(--accent) 0%, #AF52DE 60%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Built for Real-World Results.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.15 }}
                        style={{
                            fontSize: 'clamp(15px, 1.8vw, 17px)',
                            lineHeight: 1.7,
                            color: 'var(--text-secondary)',
                            maxWidth: '520px',
                            margin: '0 auto',
                        }}
                    >
                        FixPix understands your images and intelligently enhances every
                        detail — automatically.
                    </motion.p>
                </div>

                {/* ── Desktop Feature Grid ── */}
                <div
                    className="hidden md:grid"
                    style={{
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                    }}
                >
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.id}
                            feature={feature}
                            index={index}
                            onCardClick={handleCardClick}
                        />
                    ))}
                </div>

                {/* ── Mobile Horizontal Slider ── */}
                <div className="block md:hidden" style={{ marginLeft: -24, marginRight: -24 }}>
                    <MobileSlider features={features} onCardClick={handleCardClick} />
                </div>

                {/* ── Bottom CTA Block ── */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    style={{
                        marginTop: 'clamp(56px, 7vw, 88px)',
                        textAlign: 'center',
                        padding: 'clamp(40px, 5vw, 64px) clamp(24px, 5vw, 48px)',
                        borderRadius: 'var(--radius-2xl)',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--depth-2)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* CTA background glow */}
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,122,255,0.06), transparent 70%)',
                            pointerEvents: 'none',
                        }}
                    />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <p
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                color: 'var(--accent)',
                                marginBottom: '14px',
                            }}
                        >
                            Start for free — no credit card required
                        </p>
                        <h3
                            style={{
                                fontSize: 'clamp(22px, 3.5vw, 34px)',
                                fontWeight: 750,
                                letterSpacing: '-0.8px',
                                lineHeight: 1.2,
                                color: 'var(--text-primary)',
                                marginBottom: '10px',
                            }}
                        >
                            Ready to restore your memories?
                        </h3>
                        <p
                            style={{
                                fontSize: 'clamp(14px, 1.6vw, 16px)',
                                lineHeight: 1.65,
                                color: 'var(--text-secondary)',
                                maxWidth: 400,
                                margin: '0 auto 28px',
                            }}
                        >
                            Upload any old photo and see the difference in seconds.
                        </p>

                        <button
                            id="features-upload-btn"
                            onClick={handleUploadClick}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '15px 36px',
                                borderRadius: 'var(--radius-xl)',
                                background: 'linear-gradient(135deg, var(--accent) 0%, #338FFF 100%)',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 650,
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 6px 24px rgba(0,122,255,0.38), 0 1px 0 rgba(255,255,255,0.15) inset',
                                transition: 'transform 160ms ease, box-shadow 160ms ease',
                                letterSpacing: '-0.2px',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,122,255,0.45), 0 1px 0 rgba(255,255,255,0.15) inset';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,122,255,0.38), 0 1px 0 rgba(255,255,255,0.15) inset';
                            }}
                            onMouseDown={e => { e.currentTarget.style.transform = 'translateY(0) scale(0.98)'; }}
                            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
                        >
                            <Upload size={18} strokeWidth={2} />
                            Upload Your Photo Now
                        </button>

                        {/* Trust row */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '20px',
                                marginTop: '18px',
                                flexWrap: 'wrap',
                            }}
                        >
                            {['✔ 100% Private', '⚡ Under 10s', '📷 Up to 4K Output'].map((t, i) => (
                                <span key={i} style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
