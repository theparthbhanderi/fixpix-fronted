import React, { useEffect, useState, useContext } from 'react';
import { ImageContext } from '../context/ImageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderOpen, Calendar, Upload, Search,
    MoreHorizontal, Plus, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';

/* ── Design Tokens ─────────────────────────────────── */
const tokens = {
    light: {
        bg: 'var(--bg-primary)',
        cardBg: 'var(--card-bg)',
        cardBorder: 'var(--card-border)',
        cardShadow: 'var(--depth-1)',
        cardHoverShadow: 'var(--depth-2)',
        floatBg: 'var(--glass-bg)',
        floatBorder: 'var(--glass-border)',
        floatShadow: 'var(--depth-1)',
        text: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        inputBg: 'var(--fill-tertiary)',
        inputBorder: 'var(--border-subtle)',
        badgeBg: 'var(--accent-soft)',
    },
    dark: {
        bg: 'var(--bg-primary)',
        cardBg: 'var(--card-bg)',
        cardBorder: 'var(--card-border)',
        cardShadow: 'var(--depth-1)',
        cardHoverShadow: 'var(--depth-2)',
        floatBg: 'var(--glass-bg)',
        floatBorder: 'var(--glass-border)',
        floatShadow: 'var(--depth-1)',
        text: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        inputBg: 'var(--fill-tertiary)',
        inputBorder: 'var(--border-subtle)',
        badgeBg: 'var(--accent-soft)',
    },
};

const useThemeTokens = () => {
    const { theme } = useContext(ImageContext);
    return theme === 'dark' ? tokens.dark : tokens.light;
};

/* ── Skeleton ──────────────────────────────────────── */
const ProjectSkeleton = ({ t }) => (
    <div style={{
        borderRadius: 'var(--radius-2xl)', overflow: 'hidden',
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
    }}>
        <div style={{ aspectRatio: '4/3', background: t.inputBg }} />
        <div style={{ padding: 16 }}>
            <div style={{ height: 18, width: '70%', borderRadius: 'var(--radius-sm)', background: t.inputBg, marginBottom: 12 }} />
            <div style={{ height: 14, width: '40%', borderRadius: 6, background: t.inputBg }} />
        </div>
    </div>
);

/* ── Empty State ───────────────────────────────────── */
const EmptyState = ({ onUpload, t }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
            maxWidth: 440,
            margin: '80px auto 0',
            padding: 'var(--space-9)',
            borderRadius: 'var(--radius-2xl)',
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            boxShadow: 'var(--depth-1)',
            textAlign: 'center',
        }}
        className="projects-empty-state"
    >
        <div style={{
            width: 80, height: 80, borderRadius: 'var(--radius-2xl)',
            background: t.inputBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
        }}>
            <FolderOpen size={36} strokeWidth={1.2} style={{ color: t.textSecondary }} />
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 600, color: t.text, marginBottom: 'var(--space-2)', letterSpacing: '-0.3px' }}>
            No Projects Yet
        </h3>
        <p style={{ fontSize: 14, color: t.textSecondary, marginBottom: 28, lineHeight: 1.5 }}>
            Upload your first photo and watch AI restore it to its former glory.
        </p>

        <label style={{ cursor: 'pointer' }}>
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => { if (e.target.files[0]) onUpload(e.target.files[0]); }}
            />
            <motion.span
                whileTap={{ scale: 0.97 }}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: '14px 28px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: 15, fontWeight: 600,
                    cursor: 'pointer',
                }}
            >
                <Upload size={18} strokeWidth={2} />
                Upload First Photo
            </motion.span>
        </label>
    </motion.div>
);

