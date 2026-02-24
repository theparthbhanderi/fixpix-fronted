import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronRight } from 'lucide-react';
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

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [mobileMenuOpen]);

    const navLinks = [
        { href: '/#features', label: 'Features' },
        { href: '/#how-it-works', label: 'How it works' },
        { href: '/#testimonials', label: 'Testimonials' },
        { to: '/about', label: 'About', isLink: true },
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
                        backgroundColor: 'var(--glass-bg)',
                        backdropFilter: 'var(--glass-blur)',
                        WebkitBackdropFilter: 'var(--glass-blur)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--navbar-inner-highlight), var(--depth-2)',
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

            {/* Mobile Menu — Floating Glass Panel */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[90] md:hidden flex items-start justify-center pt-[110px] px-5"
                        style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget) setMobileMenuOpen(false); }}
                    >
                        <motion.div
                            initial={{ y: -12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -12, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                            className="w-full max-w-[420px]"
                            style={{
                                borderRadius: 'var(--radius-2xl)',
                                backgroundColor: 'var(--surface-elevated)',
                                backdropFilter: 'blur(20px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                                border: '1px solid var(--border-subtle)',
                                boxShadow: 'var(--depth-3)',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Nav Links */}
                            <div className="p-3">
                                {navLinks.map((link, index) =>
                                    link.isLink ? (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className="flex items-center justify-between h-12 px-3 rounded-lg text-text-main text-[15px] font-medium transition-all duration-[120ms] ease-out hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-tertiary)]"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                            <ChevronRight className="w-4 h-4 text-text-quaternary" />
                                        </Link>
                                    ) : (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center justify-between h-12 px-3 rounded-lg text-text-main text-[15px] font-medium transition-all duration-[120ms] ease-out hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-tertiary)]"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                            <ChevronRight className="w-4 h-4 text-text-quaternary" />
                                        </a>
                                    )
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-px mx-4" style={{ backgroundColor: 'var(--border-subtle)' }} />

                            {/* Theme toggle */}
                            <div className="p-3">
                                <button
                                    onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                                    className="flex items-center justify-between w-full h-12 px-3 rounded-lg text-text-main text-[15px] font-medium transition-all duration-[120ms] ease-out hover:bg-[var(--fill-tertiary)] active:bg-[var(--fill-tertiary)]"
                                >
                                    <span className="flex items-center gap-3">
                                        {theme === 'dark' ? <Sun className="w-5 h-5 text-text-secondary" /> : <Moon className="w-5 h-5 text-text-secondary" />}
                                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="h-px mx-4" style={{ backgroundColor: 'var(--border-subtle)' }} />

                            {/* Auth Buttons */}
                            <div className="p-4 space-y-3">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-3 py-2">
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-[15px] font-semibold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="text-[15px] font-semibold text-text-main">{user.username}</span>
                                                <span className="text-[13px] text-text-secondary block">Logged in</span>
                                            </div>
                                        </div>
                                        <Button variant="filled" size="lg" className="w-full justify-center" onClick={() => { navigate('/app'); setMobileMenuOpen(false); }}>
                                            Go to Dashboard
                                        </Button>
                                        <Button variant="plain" size="md" className="w-full justify-center text-text-secondary" onClick={() => { logoutUser(); setMobileMenuOpen(false); }}>
                                            Log Out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block">
                                            <Button variant="filled" size="lg" className="w-full justify-center">Get Started</Button>
                                        </Link>
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                                            <Button variant="plain" size="md" className="w-full justify-center text-text-secondary">Log In</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
