import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Wand2, Sparkles, Palette, SlidersHorizontal,
    Download, Undo2, Redo2, ChevronLeft, FilePlus2
} from 'lucide-react';

// Editor Components
import { StudioBackdrop, CanvasStage } from '../components/editor';

// Tool Panels
import { RestoreTools, EnhanceTools, CreateTools, AdjustTools } from '../components/tools';
import GenerateButton from '../components/editor/GenerateButton';
import PendingQueue from '../components/editor/PendingQueue';

// Core Features
import ImageWorkspace from '../components/features/ImageWorkspace';
import OnboardingTour from '../components/features/OnboardingTour';
import QuickStartModal from '../components/features/QuickStartModal';
import KeyboardShortcutsHelp from '../components/ui/KeyboardShortcutsHelp';
import ExportModal from '../components/features/ExportModal';

// Mobile Components
import FloatingCapsuleToolbar from '../components/mobile/FloatingCapsuleToolbar';
import MobileEditorHeader from '../components/mobile/MobileEditorHeader';


// Context
import { useCommand } from '../context/CommandContext';
import { useImage } from '../context/ImageContext';

// Hooks
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

import '../styles/studio-system.css';
import '../styles/mobile-overrides.css';
import '../styles/mobile-studio.css'; // Premium Dark Studio Theme

/* ────────────────────────────────────────────────────
   TAB DEFINITIONS
   ──────────────────────────────────────────────────── */
const tabs = [
    { id: 'create', label: 'Create', icon: Palette },
    { id: 'restore', label: 'Restore', icon: Wand2 },
    { id: 'enhance', label: 'Enhance', icon: Sparkles },
    { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal },
];

/* ────────────────────────────────────────────────────
   LEFT TOOLS PANEL — Full iOS-style sidebar
   All editing tools in one place
   ──────────────────────────────────────────────────── */
const LeftToolsPanel = ({
    activeTab, onTabChange,
    onExport, onGenerate, isProcessing,
}) => {
    const {
        undo, redo, canUndo, canRedo,
        showComparison, setShowComparison,
        originalImage, resetProject
    } = useImage();

    const hasImage = !!originalImage;

    const handleResetProject = () => {
        if (hasImage) {
            if (!window.confirm('Start a new project? Unsaved changes will be lost.')) return;
        }
        resetProject();
        onTabChange('create');
    };

    const activeIndex = tabs.findIndex(t => t.id === activeTab);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'restore': return <RestoreTools />;
            case 'enhance': return <EnhanceTools />;
            case 'create': return <CreateTools />;
            case 'adjust': return <AdjustTools />;
            default: return null;
        }
    };

    /* Adaptive segmented control transition */
    const segmentTransition = { duration: 0.22, ease: [0.4, 0, 0.2, 1] };

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
            style={{
                width: 340,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-2xl)',
                background: 'var(--glass-bg-solid)',
                backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--depth-2)',
                overflow: 'hidden',
            }}
        >
            {/* ─── Quick Actions Bar ───────────────── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-4)',
                padding: '0 var(--space-5)',
                height: 56,
                flexShrink: 0,
                borderBottom: '1px solid var(--glass-border)',
            }}>
                {[
                    { icon: Undo2, label: 'Undo', onClick: undo, disabled: !canUndo },
                    { icon: Redo2, label: 'Redo', onClick: redo, disabled: !canRedo },
                    { icon: Download, label: 'Export', onClick: onExport },
                    { icon: FilePlus2, label: 'New Project', onClick: handleResetProject },
                ].map((btn, i) => {
                    const Icon = btn.icon;
                    const isDisabled = isProcessing || btn.disabled;
                    return (
                        <motion.button
                            key={i}
                            onClick={btn.onClick}
                            disabled={isDisabled}
                            whileTap={!isDisabled ? { scale: 0.96 } : {}}
                            whileHover={!isDisabled ? { background: btn.danger ? 'rgba(255,59,48,0.08)' : 'rgba(0,122,255,0.08)' } : {}}
                            title={btn.label}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40, height: 40,
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                opacity: isDisabled ? 0.3 : btn.active ? 1 : 0.6,
                                transition: 'all 150ms ease',
                                background: btn.active ? 'rgba(0,122,255,0.08)' : 'transparent',
                                color: btn.danger && !isDisabled ? '#FF3B30' : btn.active ? '#007AFF' : 'inherit',
                            }}
                        >
                            <Icon size={20} strokeWidth={1.75} />
                        </motion.button>
                    );
                })}
            </div>

            {/* ─── Adaptive Segmented Tabs ───────────────── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                margin: '14px 12px',
                height: 56,
                flexShrink: 0,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-2)',
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: 'var(--depth-1)',
            }}
                className="adaptive-tabs-capsule"
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .dark .adaptive-tabs-capsule {
                        background: rgba(28,28,30,0.75) !important;
                        border-color: rgba(255,255,255,0.06) !important;
                        box-shadow: 0 12px 30px rgba(0,0,0,0.45), 0 1px 0 rgba(0,0,0,0.04) !important;
                    }
                `}} />
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            whileTap={{ scale: 0.97 }}
                            whileHover={!isActive ? { scale: 1.02, backgroundColor: 'rgba(0,0,0,0.04)' } : {}}
                            animate={{
                                width: isActive ? 'auto' : 40,
                                padding: isActive ? '0 16px' : '0',
                                opacity: isActive ? 1 : 0.7,
                                backgroundColor: isActive ? 'rgba(0,122,255,0.12)' : 'transparent',
                                color: isActive ? '#007AFF' : 'inherit',
                                boxShadow: isActive
                                    ? 'inset 0 0 0 1px rgba(0,122,255,0.15), 0 2px 8px rgba(0,122,255,0.08)'
                                    : 'none',
                            }}
                            transition={segmentTransition}
                            style={{
                                height: 40,
                                flexShrink: isActive ? 0 : 0,
                                flexGrow: isActive ? 1 : 0,
                                flexBasis: isActive ? 'auto' : '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <Icon
                                size={18}
                                strokeWidth={isActive ? 2 : 1.75}
                                style={{ flexShrink: 0 }}
                            />
                            <AnimatePresence mode="wait">
                                {isActive && (
                                    <motion.span
                                        key={tab.id + '-label'}
                                        initial={{ opacity: 0, width: 0, x: 4 }}
                                        animate={{ opacity: 1, width: 'auto', x: 0 }}
                                        exit={{ opacity: 0, width: 0, x: 4 }}
                                        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 500,
                                            overflow: 'hidden',
                                            display: 'inline-block',
                                        }}
                                    >
                                        {tab.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            {/* ─── Scrollable Tool Cards ─── */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px 18px 18px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.12 }}
                    >
                        {renderTabContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ─── Pending Queue ─── */}
            <AnimatePresence>
                <PendingQueue />
            </AnimatePresence>

            {/* ─── Generate Button (sticky footer) ─── */}
            <div style={{
                padding: '16px 18px 24px',
                borderTop: '1px solid var(--glass-border)',
            }}>
                <GenerateButton />
            </div>
        </motion.div>
    );
};

