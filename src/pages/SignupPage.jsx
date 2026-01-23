import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ImageContext } from '../context/ImageContext';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { Lock, User as UserIcon, Mail, ArrowLeft, Eye, EyeOff, Check, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/ui/Toast';

const SignupPage = () => {
    const { registerUser } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ImageContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    // Password strength indicator
    const getPasswordStrength = () => {
        if (password.length === 0) return null;
        if (password.length < 6) return { label: 'Too short', color: 'text-error' };
        if (password.length < 8) return { label: 'Weak', color: 'text-warning' };
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            return { label: 'Strong', color: 'text-success' };
        }
        return { label: 'Medium', color: 'text-info' };
    };

    const passwordStrength = getPasswordStrength();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await registerUser(username, email, password);
        setIsLoading(false);

        if (result === true) {
            toast.success('Account created successfully!', { title: 'Welcome to FixPix' });
            navigate('/app');
        } else {
            // Parse error from API (Django DRF usually returns object with field errors)
            let errorMsg = "Registration failed. Please try again.";

            if (result && typeof result === 'object') {
                if (result.username) errorMsg = Array.isArray(result.username) ? result.username[0] : result.username;
                else if (result.email) errorMsg = Array.isArray(result.email) ? result.email[0] : result.email;
                else if (result.password) errorMsg = Array.isArray(result.password) ? result.password[0] : result.password;
                else if (result.detail) errorMsg = result.detail;
            }

            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center ios-gutter py-12 relative" style={{ background: 'var(--ios-gradient-hero)' }}>
            {/* Theme Toggle - Top Right */}
            <motion.button
                onClick={toggleTheme}
                className="absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main transition-colors ios-card p-0"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
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
                <div className="ios-card p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Logo />
                    </div>

                    {/* Header */}
                    <h1 className="ios-title2 text-center text-text-main mb-2">Create Account</h1>
                    <p className="ios-subhead text-text-secondary text-center mb-8">
                        Start your journey with FixPix today.
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
                                    className="ios-input ios-input-icon"
                                    placeholder="Choose a username"
                                    autoComplete="username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="ios-form-group">
                            <label className="ios-label">Email</label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none"
                                    strokeWidth={1.75}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="ios-input ios-input-icon"
                                    placeholder="name@example.com"
                                    autoComplete="email"
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
                                    className="ios-input ios-input-icon pr-12"
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" strokeWidth={1.75} />
                                    ) : (
                                        <Eye className="w-5 h-5" strokeWidth={1.75} />
                                    )}
                                </button>
                            </div>
                            {/* Password Strength */}
                            {passwordStrength && (
                                <p className={`ios-helper ${passwordStrength.color} flex items-center gap-1`}>
                                    {passwordStrength.label === 'Strong' && <Check className="w-3 h-3" />}
                                    {passwordStrength.label}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            variant="filled"
                            size="lg"
                            fullWidth
                            disabled={isLoading}
                            className="mt-2"
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-text-secondary mt-8 ios-subhead">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:opacity-70 transition-opacity">
                            Log in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
