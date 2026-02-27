import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import {
    Sun, Moon, Bell, BellOff, Download, User, Mail,
    ChevronRight, LogOut, Sparkles, HardDrive, Info, Lock, Zap, Trash2
} from 'lucide-react';

/* ────────────────────────────────────────
   THEME TOKENS
   ──────────────────────────────────────── */
const lightTokens = {
    pageBg: 'var(--bg-primary)',
    sectionBg: 'var(--glass-bg)',
    sectionBorder: '1px solid var(--border-subtle)',
    sectionShadow: 'var(--depth-1)',
    textPrimary: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    separator: 'var(--border-subtle)',
    hoverBg: 'var(--fill-tertiary)',
    dropdownBg: 'var(--bg-tertiary)',
    dangerText: 'var(--error)',
    dangerBg: 'rgba(255,59,48,0.06)',
};

const darkTokens = {
    pageBg: 'var(--bg-primary)',
    sectionBg: 'var(--glass-bg)',
    sectionBorder: '1px solid var(--border-subtle)',
    sectionShadow: 'var(--depth-2)',
    textPrimary: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    separator: 'var(--border-subtle)',
    hoverBg: 'var(--fill-tertiary)',
    dropdownBg: 'var(--surface)',
    dangerText: 'var(--error)',
    dangerBg: 'rgba(255,69,58,0.08)',
};

const useThemeTokens = () => {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? darkTokens : lightTokens;
};

/* ────────────────────────────────────────
   iOS TOGGLE
   ──────────────────────────────────────── */
const IOSToggle = ({ checked, onChange }) => (
    <motion.button
        onClick={() => onChange(!checked)}
        style={{
            width: 44, height: 26,
            borderRadius: 'var(--radius-md)',
            padding: 2,
            border: 'none',
            cursor: 'pointer',
            background: checked ? 'var(--accent)' : 'var(--fill-primary)',
            transition: 'background 200ms ease',
            display: 'flex',
            alignItems: 'center',
        }}
        whileTap={{ scale: 0.95 }}
    >
        <motion.div
            style={{
                width: 22, height: 22,
                borderRadius: 'var(--radius-sm)',
                background: '#fff',
                boxShadow: 'var(--depth-1)',
            }}
            animate={{ x: checked ? 18 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
    </motion.button>
);

/* ────────────────────────────────────────
   SETTINGS ROW
   ──────────────────────────────────────── */
const SettingsRow = ({
    icon: Icon,
    title,
    subtitle,
    action,
    showChevron = false,
    destructive = false,
    onClick,
    isLast = false,
    t,
}) => (
    <motion.div
        onClick={onClick}
        whileTap={onClick ? { scale: 0.99 } : {}}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            height: 64,
            padding: '0 var(--space-6)',
            cursor: onClick ? 'pointer' : 'default',
            borderBottom: isLast ? 'none' : `1px solid ${t.separator}`,
            transition: 'background 150ms ease',
        }}
        whileHover={{ background: t.hoverBg }}
    >
        {/* Icon */}
        <div style={{
            width: 32, height: 32,
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: destructive ? t.dangerBg : 'var(--accent-soft)',
        }}>
            <Icon
                size={18} strokeWidth={1.75}
                style={{ color: destructive ? t.dangerText : 'var(--accent)' }}
            />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
                fontSize: 15, fontWeight: 500,
                color: destructive ? t.dangerText : t.textPrimary,
            }}>
                {title}
            </div>
            {subtitle && (
                <div style={{
                    fontSize: 13, marginTop: 2,
                    color: t.textSecondary,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    {subtitle}
                </div>
            )}
        </div>

        {/* Action */}
        {action}

        {/* Chevron */}
        {showChevron && (
            <ChevronRight size={16} strokeWidth={2} style={{ color: t.textSecondary, opacity: 0.5, flexShrink: 0 }} />
        )}
    </motion.div>
);

/* ────────────────────────────────────────
   FLOATING SECTION
   ──────────────────────────────────────── */
const FloatingSection = ({ label, footer, children, t, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay, ease: [0.25, 1, 0.5, 1] }}
        style={{ marginBottom: 32 }}
    >
        {label && (
            <div style={{
                fontSize: 13, fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: t.textSecondary,
                padding: '0 var(--space-6) var(--space-2)',
            }}>
                {label}
            </div>
        )}
        <div style={{
            borderRadius: 'var(--radius-2xl)',
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--depth-1)',
            overflow: 'hidden',
        }}>
            {children}
        </div>
        {footer && (
            <div style={{
                fontSize: 12, color: t.textSecondary,
                padding: 'var(--space-2) var(--space-6) 0',
                opacity: 0.7,
            }}>
                {footer}
            </div>
        )}
    </motion.div>
);

/* ────────────────────────────────────────
   SETTINGS PAGE
   ──────────────────────────────────────── */
