/**
 * Test Setup - Global configuration for Vitest tests
 */

import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
    }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock URL.createObjectURL
global.URL.createObjectURL = () => 'mock-url';
global.URL.revokeObjectURL = () => { };
