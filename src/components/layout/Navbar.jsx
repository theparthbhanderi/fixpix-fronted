import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronRight } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
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
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is active
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
        }
    }, [mobileMenuOpen]);

    const navLinks = [
        { href: '/#features', label: 'Features' },
        { href: '/#how-it-works', label: 'How it works' },
        { href: '/#testimonials', label: 'Testimonials' },
        { to: '/about', label: 'About', isLink: true },
    ];

    return (
        <>
            {/* iOS-Style Navigation Bar - Three Section Layout */}
            <nav
                className={cn(
                    "fixed top-0 left-0 w-full transition-all duration-300",
                    mobileMenuOpen ? "z-[100]" : "z-50",
                    scrolled
                        ? "h-14 md:h-16 backdrop-blur-xl border-b"
                        : "h-[60px] md:h-[72px] bg-transparent"
                )}
                style={{
                    backgroundColor: scrolled ? 'rgb(var(--ios-surface) / 0.85)' : 'transparent',
                    borderColor: scrolled ? 'rgb(var(--ios-separator) / 0.15)' : 'transparent',
                }}
            >
                <div className="container mx-auto px-6 h-full">
                    {/* Three-Section Grid: Logo | Nav | Actions */}
                    <div className="h-full grid grid-cols-3 items-center">

                        {/* LEFT: Logo */}
                        <div className="flex items-center justify-start">
                            <Link to="/" className="flex items-center h-10" aria-label="FixPix Home">
                                <Logo />
                            </Link>
                        </div>

                        {/* CENTER: Navigation Links */}
                        <div className="hidden md:flex items-center justify-center">
                            <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
                                {navLinks.map((link) => (
                                    link.isLink ? (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className="relative px-5 py-2.5 text-[15px] font-medium leading-none text-text-secondary hover:text-text-main transition-colors duration-200 group"
                                        >
                                            {link.label}
                                            {/* Hover underline */}
                                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-200 group-hover:w-5" />
                                        </Link>
                                    ) : (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="relative px-5 py-2.5 text-[15px] font-medium leading-none text-text-secondary hover:text-text-main transition-colors duration-200 group"
                                        >
                                            {link.label}
                                            {/* Hover underline */}
                                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-200 group-hover:w-5" />
                                        </a>
                                    )
                                ))}
                            </nav>
                        </div>

                        {/* RIGHT: Actions */}
                        <div className="hidden md:flex items-center justify-end gap-3">
                            {/* Theme Toggle - iOS Style */}
                            <motion.button
                                onClick={toggleTheme}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main transition-colors"
                                style={{ backgroundColor: 'rgb(var(--ios-fill) / 0.08)' }}
                                whileTap={{ scale: 0.92 }}
                                whileHover={{ backgroundColor: 'rgb(var(--ios-fill) / 0.12)' }}
                                aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                                title={theme === 'dark' ? "Light Mode" : "Dark Mode"}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={theme}
                                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    {/* User Avatar */}
                                    <div className="flex items-center gap-2.5 pl-1">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[13px] font-semibold shadow-sm ring-2 ring-white/10">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-[14px] font-medium text-text-main hidden lg:block">{user.username}</span>
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

                        {/* Mobile: Right-aligned menu button */}
                        <div className="flex items-center justify-end md:hidden col-span-2 relative z-[61]">
                            <motion.button
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: 'rgb(var(--ios-fill) / 0.08)' }}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                whileTap={{ scale: 0.92 }}
                                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={mobileMenuOpen}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={mobileMenuOpen ? 'close' : 'menu'}
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu - iOS Style Sheet */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[90] md:hidden overflow-hidden"
                        style={{
                            backgroundColor: 'rgb(var(--ios-bg) / 0.97)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            paddingTop: '80px' // Ensure content starts below the fixed navbar
                        }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setMobileMenuOpen(false);
                            }
                        }}
                    >
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.05 }}
                            className="pt-20 px-5"
                        >
                            {/* Navigation Links - Lighter */}
                            <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: 'rgb(var(--ios-surface))' }}>
                                {navLinks.map((link, index) => (
                                    link.isLink ? (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-3.5 text-text-main text-[15px] font-medium",
                                                index !== navLinks.length - 1 && "border-b border-separator/10"
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                            <ChevronRight className="w-4 h-4 text-text-quaternary" />
                                        </Link>
                                    ) : (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-3.5 text-text-main text-[15px] font-medium",
                                                index !== navLinks.length - 1 && "border-b border-separator/10"
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                            <ChevronRight className="w-4 h-4 text-text-quaternary" />
                                        </a>
                                    )
                                ))}
                            </div>

                            {/* Settings Row - Separate smaller card */}
                            <div className="rounded-2xl overflow-hidden mb-5" style={{ backgroundColor: 'rgb(var(--ios-surface))' }}>
                                <button
                                    onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                                    className="flex items-center justify-between w-full px-4 py-3.5 text-text-main text-[15px] font-medium"
                                >
                                    <span className="flex items-center gap-3">
                                        {theme === 'dark' ? <Sun className="w-5 h-5 text-ios-orange" /> : <Moon className="w-5 h-5 text-ios-purple" />}
                                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                    <div className="w-8 h-5 rounded-full flex items-center px-0.5" style={{ backgroundColor: theme === 'dark' ? 'rgb(var(--ios-success))' : 'rgb(var(--ios-fill) / 0.2)' }}>
                                        <motion.div
                                            className="w-4 h-4 rounded-full bg-white shadow-sm"
                                            animate={{ x: theme === 'dark' ? 12 : 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </div>
                                </button>
                            </div>

                            {/* Auth Buttons - Primary first for logged out, Dashboard prominent for logged in */}
                            <div className="flex flex-col gap-2.5">
                                {user ? (
                                    <div className="rounded-2xl overflow-hidden p-3 space-y-2" style={{ backgroundColor: 'rgb(var(--ios-surface))' }}>
                                        <div className="flex items-center gap-3 px-2 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[15px] font-semibold shadow-sm">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-semibold text-text-main">{user.username}</span>
                                                <span className="text-[13px] text-text-secondary">Logged in</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="filled"
                                            size="lg"
                                            className="w-full justify-center shadow-sm"
                                            onClick={() => { navigate('/app'); setMobileMenuOpen(false); }}
                                        >
                                            Go to Dashboard
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="md"
                                            className="w-full justify-center text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                            onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                                        >
                                            Log Out
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                                            <Button variant="filled" size="lg" className="w-full justify-center shadow-lg">Get Started</Button>
                                        </Link>
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
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
