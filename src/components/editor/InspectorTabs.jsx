import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Palette, SlidersHorizontal } from 'lucide-react';

/**
 * InspectorTabs — Micro-polished
 *
 * Tab height: 48px
 * Icon: 18px
 * Label: 11px uppercase
 * Active: accent underline 2px, opacity 100
 * Inactive: opacity 60
 * Gap: 24px (implicit via equal flex)
 */

const tabs = [
    { id: 'restore', label: 'Restore', icon: Wand2 },
    { id: 'enhance', label: 'Enhance', icon: Sparkles },
    { id: 'create', label: 'Create', icon: Palette },
    { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal },
];

const InspectorTabs = ({ activeTab, onTabChange, collapsed = false }) => {
    const activeIndex = tabs.findIndex(t => t.id === activeTab);

    const styleBlock = `
      .inspector-tabs-capsule {
        display: flex;
        position: sticky;
        top: 12px;
        z-index: 20;
        margin: 14px 14px 14px 14px;
        height: 56px;
        border-radius: 16px;
        padding: 6px;
        gap: 6px;
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(0,0,0,0.04);
      }

      .dark .inspector-tabs-capsule {
        background: rgba(28, 28, 30, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(0,0,0,0.04);
      }

      .inspector-tab-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px 16px;
        background: transparent;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        opacity: 0.6;
        color: inherit;
        transition: all 160ms ease;
      }

      .inspector-tab-btn.active {
        opacity: 1;
        background: rgba(0, 122, 255, 0.12);
        color: var(--ios-accent, #007AFF);
        box-shadow: inset 0 0 0 1px rgba(0, 122, 255, 0.15);
      }

      @media (hover: hover) {
        .inspector-tab-btn:hover:not(.active) {
          opacity: 0.8;
          background: rgba(0, 0, 0, 0.04);
        }
        .dark .inspector-tab-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
        }
      }
    `;

    return (
        <>
        <style dangerouslySetInnerHTML={{ __html: styleBlock }} />
        <div className="inspector-tabs-capsule">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <motion.button
                        key={tab.id}
                        className={`inspector-tab-btn ${isActive ? 'active' : ''}`}
                        onClick={(e) => {
                            onTabChange(tab.id);
                        }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.12 }}
                    >
                        <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
                        {!collapsed && (
                            <AnimatePresence mode="wait">
                                <motion.span 
                                    key={tab.id + "-label"}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 8 }}
                                    transition={{ duration: 0.12 }}
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 500,
                                    }}
                                >
                                    {tab.label}
                                </motion.span>
                            </AnimatePresence>
                        )}
                    </motion.button>
                );
            })}
        </div>
        </>
    );
};

export default InspectorTabs;
