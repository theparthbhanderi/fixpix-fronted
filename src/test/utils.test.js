/**
 * Example Test - Utility Functions
 */

import { describe, it, expect } from 'vitest';
import { formatFileSize, validateImageFile } from '../utils/imageCompression';


describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
        expect(formatFileSize(0)).toBe('0 Bytes');
        expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('formats kilobytes correctly', () => {
        expect(formatFileSize(1024)).toBe('1 KB');
        expect(formatFileSize(2560)).toBe('2.5 KB');
    });

    it('formats megabytes correctly', () => {
        expect(formatFileSize(1048576)).toBe('1 MB');
        expect(formatFileSize(5242880)).toBe('5 MB');
    });
});

describe('validateImageFile', () => {
    it('accepts valid image types', () => {
        const jpegFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        expect(validateImageFile(jpegFile).valid).toBe(true);

        const pngFile = new File([''], 'test.png', { type: 'image/png' });
        expect(validateImageFile(pngFile).valid).toBe(true);
    });

    it('rejects invalid file types', () => {
        const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
        const result = validateImageFile(pdfFile);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid file type');
    });
});
