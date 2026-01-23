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
            // Redirect to login, could add state for return URL
            navigate('/login', { state: { from: '/app/restoration' } });
            return;
        }
        // Navigate directly to dashboard/restoration, user will upload there
        navigate('/app/restoration');
    };

    const handleGalleryClick = () => {
        navigate('/app');
    };

    return (
        <section className="relative pt-28 pb-20 px-ios-gutter min-h-[90vh] flex flex-col items-center justify-center" style={{ background: 'var(--ios-gradient-hero)' }}>
            <div className="max-w-4xl mx-auto text-center w-full">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-flex items-center gap-2 py-2 px-4 rounded-pill bg-primary/10 text-primary text-ios-subhead font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered Photo Restoration
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="ios-large-title text-text-main mb-6"
                >
                    Restore. Enhance.{' '}
                    <br className="hidden sm:block" />
                    <span className="text-primary">Relive Your Memories.</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-ios-body text-text-secondary max-w-xl mx-auto mb-8"
                >
                    FixPix uses advanced AI to unblur, colorize, and upscale your photos in seconds. Secure, private, and fast.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                    <Button size="lg" variant="filled" icon={Upload} onClick={handleUploadClick}>
                        Upload Image
                    </Button>
                    <Button size="lg" variant="gray" onClick={handleGalleryClick}>
                        Explore Demo
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </motion.div>

                {/* Hero Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 mx-auto w-full max-w-3xl"
                >
                    <div className="bg-surface rounded-ios-2xl p-2 shadow-ios-lg dark:shadow-none dark:border dark:border-separator/20">
                        <div className="aspect-[16/10] rounded-ios-xl overflow-hidden relative">
                            <BeforeAfterSlider
                                before="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop&sat=-100&blur=50"
                                after="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                            />
                        </div>

                        <div className="flex items-center justify-center gap-2 py-3 text-ios-footnote text-text-secondary">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span>Drag slider to see the magic</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
