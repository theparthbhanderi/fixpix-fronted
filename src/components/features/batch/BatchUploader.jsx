import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const BatchUploader = ({ onUpload }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files);
        }
    };

    return (
        <motion.div
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileTap={{ scale: 0.99 }}
            style={{
                borderRadius: 'var(--radius-2xl)',
                border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border-subtle)'}`,
                background: isDragging ? 'var(--accent-soft)' : 'var(--surface)',
                padding: '40px 24px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                boxShadow: isDragging ? '0 0 0 4px var(--accent-soft)' : 'var(--depth-1)',
                transform: isDragging ? 'scale(1.01)' : 'scale(1)',
            }}
        >
            <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleChange}
            />

            {/* Icon */}
            <motion.div
                animate={isDragging ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                    width: 64, height: 64, borderRadius: 'var(--radius-xl)',
                    background: isDragging ? 'var(--accent)' : 'var(--accent-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                    transition: 'background 200ms ease',
                }}
            >
                <UploadCloud
                    size={28} strokeWidth={1.75}
                    style={{ color: isDragging ? 'white' : 'var(--accent)', transition: 'color 200ms' }}
                />
            </motion.div>

            <h3 style={{
                fontSize: 17, fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 6, letterSpacing: '-0.2px',
            }}>
                Drag & Drop Multiple Images
            </h3>
            <p style={{
                fontSize: 14, color: 'var(--text-secondary)',
                textAlign: 'center', lineHeight: 1.5, margin: 0,
            }}>
                Or click to browse · JPG, PNG supported
            </p>
            <span style={{
                fontSize: 12, color: 'var(--text-secondary)',
                opacity: 0.6, marginTop: 8,
            }}>
                Batch auto-enhancement ready
            </span>
        </motion.div>
    );
};

export default BatchUploader;
