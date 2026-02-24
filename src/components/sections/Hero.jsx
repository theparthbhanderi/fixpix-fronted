import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Sparkles, Upload, ArrowRight } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import BeforeAfterSlider from '../features/BeforeAfterSlider';
import { useNavigate } from 'react-router-dom';

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
        <section className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-5 md:px-8 min-h-[90vh] flex flex-col items-center justify-center">
            {/* Subtle ambient radial — very faint */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0,122,255,0.04), transparent 70%)',
                }}
            />

            <div className="relative z-10 w-full max-w-[820px] mx-auto">
                {/* Floating Glass Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    className="text-center"
                    style={{
                        padding: 'clamp(32px, 5vw, 48px)',
                        borderRadius: 'var(--radius-2xl)',
                        backgroundColor: 'var(--floating-bg)',
                        backdropFilter: 'blur(30px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                        border: 'var(--floating-border)',
                        boxShadow: 'var(--depth-2)',
                    }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full text-[13px] font-medium mb-8"
                            style={{
                                backgroundColor: 'var(--accent-soft)',
                                color: 'var(--accent)',
                            }}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            AI-Powered Photo Restoration
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="text-text-main mb-6"
                        style={{
                            fontSize: 'clamp(32px, 5vw, 48px)',
                            fontWeight: 700,
                            lineHeight: 1.25,
                            letterSpacing: '-0.5px',
                        }}
                    >
                        Restore. Enhance.{' '}
                        <br className="hidden sm:block" />
                        <span style={{ color: 'var(--accent)' }}>Relive Your Memories.</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-text-secondary mx-auto mb-10"
                        style={{
                            maxWidth: '620px',
                            fontSize: '15px',
                            lineHeight: 1.6,
                        }}
                    >
                        FixPix uses advanced AI to unblur, colorize, and upscale your photos in seconds. Secure, private, and fast.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                        <Button size="lg" variant="filled" icon={Upload} onClick={handleUploadClick}>
                            Upload Image
                        </Button>
                        <Button size="lg" variant="outline" onClick={handleGalleryClick}>
                            Explore Demo
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Hero Visual — Before/After Slider */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    className="mt-12 md:mt-16 mx-auto w-full"
                >
                    <div
                        className="p-2 overflow-hidden"
                        style={{
                            borderRadius: 'var(--radius-2xl)',
                            backgroundColor: 'var(--card-bg)',
                            border: 'var(--card-border)',
                            boxShadow: 'var(--depth-1)',
                        }}
                    >
                        <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }} className="aspect-[16/10] relative">
                            <BeforeAfterSlider
                                before="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop&sat=-100&blur=50"
                                after="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                            />
                        </div>

                        <div className="flex items-center justify-center gap-2 py-3 text-text-secondary" style={{ fontSize: '13px' }}>
                            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                            <span>Drag slider to see the magic</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
