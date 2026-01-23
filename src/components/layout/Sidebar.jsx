import React, { useContext } from 'react';
import { ImageContext } from '../../context/ImageContext';
import Logo from '../ui/Logo';
import { Layers, Image as ImageIcon, Settings, SquareStack, Sun, Moon, Plus, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * iPadOS-Style Sidebar Navigation Item
 */
const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all duration-200",
            active
                ? "bg-primary/12 text-primary"
                : "text-text-secondary hover:bg-fill/8 active:bg-fill/12"
        )}
    >
        <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2 : 1.5} />
        <span className={cn(
            "flex-1 text-left text-[15px] tracking-[-0.2px]",
            active ? "font-semibold" : "font-normal"
        )}>
            {label}
        </span>
        {badge && (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-primary text-white">
                {badge}
            </span>
        )}
        {active && (
            <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <ChevronRight className="w-4 h-4 opacity-60" strokeWidth={2} />
            </motion.div>
        )}
    </motion.button>
);

/**
 * Section Header
 */
const SectionHeader = ({ children }) => (
    <div className="px-4 py-2 mt-2 mb-1">
        <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.5px]">
            {children}
        </span>
    </div>
);

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const { uploadImage, theme, toggleTheme } = useContext(ImageContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Close sidebar on route change for mobile
    React.useEffect(() => {
        if (window.innerWidth < 768 && onClose) {
            onClose();
        }
    }, [location.pathname]);

    const isActive = (path) => location.pathname.includes(path);

    const workspaceItems = [
        { icon: ImageIcon, label: 'Restoration', path: 'restoration' },
        { icon: Layers, label: 'My Projects', path: 'projects' },
        { icon: SquareStack, label: 'Batch Studio', path: 'batch', badge: 'New' },
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
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            <aside
                className={cn(
                    "fixed md:static inset-y-0 left-0 z-50 w-[260px] h-full flex flex-col border-r shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out bg-background",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
                style={{
                    backgroundColor: 'rgb(var(--ios-surface))',
                    borderColor: 'rgb(var(--ios-separator) / 0.2)'
                }}
            >
                {/* Logo Section */}
                <div className="px-5 py-5 border-b flex items-center justify-between" style={{ borderColor: 'rgb(var(--ios-separator) / 0.15)' }}>
                    <Logo />
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-1 text-text-secondary hover:text-text-main rounded-md"
                        aria-label="Close sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                {/* New Project Button */}
                <div className="px-4 pt-4 pb-2">
                    <motion.label
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[12px] cursor-pointer font-semibold text-[15px] tracking-[-0.2px] text-white transition-all"
                        style={{ backgroundColor: 'rgb(var(--ios-accent))' }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    uploadImage(e.target.files[0]);
                                    navigate('/app/restoration');
                                }
                            }}
                        />
                        <Plus className="w-5 h-5" strokeWidth={2} />
                        New Project
                    </motion.label>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-3 py-2 overflow-y-auto">
                    <SectionHeader>Workspace</SectionHeader>
                    <nav className="space-y-1">
                        {workspaceItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                badge={item.badge}
                                active={isActive(item.path)}
                                onClick={() => navigate(`/app/${item.path}`)}
                            />
                        ))}
                    </nav>

                    <SectionHeader>Account</SectionHeader>
                    <nav className="space-y-1">
                        <SidebarItem
                            icon={Settings}
                            label="Settings"
                            active={isActive('settings')}
                            onClick={() => navigate('/app/settings')}
                        />
                    </nav>
                </div>

                {/* Footer */}
                <div className="p-4 space-y-3 border-t" style={{ borderColor: 'rgb(var(--ios-separator) / 0.15)' }}>
                    {/* Theme Toggle */}
                    <motion.button
                        onClick={toggleTheme}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[15px] text-text-secondary transition-colors"
                        style={{ backgroundColor: 'rgb(var(--ios-fill) / 0.06)' }}
                        aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={theme}
                                initial={{ rotate: -30, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 30, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5 text-ios-orange" strokeWidth={1.5} />
                                ) : (
                                    <Moon className="w-5 h-5 text-ios-purple" strokeWidth={1.5} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                        <span>{theme === 'dark' ? "Light Mode" : "Dark Mode"}</span>
                    </motion.button>

                    {/* User Profile Card */}
                    <div
                        className="rounded-[12px] p-3 flex items-center gap-3"
                        style={{
                            backgroundColor: 'rgb(var(--ios-fill) / 0.06)',
                            border: '1px solid rgb(var(--ios-separator) / 0.1)'
                        }}
                    >
                        {/* Avatar */}
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[15px] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm ring-2 ring-white/10"
                        >
                            {user ? user.username[0].toUpperCase() : 'U'}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-text-main truncate">
                                {user ? user.username : 'Guest'}
                            </p>
                            <p className="text-[12px] text-text-secondary truncate">
                                {user?.email || 'Not signed in'}
                            </p>
                        </div>

                        {/* Logout Button */}
                        {user && (
                            <motion.button
                                onClick={logoutUser}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-full text-text-tertiary hover:text-error hover:bg-error/10 transition-colors"
                                title="Logout"
                                aria-label="Sign out of your account"
                            >
                                <LogOut className="w-4 h-4" strokeWidth={1.75} />
                            </motion.button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