const SettingsPage = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const t = useThemeTokens();

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [highQualityExport, setHighQualityExport] = useState(true);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            overflowY: 'auto',
            padding: 'var(--space-9) var(--space-6) var(--space-9)',
        }}
            className="settings-page-container"
        >
            <div style={{ maxWidth: 800, margin: '0 auto' }}>

                {/* ── Page Title ── */}
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        fontSize: 28, fontWeight: 700,
                        color: t.textPrimary,
                        marginBottom: 'var(--space-7)',
                        letterSpacing: '-0.5px',
                    }}
                >
                    Settings
                </motion.h1>

                {/* ── Profile Section ── */}
                <FloatingSection t={t} delay={0.05}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-6)',
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: 56, height: 56,
                            borderRadius: 'var(--radius-2xl)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--accent)',
                            color: '#fff',
                            fontSize: 22, fontWeight: 600,
                            flexShrink: 0,
                        }}>
                            {user ? user.username[0].toUpperCase() : 'U'}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: 17, fontWeight: 600,
                                color: t.textPrimary,
                            }}>
                                {user ? user.username : 'Guest'}
                            </div>
                            <div style={{
                                fontSize: 13, color: t.textSecondary,
                                marginTop: 2,
                                display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                                <Mail size={14} strokeWidth={1.75} />
                                {user ? user.email : 'guest@example.com'}
                            </div>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center', gap: 4,
                                marginTop: 'var(--space-2)',
                                padding: '3px 10px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 12, fontWeight: 600,
                                background: 'var(--accent-soft)',
                                color: 'var(--accent)',
                            }}>
                                <Sparkles size={12} strokeWidth={2} />
                                Free Plan
                            </div>
                        </div>

                        {/* Edit button */}
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                fontSize: 14, fontWeight: 600,
                                background: 'var(--accent-soft)',
                                color: 'var(--accent)',
                                cursor: 'pointer',
                            }}
                        >
                            Edit
                        </motion.button>
                    </div>
                </FloatingSection>

                {/* ── Appearance ── */}
                <FloatingSection label="Appearance" t={t} delay={0.1}>
                    <SettingsRow
                        icon={theme === 'dark' ? Moon : Sun}
                        title="Theme"
                        subtitle={`Currently using ${theme} mode`}
                        t={t}
                        isLast
                        action={
                            <motion.button
                                onClick={toggleTheme}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    fontSize: 13, fontWeight: 600,
                                    background: t.dropdownBg,
                                    color: t.textPrimary,
                                    cursor: 'pointer',
                                }}
                            >
                                {theme === 'dark' ? 'Light' : 'Dark'}
                            </motion.button>
                        }
                    />
                </FloatingSection>

                {/* ── Preferences ── */}
                <FloatingSection label="Preferences" t={t} delay={0.15}>
                    <SettingsRow
                        icon={notifications ? Bell : BellOff}
                        title="Notifications"
                        subtitle="Get notified when processing completes"
                        t={t}
                        action={<IOSToggle checked={notifications} onChange={setNotifications} />}
                    />
                    <SettingsRow
                        icon={Download}
                        title="Auto-save Projects"
                        subtitle="Automatically save your work"
                        t={t}
                        action={<IOSToggle checked={autoSave} onChange={setAutoSave} />}
                    />
                    <SettingsRow
                        icon={Zap}
                        title="High Quality Export"
                        subtitle="Export at maximum resolution"
                        t={t}
                        isLast
                        action={<IOSToggle checked={highQualityExport} onChange={setHighQualityExport} />}
                    />
                </FloatingSection>

                {/* ── Storage ── */}
                <FloatingSection label="Storage" footer="Manage your cloud storage and local cache." t={t} delay={0.2}>
                    <SettingsRow
                        icon={HardDrive}
                        title="Storage Used"
                        subtitle="2.4 GB of 5 GB"
                        showChevron
                        t={t}
                        isLast
                    />
                </FloatingSection>

                {/* ── Account ── */}
                <FloatingSection label="Account" t={t} delay={0.25}>
                    <SettingsRow
                        icon={Lock}
                        title="Privacy & Security"
                        showChevron
                        t={t}
                    />
                    <SettingsRow
                        icon={Info}
                        title="About FixPix"
                        subtitle="Version 1.0.0"
                        showChevron
                        t={t}
                        isLast
                    />
                </FloatingSection>

                {/* ── Danger Zone ── */}
                <FloatingSection t={t} delay={0.3}>
                    <SettingsRow
                        icon={LogOut}
                        title="Log Out"
                        destructive
                        onClick={logoutUser}
                        t={t}
                    />
                    <SettingsRow
                        icon={Trash2}
                        title="Delete Account"
                        subtitle="Permanently remove all data"
                        destructive
                        t={t}
                        isLast
                    />
                </FloatingSection>

            </div>
        </div>
    );
};

export default SettingsPage;
