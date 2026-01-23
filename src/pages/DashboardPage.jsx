import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import {
    Wand2, FolderOpen, Layers, Settings,
    Image, Clock, Sparkles, ChevronRight, TrendingUp
} from 'lucide-react';

/**
 * Animated Counter Component - iOS style number animation
 */
const AnimatedCounter = ({ value, duration = 1 }) => {
    const [count, setCount] = useState(0);
    const numericValue = parseInt(value) || 0;

    useEffect(() => {
        let start = 0;
        const end = numericValue;
        const incrementTime = (duration * 1000) / end;

        if (end === 0) return;

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) clearInterval(timer);
        }, Math.max(incrementTime, 20));

        return () => clearInterval(timer);
    }, [numericValue, duration]);

    return <span>{count}{typeof value === 'string' && value.replace(/[0-9]/g, '')}</span>;
};

/**
 * Skeleton Loading Component
 */
const Skeleton = ({ className }) => (
    <div className={`ios-skeleton rounded-[10px] ${className}`} />
);

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const quickActions = [
        {
            icon: Wand2,
            title: 'Restore Photo',
            desc: 'AI-powered restoration',
            link: '/app/restoration',
            colorVar: '--ios-purple'
        },
        {
            icon: Layers,
            title: 'Batch Process',
            desc: 'Process multiple images',
            link: '/app/batch',
            colorVar: '--ios-blue'
        },
        {
            icon: FolderOpen,
            title: 'My Projects',
            desc: 'View saved work',
            link: '/app/projects',
            colorVar: '--ios-green'
        },
        {
            icon: Clock,
            title: 'History',
            desc: 'Past restorations',
            link: '/app/history',
            colorVar: '--ios-orange'
        },
    ];

    const stats = [
        { label: 'Images Restored', value: '24', icon: Image, colorVar: '--ios-blue' },
        { label: 'Time Saved', value: '3h', icon: Clock, colorVar: '--ios-green' },
        { label: 'AI Enhancements', value: '156', icon: Sparkles, colorVar: '--ios-purple' },
    ];

    return (
        <div className="p-6 md:p-8 w-full h-full overflow-y-auto" style={{ backgroundColor: 'rgb(var(--ios-bg))' }}>
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-text-main">
                    Good {timeOfDay}, {user?.username || 'there'}! 👋
                </h1>
                <p className="ios-body text-text-secondary mt-2">
                    Ready to restore some memories?
                </p>
            </motion.div>

            {/* Stats Row OR Onboarding Hero */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                {/* 
                  * Logic: If specific stats are 0, show Onboarding Hero.
                  * For demo purposes, we can toggle this.
                  * Assuming 'loading' handles the initial state.
                 */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="ios-card p-4 h-28 flex flex-col justify-center">
                                <Skeleton className="w-8 h-8 mx-auto mb-3" />
                                <Skeleton className="w-16 h-6 mx-auto mb-2" />
                                <Skeleton className="w-24 h-3 mx-auto text-secondary" />
                            </div>
                        ))}
                    </div>
                ) : (
                    parseInt(stats[0].value) === 0 ? (
                        // Zero State / Onboarding Hero
                        <motion.div
                            className="ios-card p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <div
                                className="absolute inset-0 opacity-[0.03]"
                                style={{ background: `radial-gradient(circle at center, rgb(var(--ios-blue)), transparent 70%)` }}
                            />
                            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 text-ios-blue">
                                <Sparkles className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h2 className="ios-title2 text-text-main mb-2">Start Your First Restoration</h2>
                            <p className="ios-body text-text-secondary max-w-md mb-6">
                                Upload an old or damaged photo to see the magic happen. Fix scratches, restore faces, and colorize black & white memories.
                            </p>
                            <Link to="/app/restoration">
                                <Button variant="filled" size="lg">
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    Start Magic Editor
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        // Standard Stats Grid
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className="ios-card relative overflow-hidden p-4 text-center group"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                >
                                    {/* Gradient background */}
                                    <div
                                        className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300"
                                        style={{ background: `radial-gradient(circle at top right, rgb(var(${stat.colorVar})), transparent 70%)` }}
                                    />

                                    <stat.icon
                                        className="w-9 h-9 mx-auto mb-2.5 transition-transform duration-300 group-hover:scale-110"
                                        style={{ color: `rgb(var(${stat.colorVar}))` }}
                                        strokeWidth={1.5}
                                    />
                                    <div className="ios-title1 text-text-main mb-0.5 leading-tight">
                                        <AnimatedCounter value={stat.value} />
                                    </div>
                                    <div className="ios-subhead text-text-secondary font-medium leading-normal">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    )
                )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="ios-headline text-text-main mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.link}>
                            <motion.div
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ y: -2 }}
                                className="group h-full"
                            >
                                <div className="ios-card p-4 h-full transition-all duration-300 hover:shadow-lg border border-transparent hover:border-separator/20 flex flex-col items-start text-left">
                                    {/* Icon Container */}
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm"
                                        style={{
                                            background: `linear-gradient(135deg, rgb(var(${action.colorVar})) 0%, rgb(var(${action.colorVar}) / 0.7) 100%)`,
                                        }}
                                    >
                                        <action.icon className="w-5 h-5 text-white" strokeWidth={2} />
                                    </div>

                                    <h3 className="ios-subhead text-text-main font-semibold flex items-center gap-1.5 mb-1 w-full justify-between">
                                        {action.title}
                                    </h3>
                                    <p className="text-[12px] leading-relaxed text-text-secondary line-clamp-2">{action.desc}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* CTA Banner - Subtle */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 mb-4"
            >
                <div
                    className="rounded-3xl p-6 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgb(var(--ios-indigo) / 0.08) 0%, rgb(var(--ios-purple) / 0.08) 100%)',
                        border: '1px solid rgb(var(--ios-indigo) / 0.15)'
                    }}
                >
                    {/* Subtle gradient orbs */}
                    <div
                        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
                        style={{ background: 'rgb(var(--ios-indigo))' }}
                    />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                        <div>
                            <h3 className="ios-headline text-text-main flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" strokeWidth={2} />
                                Start Restoring Now
                            </h3>
                            <p className="ios-subhead text-text-secondary">Upload your old photos and let AI do the magic</p>
                        </div>
                        <Link to="/app/restoration">
                            <Button variant="filled">
                                <Wand2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                Open Editor
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
