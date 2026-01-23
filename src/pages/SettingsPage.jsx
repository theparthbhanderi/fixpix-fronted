import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import {
    Sun, Moon, Bell, BellOff, Eye, Download, Trash2, User, Mail, Shield,
    Palette, ChevronRight, LogOut, Sparkles, HardDrive, Info, Lock,
    CreditCard, Globe, Zap
} from 'lucide-react';



/**
 * iOS Settings Row Component with Colorful Icons
 */
const SettingsRow = ({
    icon: Icon,
    iconColor = 'rgb(0 122 255)',
    iconBg = 'rgb(0 122 255 / 0.12)',
    title,
    subtitle,
    action,
    showChevron = false,
    destructive = false,
    onClick
}) => (
    <motion.div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors"
        onClick={onClick}
        whileTap={{ backgroundColor: 'rgb(var(--ios-fill) / 0.08)' }}
        style={{ minHeight: '52px' }}
    >
        {/* Colorful Icon Container - SF Symbols Style */}
        <div
            className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center flex-shrink-0"
            style={{
                backgroundColor: destructive ? 'rgb(255 59 48 / 0.12)' : iconBg
            }}
        >
            <Icon
                className="w-[17px] h-[17px]"
                strokeWidth={1.75}
                style={{ color: destructive ? 'rgb(255 59 48)' : iconColor }}
            />
        </div>

        <div className="flex-1 min-w-0">
            <h4
                className="text-[16px] font-normal"
                style={{ color: destructive ? 'rgb(255 59 48)' : 'rgb(var(--ios-label))' }}
            >
                {title}
            </h4>
            {subtitle && (
                <p className="text-[13px] text-text-secondary truncate mt-0.5">{subtitle}</p>
            )}
        </div>

        {action}

        {showChevron && (
            <ChevronRight className="w-5 h-5 text-text-quaternary flex-shrink-0" strokeWidth={1.75} />
        )}
    </motion.div>
);

/**
 * iOS Settings Section Component
 */
const SettingsSection = ({ title, children, footer }) => (
    <div className="mb-6">
        {title && (
            <h3
                className="text-[13px] font-normal uppercase tracking-[0.3px] px-4 pb-2"
                style={{ color: 'rgb(var(--ios-label-secondary) / 0.6)' }}
            >
                {title}
            </h3>
        )}
        <div
            className="rounded-[12px] overflow-hidden divide-y"
            style={{
                backgroundColor: 'rgb(var(--ios-surface))',
                borderColor: 'rgb(var(--ios-separator) / 0.2)'
            }}
        >
            {React.Children.map(children, (child, index) => (
                <div style={{ borderColor: 'rgb(var(--ios-separator) / 0.15)' }}>
                    {child}
                </div>
            ))}
        </div>
        {footer && (
            <p className="text-[12px] text-text-tertiary px-4 pt-2">{footer}</p>
        )}
    </div>
);

const SettingsPage = () => {
    const { user, logoutUser } = useContext(AuthContext);

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
        <div
            className="p-6 md:p-8 w-full max-w-2xl mx-auto overflow-y-auto"
            style={{ backgroundColor: 'rgb(var(--ios-bg))' }}
        >
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ios-large-title text-text-main mb-8"
            >
                Settings
            </motion.h1>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
            >
                <SettingsSection>
                    <div className="flex items-center gap-4 p-4">
                        {/* Avatar with gradient */}
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[26px] font-semibold"
                            style={{
                                background: 'linear-gradient(135deg, rgb(0 122 255) 0%, rgb(88 86 214) 100%)'
                            }}
                        >
                            {user ? user.username[0].toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-[20px] font-semibold text-text-main">
                                {user ? user.username : 'Guest'}
                            </h2>
                            <p className="text-[15px] text-text-secondary flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-4 h-4" strokeWidth={1.5} />
                                {user ? user.email : 'guest@example.com'}
                            </p>
                            <span
                                className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-[12px] font-semibold"
                                style={{
                                    backgroundColor: 'rgb(var(--ios-accent) / 0.12)',
                                    color: 'rgb(var(--ios-accent))'
                                }}
                            >
                                <Sparkles className="w-3 h-3" strokeWidth={2} />
                                Free Plan
                            </span>
                        </div>
                    </div>
                </SettingsSection>
            </motion.div>

            {/* Appearance Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <SettingsSection title="Appearance">
                    <SettingsRow
                        icon={theme === 'dark' ? Moon : Sun}
                        iconColor={theme === 'dark' ? 'rgb(175 82 222)' : 'rgb(255 149 0)'}
                        iconBg={theme === 'dark' ? 'rgb(175 82 222 / 0.12)' : 'rgb(255 149 0 / 0.12)'}
                        title="Theme"
                        subtitle={`Currently using ${theme} mode`}
                        action={
                            <motion.button
                                onClick={toggleTheme}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1.5 rounded-[8px] text-[14px] font-medium transition-colors"
                                style={{
                                    backgroundColor: 'rgb(var(--ios-accent) / 0.12)',
                                    color: 'rgb(var(--ios-accent))'
                                }}
                            >
                                Switch
                            </motion.button>
                        }
                    />
                </SettingsSection>
            </motion.div>

            {/* Preferences Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <SettingsSection title="Preferences">
                    <SettingsRow
                        icon={notifications ? Bell : BellOff}
                        iconColor="rgb(255 59 48)"
                        iconBg="rgb(255 59 48 / 0.12)"
                        title="Notifications"
                        subtitle="Get notified when processing is complete"
                        action={<Toggle enabled={notifications} onChange={setNotifications} />}
                    />
                    <SettingsRow
                        icon={Download}
                        iconColor="rgb(52 199 89)"
                        iconBg="rgb(52 199 89 / 0.12)"
                        title="Auto-save Projects"
                        subtitle="Automatically save your work"
                        action={<Toggle enabled={autoSave} onChange={setAutoSave} />}
                    />
                    <SettingsRow
                        icon={Zap}
                        iconColor="rgb(255 204 0)"
                        iconBg="rgb(255 204 0 / 0.12)"
                        title="High Quality Export"
                        subtitle="Export images at maximum resolution"
                        action={<Toggle enabled={highQualityExport} onChange={setHighQualityExport} />}
                    />
                </SettingsSection>
            </motion.div>

            {/* Storage Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <SettingsSection title="Storage" footer="Manage your cloud storage and local cache.">
                    <SettingsRow
                        icon={HardDrive}
                        iconColor="rgb(90 200 250)"
                        iconBg="rgb(90 200 250 / 0.12)"
                        title="Storage Used"
                        subtitle="2.4 GB of 5 GB"
                        showChevron
                    />
                </SettingsSection>
            </motion.div>

            {/* Account Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
            >
                <SettingsSection title="Account">
                    <SettingsRow
                        icon={Lock}
                        iconColor="rgb(88 86 214)"
                        iconBg="rgb(88 86 214 / 0.12)"
                        title="Privacy & Security"
                        showChevron
                    />
                    <SettingsRow
                        icon={Info}
                        iconColor="rgb(142 142 147)"
                        iconBg="rgb(142 142 147 / 0.12)"
                        title="About FixPix"
                        subtitle="Version 1.0.0"
                        showChevron
                    />
                    <SettingsRow
                        icon={LogOut}
                        title="Log Out"
                        destructive
                        onClick={logoutUser}
                    />
                </SettingsSection>
            </motion.div>
        </div>
    );
};

export default SettingsPage;
