import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FolderOpen, Image, Sparkles, Upload, Plus, Wand2, Palette, Maximize2 } from 'lucide-react';
import Button from './Button';
import { cn } from '../../lib/utils';

/**
 * EmptyState - iOS Style Empty States with Enhanced Visuals
 */

const EmptyState = ({
    icon: Icon = FolderOpen,
    title = "No items found",
    description = "Get started by creating something new.",
    action,
    actionLabel = "Create New",
    actionTo,
    secondaryAction,
    secondaryLabel,
    showQuickActions = false,
    className
}) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
            "flex flex-col items-center justify-center py-16 px-6 text-center",
            className
        )}
    >
        {/* Animated Icon with Gradient Background */}
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
            className="relative mb-6"
        >
            {/* Glow effect - Softened */}
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-primary/10 blur-2xl opacity-60" />
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10">
                <Icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
        </motion.div>

        {/* Text */}
        <motion.h3
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="ios-title2 text-text-main mb-2"
        >
            {title}
        </motion.h3>
        <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-ios-subhead text-text-secondary max-w-md mb-6"
        >
            {description}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-3 justify-center"
        >
            {(action || actionTo) && (
                actionTo ? (
                    <Link to={actionTo}>
                        <Button variant="filled" icon={Plus}>
                            {actionLabel}
                        </Button>
                    </Link>
                ) : (
                    <Button variant="filled" onClick={action} icon={Plus}>
                        {actionLabel}
                    </Button>
                )
            )}
            {secondaryAction && (
                <Button variant="gray" onClick={secondaryAction}>
                    {secondaryLabel}
                </Button>
            )}
        </motion.div>

        {/* Quick Actions Grid */}
        {showQuickActions && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-10 grid grid-cols-3 gap-4 max-w-md"
            >
                <QuickActionCard
                    icon={Wand2}
                    label="Restore"
                    color="text-ios-purple"
                    bgColor="bg-ios-purple/10"
                />
                <QuickActionCard
                    icon={Palette}
                    label="Colorize"
                    color="text-ios-orange"
                    bgColor="bg-ios-orange/10"
                />
                <QuickActionCard
                    icon={Maximize2}
                    label="Upscale"
                    color="text-ios-green"
                    bgColor="bg-ios-green/10"
                />
            </motion.div>
        )}
    </motion.div>
);

/**
 * Quick Action Card for empty state
 */
const QuickActionCard = ({ icon: Icon, label, color, bgColor }) => (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface border border-separator/10 hover:border-separator/30 transition-colors cursor-pointer">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", bgColor)}>
            <Icon className={cn("w-5 h-5", color)} strokeWidth={1.75} />
        </div>
        <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
);

// Pre-built empty states

const EmptyProjects = () => (
    <EmptyState
        icon={FolderOpen}
        title="No projects yet"
        description="Start restoring your first photo to see your work history here. Your projects are automatically saved."
        actionTo="/app/restoration"
        actionLabel="Create First Project"
        showQuickActions={true}
    />
);

const EmptyImages = () => (
    <EmptyState
        icon={Image}
        title="No image selected"
        description="Upload an image to start editing and enhancing with AI-powered tools."
        actionLabel="Upload Image"
    />
);

const EmptyBatch = ({ onUpload }) => (
    <EmptyState
        icon={Upload}
        title="No images in queue"
        description="Add multiple images to process them all at once. Perfect for batch restoration."
        action={onUpload}
        actionLabel="Add Images"
    />
);

const EmptySearch = ({ query }) => (
    <EmptyState
        icon={Sparkles}
        title="No results found"
        description={`We couldn't find anything matching "${query}". Try a different search term.`}
    />
);

const EmptyDashboard = ({ onUpload }) => (
    <EmptyState
        icon={Sparkles}
        title="Welcome to FixPix!"
        description="Start by uploading your first image. Our AI will help you restore, enhance, and upscale your photos."
        action={onUpload}
        actionLabel="Upload Your First Image"
        showQuickActions={true}
    />
);

export { EmptyState, EmptyProjects, EmptyImages, EmptyBatch, EmptySearch, EmptyDashboard };
export default EmptyState;

