import React, { useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Globe, Instagram, ArrowRight, Sparkles, Code2, Palette, Brain, Layers, Zap, Heart } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import profileImg from '../assets/profile.jpg';

/* ── Fade-in observer ── */
const useFadeIn = () => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('about-visible');
                    io.unobserve(el);
                }
            },
            { threshold: 0.12 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return ref;
};

const FadeSection = ({ children, delay = 0, style = {}, className = '' }) => {
    const ref = useFadeIn();
    return (
        <div
            ref={ref}
            className={`about-fade ${className}`}
            style={{ transitionDelay: `${delay}ms`, ...style }}
        >
            {children}
        </div>
    );
};

/* ── Data ── */
const developerInfo = {
    name: 'Parth Bhanderi',
    title: 'Full Stack Developer & AI Engineer',
    bio: 'Crafting intuitive products at the intersection of design and engineering. Creator of FixPix — bringing professional-grade photo restoration to everyone.',
    socials: [
        { icon: Github, link: 'https://github.com/theparthbhanderi', label: 'GitHub' },
        { icon: Linkedin, link: 'https://www.linkedin.com/in/parth-bhanderi-366433330', label: 'LinkedIn' },
        { icon: Instagram, link: 'https://www.instagram.com/theparthbhanderi/', label: 'Instagram' },
        { icon: Mail, link: 'mailto:theparthbhanderi@gmail.com', label: 'Email' },
        { icon: Globe, link: 'https://parthbhanderi.in', label: 'Portfolio' },
    ],
    skills: [
        { label: 'React', icon: Code2, accent: '#007AFF' },
        { label: 'Node.js', icon: Layers, accent: '#34C759' },
        { label: 'Python', icon: Brain, accent: '#FF9500' },
        { label: 'AI / ML', icon: Sparkles, accent: '#AF52DE' },
        { label: 'UI Design', icon: Palette, accent: '#FF2D55' },
        { label: 'Systems', icon: Zap, accent: '#5AC8FA' },
    ],
    story: [
        {
            title: 'The Spark',
            text: 'It started with a box of faded family photos — memories slowly disappearing. I wanted to bring them back to life.',
            accent: '#AF52DE',
        },
        {
            title: 'Building FixPix',
            text: 'Combined state-of-the-art AI with an interface anyone could use. No command lines, no complexity — just drag, restore, done.',
            accent: '#007AFF',
        },
        {
            title: 'The Mission',
            text: 'Every photo tells a story. FixPix exists so those stories never fade away. Professional restoration, accessible to everyone.',
            accent: '#34C759',
        },
    ],
};

