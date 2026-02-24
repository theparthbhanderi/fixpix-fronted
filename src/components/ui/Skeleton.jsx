import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Skeleton - Loading placeholder component
 * 
 * Use for content loading states to improve perceived performance.
 */

// Base skeleton with shimmer animation
const Skeleton = ({ className, ...props }) => (
    <div
        className={cn(
            "animate-pulse rounded-lg bg-gradient-to-r from-surface-elevated via-white/5 to-surface-elevated bg-[length:200%_100%]",
            className
        )}
        {...props}
    />
);

// Text line skeleton
const SkeletonText = ({ lines = 1, className }) => (
    <div className={cn("space-y-2", className)}>
        {[...Array(lines)].map((_, i) => (
            <Skeleton
                key={i}
                className={cn(
                    "h-4",
                    i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
                )}
            />
        ))}
    </div>
);

// Avatar/circular skeleton
const SkeletonAvatar = ({ size = "md", className }) => {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24"
    };

    return (
        <Skeleton className={cn("rounded-full", sizes[size], className)} />
    );
};

// Image/card skeleton
const SkeletonCard = ({ className }) => (
    <div className={cn("rounded-2xl overflow-hidden", className)}>
        <Skeleton className="aspect-video w-full" />
        <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    </div>
);

// Project card skeleton (for Projects page)
const SkeletonProjectCard = () => (
    <div className="glass-panel rounded-2xl overflow-hidden">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
                <SkeletonAvatar size="sm" />
                <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </div>
    </div>
);

// Button skeleton
const SkeletonButton = ({ className }) => (
    <Skeleton className={cn("h-10 w-24 rounded-xl", className)} />
);

// Projects page loading skeleton
const ProjectsPageSkeleton = () => (
    <div className="p-6 md:p-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-40" />
            <SkeletonButton className="w-32" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <SkeletonProjectCard key={i} />
            ))}
        </div>
    </div>
);

// Dashboard stats skeleton
const DashboardSkeleton = () => (
    <div className="p-6 md:p-8 w-full">
        <Skeleton className="h-10 w-64 mb-8" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-panel p-4 rounded-2xl">
                    <SkeletonAvatar size="sm" className="mx-auto mb-2" />
                    <Skeleton className="h-6 w-12 mx-auto mb-1" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                </div>
            ))}
        </div>

        {/* Quick actions */}
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    </div>
);

export {
    Skeleton,
    SkeletonText,
    SkeletonAvatar,
    SkeletonCard,
    SkeletonButton,
    SkeletonProjectCard,
    ProjectsPageSkeleton,
    DashboardSkeleton
};

export default Skeleton;
