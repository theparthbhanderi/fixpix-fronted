/**
 * API and Utils Tests
 */

import { describe, it, expect } from 'vitest';
import { cn, formatBytes, generateId, debounce, throttle, sleep } from '../lib/utils';
import { API_URL, apiEndpoints, getMediaUrl } from '../lib/api';

describe('cn (className utility)', () => {
    it('merges class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
        expect(cn('base', true && 'active', false && 'inactive')).toBe('base active');
    });

    it('deduplicates Tailwind classes', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });
});

describe('formatBytes', () => {
    it('formats bytes correctly', () => {
        expect(formatBytes(0)).toBe('0 Bytes');
        expect(formatBytes(500)).toBe('500 Bytes');
    });

    it('formats kilobytes correctly', () => {
        expect(formatBytes(1024)).toBe('1 KB');
        expect(formatBytes(2560)).toBe('2.5 KB');
    });

    it('formats megabytes correctly', () => {
        expect(formatBytes(1048576)).toBe('1 MB');
        expect(formatBytes(5242880)).toBe('5 MB');
    });

    it('respects decimal places', () => {
        expect(formatBytes(1536, 0)).toBe('2 KB');
        expect(formatBytes(1536, 1)).toBe('1.5 KB');
    });
});

describe('generateId', () => {
    it('generates unique IDs', () => {
        const id1 = generateId();
        const id2 = generateId();
        expect(id1).not.toBe(id2);
    });

    it('returns a string', () => {
        expect(typeof generateId()).toBe('string');
    });
});

describe('sleep', () => {
    it('returns a promise', () => {
        expect(sleep(10)).toBeInstanceOf(Promise);
    });
});

describe('API Configuration', () => {
    it('has API_URL defined', () => {
        expect(API_URL).toBeDefined();
        expect(typeof API_URL).toBe('string');
    });

    it('apiEndpoints has required endpoints', () => {
        expect(apiEndpoints.token).toBeDefined();
        expect(apiEndpoints.register).toBeDefined();
        expect(apiEndpoints.images).toBeDefined();
    });

    it('processImage returns correct URL', () => {
        expect(apiEndpoints.processImage(123)).toContain('/123/process');
    });
});

describe('getMediaUrl', () => {
    it('returns null for null/undefined', () => {
        expect(getMediaUrl(null)).toBe(null);
        expect(getMediaUrl(undefined)).toBe(null);
    });

    it('returns full URL as-is', () => {
        expect(getMediaUrl('https://example.com/img.jpg')).toBe('https://example.com/img.jpg');
    });

    it('prepends MEDIA_URL to relative paths', () => {
        const result = getMediaUrl('/media/test.jpg');
        expect(result).toContain('/media/test.jpg');
    });
});
