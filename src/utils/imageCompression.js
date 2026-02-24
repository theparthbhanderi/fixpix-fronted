/**
 * Image Compression & Optimization Utilities for FixPix
 * 
 * Provides client-side image compression before upload to:
 * - Reduce upload time
 * - Reduce server processing load
 * - Improve user experience
 */

// Maximum dimensions for uploaded images
const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;
const DEFAULT_QUALITY = 0.85;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Compress and resize an image file before upload
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width (default: 4096)
 * @param {number} options.maxHeight - Maximum height (default: 4096)
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.85)
 * @param {function} options.onProgress - Progress callback (0-100)
 * @returns {Promise<{file: File, originalSize: number, compressedSize: number, wasResized: boolean}>}
 */
export async function compressImage(file, options = {}) {
    const {
        maxWidth = MAX_WIDTH,
        maxHeight = MAX_HEIGHT,
        quality = DEFAULT_QUALITY,
        onProgress = () => { }
    } = options;

    onProgress(10);

    // Skip compression for small files and non-image types
    if (!file.type.startsWith('image/')) {
        return { file, originalSize: file.size, compressedSize: file.size, wasResized: false };
    }

    // For very small files, skip compression
    if (file.size < 100 * 1024) { // Less than 100KB
        onProgress(100);
        return { file, originalSize: file.size, compressedSize: file.size, wasResized: false };
    }

    onProgress(20);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            onProgress(30);

            const img = new Image();
            img.onload = () => {
                onProgress(50);

                let { width, height } = img;
                let wasResized = false;

                // Calculate new dimensions maintaining aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                    wasResized = true;
                }

                onProgress(60);

                // Create canvas and draw resized image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                ctx.drawImage(img, 0, 0, width, height);

                onProgress(80);

                // Convert to blob
                const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                const outputQuality = mimeType === 'image/png' ? undefined : quality;

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'));
                            return;
                        }

                        onProgress(90);

                        // Create new file with same name
                        const compressedFile = new File(
                            [blob],
                            file.name,
                            { type: mimeType }
                        );

                        onProgress(100);

                        resolve({
                            file: compressedFile,
                            originalSize: file.size,
                            compressedSize: compressedFile.size,
                            wasResized,
                            dimensions: { width, height }
                        });
                    },
                    mimeType,
                    outputQuality
                );
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = event.target.result;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Format file size to human readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted string like "2.5 MB"
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validateImageFile(file) {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Supported: ${validTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`
        };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`
        };
    }

    return { valid: true };
}

/**
 * Get image dimensions from file
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => {
            URL.revokeObjectURL(img.src);
            reject(new Error('Failed to load image'));
        };
        img.src = URL.createObjectURL(file);
    });
}

export default {
    compressImage,
    formatFileSize,
    validateImageFile,
    getImageDimensions,
    MAX_WIDTH,
    MAX_HEIGHT,
    MAX_FILE_SIZE
};
