import React from 'react';
import useBatchProcessor from '../../../hooks/useBatchProcessor';
import BatchUploader from './BatchUploader';
import BatchQueueItem from './BatchQueueItem';
import Button from '../../ui/Button';
import { Play, Trash2, DownloadCloud, XCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
        <div className="flex-1 h-full bg-background overflow-hidden flex flex-col p-8 batch-page-container">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">Batch Studio</h1>
                    <p className="text-text-secondary">Auto-enhance multiple photos at once. <span className="text-primary">3 images processed simultaneously.</span></p>
                </div>

                {queue.length > 0 && (
                    <div className="flex gap-3">
                        {failedCount > 0 && !isBatchProcessing && (
                            <Button
                                variant="secondary"
                                onClick={retryFailed}
                                icon={RefreshCw}
                            >
                                Retry Failed ({failedCount})
                            </Button>
                        )}
                        {completedCount > 0 && !isBatchProcessing && (
                            <Button
                                variant="secondary"
                                onClick={clearCompleted}
                                icon={CheckCircle}
                            >
                                Clear Done
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            onClick={clearQueue}
                            disabled={isBatchProcessing}
                            icon={Trash2}
                        >
                            Clear All
                        </Button>
                        {isBatchProcessing ? (
                            <Button
                                variant="primary"
                                onClick={cancelProcessing}
                                icon={XCircle}
                                className="bg-red-500 hover:bg-red-600 border-red-500"
                            >
                                Cancel
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={processQueue}
                                disabled={pendingCount === 0}
                                icon={Play}
                                className="shadow-neon"
                            >
                                Process {pendingCount} Images
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {isBatchProcessing && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-secondary">
                            Processing {processingCount} image{processingCount !== 1 ? 's' : ''}...
                        </span>
                        <span className="text-primary font-bold">
                            {progress.completed}/{progress.total} ({progress.percentage}%)
                        </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.percentage}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </motion.div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-8">
                {/* Left: Uploader */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                    <BatchUploader onUpload={addToQueue} />

                    {/* Stats Card */}
                    <div className="mt-6 glass-panel p-6 rounded-2xl">
                        <h3 className="font-bold text-text-main mb-4">Session Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Total Images</span>
                                <span className="font-bold text-text-main">{queue.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Completed</span>
                                <span className="font-bold text-secondary">{completedCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Processing</span>
                                <span className="font-bold text-primary">{processingCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Pending</span>
                                <span className="font-bold text-text-muted">{pendingCount}</span>
                            </div>
                            {failedCount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Failed</span>
                                    <span className="font-bold text-red-400">{failedCount}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Queue Grid */}
                <div className="flex-1 glass-panel rounded-3xl p-6 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-text-main">Queue</h2>
                        <span className="text-xs text-text-secondary uppercase tracking-wider font-bold">
                            {isBatchProcessing
                                ? `Processing ${processingCount} of ${progress.total}...`
                                : queue.length > 0 ? 'Ready' : 'Empty'
                            }
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
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
                            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                                <DownloadCloud className="w-16 h-16 mb-4" />
                                <p className="text-xl font-medium">Queue is empty</p>
                                <p className="text-sm">Upload images to get started</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchProcessor;