/* ── Project Card ──────────────────────────────────── */
const ProjectCard = ({ project, onClick, index, t }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            style={{
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                boxShadow: hovered ? 'var(--depth-2)' : 'var(--depth-1)',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 180ms cubic-bezier(0.25, 1, 0.5, 1)',
                cursor: 'pointer',
            }}
            className="projects-page-container"
        >
            {/* Image Preview — 4:3 */}
            <div style={{
                aspectRatio: '4/3',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--canvas-bg)',
            }}>
                <img
                    src={project.processed_image || project.original_image}
                    alt={project.title}
                    style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />

                {project.status === 'processing' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(8px)',
                    }}>
                        <div style={{
                            width: 28, height: 28,
                            border: '3px solid rgba(255,255,255,0.2)',
                            borderTopColor: '#fff',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                    </div>
                )}

                {/* Options button */}
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff',
                        cursor: 'pointer',
                        opacity: hovered ? 1 : 0,
                        transition: 'opacity 200ms',
                    }}
                >
                    <MoreHorizontal size={16} strokeWidth={2} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: 16 }}>
                <h3 style={{
                    fontSize: 17, fontWeight: 600,
                    color: t.text,
                    marginBottom: 'var(--space-2)',
                    letterSpacing: '-0.2px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    {project.title || 'Untitled Project'}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: t.textSecondary }}>
                        <Calendar size={14} strokeWidth={1.75} />
                        <span style={{ fontSize: 13 }}>
                            {new Date(project.created_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric',
                            })}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                        {project.settings?.removeScratches && (
                            <span style={{
                                padding: '3px 8px', borderRadius: 'var(--radius-sm)',
                                fontSize: 11, fontWeight: 600,
                                background: t.badgeBg,
                                color: 'var(--accent)',
                            }}>
                                Restored
                            </span>
                        )}
                        {project.settings?.colorize && (
                            <span style={{
                                padding: '3px 8px', borderRadius: 'var(--radius-sm)',
                                fontSize: 11, fontWeight: 600,
                                background: t.badgeBg,
                                color: 'var(--accent)',
                            }}>
                                Colorized
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ── Filter Bar ────────────────────────────────────── */
const FilterBar = ({ search, onSearch, t }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        height: 56, borderRadius: 'var(--radius-2xl)',
        padding: '0 var(--space-4)',
        background: t.floatBg,
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: `1px solid ${t.floatBorder}`,
        boxShadow: 'var(--depth-1)',
    }}
        className="projects-filter-bar">
        {/* Search */}
        <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            padding: '0 var(--space-3)',
            height: 36, borderRadius: 'var(--radius-sm)',
            background: t.inputBg,
            border: `1px solid ${t.inputBorder}`,
        }}>
            <Search size={16} strokeWidth={2} style={{ color: t.textSecondary, flexShrink: 0 }} />
            <input
                type="text"
                placeholder="Search projects…"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                style={{
                    flex: 1, border: 'none', outline: 'none',
                    background: 'transparent',
                    fontSize: 14, color: t.text,
                }}
            />
        </div>

        {/* Sort */}
        <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 var(--space-3)', height: 36, borderRadius: 'var(--radius-sm)',
            background: 'transparent', border: 'none',
            color: t.textSecondary, fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
        }}>
            <ArrowUpDown size={14} strokeWidth={2} />
            <span>Recent</span>
        </button>
    </div>
);

/* ── Projects Page ─────────────────────────────────── */
const ProjectsPage = () => {
    const { fetchProjects, loadProject, uploadImage } = useContext(ImageContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const t = useThemeTokens();

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

    const filtered = projects.filter((p) =>
        (p.title || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{
            padding: '48px 48px 64px',
            width: '100%',
            maxWidth: 1400,
            margin: '0 auto',
            minHeight: '100vh',
            overflowY: 'auto',
            background: t.bg,
        }}
            className="projects-page-container"
        >
            {/* ── Header ─────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 'var(--space-7)',
                }}
                className="projects-page-header"
            >
                <div>
                    <h1 style={{
                        fontSize: 28, fontWeight: 700, color: t.text,
                        letterSpacing: '-0.5px', margin: 0,
                    }}>
                        Projects
                    </h1>
                </div>

                {projects.length > 0 && (
                    <label style={{ cursor: 'pointer' }}>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => { if (e.target.files[0]) handleUpload(e.target.files[0]); }}
                        />
                        <motion.span
                            whileTap={{ scale: 0.97 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                                padding: '12px 20px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--accent)',
                                color: '#fff',
                                fontSize: 14, fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            New Project
                        </motion.span>
                    </label>
                )}
            </motion.div>

            {/* ── Filter Bar ─────────────────────── */}
            {projects.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    style={{ marginBottom: 32 }}
                >
                    <FilterBar search={search} onSearch={setSearch} t={t} />
                </motion.div>
            )}

            {/* ── Content ────────────────────────── */}
            {loading ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--space-7)',
                }}
                    className="projects-grid">
                    {[...Array(8)].map((_, i) => <ProjectSkeleton key={i} t={t} />)}
                </div>
            ) : projects.length === 0 ? (
                <EmptyState onUpload={handleUpload} t={t} />
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--space-7)',
                }}
                    className="projects-grid">
                    <AnimatePresence>
                        {filtered.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                t={t}
                                onClick={() => handleProjectClick(project)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
