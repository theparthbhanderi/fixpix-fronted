import React, { useEffect, useState, useContext } from 'react';
import { ImageContext } from '../context/ImageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderOpen, Calendar, Upload, Search,
    MoreHorizontal, Plus, ArrowUpDown, Image, Sparkles, Wand2
} from 'lucide-react';

/* ── Design Tokens ─────────────────────────────────── */
const useThemeTokens = () => {
    const { theme } = useContext(ImageContext);
    const isDark = theme === 'dark';
    return {
        bg: 'var(--bg-primary)',
        cardBg: 'var(--surface)',
        cardBorder: 'var(--border-subtle)',
        text: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        inputBg: 'var(--fill-tertiary)',
        inputBorder: 'var(--border-subtle)',
        badgeBg: 'var(--accent-soft)',
        skeletonBase: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        skeletonShine: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
    };
};

/* ── Skeleton ──────────────────────────────────────── */
const ProjectSkeleton = ({ t, index }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        style={{
            borderRadius: 'var(--radius-2xl)', overflow: 'hidden',
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
        }}
    >
        <div style={{
            aspectRatio: '4/3',
            background: `linear-gradient(110deg, ${t.skeletonBase} 30%, ${t.skeletonShine} 50%, ${t.skeletonBase} 70%)`,
            backgroundSize: '300% 100%',
            animation: 'shimmer 1.8s ease-in-out infinite',
        }} />
        <div style={{ padding: 16 }}>
            <div style={{
                height: 16, width: '65%', borderRadius: 8,
                background: `linear-gradient(110deg, ${t.skeletonBase} 30%, ${t.skeletonShine} 50%, ${t.skeletonBase} 70%)`,
                backgroundSize: '300% 100%', animation: 'shimmer 1.8s ease-in-out infinite',
                marginBottom: 10,
            }} />
            <div style={{
                height: 12, width: '35%', borderRadius: 6,
                background: `linear-gradient(110deg, ${t.skeletonBase} 30%, ${t.skeletonShine} 50%, ${t.skeletonBase} 70%)`,
                backgroundSize: '300% 100%', animation: 'shimmer 1.8s ease-in-out infinite',
            }} />
        </div>
    </motion.div>
);

/* ── Empty State ───────────────────────────────────── */
const EmptyState = ({ onUpload, t }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        style={{
            maxWidth: 480,
            margin: '60px auto 0',
            padding: '48px 40px',
            borderRadius: 'var(--radius-2xl)',
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            boxShadow: 'var(--depth-1)',
            textAlign: 'center',
        }}
    >
        {/* Illustration */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28 }}>
            <div style={{
                width: 88, height: 88, borderRadius: 'var(--radius-2xl)',
                background: 'var(--accent-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <FolderOpen size={40} strokeWidth={1.2} style={{ color: 'var(--accent)' }} />
            </div>
            <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', bottom: -6, right: -10,
                    width: 32, height: 32, borderRadius: 'var(--radius-lg)',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
            >
                <Wand2 size={16} strokeWidth={2} style={{ color: 'white' }} />
            </motion.div>
        </div>

        <h3 style={{
            fontSize: 22, fontWeight: 650, color: t.text,
            marginBottom: 8, letterSpacing: '-0.4px',
        }}>
            No Projects Yet
        </h3>
        <p style={{
            fontSize: 15, color: t.textSecondary,
            marginBottom: 32, lineHeight: 1.6,
            maxWidth: 320, margin: '0 auto 32px',
        }}>
            Upload your first photo and let AI restore, colorize, or enhance it in seconds.
        </p>

        <label style={{ cursor: 'pointer', display: 'inline-block' }}>
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => { if (e.target.files[0]) onUpload(e.target.files[0]); }}
            />
            <motion.span
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '14px 32px',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: 15, fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                }}
            >
                <Upload size={18} strokeWidth={2} />
                Upload First Photo
            </motion.span>
        </label>
    </motion.div>
);

