import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Context for modal state management
const ModalContext = createContext(null);

/**
 * Global Modal Provider
 * Manages modal state and provides a single overlay system.
 * All modals must use this provider to render.
 */
export const ModalProvider = ({ children }) => {
    const [modalContent, setModalContent] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    // Wait for initial layout to be ready
    useEffect(() => {
        // Use double rAF to ensure layout is painted
        let rafId1, rafId2;
        rafId1 = requestAnimationFrame(() => {
            rafId2 = requestAnimationFrame(() => {
                setIsLayoutReady(true);
            });
        });
        return () => {
            cancelAnimationFrame(rafId1);
            cancelAnimationFrame(rafId2);
        };
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
            }
        }
    }, [isOpen]);

    const openModal = useCallback((content) => {
        // Only open if layout is ready
        if (!isLayoutReady) {
            // Defer opening until layout is ready
            const checkReady = setInterval(() => {
                if (isLayoutReady) {
                    clearInterval(checkReady);
                    setModalContent(content);
                    setIsOpen(true);
                }
            }, 50);
            return;
        }
        setModalContent(content);
        setIsOpen(true);
    }, [isLayoutReady]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        // Clear content after animation
        setTimeout(() => setModalContent(null), 300);
    }, []);

    return (
        <ModalContext.Provider value={{ openModal, closeModal, isOpen, isLayoutReady }}>
            {children}
            {/* Global Modal Portal Root */}
            <ModalPortal isOpen={isOpen} onClose={closeModal}>
                {modalContent}
            </ModalPortal>
        </ModalContext.Provider>
    );
};

/**
 * Modal Portal Component
 * Renders modal content in a fixed overlay using React Portal.
 * Uses flexbox centering - no transforms.
 */
const ModalPortal = ({ isOpen, onClose, children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen || !children) return null;

    // Get or create portal root
    let portalRoot = document.getElementById('modal-root');
    if (!portalRoot) {
        portalRoot = document.createElement('div');
        portalRoot.id = 'modal-root';
        document.body.appendChild(portalRoot);
    }

    return createPortal(
        <div
            className="modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                padding: 'env(safe-area-inset-top, 16px) 16px env(safe-area-inset-bottom, 16px) 16px',
                boxSizing: 'border-box',
            }}
        >
            <div
                className="modal-content-wrapper"
                style={{
                    position: 'relative',
                    width: 'min(92vw, 400px)',
                    maxHeight: 'calc(100dvh - env(safe-area-inset-top, 20px) - env(safe-area-inset-bottom, 20px) - 40px)',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--depth-3)',
                    padding: 'var(--space-6)',
                    boxSizing: 'border-box',
                }}
            >
                {children}
            </div>
        </div>,
        portalRoot
    );
};

/**
 * Hook to use modal context
 */
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export default ModalProvider;
