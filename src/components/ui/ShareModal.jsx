import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Copy, Check, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';
import Button from './Button';
import { ImageContext } from '../../context/ImageContext';
import { useToast } from './Toast';

const ShareModal = ({ isOpen, onClose }) => {
    const { processedImage, currentProject } = useContext(ImageContext);
    const [copied, setCopied] = useState(false);
    const toast = useToast();

    // Generate a shareable link (in production, this would be a real permalink)
    const shareUrl = `${window.location.origin}/share/${currentProject?.id || 'demo'}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const shareLinks = [
        {
            name: 'Twitter',
            icon: Twitter,
            name: 'Twitter',
            icon: Twitter,
            color: 'bg-ios-twitter/20 text-ios-twitter hover:bg-ios-twitter/30',
            url: `https://twitter.com/intent/tweet?text=Check out my restored photo!&url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-ios-facebook/20 text-ios-facebook hover:bg-ios-facebook/30',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'bg-ios-linkedin/20 text-ios-linkedin hover:bg-ios-linkedin/30',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-md bg-surface border border-separator/20 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-separator/20 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-text-main flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-primary" />
                                Share Your Creation
                            </h3>
                            <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Preview */}
                        {processedImage && (
                            <div className="p-4 bg-black/20">
                                <img
                                    src={processedImage}
                                    alt="Preview"
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            {/* Copy Link */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Share Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-text-main"
                                    />
                                    <Button
                                        variant={copied ? 'secondary' : 'primary'}
                                        onClick={handleCopyLink}
                                        className="flex-shrink-0"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Social Share */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 block">
                                    Share on Social
                                </label>
                                <div className="flex gap-3">
                                    {shareLinks.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${social.color}`}
                                        >
                                            <social.icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">{social.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-separator/20 bg-fill/5">
                            <p className="text-xs text-text-secondary text-center">
                                Anyone with the link can view this image
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
