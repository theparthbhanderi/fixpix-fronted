import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sliders } from 'lucide-react';
import ToolsPanel from '../components/layout/ToolsPanel';
import ImageWorkspace from '../components/features/ImageWorkspace';
import OnboardingTour from '../components/features/OnboardingTour';
import QuickStartModal from '../components/features/QuickStartModal';
import KeyboardShortcutsHelp from '../components/ui/KeyboardShortcutsHelp';
import MobileToolsSheet from '../components/features/MobileToolsSheet';
import FloatingActionButton from '../components/ui/FloatingActionButton';

const EditorPage = () => {
    const [showTools, setShowTools] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileTools, setShowMobileTools] = useState(false);
    const [quickStartDone, setQuickStartDone] = useState(false);

    // Check if mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="w-full h-full bg-background overflow-hidden relative flex">
            {/* Onboarding Tour - Only runs after QuickStart is dismissed/seen */}
            {quickStartDone && <OnboardingTour />}

            {/* First-time user onboarding */}
            <QuickStartModal onClose={() => setQuickStartDone(true)} />

            {/* Keyboard Shortcuts Modal (opens with ? key) */}
            <KeyboardShortcutsHelp />

            {/* ImageWorkspace takes full space */}
            <div className="flex-1 h-full relative" data-tour="upload-zone">
                <ImageWorkspace
                    isPanelOpen={!isMobile && showTools}
                    togglePanel={() => isMobile ? setShowMobileTools(true) : setShowTools(!showTools)}
                />
            </div>

            {/* Desktop: ToolsPanel on side */}
            {!isMobile && (
                <div
                    className={`h-full transition-all duration-300 ${showTools ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full absolute right-0'}`}
                    data-tour="tools-panel"
                >
                    <ToolsPanel />
                </div>
            )}

            {/* Mobile: Floating Action Button to open tools */}
            <AnimatePresence>
                {isMobile && !showMobileTools && (
                    <FloatingActionButton
                        icon={Sliders}
                        onClick={() => setShowMobileTools(true)}
                        label="Tools"
                        variant="primary"
                        position="bottom-right"
                    />
                )}
            </AnimatePresence>

            {/* Mobile: Dedicated Mobile Tools Sheet */}
            <MobileToolsSheet
                isOpen={isMobile && showMobileTools}
                onClose={() => setShowMobileTools(false)}
            />
        </div>
    );
};

export default EditorPage;



