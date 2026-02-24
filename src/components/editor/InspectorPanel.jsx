import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import InspectorTabs from './InspectorTabs';
import PendingQueue from './PendingQueue';
import GenerateButton from './GenerateButton';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';

// Import new Tool Components
import {
    RestoreTools,
    EnhanceTools,
    CreateTools,
    AdjustTools
} from '../tools';

/**
 * InspectorPanel - Layer 3: Right-side Floating Tools Panel
 * 
 * Features:
 * - Glass morphism background
 * - Tab navigation (Restore, Enhance, Create, Adjust)
 * - Collapsible (380px → 64px)
 * - Scrollable content area
 * - Sticky Generate footer
 * - Controlled tab state via props (for keyboard shortcuts)
 * 
 * From EDITOR_REDESIGN_SPEC.md Section 2.1 & 7.2
 */
const InspectorPanel = ({
    onGenerate,
    isProcessing = false,
    activeTab: controlledActiveTab,
    onTabChange: controlledOnTabChange
}) => {
    // Support both controlled and uncontrolled modes
    const [internalTab, setInternalTab] = useState('restore');
    const activeTab = controlledActiveTab ?? internalTab;
    const setActiveTab = controlledOnTabChange ?? setInternalTab;

    const [isCollapsed, setIsCollapsed] = useState(false);

    const { pendingQueue, commitCommands } = useCommand();
    const { isGenerating } = useImage();

    // Tab content fade animation
    const contentVariants = {
        enter: { opacity: 0, y: 10 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    const handleGenerate = async () => {
        if (onGenerate) {
            await onGenerate();
        } else if (commitCommands) {
            await commitCommands();
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'restore':
                return <RestoreTools />;
            case 'enhance':
                return <EnhanceTools />;
            case 'create':
                return <CreateTools />;
            case 'adjust':
                return <AdjustTools />;
            default:
                return null;
        }
    };

    return (
        <motion.aside
            className={`inspector-panel ${isCollapsed ? 'collapsed' : ''}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{
                opacity: 1,
                scale: 1,
                width: isCollapsed ? 'var(--panel-collapsed)' : 'var(--panel-width)'
            }}
            transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
        >
            {/* Collapse Toggle */}
            <button
                style={{
                    position: 'absolute', left: 0, top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    width: 24, height: 48,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--glass-bg-solid)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                }}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <motion.div
                    animate={{ rotate: isCollapsed ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <ChevronLeft size={12} strokeWidth={2} />
                </motion.div>
            </button>

            {/* Tab Navigation */}
            <InspectorTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                collapsed={isCollapsed}
            />

            {/* Scrollable Content */}
            <div className="inspector-content" style={{ paddingTop: 10 }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={contentVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.15 }}
                    >
                        {!isCollapsed && renderTabContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pending Queue - Per EDITOR_TOOLS_SPEC.md Section 4 */}
            {!isCollapsed && (
                <AnimatePresence>
                    <PendingQueue />
                </AnimatePresence>
            )}

            {/* Sticky Generate Footer - Per EDITOR_TOOLS_SPEC.md Section 5 */}
            {!isCollapsed && (
                <div className="inspector-footer">
                    <GenerateButton />
                </div>
            )}
        </motion.aside>
    );
};

export default InspectorPanel;
