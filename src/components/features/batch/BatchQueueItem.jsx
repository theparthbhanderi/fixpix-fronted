import React from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMediaUrl } from '../../../lib/api';

const statusConfig = {
    completed: {
        color: '#34C759',
        bg: 'rgba(52,199,89,0.1)',
        label: '✓ Done',
        barColor: '#34C759',
    },
    processing: {
        color: 'var(--accent)',
        bg: 'var(--accent-soft)',
        label: 'Processing',
        barColor: 'var(--accent)',
    },
    error: {
        color: '#FF3B30',
        bg: 'rgba(255,59,48,0.1)',
        label: 'Failed',
        barColor: '#FF3B30',
    },
    cancelled: {
        color: '#FF9500',
        bg: 'rgba(255,149,0,0.1)',
        label: 'Cancelled',
        barColor: '#FF9500',
    },
    pending: {
        color: 'var(--text-secondary)',
        bg: 'var(--fill-tertiary)',
        label: 'Pending',
        barColor: 'var(--border-subtle)',
    },
};

const BatchQueueItem = ({ item, onRemove }) => {
    const config = statusConfig[item.status] || statusConfig.pending;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
            style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                position: 'relative', overflow: 'hidden',
            }}
        >
            {/* Status bar */}
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: config.barColor,
                borderRadius: '0 2px 2px 0',
                animation: item.status === 'processing' ? 'pulse 1.5s ease-in-out infinite' : 'none',
            }} />

            {/* Thumbnail */}
            <div style={{
                width: 52, height: 52, borderRadius: 'var(--radius-lg)',
                overflow: 'hidden', flexShrink: 0,
                border: '1px solid var(--border-subtle)',
                position: 'relative',
            }}>
                <img
                    src={item.status === 'completed' && item.resultUrl ? item.resultUrl : item.preview}
                    alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {item.status === 'processing' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.45)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Loader2 size={18} style={{ color: 'white', animation: 'spin 1s linear infinite' }} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: 14, fontWeight: 550,
                    color: 'var(--text-primary)', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    {item.file.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                    <span style={{
                        fontSize: 11, fontWeight: 600,
                        padding: '1px 7px', borderRadius: 'var(--radius-sm)',
                        background: config.bg, color: config.color,
                    }}>
                        {config.label}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        {(item.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {item.status === 'completed' && item.resultUrl && (
                    <a
                        href={getMediaUrl(item.resultUrl)}
                        download={`restored_${item.file.name}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--accent)', background: 'var(--accent-soft)',
                            border: 'none', cursor: 'pointer', textDecoration: 'none',
                        }}
                    >
                        <Download size={15} strokeWidth={2} />
                    </a>
                )}

                {item.status !== 'processing' && (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRemove(item.id)}
                        style={{
                            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-secondary)',
                            background: 'transparent',
                            border: 'none', cursor: 'pointer',
                            transition: 'all 150ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#FF3B30'; e.currentTarget.style.background = 'rgba(255,59,48,0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <X size={16} strokeWidth={2} />
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default BatchQueueItem;
