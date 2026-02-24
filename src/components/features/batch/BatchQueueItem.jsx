import React from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMediaUrl } from '../../../lib/api';

const BatchQueueItem = ({ item, onRemove }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel p-3 rounded-xl flex items-center gap-4 group relative overflow-hidden"
        >
            {/* Status Line Indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'completed' ? 'bg-secondary' :
                item.status === 'processing' ? 'bg-primary animate-pulse' :
                    item.status === 'error' ? 'bg-red-500' :
                        'bg-gray-300 dark:bg-gray-600'
                }`} />

            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface border border-border-light relative">
                <img src={item.status === 'completed' ? item.resultUrl : item.preview} alt="preview" className="w-full h-full object-cover" />
                {item.status === 'processing' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-main truncate">{item.file.name}</p>
                <div className="flex items-center gap-2 text-xs mt-1">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${item.status === 'completed' ? 'bg-secondary/10 text-secondary' :
                        item.status === 'processing' ? 'bg-primary/10 text-primary' :
                            item.status === 'error' ? 'bg-red-500/10 text-red-500' :
                                'bg-gray-200 dark:bg-gray-700 text-text-secondary'
                        }`}>
                        {item.status.toUpperCase()}
                    </span>
                    <span className="text-text-secondary">{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {item.status === 'completed' && (
                    <a
                        href={getMediaUrl(item.resultUrl)}
                        download={`restored_${item.file.name}`}
                        className="p-2 rounded-full hover:bg-surface-highlight text-text-secondary hover:text-primary transition-colors"
                        title="Download Result"
                    >
                        <Download className="w-5 h-5" />
                    </a>
                )}

                {item.status !== 'processing' && (
                    <button
                        onClick={() => onRemove(item.id)}
                        className="p-2 rounded-full hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default BatchQueueItem;
