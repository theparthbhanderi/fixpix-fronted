/**
 * Analytics Hook - Track user events
 * 
 * Integrates with Google Analytics, PostHog, or custom analytics.
 * Configure analytics provider via environment variables.
 */

import { useCallback, useEffect } from 'react';

// Analytics providers
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;

// Initialize analytics on load
let analyticsInitialized = false;

const initAnalytics = () => {
    if (analyticsInitialized) return;

    // Google Analytics 4
    if (GA_TRACKING_ID && typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_TRACKING_ID);
    }

    analyticsInitialized = true;
};

export const useAnalytics = () => {
    useEffect(() => {
        initAnalytics();
    }, []);

    // Track page views
    const trackPageView = useCallback((pagePath, pageTitle) => {
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: pagePath,
                page_title: pageTitle
            }
    }, []);

    // Track custom events
    const trackEvent = useCallback((eventName, params = {}) => {
        if (window.gtag) {
            window.gtag('event', eventName, params);
        }
    }, []);

    // Pre-defined events for FixPix
    const events = {
        // Auth events
        signUp: () => trackEvent('sign_up', { method: 'email' }),
        login: () => trackEvent('login', { method: 'email' }),

        // Image processing events
        imageUpload: () => trackEvent('image_upload'),
        imageProcess: (settings) => trackEvent('image_process', {
            colorize: settings?.colorize ? 1 : 0,
            restore: settings?.faceRestoration ? 1 : 0,
            upscale: settings?.upscaleX || 1
        }),
        imageDownload: (format) => trackEvent('image_download', { format }),

        // Subscription events
        viewPricing: () => trackEvent('view_pricing'),
        startCheckout: (plan) => trackEvent('begin_checkout', { plan }),
        completeSubscription: (plan) => trackEvent('purchase', { plan, currency: 'USD' }),

        // Feature usage
        batchProcess: (count) => trackEvent('batch_process', { image_count: count }),
        useFilter: (filter) => trackEvent('use_filter', { filter_name: filter }),

        // Engagement
        shareImage: (platform) => trackEvent('share', { method: platform }),
        viewTutorial: (tutorialId) => trackEvent('view_tutorial', { tutorial_id: tutorialId }),
    };

    return {
        trackPageView,
        trackEvent,
        events
    };
};

export default useAnalytics;
