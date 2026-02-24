import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ImageContext } from '../context/ImageContext';
import Logo from '../components/ui/Logo';
import { Lock, User as UserIcon, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/ui/Toast';

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ImageContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const success = await loginUser(username, password);
        setIsLoading(false);

        if (success) {
            toast.success('Welcome back!', { title: 'Login Successful' });
            navigate('/app');
        } else {
            setError("Invalid credentials. Please try again.");
            toast.error('Invalid credentials. Please try again.');
        }
    };



    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="min-h-screen flex items-center justify-center relative"
            style={{
                padding: 'clamp(20px, 4vw, 32px)',
                backgroundColor: 'var(--bg-primary)',
            }}
        >


            {/* Subtle ambient radial behind card */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,122,255,0.03), transparent 70%)',
                }}
            />

            {/* Theme Toggle — top right */}
            <motion.button
                onClick={toggleTheme}
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main transition-colors"
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

            {/* Floating Auth Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
                className="w-full relative z-10"
                style={{ maxWidth: '420px' }}
            >
                <div
                    style={{
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'clamp(28px, 4vw, 40px)',
                        backgroundColor: 'var(--surface-elevated)',
                        backdropFilter: 'blur(30px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--depth-2)',
                    }}
                >
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Logo />
                    </div>

                    {/* Title */}
                    <h1
                        className="text-center text-text-main mb-2"
                        style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', lineHeight: 1.25 }}
                    >
                        Welcome back
                    </h1>
                    <p
                        className="text-center text-text-secondary mb-6"
                        style={{ fontSize: '15px', lineHeight: 1.6 }}
                    >
                        Sign in to continue to FixPix
                    </p>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                className="mb-4 overflow-hidden"
                            >
                                <div
                                    className="text-center"
                                    style={{
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        padding: '12px 16px',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'rgba(255, 59, 48, 0.08)',
                                        color: 'var(--error)',
                                    }}
                                >
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Username */}
                            <div className="relative">
                                <UserIcon
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none"
                                    style={{ color: 'var(--text-tertiary)' }}
                                    strokeWidth={1.75}
                                />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input-field"
                                    style={{ paddingLeft: 'var(--space-9)' }}
                                    placeholder="Username"
                                    autoComplete="username"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none"
                                    style={{ color: 'var(--text-tertiary)' }}
                                    strokeWidth={1.75}
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    style={{ paddingLeft: 'var(--space-9)', paddingRight: '48px' }}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                                    style={{ color: 'var(--text-tertiary)' }}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword
                                        ? <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.75} />
                                        : <Eye className="w-[18px] h-[18px]" strokeWidth={1.75} />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Primary Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ filter: 'brightness(1.05)' }}
                            className="w-full mt-6 text-white font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none"
                            style={{
                                height: '52px',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '15px',
                                backgroundColor: 'var(--accent)',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {isLoading ? 'Signing in…' : 'Log In'}
                        </motion.button>
                    </form>

                    {/* Forgot Password */}
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            className="text-text-secondary hover:text-text-main transition-colors"
                            style={{ fontSize: '13px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
                        <span className="text-text-quaternary" style={{ fontSize: '13px', fontWeight: 500 }}>or</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
                    </div>

                    {/* Google Button — outline floating pill */}
                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2.5 text-text-main transition-colors"
                        style={{
                            height: '52px',
                            borderRadius: 'var(--radius-lg)',
                            fontSize: '15px',
                            fontWeight: 500,
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                        }}
                    >
                        {/* Google icon */}
                        <svg width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        Continue with Google
                    </motion.button>

                    {/* Bottom Link */}
                    <p
                        className="text-center text-text-secondary mt-6"
                        style={{ fontSize: '15px' }}
                    >
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="font-semibold transition-colors"
                            style={{ color: 'var(--accent)' }}
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LoginPage;
