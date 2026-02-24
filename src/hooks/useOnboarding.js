/**
 * useOnboarding - Interactive onboarding tour hook using driver.js
 * 
 * Shows new users how to use the app with step-by-step highlights.
 */

import { useEffect, useCallback } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// Check if user has completed onboarding
const ONBOARDING_KEY = 'fixpix_onboarding_complete';

export const useOnboarding = () => {
    const hasCompletedOnboarding = () => {
        return localStorage.getItem(ONBOARDING_KEY) === 'true';
    };

    const markOnboardingComplete = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
    };

    const resetOnboarding = () => {
        localStorage.removeItem(ONBOARDING_KEY);
    };

    // Editor page tour
    const startEditorTour = useCallback(() => {
        const driverObj = driver({
            showProgress: true,
            animate: true,
            smoothScroll: true,
            allowClose: true,
            stagePadding: 10,
            popoverClass: 'fixpix-tour-popover',
            onDestroyStarted: () => {
                markOnboardingComplete();
                driverObj.destroy();
            },
            steps: [
                {
                    element: '[data-tour="upload-area"]',
                    popover: {
                        title: '📤 Upload Image',
                        description: 'Click here or drag & drop an old photo to start restoring it.',
                        side: 'bottom',
                        align: 'center'
                    }
                },
                {
                    element: '[data-tour="tools-panel"]',
                    popover: {
                        title: '🛠️ AI Tools',
                        description: 'Use these powerful AI tools to restore, colorize, and enhance your photos.',
                        side: 'left',
                        align: 'start'
                    }
                },
                {
                    element: '[data-tour="face-restoration"]',
                    popover: {
                        title: '👤 Face Restoration',
                        description: 'Enhance and restore facial details in old photos.',
                        side: 'left'
                    }
                },
                {
                    element: '[data-tour="colorize"]',
                    popover: {
                        title: '🎨 Colorize',
                        description: 'Add color to black & white photos with AI.',
                        side: 'left'
                    }
                },
                {
                    element: '[data-tour="generate-btn"]',
                    popover: {
                        title: '✨ Generate',
                        description: 'Click to apply all your selected enhancements.',
                        side: 'top'
                    }
                },
                {
                    element: '[data-tour="download-btn"]',
                    popover: {
                        title: '💾 Download',
                        description: 'Save your restored photo in high quality.',
                        side: 'top'
                    }
                }
            ]
        });

        driverObj.drive();
    }, []);

    // Dashboard tour
    const startDashboardTour = useCallback(() => {
        const driverObj = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: '[data-tour="sidebar"]',
                    popover: {
                        title: '📱 Navigation',
                        description: 'Access Editor, Projects, Batch Processing, and Settings here.',
                        side: 'right'
                    }
                },
                {
                    element: '[data-tour="projects"]',
                    popover: {
                        title: '📁 Your Projects',
                        description: 'All your saved restorations appear here.',
                        side: 'bottom'
                    }
                }
            ],
            onDestroyStarted: () => {
                markOnboardingComplete();
                driverObj.destroy();
            }
        });

        driverObj.drive();
    }, []);

    // Auto-start tour for new users
    const autoStartTour = useCallback((tourType = 'editor') => {
        if (!hasCompletedOnboarding()) {
            setTimeout(() => {
                if (tourType === 'editor') {
                    startEditorTour();
                } else {
                    startDashboardTour();
                }
            }, 1000); // Delay to let page load
        }
    }, [startEditorTour, startDashboardTour]);

    return {
        hasCompletedOnboarding,
        markOnboardingComplete,
        resetOnboarding,
        startEditorTour,
        startDashboardTour,
        autoStartTour
    };
};

export default useOnboarding;