/* ── Component ── */
const AboutPage = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <Navbar />

            <main className="px-5 md:px-8" style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
                {/* Spacer */}
                <div style={{ height: 'clamp(100px, 14vw, 140px)' }} />

                {/* ═════ HERO PROFILE ═════ */}
                <FadeSection>
                    <div className="text-center" style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}>
                        {/* Avatar */}
                        <div style={{ width: 'clamp(88px, 12vw, 120px)', height: 'clamp(88px, 12vw, 120px)', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '3px solid var(--surface)' }}>
                            <img src={profileImg} alt={developerInfo.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>

                        {/* Name */}
                        <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 750, letterSpacing: '-0.8px', lineHeight: 1.15, margin: '0 0 6px', color: 'var(--text-primary)' }}>
                            {developerInfo.name}
                        </h1>

                        {/* Title */}
                        <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 600, letterSpacing: '-0.2px', margin: '0 0 14px' }}>
                            <span style={{ background: 'linear-gradient(135deg, var(--accent), #AF52DE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                {developerInfo.title}
                            </span>
                        </p>

                        {/* Bio */}
                        <p style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 22px' }}>
                            {developerInfo.bio}
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            {developerInfo.socials.map((social, i) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={i}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        title={social.label}
                                        className="about-social-btn"
                                        style={{
                                            width: 40, height: 40, borderRadius: 11,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'var(--fill-tertiary)', color: 'var(--text-secondary)',
                                            transition: 'all 200ms ease', border: 'none', textDecoration: 'none',
                                        }}
                                    >
                                        <Icon size={16} strokeWidth={1.75} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </FadeSection>

                {/* ═════ ABOUT ═════ */}
                <FadeSection delay={80}>
                    <div style={{
                        padding: 'clamp(24px, 3vw, 36px)',
                        borderRadius: 'var(--radius-2xl)',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--depth-1)',
                        marginBottom: 'clamp(32px, 4vw, 48px)',
                    }}>
                        <span style={{
                            display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '1.2px',
                            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px',
                            padding: '4px 12px', borderRadius: '16px', backgroundColor: 'var(--accent-soft)',
                        }}>
                            About
                        </span>
                        <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0, maxWidth: 640 }}>
                            I build products that feel effortless. My work sits at the intersection of design engineering and artificial intelligence — crafting experiences that are powerful under the hood but simple at the surface. FixPix is the embodiment of that philosophy: professional-grade photo restoration wrapped in an interface anyone can use.
                        </p>
                    </div>
                </FadeSection>

                {/* ═════ SKILLS ═════ */}
                <FadeSection delay={140}>
                    <div style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }}>
                        <span style={{
                            display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '1.2px',
                            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '14px',
                            padding: '4px 12px', borderRadius: '16px', backgroundColor: 'var(--accent-soft)',
                        }}>
                            Skills
                        </span>
                        <div className="flex flex-wrap" style={{ gap: '8px' }}>
                            {developerInfo.skills.map((skill, i) => {
                                const Icon = skill.icon;
                                return (
                                    <div
                                        key={i}
                                        className="about-skill-chip"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '7px',
                                            padding: '7px 14px',
                                            borderRadius: 20,
                                            backgroundColor: 'var(--surface)',
                                            border: '1px solid var(--border-subtle)',
                                            transition: 'all 200ms ease',
                                        }}
                                    >
                                        <Icon size={14} strokeWidth={1.75} style={{ color: skill.accent }} />
                                        <span style={{ fontSize: '13px', fontWeight: 550, color: 'var(--text-primary)' }}>
                                            {skill.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </FadeSection>

                {/* ═════ STORY ═════ */}
                <FadeSection delay={200}>
                    <div style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }}>
                        <span style={{
                            display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '1.2px',
                            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '14px',
                            padding: '4px 12px', borderRadius: '16px', backgroundColor: 'var(--accent-soft)',
                        }}>
                            The Story
                        </span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {developerInfo.story.map((item, i) => (
                                <div
                                    key={i}
                                    className="about-card-hover"
                                    style={{
                                        padding: 'clamp(16px, 2vw, 22px)',
                                        borderRadius: 16,
                                        backgroundColor: 'var(--surface)',
                                        border: '1px solid var(--border-subtle)',
                                        transition: 'transform 200ms ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Accent left stripe */}
                                    <div style={{
                                        position: 'absolute', top: 10, bottom: 10, left: 0, width: 3,
                                        borderRadius: '0 2px 2px 0',
                                        background: item.accent, opacity: 0.6,
                                    }} />

                                    <div className="flex items-start gap-3" style={{ paddingLeft: '8px' }}>
                                        <div style={{
                                            width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: `${item.accent}10`,
                                            fontSize: '11px', fontWeight: 700, color: item.accent,
                                            marginTop: '1px',
                                        }}>
                                            {i + 1}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h3 style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', fontWeight: 630, letterSpacing: '-0.2px', margin: '0 0 3px', color: 'var(--text-primary)' }}>
                                                {item.title}
                                            </h3>
                                            <p style={{ fontSize: 'clamp(13px, 1.4vw, 14px)', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeSection>

                {/* ═════ CTA ═════ */}
                <FadeSection delay={260}>
                    <div
                        style={{
                            padding: 'clamp(24px, 3vw, 36px)',
                            borderRadius: 'var(--radius-2xl)',
                            textAlign: 'center',
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border-subtle)',
                        }}
                    >
                        <div style={{
                            width: 44, height: 44, borderRadius: 13, margin: '0 auto 14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'var(--accent-soft)',
                        }}>
                            <Heart size={20} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
                        </div>

                        <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, letterSpacing: '-0.4px', margin: '0 0 8px', color: 'var(--text-primary)' }}>
                            Let's build something great
                        </h2>
                        <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: 1.65, color: 'var(--text-secondary)', margin: '0 auto 22px', maxWidth: 380 }}>
                            I'm always open to interesting conversations and collaborations.
                        </p>

                        <a
                            href="mailto:theparthbhanderi@gmail.com"
                            className="about-cta-btn"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '11px 26px', borderRadius: 12,
                                background: 'var(--accent)', color: '#FFF',
                                fontSize: '14px', fontWeight: 620, letterSpacing: '-0.2px',
                                textDecoration: 'none', border: 'none', cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,122,255,0.25)',
                                transition: 'transform 150ms ease, box-shadow 150ms ease',
                            }}
                        >
                            Get in Touch
                            <ArrowRight size={15} strokeWidth={2.5} />
                        </a>
                    </div>
                </FadeSection>

                <div style={{ height: 24 }} />
            </main>

            <Footer />

            {/* Scoped Styles */}
            <style>{`
                .about-fade {
                    opacity: 0;
                    transform: translateY(14px);
                    transition: opacity 400ms ease, transform 400ms ease;
                }
                .about-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .about-social-btn:hover {
                    background: var(--accent) !important;
                    color: white !important;
                    transform: translateY(-2px);
                }
                .about-card-hover:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--depth-2) !important;
                }
                .about-skill-chip:hover {
                    background: var(--accent-soft) !important;
                    border-color: rgba(0,122,255,0.15) !important;
                    transform: translateY(-1px);
                }
                .about-cta-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(0,122,255,0.35) !important;
                }
                .about-cta-btn:active {
                    transform: scale(0.97) !important;
                }
                @media (max-width: 767px) {
                    .about-fade { transform: translateY(10px); }
                }
            `}</style>
        </div>
    );
};

export default AboutPage;
