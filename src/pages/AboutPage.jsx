import React, { useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Globe, Instagram, ArrowRight, Sparkles, Code2, Palette, Brain, Layers, Zap, Heart } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import profileImg from '../assets/profile.jpg';

/* ─────────────────────────────────────────────────────────────
   Fade-in observer — sections animate in on scroll
   ───────────────────────────────────────────────────────────── */
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
            { threshold: 0.15 }
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

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */
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
        { label: 'React', icon: Code2 },
        { label: 'Node.js', icon: Layers },
        { label: 'Python', icon: Brain },
        { label: 'AI / ML', icon: Sparkles },
        { label: 'UI Design', icon: Palette },
        { label: 'Systems', icon: Zap },
    ],
    story: [
        {
            title: 'The Spark',
            text: 'It started with a box of faded family photos — memories slowly disappearing. I wanted to bring them back to life.',
        },
        {
            title: 'Building FixPix',
            text: 'Combined state-of-the-art AI with an interface anyone could use. No command lines, no complexity — just drag, restore, done.',
        },
        {
            title: 'The Mission',
            text: 'Every photo tells a story. FixPix exists so those stories never fade away. Professional restoration, accessible to everyone.',
        },
    ],
};

/* ─────────────────────────────────────────────────────────────
   STYLES — Inline CSS-in-JS for precise control
   ───────────────────────────────────────────────────────────── */
const s = {
    page: {
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    main: {
        maxWidth: 900,
        margin: '0 auto',
        padding: '0 var(--space-9) 96px',
    },
    mainMobile: {
        padding: '0 20px 64px',
    },
    /* Floating surface — glass card */
    floatingCard: {
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(30px) saturate(150%)',
        WebkitBackdropFilter: 'blur(30px) saturate(150%)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--depth-2)',
    },
    /* Solid card */
    solidCard: {
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--depth-1)',
    },
};

