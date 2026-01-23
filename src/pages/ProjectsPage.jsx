import React, { useEffect, useState, useContext } from 'react';
import { ImageContext } from '../context/ImageContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FolderOpen, Calendar, Sparkles, ChevronRight, Upload, Image as ImageIcon, MoreHorizontal, Trash2, Download, Share2 } from 'lucide-react';

/**
 * Skeleton Loading Component
 */
const ProjectSkeleton = () => (
    <div className="ios-card overflow-hidden">
        <div className="aspect-video ios-skeleton" />
        <div className="p-4">
            <div className="ios-skeleton h-5 w-3/4 mb-3 rounded-[6px]" />
            <div className="flex items-center justify-between">
                <div className="ios-skeleton h-4 w-24 rounded-[6px]" />
                <div className="ios-skeleton h-5 w-16 rounded-full" />
            </div>
        </div>
    </div>
);

/**
 * Empty State Component - iOS Style
 */
const EmptyState = ({ onUpload }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-8"
    >
        {/* Illustration: Stylized folder with photos */}
        <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Background glow */}
            <div
                className="absolute inset-0 rounded-full blur-2xl opacity-30"
                style={{ background: 'rgb(var(--ios-accent))' }}
            />

            {/* Main folder icon */}
            <div
                className="relative w-full h-full rounded-[28px] flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, rgb(var(--ios-fill) / 0.08) 0%, rgb(var(--ios-fill) / 0.04) 100%)',
                    border: '2px dashed rgb(var(--ios-separator) / 0.3)'
                }}
            >
                <FolderOpen className="w-14 h-14 text-text-quaternary" strokeWidth={1} />

                {/* Floating photo icons */}
                <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-[8px] bg-ios-blue flex items-center justify-center shadow-lg"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ImageIcon className="w-4 h-4 text-white" strokeWidth={2} />
                </motion.div>
                <motion.div
                    className="absolute -bottom-1 -left-2 w-7 h-7 rounded-[7px] bg-ios-purple flex items-center justify-center shadow-lg"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                    <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                </motion.div>
            </div>
        </div>

        <h3 className="ios-title2 text-text-main mb-2">No Projects Yet</h3>
        <p className="ios-body text-text-secondary mb-6 max-w-sm mx-auto">
            Upload your first photo and watch AI restore it to its former glory.
        </p>

        {/* Upload CTA */}
        <label>
            <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files[0]) {
                        onUpload(e.target.files[0]);
                    }
                }}
            />
            <Button variant="filled" size="lg" as="span" className="cursor-pointer">
                <Upload className="w-5 h-5 mr-2" strokeWidth={2} />
                Upload First Photo
            </Button>
        </label>
    </motion.div>
);

/**
 * Project Card Component
 */
const ProjectCard = ({ project, onClick, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="ios-card overflow-hidden cursor-pointer group"
    >
        {/* Image Preview */}
        <div className="aspect-video relative overflow-hidden" style={{ backgroundColor: 'rgb(var(--ios-fill) / 0.08)' }}>
            <img
                src={project.processed_image || project.original_image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {project.status === 'processing' && (
                <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--ios-bg) / 0.8)' }}>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full ios-spin" />
                        <span className="ios-footnote text-text-secondary">Processing...</span>
                    </div>
                </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                <div
                    className="px-4 py-2 rounded-full text-[13px] font-semibold text-white flex items-center gap-1.5 backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                    Open Project
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="p-4">
            <div className="flex items-start justify-between mb-2">
                <h3 className="ios-headline text-text-main truncate flex-1">
                    {project.title || "Untitled Project"}
                </h3>
                {/* Quick actions would go here */}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-text-secondary">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span className="ios-caption1">
                        {new Date(project.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                <div className="flex gap-1.5">
                    {project.settings?.removeScratches && (
                        <span
                            className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{
                                backgroundColor: 'rgb(0 122 255 / 0.12)',
                                color: 'rgb(0 122 255)'
                            }}
                        >
                            Restored
                        </span>
                    )}
                    {project.settings?.colorize && (
                        <span
                            className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{
                                backgroundColor: 'rgb(175 82 222 / 0.12)',
                                color: 'rgb(175 82 222)'
                            }}
                        >
                            Colorized
                        </span>
                    )}
                    {project.settings?.upscaleX > 1 && (
                        <span
                            className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{
                                backgroundColor: 'rgb(255 149 0 / 0.12)',
                                color: 'rgb(255 149 0)'
                            }}
                        >
                            {project.settings.upscaleX}x
                        </span>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);

const ProjectsPage = () => {
    const { fetchProjects, loadProject, uploadImage } = useContext(ImageContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const data = await fetchProjects();
            setProjects(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleUpload = (file) => {
        uploadImage(file);
        navigate('/app/restoration');
    };

    const handleProjectClick = (project) => {
        loadProject(project);
        navigate('/app/restoration');
    };

    return (
        <div className="p-6 md:p-8 w-full overflow-y-auto" style={{ backgroundColor: 'rgb(var(--ios-bg))' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between mb-8"
            >
                <h1 className="ios-large-title text-text-main">My Projects</h1>

                {projects.length > 0 && (
                    <label>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files[0]) handleUpload(e.target.files[0]);
                            }}
                        />
                        <Button variant="tinted" size="md" as="span" className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-1.5" strokeWidth={2} />
                            New
                        </Button>
                    </label>
                )}
            </motion.div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <ProjectSkeleton key={i} />
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <EmptyState onUpload={handleUpload} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            onClick={() => handleProjectClick(project)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
