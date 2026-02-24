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
        <footer className="px-5 md:px-8 pb-12 md:pb-12">
            <div
                className="max-w-[1280px] mx-auto"
                style={{
                    borderRadius: 'var(--radius-2xl)',
                    backgroundColor: 'var(--card-bg)',
                    border: 'var(--card-border)',
                    boxShadow: 'var(--depth-1)',
                    overflow: 'hidden',
                }}
            >
                <div className="px-8 md:px-10 py-10 md:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2.5 mb-4">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--accent)' }}
                                >
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-text-main" style={{ fontSize: '18px', fontWeight: 600 }}>
                                    FixPix
                                </span>
                            </div>
                            <p className="text-text-secondary" style={{ fontSize: '15px', lineHeight: 1.6 }}>
                                AI-powered photo restoration tool. Bring your old memories back to life with cutting-edge technology.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="md:text-center">
                            <h4 className="text-text-main mb-4" style={{ fontSize: '15px', fontWeight: 600 }}>
                                Quick Links
                            </h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className="text-text-secondary hover:text-text-main transition-colors"
                                            style={{ fontSize: '15px' }}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social */}
                        <div className="md:text-right">
                            <h4 className="text-text-main mb-4" style={{ fontSize: '15px', fontWeight: 600 }}>
                                Connect
                            </h4>
                            <div className="flex gap-2.5 md:justify-end">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-text-main transition-colors"
                                        style={{ backgroundColor: 'var(--fill-tertiary)' }}
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-[18px] h-[18px]" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div
                        className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
                        style={{ borderTop: '1px solid var(--border-subtle)' }}
                    >
                        <p className="text-text-secondary" style={{ fontSize: '13px' }}>
                            © {currentYear} FixPix. All rights reserved.
                        </p>
                        <p className="text-text-secondary flex items-center gap-1.5" style={{ fontSize: '13px' }}>
                            Made with <Heart className="w-3 h-3" style={{ color: 'var(--error)', fill: 'var(--error)' }} /> by Parth Bhanderi
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