/* ────────────────────────────────────────────────────
   EDITOR CONTENT
   ──────────────────────────────────────────────────── */
const EditorContent = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [quickStartDone, setQuickStartDone] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [activeTab, setActiveTab] = useState('create');
    const navigate = useNavigate();

    const { commitCommands } = useCommand();
    const {
        originalImage, isGenerating, resetProject,
        undo, redo, canUndo, canRedo,
        zoom, setZoom,
        showComparison, setShowComparison
    } = useImage();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Smart tab switching: when user uploads an image, switch to Restore
    useEffect(() => {
        if (originalImage && activeTab === 'create') {
            setActiveTab('restore');
        }
    }, [originalImage]);

    const handleGenerate = async () => {
        if (commitCommands) await commitCommands();
    };
    const handleExport = () => setShowExportModal(true);
    const handleZoomIn = () => setZoom?.(Math.min((zoom || 1) + 0.25, 3));
    const handleZoomOut = () => setZoom?.(Math.max((zoom || 1) - 0.25, 0.5));
    const handleZoomReset = () => setZoom?.(1);
    const handleResetProject = () => {
        if (originalImage) {
            if (!window.confirm('Start a new project? Unsaved changes will be lost.')) return;
        }
        resetProject();
        setActiveTab('create');
    };

    // Cmd+N / Ctrl+N shortcut for new project
    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                handleResetProject();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [originalImage]);

    const { isPanning } = useKeyboardShortcuts({
        onUndo: undo, onRedo: redo,
        onSave: handleExport, onExport: handleExport,
        onProcess: handleGenerate,
        onCancel: () => setShowExportModal(false),
        onZoomIn: handleZoomIn, onZoomOut: handleZoomOut, onZoomReset: handleZoomReset,
        onTabChange: setActiveTab,
        enabled: !isMobile
    });

    /* ── MOBILE ── */
    if (isMobile) {
        return (
            <div className="fixed inset-0 flex flex-col mobile-studio-canvas">
                <MobileEditorHeader
                    title="FixPix"
                    onBack={() => navigate('/app')}
                    onExport={handleExport}
                    onReset={handleResetProject}
                />
                <div
                    className="flex-1 relative overflow-hidden flex items-center justify-center"
                    style={{
                        paddingTop: 56,
                        paddingLeft: 8,
                        paddingRight: 8,
                        paddingBottom: 62,
                    }}
                >
                    <ImageWorkspace />
                </div>
                <FloatingCapsuleToolbar onExport={handleExport} />
                <AnimatePresence>
                    {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
                </AnimatePresence>
            </div>
        );
    }

    /* ── DESKTOP — Left tools panel + Canvas (no right panel) ── */
    return (
        <div className={`w-full h-full flex-1 relative overflow-hidden ${isPanning ? 'cursor-grab' : ''}`}>

            {/* LAYER 0: Dark canvas backdrop */}
            <StudioBackdrop />

            {/* LAYER 1: Canvas Stage — full width minus left panel */}
            <div
                className="absolute inset-0 z-10 flex items-center justify-center"
                style={{
                    paddingTop: 24,
                    paddingBottom: 24,
                    paddingLeft: 24,
                    paddingRight: 392,
                }}
            >
                <CanvasStage
                    hasImage={!!originalImage}
                    isProcessing={isGenerating}
                >
                    <ImageWorkspace />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                        {quickStartDone && <OnboardingTour />}
                        <KeyboardShortcutsHelp />
                    </div>
                </CanvasStage>
            </div>

            {/* LAYER 2: Left Tools Panel — all editing tools here */}
            <div
                className="absolute z-30 pointer-events-none"
                style={{ top: 24, right: 24, bottom: 24 }}
            >
                <div className="pointer-events-auto h-full">
                    <LeftToolsPanel
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onExport={handleExport}
                        onGenerate={handleGenerate}
                        isProcessing={isGenerating}
                    />
                </div>
            </div>

            <QuickStartModal onClose={() => setQuickStartDone(true)} />
            <AnimatePresence>
                {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
            </AnimatePresence>
        </div>
    );
};

const EditorPage = () => <EditorContent />;

export default EditorPage;
