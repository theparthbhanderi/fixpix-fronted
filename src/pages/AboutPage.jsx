import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Globe, Code, Award, ExternalLink, Instagram } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import profileImg from '../assets/profile.jpg';

const AboutPage = () => {
    const developerInfo = {
        name: "Parth Bhanderi",
        title: "Full Stack Developer & AI Engineer",
        bio: "Passionate about building intuitive and powerful web applications. Creator of FixPix. Focused on bridging the gap between complex AI capabilities and accessible user experiences.",
        location: "Planet Earth",
        socials: [
            { icon: Github, link: "https://github.com/theparthbhanderi", label: "GitHub" },
            { icon: Linkedin, link: "https://www.linkedin.com/in/parth-bhanderi-366433330", label: "LinkedIn" },
            { icon: Instagram, link: "https://www.instagram.com/theparthbhanderi/", label: "Instagram" },
            { icon: Mail, link: "mailto:theparthbhanderi@gmail.com", label: "Email" },
            { icon: Globe, link: "https://parthbhanderi.in", label: "Website" }
        ],
        skills: [
            "React", "Node.js", "Python", "AI Integration", "UI/UX Design", "System Architecture"
        ]
    };

    return (
        <div className="min-h-screen bg-background text-text-main font-sans">
            <Navbar />

            <main className="pt-28 pb-16 px-ios-gutter max-w-4xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    {/* Profile Image */}
                    <div className="mb-6">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-ios-lg">
                                <img
                                    src={profileImg}
                                    alt={developerInfo.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <h1 className="ios-large-title text-text-main mb-2">
                        {developerInfo.name}
                    </h1>
                    <p className="text-ios-title3 text-primary mb-4">{developerInfo.title}</p>
                    <p className="text-ios-body text-text-secondary max-w-xl mx-auto">
                        {developerInfo.bio}
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3 mt-6">
                        {developerInfo.socials.map((social, index) => {
                            const Icon = social.icon;
                            return (
                                <motion.a
                                    key={index}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileTap={{ scale: 0.95 }}
                                    className="w-12 h-12 rounded-ios-md bg-fill/10 hover:bg-primary/10 flex items-center justify-center text-text-secondary hover:text-primary transition-all"
                                    aria-label={social.label}
                                >
                                    <Icon className="w-5 h-5" />
                                </motion.a>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Skills Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface rounded-ios-md p-6 shadow-ios-card dark:shadow-none dark:border dark:border-separator/20"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-ios bg-ios-blue/10 flex items-center justify-center">
                                <Code className="w-5 h-5 text-ios-blue" />
                            </div>
                            <h2 className="text-ios-title3 text-text-main">Technical Skills</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {developerInfo.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 rounded-pill bg-fill/10 text-ios-footnote text-text-secondary font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Philosophy Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-surface rounded-ios-md p-6 shadow-ios-card dark:shadow-none dark:border dark:border-separator/20"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-ios bg-ios-purple/10 flex items-center justify-center">
                                <Award className="w-5 h-5 text-ios-purple" />
                            </div>
                            <h2 className="text-ios-title3 text-text-main">Philosophy</h2>
                        </div>
                        <p className="text-ios-subhead text-text-secondary leading-relaxed mb-4">
                            Believing in the intersection of technology and art. Every line of code is a brush stroke, and every application is a masterpiece waiting to be discovered.
                        </p>
                        <a
                            href="https://parthbhanderi.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary text-ios-subhead font-medium hover:opacity-80 transition-opacity"
                        >
                            View Portfolio
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
