import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronRight, Sparkles, Layers, MessageCircle, User, LogOut, LayoutDashboard, ArrowRight } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { ImageContext } from '../../context/ImageContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logoutUser } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ImageContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // No scroll lock needed — backdrop prevents interaction

    const navLinks = [
        { href: '/#features', label: 'Features', icon: Sparkles, accent: '#007AFF' },
        { href: '/#how-it-works', label: 'How it works', icon: Layers, accent: '#34C759' },
        { href: '/#testimonials', label: 'Testimonials', icon: MessageCircle, accent: '#AF52DE' },
        { to: '/about', label: 'About', isLink: true, icon: User, accent: '#FF9500' },
    ];

    return (
        <>
            {/* Floating Glass Pill Navbar */}
            <nav
                className="fixed top-3 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] md:w-[calc(100%-320px)] max-w-[1100px] landing-navbar"
                style={{ transition: 'all 250ms cubic-bezier(0.25, 1, 0.5, 1)' }}
            >
                <div
                    className="relative flex items-center justify-between h-14 md:h-16"
                    style={{
                        padding: '0 var(--space-4)',
                        borderRadius: 'var(--radius-2xl)',
                        backgroundColor: 'var(--glass-bg, rgba(255, 255, 255, 0.75))',
                        backdropFilter: 'var(--glass-blur, blur(30px) saturate(150%))',
                        WebkitBackdropFilter: 'var(--glass-blur, blur(30px) saturate(150%))',
                        border: '1px solid var(--glass-border, rgba(0, 0, 0, 0.08))',
                        boxShadow: 'var(--navbar-inner-highlight, none), var(--depth-2)',
                        willChange: 'backdrop-filter',
                        transition: 'height 250ms cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                >
                    {/* LEFT: Logo */}
                    <Link to="/" className="flex items-center h-10 shrink-0" aria-label="FixPix Home">
                        <Logo />
                    </Link>

                    {/* CENTER: Nav Links (desktop) */}
                    <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) =>
                            link.isLink ? (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="relative px-4 py-2 text-[15px] font-medium text-text-secondary hover:text-text-main transition-colors duration-200 group whitespace-nowrap"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary rounded-full transition-all duration-250 group-hover:w-5" />
                                </Link>
                            ) : (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 text-[15px] font-medium text-text-secondary hover:text-text-main transition-colors duration-200 group whitespace-nowrap"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary rounded-full transition-all duration-250 group-hover:w-5" />
                                </a>
                            )
                        )}
                    </div>

                    {/* RIGHT: Actions (desktop) */}
                    <div className="hidden md:flex items-center gap-2 shrink-0">
                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main transition-colors"
                            style={{ backgroundColor: 'var(--fill-tertiary)' }}
                            whileTap={{ scale: 0.92 }}
                            aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={theme}
                                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {theme === 'dark' ? <Sun className="w-[17px] h-[17px]" /> : <Moon className="w-[17px] h-[17px]" />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>

                        {user ? (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[13px] font-semibold">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <Button variant="plain" size="sm" onClick={logoutUser}>Logout</Button>
                                <Button variant="filled" size="sm" onClick={() => navigate('/app')}>Dashboard</Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="plain" size="sm">Log In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="filled" size="sm">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: Premium Hamburger ↔ X */}
                    <div className="flex items-center md:hidden">
                        <motion.button
                            className="mobile-hamburger-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            whileTap={{ scale: 0.96 }}
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            style={{
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                        >
                            {/* 3-line icon — animates to X */}
                            <div style={{
                                width: 18,
                                height: 14,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative',
                            }}>
                                <span style={{
                                    display: 'block',
                                    width: 20,
                                    height: 2,
                                    borderRadius: 1,
                                    backgroundColor: 'currentColor',
                                    transition: 'transform 180ms ease-in-out, opacity 180ms ease-in-out',
                                    transformOrigin: 'center',
                                    transform: mobileMenuOpen
                                        ? 'translateY(6px) rotate(45deg)'
                                        : 'translateY(0) rotate(0)',
                                }} />
                                <span style={{
                                    display: 'block',
                                    width: 20,
                                    height: 2,
                                    borderRadius: 1,
                                    backgroundColor: 'currentColor',
                                    transition: 'opacity 120ms ease-in-out',
                                    opacity: mobileMenuOpen ? 0 : 1,
                                }} />
                                <span style={{
                                    display: 'block',
                                    width: 20,
                                    height: 2,
                                    borderRadius: 1,
                                    backgroundColor: 'currentColor',
                                    transition: 'transform 180ms ease-in-out, opacity 180ms ease-in-out',
                                    transformOrigin: 'center',
                                    transform: mobileMenuOpen
                                        ? 'translateY(-6px) rotate(-45deg)'
                                        : 'translateY(0) rotate(0)',
                                }} />
                            </div>
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu — Navbar Expansion */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 z-[89] md:hidden"
                            style={{ backgroundColor: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Expanded navbar card */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="fixed z-[91] md:hidden"
                            style={{
                                top: 12, left: 16, right: 16,
                                borderRadius: 'var(--radius-2xl)',
                                backgroundColor: 'var(--glass-bg, rgba(255,255,255,0.75))',
                                backdropFilter: 'var(--glass-blur, blur(30px) saturate(150%))',
                                WebkitBackdropFilter: 'var(--glass-blur, blur(30px) saturate(150%))',
                                border: '1px solid var(--glass-border, rgba(0,0,0,0.08))',
                                boxShadow: 'var(--depth-2)',
                            }}
                        >
                            {/* Header — matches navbar exactly */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                height: 56, padding: '0 var(--space-4)',
                            }}>
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center h-10 shrink-0" aria-label="FixPix Home">
                                    <Logo />
                                </Link>
                                <motion.button
                                    onClick={() => setMobileMenuOpen(false)}
                                    whileTap={{ scale: 0.92 }}
                                    style={{
                                        width: 34, height: 34, borderRadius: 'var(--radius-lg, 10px)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: 'var(--fill-tertiary)',
                                        color: 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer',
                                    }}
                                    aria-label="Close menu"
                                >
                                    <X size={16} strokeWidth={2.5} />
                                </motion.button>
                            </div>

                            {/* Separator */}
                            <div style={{ height: 1, backgroundColor: 'var(--glass-border, rgba(0,0,0,0.08))' }} />

                            {/* Nav links — same style as desktop */}
                            <div style={{ padding: '4px 8px 6px' }}>
                                {navLinks.map((link) => {
                                    const inner = (
                                        <div style={{
                                            padding: '9px 12px',
                                            borderRadius: 'var(--radius-lg, 10px)',
                                            fontSize: '15px',
                                            fontWeight: 500,
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}>
                                            {link.label}
                                            <ChevronRight size={16} strokeWidth={1.5} style={{ color: 'var(--text-quaternary)' }} />
                                        </div>
                                    );
                                    return link.isLink ? (
                                        <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', textDecoration: 'none' }}>{inner}</Link>
                                    ) : (
                                        <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', textDecoration: 'none' }}>{inner}</a>
                                    );
                                })}
                            </div>

                            {/* Separator */}
                            <div style={{ height: 1, margin: '0 16px', backgroundColor: 'var(--glass-border, rgba(0,0,0,0.08))' }} />

                            {/* Bottom row */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px var(--space-4) 10px',
                                gap: 8,
                            }}>
                                {/* Theme toggle */}
                                <button
                                    onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: 34, height: 34, borderRadius: 'var(--radius-lg, 10px)',
                                        backgroundColor: 'var(--fill-tertiary)',
                                        color: 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer',
                                        flexShrink: 0,
                                    }}
                                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                >
                                    {theme === 'dark' ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
                                </button>

                                {/* Auth actions */}
                                {user ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                                        <div style={{
                                            width: 30, height: 30, borderRadius: '50%',
                                            backgroundColor: 'var(--accent)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', fontSize: '12px', fontWeight: 650, flexShrink: 0,
                                        }}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <button
                                            onClick={() => { navigate('/app/profile'); setMobileMenuOpen(false); }}
                                            style={{
                                                padding: '7px 14px', borderRadius: 'var(--radius-lg, 10px)',
                                                backgroundColor: 'var(--fill-tertiary)', color: 'var(--text-primary)',
                                                fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
                                            }}
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => { navigate('/app'); setMobileMenuOpen(false); }}
                                            style={{
                                                padding: '7px 14px', borderRadius: 'var(--radius-lg, 10px)',
                                                backgroundColor: 'var(--accent)', color: 'white',
                                                fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
                                            }}
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                                            style={{
                                                width: 34, height: 34, borderRadius: 'var(--radius-lg, 10px)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                backgroundColor: 'var(--fill-tertiary)',
                                                color: 'var(--text-secondary)',
                                                border: 'none', cursor: 'pointer',
                                            }}
                                            aria-label="Log out"
                                        >
                                            <LogOut size={15} strokeWidth={1.75} />
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                                            <button style={{
                                                padding: '7px 14px', borderRadius: 'var(--radius-lg, 10px)',
                                                backgroundColor: 'var(--fill-tertiary)', color: 'var(--text-primary)',
                                                fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
                                            }}>
                                                Log In
                                            </button>
                                        </Link>
                                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                                            <button style={{
                                                padding: '7px 14px', borderRadius: 'var(--radius-lg, 10px)',
                                                backgroundColor: 'var(--accent)', color: 'white',
                                                fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
                                            }}>
                                                Get Started
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
