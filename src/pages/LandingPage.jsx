import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import FeaturesGrid from '../components/sections/FeaturesGrid';
import HowItWorks from '../components/sections/HowItWorks';
import Testimonials from '../components/sections/Testimonials';

const LandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        // Enable scroll for landing page (body has overflow:hidden by default for app)
        document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div
            className="min-h-screen font-sans selection:bg-primary/20"
            style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
            }}
        >
            <Navbar />

            <main>
                <Hero />
                <FeaturesGrid />
                <HowItWorks />
                <Testimonials />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
