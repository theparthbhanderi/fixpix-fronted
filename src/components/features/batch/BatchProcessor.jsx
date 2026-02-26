import React from 'react';
import useBatchProcessor from '../../../hooks/useBatchProcessor';
import BatchUploader from './BatchUploader';
import BatchQueueItem from './BatchQueueItem';
import { Play, Trash2, DownloadCloud, XCircle, RefreshCw, CheckCircle, Layers, Zap, Clock, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/* ── Stat Card ─────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div style={{
        flex: 1, display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--fill-tertiary)',
    }}>
        <div style={{
            width: 34, height: 34, borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: color ? `${color}15` : 'var(--accent-soft)',
        }}>
            <Icon size={16} strokeWidth={2} style={{ color: color || 'var(--accent)' }} />
        </div>
        <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: color || 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
        </div>
    </div>
);

/* ── Action Button ─────────────────────────────────── */
const ActionBtn = ({ icon: Icon, label, onClick, disabled, variant = 'secondary', danger }) => (
    <motion.button
        whileTap={disabled ? {} : { scale: 0.97 }}
        onClick={onClick}
        disabled={disabled}
        style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', borderRadius: 'var(--radius-xl)',
            fontSize: 13, fontWeight: 600, border: 'none', cursor: disabled ? 'default' : 'pointer',
            opacity: disabled ? 0.4 : 1,
            transition: 'all 150ms',
            ...(variant === 'primary' ? {
                background: danger ? 'var(--error)' : 'var(--accent)',
                color: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            } : {
                background: 'var(--fill-tertiary)',
                color: 'var(--text-primary)',
            }),
        }}
    >
        <Icon size={15} strokeWidth={2} />
        {label}
    </motion.button>
);

