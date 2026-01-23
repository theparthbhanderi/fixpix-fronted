import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Instagram, Linkedin, Mail, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Github, href: 'https://github.com/theparthbhanderi', label: 'GitHub' },
        { icon: Instagram, href: 'https://www.instagram.com/theparthbhanderi/', label: 'Instagram' },
        { icon: Linkedin, href: 'https://www.linkedin.com/in/parth-bhanderi-366433330', label: 'LinkedIn' },
        { icon: Mail, href: 'mailto:theparthbhanderi@gmail.com', label: 'Email' },
    ];

    const quickLinks = [
        { label: 'Home', to: '/' },
        { label: 'Get Started', to: '/app' },
        { label: 'Login', to: '/login' },
        { label: 'Sign Up', to: '/signup' },
    ];

    return (
        <footer className="w-full border-t border-separator/30 bg-background-secondary mt-auto">
            <div className="max-w-6xl mx-auto px-ios-gutter py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-ios bg-primary flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-ios-title3 text-text-main">FixPix</span>
                        </div>
                        <p className="text-ios-subhead text-text-secondary leading-relaxed">
                            AI-powered photo restoration tool. Bring your old memories back to life with cutting-edge technology.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:text-center">
                        <h4 className="text-ios-headline text-text-main mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-ios-subhead text-text-secondary hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="md:text-right">
                        <h4 className="text-ios-headline text-text-main mb-4">Connect</h4>
                        <div className="flex gap-3 md:justify-end">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-ios bg-fill/10 hover:bg-primary/10 flex items-center justify-center text-text-secondary hover:text-primary transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-separator/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-ios-footnote text-text-secondary">
                        © {currentYear} FixPix. All rights reserved.
                    </p>
                    <p className="text-ios-footnote text-text-secondary flex items-center gap-1.5">
                        Made with <Heart className="w-3.5 h-3.5 text-ios-red fill-ios-red" /> by Parth Bhanderi
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
