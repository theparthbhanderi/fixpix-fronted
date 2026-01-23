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
    }, []);

    return (
        <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/20 overflow-x-hidden">
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
