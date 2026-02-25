import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Sparkles, Upload, ArrowRight, Shield, Zap, Image } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import BeforeAfterSlider from '../features/BeforeAfterSlider';
import { useNavigate } from 'react-router-dom';

const trustBadges = [
    { icon: Shield, label: '100% Private' },
    { icon: Zap, label: 'Under 10s' },
    { icon: Image, label: 'Up to 4K' },
];

const Hero = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleUploadClick = () => {
        if (!user) {
            navigate('/login', { state: { from: '/app/restoration' } });
            return;
        }
        navigate('/app/restoration');
    };

    const handleGalleryClick = () => {
        navigate('/app');
    };

    return (
        <section
            className="relative px-5 md:px-8 flex flex-col items-center justify-center overflow-hidden"
            style={{
                paddingTop: 'clamp(120px, 16vw, 180px)',
                paddingBottom: 'clamp(48px, 8vw, 80px)',
                minHeight: '90vh',
            }}
        >
            {/* Ambient background glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse 60% 40% at 50% 20%, rgba(0,122,255,0.06), transparent 60%),
                        radial-gradient(ellipse 40% 30% at 70% 60%, rgba(175,82,222,0.03), transparent 50%)
                    `,
                }}
            />

            <div className="relative z-10 w-full max-w-[900px] mx-auto">
                {/* ── Text Content ── */}
                <div className="text-center">
                    {/* Pill Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                    >
                        <span
                            className="inline-flex items-center gap-2 mb-7"
                            style={{
                                padding: '6px 16px',
                                borderRadius: '24px',
                                fontSize: '12px',
                                fontWeight: 650,
                                letterSpacing: '0.5px',
                                color: 'var(--accent)',
                                backgroundColor: 'var(--accent-soft)',
                                border: '1px solid rgba(0,122,255,0.1)',
                            }}
                        >
                            <Sparkles size={13} />
                            AI-Powered Photo Restoration
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        style={{
                            fontSize: 'clamp(32px, 6vw, 56px)',
                            fontWeight: 750,
                            lineHeight: 1.15,
                            letterSpacing: '-1px',
                            color: 'var(--text-primary)',
                            marginBottom: 'clamp(16px, 2vw, 24px)',
                        }}
                    >
                        Restore. Enhance.
                        <br />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, var(--accent), #AF52DE)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Relive Your Memories.
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.18 }}
                        style={{
                            fontSize: 'clamp(15px, 2vw, 18px)',
                            lineHeight: 1.65,
                            color: 'var(--text-secondary)',
                            maxWidth: '560px',
                            margin: '0 auto',
                            marginBottom: 'clamp(24px, 3vw, 36px)',
                        }}
                    >
                        FixPix uses advanced AI to unblur, colorize, and upscale your old photos in seconds.
                        Secure, private, and completely free to try.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.24 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3"
                        style={{ marginBottom: 'clamp(24px, 3vw, 36px)' }}
                    >
                        <Button size="lg" variant="filled" icon={Upload} onClick={handleUploadClick}>
                            Upload Image
                        </Button>
                        <Button size="lg" variant="outline" onClick={handleGalleryClick}>
                            Explore Demo
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.32 }}
                        className="flex items-center justify-center gap-5 md:gap-8 flex-wrap"
                    >
                        {trustBadges.map((badge, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2"
                                style={{ color: 'var(--text-tertiary)', fontSize: '13px', fontWeight: 500 }}
                            >
                                <badge.icon size={15} strokeWidth={1.75} style={{ color: 'var(--accent)', opacity: 0.7 }} />
                                <span>{badge.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ── Before/After Visual ── */}
                <motion.div
                    initial={{ opacity: 0, y: 28, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.65, delay: 0.38, ease: [0.25, 1, 0.5, 1] }}
                    style={{ marginTop: 'clamp(36px, 5vw, 56px)' }}
                >
                    {/* Floating labels above the card */}
                    <div
                        className="flex items-center justify-between px-2 mb-3"
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
                                width: 6, height: 6, borderRadius: '50%',
                                backgroundColor: 'rgba(255,59,48,0.7)',
                                display: 'inline-block',
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
                                width: 6, height: 6, borderRadius: '50%',
                                backgroundColor: 'rgba(52,199,89,0.7)',
                                display: 'inline-block',
                            }} />
                        </span>
                    </div>

                    {/* Preview Card */}
                    <div
                        className="hero-preview-card"
                        style={{
                            padding: 'clamp(5px, 0.8vw, 8px)',
                            borderRadius: 'var(--radius-2xl)',
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: `
                                0 25px 60px -12px rgba(0, 0, 0, 0.15),
                                0 12px 28px -8px rgba(0, 0, 0, 0.08),
                                var(--depth-1)
                            `,
                            overflow: 'hidden',
                            transition: 'box-shadow 400ms ease',
                        }}
                    >
                        <div
                            style={{ borderRadius: 'calc(var(--radius-2xl) - 5px)', overflow: 'hidden' }}
                            className="aspect-[16/10] md:aspect-[16/10] relative"
                        >
                            <BeforeAfterSlider
                                before="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop&sat=-100&blur=50"
                                after="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                            />
                        </div>
                    </div>


                    {/* Subtle caption */}
                    <div
                        className="flex items-center justify-center gap-2"
                        style={{
                            marginTop: '12px',
                            fontSize: '12px',
                            color: 'var(--text-tertiary)',
                            opacity: 0.7,
                        }}
                    >
                        <Sparkles size={11} style={{ color: 'var(--accent)' }} />
                        <span>Drag the slider to compare</span>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
