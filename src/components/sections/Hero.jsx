import React, { useContext, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../ui/Button';
import { Sparkles, Upload, ArrowRight, Shield, Zap, Image } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import BeforeAfterSlider from '../features/BeforeAfterSlider';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────
   Trust badge data
───────────────────────────────────────────────────── */
const trustBadges = [
    { icon: '✔', label: '100% Private' },
    { icon: '⚡', label: 'Under 10s' },
    { icon: '📷', label: 'Up to 4K' },
];

/* ─────────────────────────────────────────────────────
   Framer-Motion Variants
───────────────────────────────────────────────────── */
const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
    },
};

const sliderFadeIn = {
    hidden: { opacity: 0, y: 36, filter: 'blur(8px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.75, delay: 0.35, ease: [0.25, 1, 0.5, 1] },
    },
};

/* ─────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────── */
const Hero = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const sectionRef = useRef(null);

    // Subtle parallax for the demo card
    const { scrollY } = useScroll();
    const parallaxY = useTransform(scrollY, [0, 400], [0, -28]);

    const handleUploadClick = () => {
        if (!user) {
            navigate('/login', { state: { from: '/app/restoration' } });
            return;
        }
        navigate('/app/restoration');
    };

    const handleDemoClick = () => {
        const el = document.getElementById('features');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/app');
        }
    };

    return (
        <section
            id="hero"
            ref={sectionRef}
            className="relative w-full overflow-hidden"
            style={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                paddingTop: 'clamp(120px, 14vw, 160px)',
                paddingBottom: 'clamp(64px, 8vw, 96px)',
            }}
        >
            {/* ── Ambient gradient background ── */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse 70% 50% at 20% 30%, rgba(0,122,255,0.07), transparent 65%),
                        radial-gradient(ellipse 50% 40% at 80% 70%, rgba(175,82,222,0.05), transparent 60%),
                        radial-gradient(ellipse 60% 40% at 50% 100%, rgba(52,199,89,0.03), transparent 60%)
                    `,
                }}
            />

            {/* ── Subtle dot grid ── */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--border-subtle) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    opacity: 0.5,
                }}
            />

            {/* ── Main container ── */}
            <div
                className="relative z-10 w-full mx-auto px-5 md:px-8"
                style={{ maxWidth: '1200px' }}
            >
                {/* ── 2-col grid: text LEFT | slider RIGHT ── */}
                <div
                    className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
                    style={{ alignItems: 'center' }}
                >
                    {/* ═══════════════════════════════
                        LEFT — Text Block
                    ═══════════════════════════════ */}
                    <motion.div
                        className="flex-1 text-center lg:text-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ maxWidth: 520 }}
                    >
                        {/* Badge */}
                        <motion.div variants={fadeUp}>
                            <span
                                className="inline-flex items-center gap-2 mb-6"
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: 999,
                                    fontSize: '12px',
                                    fontWeight: 650,
                                    letterSpacing: '0.5px',
                                    color: 'var(--accent)',
                                    backgroundColor: 'var(--accent-soft)',
                                    border: '1px solid rgba(0,122,255,0.15)',
                                }}
                            >
                                <Sparkles size={13} />
                                AI-Powered Photo Restoration
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={fadeUp}
                            style={{
                                fontSize: 'clamp(36px, 5.5vw, 60px)',
                                fontWeight: 760,
                                lineHeight: 1.1,
                                letterSpacing: '-1.5px',
                                color: 'var(--text-primary)',
                                marginBottom: 'clamp(14px, 2vw, 20px)',
                            }}
                        >
                            Restore. Enhance.
                            <br />
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent) 0%, #AF52DE 55%, #FF6B6B 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    display: 'inline-block',
                                }}
                            >
                                Relive Your Memories.
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            variants={fadeUp}
                            style={{
                                fontSize: 'clamp(15px, 1.8vw, 18px)',
                                lineHeight: 1.7,
                                color: 'var(--text-secondary)',
                                marginBottom: 'clamp(28px, 3vw, 40px)',
                                maxWidth: 460,
                                margin: '0 auto clamp(28px, 3vw, 40px)',
                            }}
                            className="lg:mx-0"
                        >
                            FixPix uses advanced AI to unblur, colorize, and upscale
                            your old photos in seconds. Secure, private, and completely
                            free to try.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={scaleIn}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
                            style={{ marginBottom: 'clamp(20px, 2.5vw, 28px)' }}
                        >
                            <button
                                id="hero-upload-btn"
                                onClick={handleUploadClick}
                                className="ios-press"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '14px 28px',
                                    borderRadius: 'var(--radius-xl)',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, #338FFF 100%)',
                                    color: 'white',
                                    fontSize: '15px',
                                    fontWeight: 650,
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 20px rgba(0,122,255,0.35), 0 1px 0 rgba(255,255,255,0.15) inset',
                                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                                    letterSpacing: '-0.2px',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,122,255,0.45), 0 1px 0 rgba(255,255,255,0.15) inset';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,122,255,0.35), 0 1px 0 rgba(255,255,255,0.15) inset';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <Upload size={17} strokeWidth={2} />
                                Upload Image
                            </button>

                            <button
                                id="hero-demo-btn"
                                onClick={handleDemoClick}
                                className="ios-press"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '14px 24px',
                                    borderRadius: 'var(--radius-xl)',
                                    backgroundColor: 'var(--fill-secondary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    border: '1px solid var(--border-medium)',
                                    cursor: 'pointer',
                                    transition: 'transform 150ms ease, background-color 150ms ease',
                                    letterSpacing: '-0.2px',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--fill-primary)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--fill-secondary)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Explore Demo
                                <ArrowRight size={16} strokeWidth={2} />
                            </button>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            variants={fadeUp}
                            className="flex items-center justify-center lg:justify-start gap-5 flex-wrap"
                        >
                            {trustBadges.map((badge, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2"
                                    style={{
                                        color: 'var(--text-tertiary)',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                    }}
                                >
                                    <span style={{ fontSize: '14px' }}>{badge.icon}</span>
                                    <span>{badge.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ═══════════════════════════════
                        RIGHT — Before/After Demo Card
                    ═══════════════════════════════ */}
                    <motion.div
                        className="flex-1 w-full lg:w-auto"
                        variants={sliderFadeIn}
                        initial="hidden"
                        animate="visible"
                        style={{
                            maxWidth: 580,
                            width: '100%',
                            y: parallaxY,
                        }}
                    >
                        {/* Floating glow behind card */}
                        <div
                            aria-hidden="true"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                translate: '-50% -50%',
                                width: '80%',
                                height: '80%',
                                background: 'radial-gradient(ellipse, rgba(0,122,255,0.12), transparent 70%)',
                                filter: 'blur(40px)',
                                pointerEvents: 'none',
                                zIndex: 0,
                            }}
                        />

                        {/* Labels row */}
                        <div
                            className="flex items-center justify-between px-1 mb-3 relative z-10"
                        >
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <span style={{
                                    width: 7, height: 7, borderRadius: '50%',
                                    backgroundColor: 'rgba(255,59,48,0.75)',
                                    display: 'inline-block',
                                    boxShadow: '0 0 6px rgba(255,59,48,0.5)',
                                }} />
                                Before
                            </span>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                After
                                <span style={{
                                    width: 7, height: 7, borderRadius: '50%',
                                    backgroundColor: 'rgba(52,199,89,0.8)',
                                    display: 'inline-block',
                                    boxShadow: '0 0 6px rgba(52,199,89,0.5)',
                                }} />
                            </span>
                        </div>

                        {/* Demo Card */}
                        <div
                            id="demo-card"
                            style={{
                                position: 'relative',
                                zIndex: 10,
                                borderRadius: 'var(--radius-2xl)',
                                padding: '6px',
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border-subtle)',
                                boxShadow: `
                                    0 32px 72px -12px rgba(0, 0, 0, 0.18),
                                    0 16px 36px -8px rgba(0, 0, 0, 0.10),
                                    0 0 0 1px var(--border-subtle)
                                `,
                                overflow: 'hidden',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                transition: 'box-shadow 400ms ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = `
                                    0 40px 90px -12px rgba(0, 122, 255, 0.15),
                                    0 20px 48px -8px rgba(0, 0, 0, 0.14),
                                    0 0 0 1px var(--border-subtle)
                                `;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = `
                                    0 32px 72px -12px rgba(0, 0, 0, 0.18),
                                    0 16px 36px -8px rgba(0, 0, 0, 0.10),
                                    0 0 0 1px var(--border-subtle)
                                `;
                            }}
                        >
                            {/* Inner clip */}
                            <div
                                className="aspect-[4/3] relative"
                                style={{
                                    borderRadius: 'calc(var(--radius-2xl) - 4px)',
                                    overflow: 'hidden',
                                }}
                            >
                                <BeforeAfterSlider
                                    before="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop&sat=-100"
                                    after="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop"
                                />
                            </div>
                        </div>

                        {/* Caption */}
                        <div
                            className="flex items-center justify-center gap-2 mt-3"
                            style={{
                                fontSize: '12px',
                                color: 'var(--text-tertiary)',
                                opacity: 0.75,
                            }}
                        >
                            <Sparkles size={11} style={{ color: 'var(--accent)' }} />
                            <span>Drag the slider to compare</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
