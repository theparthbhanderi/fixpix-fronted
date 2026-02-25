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
        <footer
            className="px-5 md:px-8"
            style={{
                paddingTop: 'clamp(48px, 6vw, 72px)',
                paddingBottom: 'clamp(24px, 3vw, 32px)',
                borderTop: '1px solid var(--border-subtle)',
            }}
        >
            <div className="max-w-[1080px] mx-auto">
                {/* Top section */}
                <div
                    className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8"
                    style={{ marginBottom: 'clamp(32px, 4vw, 48px)' }}
                >
                    {/* Brand */}
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: 'var(--accent)' }}
                            >
                                <Sparkles size={13} className="text-white" />
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 650, color: 'var(--text-primary)' }}>
                                FixPix
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: '13px',
                                lineHeight: 1.7,
                                color: 'var(--text-tertiary)',
                                maxWidth: '280px',
                            }}
                        >
                            AI-powered photo restoration. Bring your old memories back to life.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <h4
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '1.2px',
                                textTransform: 'uppercase',
                                color: 'var(--text-tertiary)',
                                marginBottom: '12px',
                            }}
                        >
                            Links
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="hover:text-text-main transition-colors"
                                    style={{
                                        fontSize: '13px',
                                        color: 'var(--text-secondary)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Social */}
                    <div className="md:col-span-4 md:text-right">
                        <h4
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '1.2px',
                                textTransform: 'uppercase',
                                color: 'var(--text-tertiary)',
                                marginBottom: '12px',
                            }}
                        >
                            Connect
                        </h4>
                        <div className="flex gap-2 md:justify-end">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center"
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        backgroundColor: 'var(--fill-tertiary)',
                                        color: 'var(--text-secondary)',
                                        transition: 'background-color 200ms, color 200ms, transform 200ms',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = 'var(--accent)';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = 'var(--fill-tertiary)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                    aria-label={social.label}
                                >
                                    <social.icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="pt-5 flex flex-col md:flex-row items-center justify-between gap-2"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        © {currentYear} FixPix. All rights reserved.
                    </p>
                    <p
                        className="flex items-center gap-1.5"
                        style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}
                    >
                        Made with
                        <Heart size={10} style={{ color: '#FF2D55', fill: '#FF2D55' }} />
                        by Parth Bhanderi
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