/* ── Batch Processor ───────────────────────────────── */
const BatchProcessor = () => {
    const {
        queue,
        isBatchProcessing,
        progress,
        addToQueue,
        removeFromQueue,
        processQueue,
        cancelProcessing,
        retryFailed,
        clearQueue,
        clearCompleted
    } = useBatchProcessor();

    const pendingCount = queue.filter(i => i.status === 'pending').length;
    const completedCount = queue.filter(i => i.status === 'completed').length;
    const failedCount = queue.filter(i => i.status === 'error' || i.status === 'cancelled').length;
    const processingCount = queue.filter(i => i.status === 'processing').length;

    return (
        <div style={{
            width: '100%', minHeight: '100vh', overflowY: 'auto',
            padding: 'var(--space-9) var(--space-6)',
        }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        display: 'flex', alignItems: 'flex-start',
                        justifyContent: 'space-between', flexWrap: 'wrap',
                        gap: 12, marginBottom: 'var(--space-6)',
                    }}
                >
                    <div>
                        <h1 style={{
                            fontSize: 28, fontWeight: 700,
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.5px', margin: 0,
                        }}>
                            Batch Studio
                        </h1>
                        <p style={{
                            fontSize: 14, color: 'var(--text-secondary)',
                            margin: '4px 0 0',
                        }}>
                            Auto-enhance multiple photos at once
                        </p>
                    </div>

                    {queue.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {failedCount > 0 && !isBatchProcessing && (
                                <ActionBtn icon={RefreshCw} label={`Retry (${failedCount})`} onClick={retryFailed} />
                            )}
                            {completedCount > 0 && !isBatchProcessing && (
                                <ActionBtn icon={CheckCircle} label="Clear Done" onClick={clearCompleted} />
                            )}
                            <ActionBtn icon={Trash2} label="Clear All" onClick={clearQueue} disabled={isBatchProcessing} />
                            {isBatchProcessing ? (
                                <ActionBtn icon={XCircle} label="Cancel" onClick={cancelProcessing} variant="primary" danger />
                            ) : (
                                <ActionBtn
                                    icon={Play} label={`Process ${pendingCount}`}
                                    onClick={processQueue} disabled={pendingCount === 0} variant="primary"
                                />
                            )}
                        </div>
                    )}
                </motion.div>

                {/* ── Progress Bar ── */}
                <AnimatePresence>
                    {isBatchProcessing && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ marginBottom: 24, overflow: 'hidden' }}
                        >
                            <div style={{
                                borderRadius: 'var(--radius-xl)',
                                background: 'var(--surface)',
                                border: '1px solid var(--border-subtle)',
                                padding: '14px 18px',
                            }}>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', marginBottom: 10,
                                }}>
                                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                        Processing {processingCount} image{processingCount !== 1 ? 's' : ''}…
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
                                        {progress.completed}/{progress.total} ({progress.percentage}%)
                                    </span>
                                </div>
                                <div style={{
                                    height: 6, borderRadius: 3,
                                    background: 'var(--fill-tertiary)',
                                    overflow: 'hidden',
                                }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress.percentage}%` }}
                                        transition={{ duration: 0.3 }}
                                        style={{
                                            height: '100%', borderRadius: 3,
                                            background: 'linear-gradient(90deg, var(--accent), #5856D6)',
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Main Content ── */}
                <div className="batch-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.6fr)',
                    gap: 'var(--space-6)',
                    alignItems: 'flex-start',
                }}>

                    {/* Left Column: Uploader + Stats */}
                    <div>
                        <BatchUploader onUpload={addToQueue} />

                        {/* Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            style={{
                                marginTop: 16,
                                borderRadius: 'var(--radius-2xl)',
                                background: 'var(--surface)',
                                border: '1px solid var(--border-subtle)',
                                boxShadow: 'var(--depth-1)',
                                padding: 14,
                            }}
                        >
                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                            }}>
                                <StatCard icon={Layers} label="Total" value={queue.length} />
                                <StatCard icon={CheckCircle} label="Done" value={completedCount} color="#34C759" />
                                <StatCard icon={Zap} label="Active" value={processingCount} color="var(--accent)" />
                                <StatCard icon={Clock} label="Pending" value={pendingCount} />
                            </div>
                            {failedCount > 0 && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    marginTop: 8, padding: '8px 12px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'rgba(255,59,48,0.06)',
                                }}>
                                    <AlertCircle size={14} style={{ color: '#FF3B30' }} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#FF3B30' }}>
                                        {failedCount} failed
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Column: Queue */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        style={{
                            borderRadius: 'var(--radius-2xl)',
                            background: 'var(--surface)',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: 'var(--depth-1)',
                            padding: 18,
                            display: 'flex', flexDirection: 'column',
                            minHeight: 400,
                        }}
                    >
                        {/* Queue Header */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 14,
                        }}>
                            <h2 style={{
                                fontSize: 16, fontWeight: 650,
                                color: 'var(--text-primary)', margin: 0,
                            }}>
                                Queue
                            </h2>
                            <span style={{
                                fontSize: 11, fontWeight: 600,
                                color: isBatchProcessing ? 'var(--accent)' : 'var(--text-secondary)',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>
                                {isBatchProcessing
                                    ? `Processing ${processingCount} of ${progress.total}…`
                                    : queue.length > 0 ? 'Ready' : 'Empty'
                                }
                            </span>
                        </div>

                        {/* Queue Items */}
                        <div style={{
                            flex: 1, overflowY: 'auto',
                            display: 'flex', flexDirection: 'column', gap: 8,
                            paddingRight: 4,
                        }}>
                            <AnimatePresence>
                                {queue.map(item => (
                                    <BatchQueueItem
                                        key={item.id}
                                        item={item}
                                        onRemove={removeFromQueue}
                                    />
                                ))}
                            </AnimatePresence>

                            {queue.length === 0 && (
                                <div style={{
                                    flex: 1, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    opacity: 0.35, textAlign: 'center', padding: 40,
                                }}>
                                    <DownloadCloud size={48} strokeWidth={1} style={{ color: 'var(--text-secondary)', marginBottom: 12 }} />
                                    <p style={{ fontSize: 16, fontWeight: 550, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                                        Queue is empty
                                    </p>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                                        Upload images to get started
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Keyframes */}
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
                @media (max-width: 700px) {
                    .batch-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default BatchProcessor;
