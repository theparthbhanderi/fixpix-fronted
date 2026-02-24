import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
    Wand2, FolderOpen, Layers, Clock,
    Image, Sparkles, TrendingUp, ArrowRight
} from 'lucide-react';

/* ─────────────────── Animated Counter ─────────────────── */

const AnimatedCounter = ({ value, duration = 1 }) => {
    const [count, setCount] = useState(0);
    const numericValue = parseInt(value) || 0;

    useEffect(() => {
        let start = 0;
        const end = numericValue;
        if (end === 0) return;
        const incrementTime = (duration * 1000) / end;

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) clearInterval(timer);
        }, Math.max(incrementTime, 20));

        return () => clearInterval(timer);
    }, [numericValue, duration]);

    return <span>{count}{typeof value === 'string' && value.replace(/[0-9]/g, '')}</span>;
};

/* ─────────────────── Skeleton ─────────────────── */

const Skeleton = ({ className }) => (
    <div
        className={`animate-pulse rounded-xl ${className}`}
        style={{ backgroundColor: 'var(--fill-secondary)' }}
    />
);

/* ═══════════════════════════ DASHBOARD PAGE ═══════════════════════════ */

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        { label: 'Images Restored', value: '24', icon: Image },
        { label: 'Time Saved', value: '3h', icon: Clock },
        { label: 'AI Enhancements', value: '156', icon: Sparkles },
    ];

    const quickActions = [
        { icon: Wand2, title: 'Restore Photo', desc: 'AI-powered restoration', link: '/app/restoration' },
        { icon: Layers, title: 'Batch Process', desc: 'Process multiple images', link: '/app/batch' },
        { icon: FolderOpen, title: 'My Projects', desc: 'View saved work', link: '/app/projects' },
        { icon: Clock, title: 'History', desc: 'Past restorations', link: '/app/history' },
    ];

    /* Card wrapper style */
    const cardStyle = {
        borderRadius: 'var(--radius-2xl)',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--depth-1)',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full overflow-y-auto"
            style={{ padding: 'clamp(24px, 4vw, 48px)' }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* ─────────── Page Header ─────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start justify-between mb-8"
                >
                    <div>
                        <h1
                            className="text-text-main"
                            style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.25 }}
                        >
                            Good {timeOfDay}, {user?.username || 'there'} 👋
                        </h1>
                        <p className="text-text-secondary mt-1" style={{ fontSize: '15px' }}>
                            Ready to restore some memories?
                        </p>
                    </div>

                    {/* Quick action button */}
                    <Link to="/app/restoration" className="hidden md:block">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ filter: 'brightness(1.05)' }}
                            className="flex items-center gap-2 text-white"
                            style={{
                                height: '44px',
                                padding: '0 var(--space-5)',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '14px',
                                fontWeight: 600,
                                backgroundColor: 'var(--accent)',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <Wand2 className="w-4 h-4" strokeWidth={2} />
                            New Restoration
                        </motion.button>
                    </Link>
                </motion.div>

                {/* ─────────── Stats Cards ─────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="mb-8"
                >
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 'var(--space-6)' }}>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} style={{ ...cardStyle, padding: 'var(--space-7)' }}>
                                    <Skeleton className="w-10 h-10 mb-4" />
                                    <Skeleton className="w-16 h-7 mb-2" />
                                    <Skeleton className="w-24 h-4" />
                                </div>
                            ))}
                        </div>
                    ) : parseInt(stats[0].value) === 0 ? (
                        /* ─── Empty State ─── */
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                            style={{ ...cardStyle, padding: 'clamp(32px, 5vw, 48px)' }}
                        >
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                                style={{ backgroundColor: 'var(--accent-soft)' }}
                            >
                                <Sparkles className="w-8 h-8" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                            </div>
                            <h2
                                className="text-text-main mb-2"
                                style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.3px' }}
                            >
                                Start Your First Restoration
                            </h2>
                            <p className="text-text-secondary max-w-md mx-auto mb-6" style={{ fontSize: '15px', lineHeight: 1.6 }}>
                                Upload an old or damaged photo to see the magic happen.
                            </p>
                            <Link to="/app/restoration">
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    className="text-white"
                                    style={{
                                        height: '48px',
                                        padding: '0 var(--space-6)',
                                        borderRadius: 'var(--radius-lg)',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        backgroundColor: 'var(--accent)',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Wand2 className="w-4 h-4 mr-2 inline" />
                                    Start Magic Editor
                                </motion.button>
                            </Link>
                        </motion.div>
                    ) : (
                        /* ─── Stats Grid ─── */
                        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 'var(--space-6)' }}>
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 + i * 0.05 }}
                                    whileHover={{ y: -2, boxShadow: 'var(--depth-2)', transition: { duration: 0.18 } }}
                                    style={{ ...cardStyle, padding: 'var(--space-7)', cursor: 'default' }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                        style={{ backgroundColor: 'var(--accent-soft)' }}
                                    >
                                        <stat.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
                                    </div>
                                    <div
                                        className="text-text-main mb-1"
                                        style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1 }}
                                    >
                                        <AnimatedCounter value={stat.value} />
                                    </div>
                                    <div className="text-text-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* ─────────── Quick Actions ─────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <h2
                        className="text-text-main mb-5"
                        style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.3px' }}
                    >
                        Quick Actions
                    </h2>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                        style={{ gap: 'var(--space-6)' }}
                    >
                        {quickActions.map((action, i) => (
                            <Link key={i} to={action.link}>
                                <motion.div
                                    whileTap={{ scale: 0.97 }}
                                    whileHover={{ y: -2, boxShadow: 'var(--depth-2)', transition: { duration: 0.18 } }}
                                    className="h-full"
                                    style={{ ...cardStyle, padding: 'var(--space-7)', textAlign: 'center' }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                        style={{ backgroundColor: 'var(--accent-soft)' }}
                                    >
                                        <action.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                                    </div>
                                    <h3
                                        className="text-text-main mb-1"
                                        style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.3px' }}
                                    >
                                        {action.title}
                                    </h3>
                                    <p className="text-text-secondary" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                                        {action.desc}
                                    </p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* ─────────── CTA Banner ─────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-6"
                >
                    <div
                        className="relative overflow-hidden"
                        style={{
                            borderRadius: 'var(--radius-2xl)',
                            padding: 'clamp(28px, 4vw, 40px)',
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            boxShadow: 'var(--depth-1)',
                        }}
                    >
                        {/* Very subtle accent overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'radial-gradient(ellipse 60% 60% at 80% 20%, rgba(0,122,255,0.05), transparent 70%)',
                            }}
                        />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                            <div>
                                <h3
                                    className="text-text-main flex items-center gap-2 mb-1"
                                    style={{ fontSize: '20px', fontWeight: 600 }}
                                >
                                    <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent)' }} strokeWidth={2} />
                                    Start Restoring Now
                                </h3>
                                <p className="text-text-secondary" style={{ fontSize: '15px' }}>
                                    Upload your old photos and let AI do the magic
                                </p>
                            </div>
                            <Link to="/app/restoration">
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    whileHover={{ filter: 'brightness(1.05)' }}
                                    className="flex items-center gap-2 text-white whitespace-nowrap"
                                    style={{
                                        height: '48px',
                                        padding: '0 var(--space-6)',
                                        borderRadius: 'var(--radius-lg)',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        backgroundColor: 'var(--accent)',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Wand2 className="w-4 h-4" strokeWidth={2} />
                                    Open Editor
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardPage;
