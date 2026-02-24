import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: "Sarah Jenkins",
        role: "Photographer",
        content: "I recovered photos from my grandmother's wedding that we thought were lost forever. The colorization is magic.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
        name: "Mark Thompson",
        role: "Historian",
        content: "The level of detail FixPix recovers from century-old documents is simply unprecedented. A game changer.",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
        name: "Jessica Chen",
        role: "Designer",
        content: "I use this tool daily to upscale low-res assets from clients. It saves me hours of manual reconstruction time.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
        name: "David Wilson",
        role: "Archivist",
        content: "Finally, an AI tool that respects the original grain while removing damage. Highly recommended.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    },
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goNext = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    const goPrev = () => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

    const testimonial = TESTIMONIALS[currentIndex];

    return (
        <section id="testimonials" className="px-5 md:px-8" style={{ paddingTop: 'clamp(64px, 8vw, 96px)', paddingBottom: 'clamp(64px, 8vw, 96px)' }}>
            <div className="max-w-[1280px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-text-main mb-4"
                        style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.25 }}
                    >
                        Loved by Users
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
                        className="text-text-secondary"
                        style={{ fontSize: '15px', lineHeight: 1.6 }}
                    >
                        See what our users have to say about FixPix.
                    </motion.p>
                </div>

                {/* Floating Carousel Card */}
                <div className="max-w-[720px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            borderRadius: 'var(--radius-2xl)',
                            backgroundColor: 'var(--card-bg)',
                            border: 'var(--card-border)',
                            boxShadow: 'var(--depth-1)',
                            overflow: 'hidden',
                        }}
                    >
                        <div className="p-8 md:p-10">
                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4" style={{ fill: '#FFD60A', color: '#FFD60A' }} />
                                ))}
                            </div>

                            {/* Content with animation */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -16 }}
                                    transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                                >
                                    <p
                                        className="text-text-main mb-6"
                                        style={{ fontSize: '18px', lineHeight: 1.6, fontWeight: 400 }}
                                    >
                                        "{testimonial.content}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-11 h-11 rounded-full object-cover"
                                            style={{
                                                border: '2px solid var(--border-subtle)',
                                                filter: 'grayscale(30%)',
                                            }}
                                        />
                                        <div>
                                            <h4
                                                className="text-text-main"
                                                style={{ fontSize: '15px', fontWeight: 600 }}
                                            >
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-text-secondary" style={{ fontSize: '13px' }}>
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div
                            className="flex items-center justify-between px-8 py-4"
                            style={{ borderTop: '1px solid var(--border-subtle)' }}
                        >
                            {/* Dots */}
                            <div className="flex gap-2">
                                {TESTIMONIALS.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className="w-2 h-2 rounded-full transition-all duration-250"
                                        style={{
                                            backgroundColor: i === currentIndex
                                                ? 'var(--accent)'
                                                : 'var(--fill-secondary)',
                                            width: i === currentIndex ? '20px' : '8px',
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Arrows */}
                            <div className="flex gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.92 }}
                                    onClick={goPrev}
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main transition-colors"
                                    style={{ backgroundColor: 'var(--fill-tertiary)' }}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.92 }}
                                    onClick={goNext}
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main transition-colors"
                                    style={{ backgroundColor: 'var(--fill-tertiary)' }}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
