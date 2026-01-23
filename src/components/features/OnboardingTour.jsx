import React, { useEffect, useContext, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { ImageContext } from '../../context/ImageContext';
import { useModal } from '../../context/ModalContext';
import WelcomeModalContent from './WelcomeModal';

/**
 * OnboardingTour Component
 * - On MOBILE: Uses the global modal system (ModalProvider) for reliable centering
 * - On DESKTOP: Uses driver.js for element highlighting tour
 */
const OnboardingTour = () => {
    const { selectedImage } = useContext(ImageContext);
    const { openModal, closeModal, isLayoutReady } = useModal();
    const [isMobile, setIsMobile] = useState(false);
    const [hasShownTour, setHasShownTour] = useState(false);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Main tour effect
    useEffect(() => {
        // Check if user has completed the tour before
        const hasCompletedTour = localStorage.getItem('fixpix_tour_completed');

        // Only show tour if:
        // 1. User hasn't completed it
        // 2. There's no image loaded (i.e., fresh session)
        // 3. Layout is ready
        // 4. Haven't shown in this session
        if (hasCompletedTour || selectedImage || !isLayoutReady || hasShownTour) return;

        // Mark as shown to prevent re-triggering
        setHasShownTour(true);

        // MOBILE: Use global modal system
        if (isMobile) {
            // Additional delay to ensure DOM is fully settled after navigation
            const timeoutId = setTimeout(() => {
                openModal(
                    <WelcomeModalContent
                        onClose={() => {
                            localStorage.setItem('fixpix_tour_completed', 'true');
                            closeModal();
                        }}
                        onGetStarted={() => {
                            localStorage.setItem('fixpix_tour_completed', 'true');
                            closeModal();
                        }}
                    />
                );
            }, 300);

            return () => clearTimeout(timeoutId);
        }

        // DESKTOP: Use driver.js for element highlighting
        const driverObj = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            overlayColor: 'rgba(0, 0, 0, 0.8)',
            stagePadding: 10,
            stageRadius: 12,
            popoverClass: 'fixpix-tour-popover',
            onDestroyStarted: () => {
                localStorage.setItem('fixpix_tour_completed', 'true');
                driverObj.destroy();
            },
            steps: [
                {
                    element: '[data-tour="upload-zone"]',
                    popover: {
                        title: '👋 Welcome to FixPix!',
                        description: 'Start by uploading an old or damaged photo here. Drag & drop or click to browse.',
                        side: 'bottom',
                        align: 'center'
                    }
                },
                {
                    element: '[data-tour="tools-panel"]',
                    popover: {
                        title: '🛠️ Your AI Toolbox',
                        description: 'Enable powerful features like Face Restoration, Colorization, and Background Removal.',
                        side: 'left',
                        align: 'center'
                    }
                },
                {
                    element: '[data-tour="generate-button"]',
                    popover: {
                        title: '⚡ Generate Magic',
                        description: 'Click "Generate" to apply your selected enhancements. Watch your photo transform!',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    element: '[data-tour="floating-dock"]',
                    popover: {
                        title: '🎛️ Quick Controls',
                        description: 'Access zoom, undo/redo, theme toggle, and download options from this floating dock.',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: '🚀 You\'re Ready!',
                        description: 'That\'s it! Start restoring your memories. Have fun!',
                    }
                }
            ]
        });

        driverObj.drive();

        return () => {
            driverObj.destroy();
        };
    }, [selectedImage, isLayoutReady, isMobile, hasShownTour, openModal, closeModal]);

    return null; // This component doesn't render anything visible
};

export default OnboardingTour;
