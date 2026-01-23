import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: "Sarah Jenkins",
        role: "Photographer",
        content: "I recovered photos from my grandmother's wedding that we thought were lost forever. The colorization is magic.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        name: "Mark Thompson",
        role: "Historian",
        content: "The level of detail FixPix recovers from century-old documents is simply unprecedented. A game changer.",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        name: "Jessica Chen",
        role: "Designer",
        content: "I use this tool daily to upscale low-res assets from clients. It saves me hours of manual reconstruction time.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        name: "David Wilson",
        role: "Archivist",
        content: "Finally, an AI tool that respects the original grain while removing damage. Highly recommended.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
    }
];

const TestimonialCard = ({ testimonial, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="ios-card min-w-[300px] flex-shrink-0"
    >
        {/* Stars - iOS Yellow */}
        <div className="flex gap-0.5 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-ios-yellow-dark text-ios-yellow-dark" />
            ))}
        </div>

        {/* Content */}
        <p className="ios-body text-text-secondary mb-5 leading-relaxed">
            "{testimonial.content}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
            <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-background/50"
            />
            <div>
                <h4 className="ios-subhead font-semibold text-text-main">{testimonial.name}</h4>
                <p className="ios-caption1 text-text-secondary">{testimonial.role}</p>
            </div>
        </div>
    </motion.div>
);

const Testimonials = () => {
    return (
        <section id="testimonials" className="section-spacing ios-gutter bg-background-secondary overflow-hidden">
            <div className="container-default">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="ios-title1 text-text-main mb-4"
                    >
                        Loved by Users
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-ios-body text-text-secondary"
                    >
                        See what our users have to say about FixPix.
                    </motion.p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 grid-gap-lg">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
