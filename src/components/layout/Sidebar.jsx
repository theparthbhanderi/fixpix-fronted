import React, { useContext } from 'react';
import { ImageContext } from '../../context/ImageContext';
import Logo from '../ui/Logo';
import { Layers, Image as ImageIcon, Settings, SquareStack, Sun, Moon, Plus, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─────────────────────────── MENU ITEM ─────────────────────────── */

const MenuItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center gap-3 relative transition-colors duration-200"
        style={{
            height: '44px',
            padding: '0 var(--space-3)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: active ? 'rgba(0, 122, 255, 0.08)' : 'transparent',
            color: active ? 'var(--accent)' : 'var(--text-secondary)',
        }}
    >
        {/* Active indicator line */}
        {active && (
            <div
                className="absolute left-0 top-1/2 -translate-y-1/2"
                style={{
                    width: '3px',
                    height: '20px',
                    borderRadius: '0 3px 3px 0',
                    backgroundColor: 'var(--accent)',
                }}
            />
        )}

        <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={active ? 2 : 1.75} />

        <span
            className="flex-1 text-left"
            style={{
                fontSize: '14px',
                fontWeight: active ? 600 : 500,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
        >
            {label}
        </span>

        {badge && (
            <span
                className="text-white uppercase"
                style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--accent)',
                    letterSpacing: '0.3px',
                }}
            >
                {badge}
            </span>
        )}
    </motion.button>
);

/* ─────────────────────────── SECTION LABEL ─────────────────────────── */

const SectionLabel = ({ label }) => (
    <div style={{ padding: '20px 12px 8px' }}>
        <span style={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'var(--text-tertiary)',
        }}>
            {label}
        </span>
    </div>
);

/* ─────────────────────────── USER PROFILE ─────────────────────────── */

const UserProfile = ({ user, onLogout }) => (
    <div
        className="flex items-center gap-2.5"
        style={{
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--fill-tertiary)',
        }}
    >
        <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white"
            style={{ fontSize: '14px', fontWeight: 600, backgroundColor: 'var(--accent)' }}
        >
            {user ? user.username[0].toUpperCase() : 'G'}
        </div>
        <div className="flex-1 min-w-0">
            <p className="truncate" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user ? user.username : 'Guest'}
            </p>
            <p className="truncate" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                {user?.email || 'Sign in'}
            </p>
        </div>
        {user && (
            <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onLogout}
                className="p-2 rounded-lg shrink-0 transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                aria-label="Sign out"
            >
                <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
            </motion.button>
        )}
    </div>
);

/* ═══════════════════════════ SIDEBAR ═══════════════════════════ */

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const { uploadImage, theme, toggleTheme } = useContext(ImageContext);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (window.innerWidth < 768 && onClose) onClose();
    }, [location.pathname]);

    const isActive = (path) => location.pathname.includes(path);

    const handleUpload = (e) => {
        if (e.target.files[0]) {
            uploadImage(e.target.files[0]);
            navigate('/app/restoration');
        }
    };

    const workspaceNav = [
        { icon: ImageIcon, label: 'Restore', path: 'restoration' },
        { icon: Layers, label: 'Projects', path: 'projects' },
        { icon: SquareStack, label: 'Batch', path: 'batch', badge: 'New' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 md:hidden mobile-sidebar-overlay"
                        style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
                    />
                )}
            </AnimatePresence>

            {/* Floating Sidebar Panel */}
            <aside
                className="fixed md:sticky inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 ease-out mobile-sidebar-drawer"
                style={{
                    width: '260px',
                    transform: isOpen ? 'translateX(0)' : (typeof window !== 'undefined' && window.innerWidth < 768 ? 'translateX(-100%)' : 'translateX(0)'),
                    /* Solid floating surface */
                    margin: '24px 0 24px 24px',
                    top: '24px',
                    height: 'calc(100vh - 48px)',
                    alignSelf: 'start',
                    borderRadius: 'var(--radius-2xl)',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--depth-2)',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between" style={{ padding: '24px 24px 12px' }}>
                    <Logo />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="md:hidden p-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                        aria-label="Close menu"
                    >
                        <X className="w-[18px] h-[18px]" strokeWidth={2} />
                    </motion.button>
                </div>

                {/* New Project Button */}
                <div style={{ padding: '8px 16px 4px', marginTop: '20px' }}>
                    <motion.label
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2 text-white cursor-pointer"
                        style={{
                            height: '44px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '14px',
                            fontWeight: 600,
                            backgroundColor: 'var(--accent)',
                        }}
                    >
                        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                        <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
                        <span>New Project</span>
                    </motion.label>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto" style={{ padding: '0 var(--space-3)', marginTop: 'var(--space-4)' }}>
                    <SectionLabel label="Workspace" />
                    <div className="space-y-1">
                        {workspaceNav.map((item) => (
                            <MenuItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                badge={item.badge}
                                active={isActive(item.path)}
                                onClick={() => navigate(`/app/${item.path}`)}
                            />
                        ))}
                    </div>

                    <SectionLabel label="Account" />
                    <div className="space-y-1">
                        <MenuItem
                            icon={Settings}
                            label="Settings"
                            active={isActive('settings')}
                            onClick={() => navigate('/app/settings')}
                        />
                    </div>
                </nav>

                {/* Footer */}
                <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                    {/* Theme Toggle */}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-center gap-2 mb-2 transition-colors"
                        style={{
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '13px',
                            fontWeight: 500,
                            backgroundColor: 'var(--fill-tertiary)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={theme}
                                initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 20, opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </motion.span>
                        </AnimatePresence>
                        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </motion.button>

                    <UserProfile user={user} onLogout={logoutUser} />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;