/* ─────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────── */
const AboutPage = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div style={{ ...s.page, height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <Navbar />

            <main style={{ ...s.main, ...(isMobile ? s.mainMobile : {}) }}>
                {/* ═══════ SPACER FOR NAVBAR ═══════ */}
                <div style={{ height: 120 }} />

                {/* ═══════ HERO PROFILE CARD ═══════ */}
                <FadeSection>
                    <div
                        style={{
                            ...s.floatingCard,
                            borderRadius: 'var(--radius-2xl)',
                            padding: isMobile ? 32 : 48,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: isMobile ? 'center' : 'center',
                                gap: isMobile ? 24 : 40,
                                textAlign: isMobile ? 'center' : 'left',
                            }}
                        >
                            {/* Avatar */}
                            <div style={{ flexShrink: 0 }}>
                                <div
                                    style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        boxShadow: 'var(--depth-2)',
                                        border: '3px solid var(--surface)',
                                    }}
                                >
                                    <img
                                        src={profileImg}
                                        alt={developerInfo.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h1
                                    style={{
                                        fontSize: isMobile ? 28 : 36,
                                        fontWeight: 700,
                                        letterSpacing: '-0.5px',
                                        lineHeight: 1.15,
                                        margin: 0,
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {developerInfo.name}
                                </h1>
                                <p
                                    style={{
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: 'var(--accent)',
                                        marginTop: 6,
                                        marginBottom: 0,
                                        letterSpacing: '-0.2px',
                                    }}
                                >
                                    {developerInfo.title}
                                </p>
                                <p
                                    style={{
                                        fontSize: 15,
                                        lineHeight: 1.6,
                                        color: 'var(--text-secondary)',
                                        marginTop: 'var(--space-3)',
                                        marginBottom: 0,
                                        maxWidth: 480,
                                        ...(isMobile ? { margin: '12px auto 0' } : {}),
                                    }}
                                >
                                    {developerInfo.bio}
                                </p>

                                {/* Social Links */}
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 'var(--space-2)',
                                        marginTop: 20,
                                        justifyContent: isMobile ? 'center' : 'flex-start',
                                        flexWrap: 'wrap',
                                    }}
                                >
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
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: 'var(--radius-md)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'var(--fill-tertiary)',
                                                    color: 'var(--text-secondary)',
                                                    transition: 'all 200ms ease',
                                                    border: 'none',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <Icon size={18} strokeWidth={1.75} />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeSection>

                {/* ═══════ ABOUT SECTION ═══════ */}
                <FadeSection delay={80} style={{ marginTop: 64 }}>
                    <div
                        style={{
                            ...s.solidCard,
                            borderRadius: 'var(--radius-2xl)',
                            padding: 'var(--space-7)',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                letterSpacing: '-0.3px',
                                margin: '0 0 16px 0',
                                color: 'var(--text-primary)',
                            }}
                        >
                            About
                        </h2>
                        <p
                            style={{
                                fontSize: 15,
                                lineHeight: 1.7,
                                color: 'var(--text-secondary)',
                                margin: 0,
                                maxWidth: 640,
                            }}
                        >
                            I build products that feel effortless. My work sits at the intersection of design engineering and artificial intelligence — crafting experiences that are powerful under the hood but simple at the surface. FixPix is the embodiment of that philosophy: professional-grade photo restoration wrapped in an interface anyone can use.
                        </p>
                    </div>
                </FadeSection>

                {/* ═══════ SKILLS GRID ═══════ */}
                <FadeSection delay={160} style={{ marginTop: 64 }}>
                    <h2
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                            letterSpacing: '-0.3px',
                            margin: '0 0 20px 0',
                            color: 'var(--text-primary)',
                        }}
                    >
                        Skills
                    </h2>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                            gap: 'var(--space-3)',
                        }}
                    >
                        {developerInfo.skills.map((skill, i) => {
                            const Icon = skill.icon;
                            return (
                                <div
                                    key={i}
                                    className="about-skill-chip"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        padding: '12px 16px',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--fill-tertiary)',
                                        border: '1px solid var(--border-subtle)',
                                        transition: 'all 200ms ease',
                                    }}
                                >
                                    <Icon
                                        size={16}
                                        strokeWidth={1.75}
                                        style={{ color: 'var(--accent)', flexShrink: 0 }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 500,
                                            letterSpacing: '-0.1px',
                                            color: 'var(--text-primary)',
                                        }}
                                    >
                                        {skill.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </FadeSection>

                {/* ═══════ STORY / TIMELINE ═══════ */}
                <FadeSection delay={240} style={{ marginTop: 64 }}>
                    <h2
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                            letterSpacing: '-0.3px',
                            margin: '0 0 20px 0',
                            color: 'var(--text-primary)',
                        }}
                    >
                        The Story
                    </h2>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-4)',
                        }}
                    >
                        {developerInfo.story.map((item, i) => (
                            <div
                                key={i}
                                className="about-card-hover"
                                style={{
                                    ...s.solidCard,
                                    borderRadius: 'var(--radius-xl)',
                                    padding: 'var(--space-6)',
                                    transition: 'transform 200ms ease, box-shadow 200ms ease',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        marginBottom: 10,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'var(--accent-soft)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: 'var(--accent)',
                                        }}
                                    >
                                        {i + 1}
                                    </div>
                                    <h3
                                        style={{
                                            fontSize: 17,
                                            fontWeight: 600,
                                            letterSpacing: '-0.2px',
                                            margin: 0,
                                            color: 'var(--text-primary)',
                                        }}
                                    >
                                        {item.title}
                                    </h3>
                                </div>
                                <p
                                    style={{
                                        fontSize: 15,
                                        lineHeight: 1.6,
                                        color: 'var(--text-secondary)',
                                        margin: 0,
                                        paddingLeft: 40,
                                    }}
                                >
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </FadeSection>

                {/* ═══════ CTA SECTION ═══════ */}
                <FadeSection delay={320} style={{ marginTop: 64 }}>
                    <div
                        style={{
                            ...s.floatingCard,
                            borderRadius: 'var(--radius-2xl)',
                            padding: isMobile ? 32 : 40,
                            textAlign: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--accent-soft)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                            }}
                        >
                            <Heart size={22} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
                        </div>
                        <h2
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                letterSpacing: '-0.3px',
                                margin: '0 0 8px 0',
                                color: 'var(--text-primary)',
                            }}
                        >
                            Let's build something great
                        </h2>
                        <p
                            style={{
                                fontSize: 15,
                                lineHeight: 1.6,
                                color: 'var(--text-secondary)',
                                margin: '0 auto 24px',
                                maxWidth: 400,
                            }}
                        >
                            I'm always open to interesting conversations and collaborations.
                        </p>
                        <a
                            href="mailto:theparthbhanderi@gmail.com"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                padding: '12px 24px',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--accent)',
                                color: '#FFFFFF',
                                fontSize: 15,
                                fontWeight: 600,
                                letterSpacing: '-0.2px',
                                textDecoration: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,122,255,0.25)',
                                transition: 'transform 150ms ease, box-shadow 150ms ease',
                            }}
                            className="about-cta-btn"
                        >
                            Get in Touch
                            <ArrowRight size={16} strokeWidth={2} />
                        </a>
                    </div>
                </FadeSection>

                {/* ═══════ FOOTER SPACER ═══════ */}
                <div style={{ height: 32 }} />
            </main>

            <Footer />

            {/* ═══════ SCOPED STYLES ═══════ */}
            <style>{`
                /* Fade-in animation */
                .about-fade {
                    opacity: 0;
                    transform: translateY(16px);
                    transition: opacity 300ms ease, transform 300ms ease;
                }
                .about-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Social button hover */
                .about-social-btn:hover {
                    background: var(--accent-soft) !important;
                    color: var(--accent) !important;
                    transform: translateY(-2px);
                }

                /* Card hover lift */
                .about-card-hover:hover {
                    transform: translateY(-3px);
                }

                /* Skill chip hover */
                .about-skill-chip:hover {
                    background: var(--accent-soft) !important;
                    border-color: rgba(0, 122, 255, 0.15) !important;
                }

                /* CTA button hover */
                .about-cta-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px rgba(0,122,255,0.35) !important;
                }
                .about-cta-btn:active {
                    transform: scale(0.97) !important;
                }

                /* Mobile overrides */
                @media (max-width: 767px) {
                    .about-fade {
                        transform: translateY(12px);
                    }
                }
            `}</style>
        </div>
    );
};

export default AboutPage;