/* ── Status Badge ──────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const colors = {
        completed: { bg: 'rgba(52,199,89,0.1)', color: '#34C759' },
        processing: { bg: 'rgba(255,149,0,0.1)', color: '#FF9500' },
        pending: { bg: 'rgba(255,149,0,0.1)', color: '#FF9500' },
        failed: { bg: 'rgba(255,59,48,0.1)', color: '#FF3B30' },
    };
    const c = colors[status] || colors.completed;
    return (
        <span style={{
            padding: '2px 8px', borderRadius: 'var(--radius-sm)',
            fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
            background: c.bg, color: c.color,
        }}>
            {status === 'completed' ? '✓ Done' : status}
        </span>
    );
};

/* ── Project Card ──────────────────────────────────── */
const ProjectCard = ({ project, onClick, index, t }) => {
    const [hovered, setHovered] = useState(false);
    const imgSrc = project.processed_image || project.original_image;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 1, 0.5, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            style={{
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                boxShadow: hovered ? 'var(--depth-2)' : 'var(--depth-1)',
                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'all 200ms cubic-bezier(0.25, 1, 0.5, 1)',
                cursor: 'pointer',
            }}
        >
            {/* Image Preview */}
            <div style={{
                aspectRatio: '4/3',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--fill-tertiary)',
            }}>
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={project.title || 'Project'}
                        loading="lazy"
                        style={{
                            width: '100%', height: '100%',
                            objectFit: 'cover', display: 'block',
                            transition: 'transform 300ms ease',
                            transform: hovered ? 'scale(1.03)' : 'scale(1)',
                        }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Image size={40} strokeWidth={1} style={{ color: t.textSecondary, opacity: 0.3 }} />
                    </div>
                )}

                {/* Processing overlay */}
                {(project.status === 'processing' || project.status === 'pending') && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(4px)',
                    }}>
                        <div style={{
                            width: 32, height: 32,
                            border: '3px solid rgba(255,255,255,0.2)',
                            borderTopColor: '#fff',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                    </div>
                )}

                {/* Options */}
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', cursor: 'pointer',
                        opacity: hovered ? 1 : 0,
                        transition: 'opacity 200ms',
                    }}
                >
                    <MoreHorizontal size={16} strokeWidth={2} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h3 style={{
                        fontSize: 15, fontWeight: 600,
                        color: t.text, margin: 0,
                        letterSpacing: '-0.2px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        flex: 1, marginRight: 8,
                    }}>
                        {project.title || 'Untitled Project'}
                    </h3>
                    {project.status && <StatusBadge status={project.status} />}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: t.textSecondary }}>
                        <Calendar size={13} strokeWidth={1.75} />
                        <span style={{ fontSize: 12 }}>
                            {new Date(project.created_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                            })}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: 4 }}>
                        {project.settings?.removeScratches && (
                            <span style={{
                                padding: '2px 7px', borderRadius: 'var(--radius-sm)',
                                fontSize: 10, fontWeight: 600,
                                background: t.badgeBg, color: 'var(--accent)',
                            }}>Restored</span>
                        )}
                        {project.settings?.colorize && (
                            <span style={{
                                padding: '2px 7px', borderRadius: 'var(--radius-sm)',
                                fontSize: 10, fontWeight: 600,
                                background: t.badgeBg, color: 'var(--accent)',
                            }}>Colorized</span>
                        )}
                        {project.source === 'generated' && (
                            <span style={{
                                padding: '2px 7px', borderRadius: 'var(--radius-sm)',
                                fontSize: 10, fontWeight: 600,
                                background: 'rgba(175,82,222,0.1)', color: '#AF52DE',
                            }}>AI Generated</span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ── Filter Bar ────────────────────────────────────── */
const FilterBar = ({ search, onSearch, count, t }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        height: 48, borderRadius: 'var(--radius-xl)',
        padding: '0 var(--space-4)',
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        boxShadow: 'var(--depth-1)',
    }}>
        {/* Search */}
        <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            height: 34, borderRadius: 'var(--radius-lg)',
            padding: '0 var(--space-3)',
            background: t.inputBg,
        }}>
            <Search size={15} strokeWidth={2} style={{ color: t.textSecondary, flexShrink: 0 }} />
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

        {/* Count badge */}
        <span style={{
            fontSize: 12, fontWeight: 600,
            color: t.textSecondary, whiteSpace: 'nowrap',
        }}>
            {count} {count === 1 ? 'project' : 'projects'}
        </span>

        {/* Sort */}
        <button style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '0 var(--space-2)', height: 34, borderRadius: 'var(--radius-sm)',
            background: 'transparent', border: 'none',
            color: t.textSecondary, fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
        }}>
            <ArrowUpDown size={14} strokeWidth={2} />
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
            try {
                const data = await fetchProjects();
                setProjects(data || []);
            } catch (err) {
                console.error('Failed to load projects:', err);
                setProjects([]);
            } finally {
                setLoading(false);
            }
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
            padding: 'var(--space-9) var(--space-6) var(--space-9)',
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            minHeight: '100vh',
            overflowY: 'auto',
        }}>
            {/* ── Header ─────────────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 'var(--space-6)',
                }}
            >
                <div>
                    <h1 style={{
                        fontSize: 28, fontWeight: 700, color: t.text,
                        letterSpacing: '-0.5px', margin: 0,
                    }}>
                        Projects
                    </h1>
                    {!loading && projects.length > 0 && (
                        <p style={{
                            fontSize: 14, color: t.textSecondary,
                            margin: '4px 0 0', fontWeight: 400,
                        }}>
                            {projects.length} total · {projects.filter(p => p.status === 'completed').length} completed
                        </p>
                    )}
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
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '10px 20px',
                                borderRadius: 'var(--radius-xl)',
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
                    transition={{ duration: 0.2, delay: 0.05 }}
                    style={{ marginBottom: 24 }}
                >
                    <FilterBar search={search} onSearch={setSearch} count={filtered.length} t={t} />
                </motion.div>
            )}

            {/* ── Content ────────────────────────── */}
            {loading ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: 'var(--space-5)',
                }}>
                    {[...Array(6)].map((_, i) => <ProjectSkeleton key={i} index={i} t={t} />)}
                </div>
            ) : projects.length === 0 ? (
                <EmptyState onUpload={handleUpload} t={t} />
            ) : filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '60px 20px' }}
                >
                    <Search size={40} strokeWidth={1} style={{ color: t.textSecondary, opacity: 0.4, marginBottom: 16 }} />
                    <p style={{ fontSize: 16, fontWeight: 500, color: t.text, marginBottom: 4 }}>
                        No matching projects
                    </p>
                    <p style={{ fontSize: 14, color: t.textSecondary }}>
                        Try a different search term
                    </p>
                </motion.div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: 'var(--space-5)',
                }}>
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

            {/* Shimmer animation */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ProjectsPage;
