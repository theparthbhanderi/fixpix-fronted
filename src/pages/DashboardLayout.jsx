import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);
    const location = useLocation();

    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const isRestorationRoute = location.pathname.includes('restoration');
    const isMobileRestoration = isMobile && isRestorationRoute;

    return (
        <div
            style={{
                display: isMobileRestoration ? 'block' : (isMobile ? 'flex' : 'grid'),
                flexDirection: isMobile ? 'column' : undefined,
                gridTemplateColumns: !isMobile && !isMobileRestoration ? 'auto 1fr' : undefined,
                gap: !isMobile ? 'var(--space-7)' : undefined,
                height: '100vh',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-primary)',
                maxWidth: '1600px',
                margin: '0 auto',
                width: '100%',
            }}
        >
            {/* Floating Sidebar — hidden on mobile restoration */}
            {!isMobileRestoration && (
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main
                className="flex flex-col relative"
                style={{
                    minWidth: 0,
                    flex: 1,
                    overflow: 'hidden',
                    height: '100%',
                }}
            >
                {/* Mobile Floating Header — glass pill */}
                {!isMobileRestoration && isMobile && (
                    <header
                        className="flex items-center justify-between z-40 mobile-header-bar"
                        style={{
                            height: '56px',
                            margin: 'var(--space-3)',
                            padding: '0 var(--space-4)',
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                            backdropFilter: 'blur(18px) saturate(140%)',
                            WebkitBackdropFilter: 'blur(18px) saturate(140%)',
                            position: 'sticky',
                            top: 0,
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            boxShadow: 'var(--depth-1)',
                            flexShrink: 0,
                        }}
                    >
                        {/* Hamburger */}
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setSidebarOpen(true)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-text-main hover:bg-fill-primary/5 transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" strokeWidth={1.75} />
                        </motion.button>

                        {/* Title */}
                        <span style={{ fontSize: '17px', fontWeight: 600 }} className="text-text-main">
                            FixPix
                        </span>

                        {/* User Avatar */}
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                            style={{ fontSize: '13px', fontWeight: 600, backgroundColor: 'var(--accent)' }}
                        >
                            U
                        </div>
                    </header>
                )}

                {/* Scrollable content */}
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
