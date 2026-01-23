import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ImageContext } from '../context/ImageContext';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { Lock, User as UserIcon, ArrowLeft, Eye, EyeOff, Sun, Moon } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center ios-gutter relative" style={{ background: 'var(--ios-gradient-hero)' }}>
            {/* Theme Toggle - Top Right */}
            <motion.button
                onClick={toggleTheme}
                className="absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main transition-colors ios-card p-0"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={theme}
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </motion.div>
                </AnimatePresence>
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full max-w-[400px]"
            >
                {/* Back Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-primary ios-subhead mb-6 hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                    Back to Home
                </Link>

                {/* Card */}
                <div className="ios-card p-6">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Logo />
                    </div>

                    {/* Header */}
                    <h1 className="ios-title2 text-center text-text-main mb-2">Welcome Back</h1>
                    <p className="ios-subhead text-text-secondary text-center mb-8">
                        Sign in to continue to FixPix.
                    </p>

                    {/* Error Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-error-subtle text-error ios-footnote p-3 rounded-[10px] mb-6 text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Username Field */}
                        <div className="ios-form-group">
                            <label className="ios-label">Username</label>
                            <div className="relative">
                                <UserIcon
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none"
                                    strokeWidth={1.75}
                                />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`ios-input ios-input-icon ${error ? 'ios-input-error' : ''}`}
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="ios-form-group">
                            <label className="ios-label">Password</label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none"
                                    strokeWidth={1.75}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`ios-input ios-input-icon pr-12 ${error ? 'ios-input-error' : ''}`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" strokeWidth={1.75} />
                                    ) : (
                                        <Eye className="w-5 h-5" strokeWidth={1.75} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            variant="filled"
                            size="lg"
                            fullWidth
                            disabled={isLoading}
                            className="mt-2"
                        >
                            {isLoading ? 'Signing in...' : 'Log In'}
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-text-secondary mt-8 ios-subhead">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary font-semibold hover:opacity-70 transition-opacity">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
