import React, { useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { apiEndpoints } from '../lib/api';
import {
    User, Mail, Calendar, Image, Edit3, Check, X, Shield,
    ChevronRight, LogOut, Trash2, Camera, Sparkles, Key, AlertCircle, Loader2
} from 'lucide-react';

/* ────────────────────────────────────────
   THEME TOKENS
   ──────────────────────────────────────── */
const useThemeTokens = () => {
    const isDark = document.documentElement.classList.contains('dark');
    return {
        pageBg: 'var(--bg-primary)',
        sectionBg: 'var(--surface)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        separator: 'var(--border-subtle)',
        hoverBg: 'var(--fill-tertiary)',
        dangerText: 'var(--error)',
        dangerBg: isDark ? 'rgba(255,69,58,0.08)' : 'rgba(255,59,48,0.06)',
        successBg: isDark ? 'rgba(52,199,89,0.1)' : 'rgba(52,199,89,0.08)',
        successText: isDark ? '#30D158' : '#34C759',
    };
};

/* ────────────────────────────────────────
   TOAST NOTIFICATION
   ──────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 200, display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 'var(--radius-xl)',
            background: type === 'error' ? 'var(--error)' : 'var(--accent)',
            color: 'white', fontSize: 14, fontWeight: 550,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
    >
        {type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
        {message}
    </motion.div>
);

/* ────────────────────────────────────────
   FLOATING SECTION
   ──────────────────────────────────────── */
const FloatingSection = ({ label, footer, children, t, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay, ease: [0.25, 1, 0.5, 1] }}
        style={{ marginBottom: 28 }}
    >
        {label && (
            <div style={{
                fontSize: 13, fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: t.textSecondary,
                padding: '0 var(--space-6) var(--space-2)',
            }}>
                {label}
            </div>
        )}
        <div style={{
            borderRadius: 'var(--radius-2xl)',
            background: t.sectionBg,
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--depth-1)',
            overflow: 'hidden',
        }}>
            {children}
        </div>
        {footer && (
            <div style={{
                fontSize: 12, color: t.textSecondary,
                padding: 'var(--space-2) var(--space-6) 0',
                opacity: 0.7,
            }}>
                {footer}
            </div>
        )}
    </motion.div>
);

/* ────────────────────────────────────────
   INFO ROW
   ──────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value, isLast, editable, onEdit, t }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
        minHeight: 60, padding: '10px var(--space-6)',
        borderBottom: isLast ? 'none' : `1px solid ${t.separator}`,
    }}>
        <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, background: 'var(--accent-soft)',
        }}>
            <Icon size={16} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: t.textSecondary, marginBottom: 1 }}>{label}</div>
            <div style={{
                fontSize: 15, fontWeight: 500, color: t.textPrimary,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
                {value || '—'}
            </div>
        </div>
        {editable && (
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'var(--fill-tertiary)',
                    border: 'none', cursor: 'pointer', color: t.textSecondary, flexShrink: 0,
                }}
            >
                <Edit3 size={14} strokeWidth={1.75} />
            </motion.button>
        )}
    </div>
);

/* ────────────────────────────────────────
   ACTION ROW
   ──────────────────────────────────────── */
const ActionRow = ({ icon: Icon, title, subtitle, destructive, onClick, showChevron, isLast, t }) => (
    <motion.div
        onClick={onClick}
        whileTap={onClick ? { scale: 0.99 } : {}}
        style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
            minHeight: 60, padding: '10px var(--space-6)',
            cursor: onClick ? 'pointer' : 'default',
            borderBottom: isLast ? 'none' : `1px solid ${t.separator}`,
        }}
        whileHover={{ background: t.hoverBg }}
    >
        <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, background: destructive ? t.dangerBg : 'var(--accent-soft)',
        }}>
            <Icon size={16} strokeWidth={1.75} style={{ color: destructive ? t.dangerText : 'var(--accent)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: destructive ? t.dangerText : t.textPrimary }}>{title}</div>
            {subtitle && <div style={{ fontSize: 13, color: t.textSecondary, marginTop: 1 }}>{subtitle}</div>}
        </div>
        {showChevron && <ChevronRight size={16} strokeWidth={2} style={{ color: t.textSecondary, opacity: 0.5 }} />}
    </motion.div>
);

/* ────────────────────────────────────────
   EDIT MODAL
   ──────────────────────────────────────── */
const EditModal = ({ field, value, onSave, onCancel, saving }) => {
    const [inputValue, setInputValue] = useState(value || '');

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (inputValue.trim()) onSave(inputValue.trim());
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <motion.form
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleSubmit}
                style={{
                    width: 'min(380px, calc(100% - 48px))',
                    borderRadius: 'var(--radius-2xl)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--depth-3)',
                    overflow: 'hidden',
                }}
            >
                <div style={{ padding: '20px 24px 0' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>
                        Edit {field}
                    </h3>
                </div>
                <div style={{ padding: '16px 24px' }}>
                    <input
                        type={field === 'Email' ? 'email' : 'text'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        placeholder={`Enter new ${field.toLowerCase()}`}
                        style={{
                            width: '100%', padding: '10px 14px',
                            borderRadius: 'var(--radius-lg)',
                            border: '1.5px solid var(--border-subtle)',
                            background: 'var(--fill-tertiary)',
                            color: 'var(--text-primary)',
                            fontSize: 15, fontWeight: 500,
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 150ms ease',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                </div>
                <div style={{
                    display: 'flex', gap: 8,
                    padding: '0 24px 20px',
                    justifyContent: 'flex-end',
                }}>
                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={onCancel}
                        disabled={saving}
                        style={{
                            padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--fill-tertiary)', color: 'var(--text-primary)',
                            fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                            opacity: saving ? 0.5 : 1,
                        }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        type="submit"
                        whileTap={{ scale: 0.97 }}
                        disabled={saving || !inputValue.trim()}
                        style={{
                            padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--accent)', color: 'white',
                            fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
                            opacity: (saving || !inputValue.trim()) ? 0.6 : 1,
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}
                    >
                        {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                        {saving ? 'Saving...' : 'Save'}
                    </motion.button>
                </div>
            </motion.form>
        </motion.div>
    );
};

/* ────────────────────────────────────────
   PASSWORD CHANGE MODAL
   ──────────────────────────────────────── */
const PasswordModal = ({ onClose, authTokens }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(apiEndpoints.profile, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });
            if (response.ok) {
                setSuccess(true);
                setTimeout(onClose, 1500);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to change password');
            }
        } catch {
            setError('Could not connect to server');
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px solid var(--border-subtle)',
        background: 'var(--fill-tertiary)',
        color: 'var(--text-primary)',
        fontSize: 15, fontWeight: 500,
        outline: 'none', boxSizing: 'border-box',
        marginBottom: 10,
        transition: 'border-color 150ms ease',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.form
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleSubmit}
                style={{
                    width: 'min(380px, calc(100% - 48px))',
                    borderRadius: 'var(--radius-2xl)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--depth-3)',
                    overflow: 'hidden',
                }}
            >
                <div style={{ padding: '20px 24px 0' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>
                        Change Password
                    </h3>
                </div>
                <div style={{ padding: '16px 24px' }}>
                    <input
                        type="password" placeholder="Current password" value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)} autoFocus style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                    <input
                        type="password" placeholder="New password (min 6 chars)" value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                    <input
                        type="password" placeholder="Confirm new password" value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                    {error && (
                        <div style={{ color: 'var(--error)', fontSize: 13, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}
                    {success && (
                        <div style={{ color: 'var(--success, #34C759)', fontSize: 13, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Check size={14} /> Password changed successfully!
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 8, padding: '0 24px 20px', justifyContent: 'flex-end' }}>
                    <motion.button
                        type="button" whileTap={{ scale: 0.97 }} onClick={onClose}
                        style={{
                            padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--fill-tertiary)', color: 'var(--text-primary)',
                            fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        type="submit" whileTap={{ scale: 0.97 }}
                        disabled={saving || !oldPassword || !newPassword || !confirmPassword}
                        style={{
                            padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--accent)', color: 'white',
                            fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
                            opacity: (saving || !oldPassword || !newPassword || !confirmPassword) ? 0.6 : 1,
                        }}
                    >
                        {saving ? 'Changing...' : 'Change Password'}
                    </motion.button>
                </div>
            </motion.form>
        </motion.div>
    );
};

/* ────────────────────────────────────────
   PROFILE PAGE
   ──────────────────────────────────────── */
const ProfilePage = () => {
    const { user, authTokens, logoutUser } = useContext(AuthContext);
    const t = useThemeTokens();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editField, setEditField] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Toast helper
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(apiEndpoints.profile, {
                    headers: { 'Authorization': `Bearer ${authTokens?.access}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    // Backend returned error, use JWT fallback
                    console.warn('Profile API returned non-OK, using JWT fallback');
                }
            } catch (err) {
                // Backend is offline, use JWT data
                console.warn('Profile API unreachable, using JWT fallback:', err.message);
            } finally {
                setLoading(false);
            }
        };
        if (authTokens) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [authTokens]);

    // Save profile field
    const handleSave = async (newValue) => {
        if (!editField) return;
        setSaving(true);
        try {
            const response = await fetch(apiEndpoints.profile, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [editField.key]: newValue }),
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data.user);
                // Update tokens in localStorage so JWT stays in sync
                if (data.tokens) {
                    localStorage.setItem('authTokens', JSON.stringify(data.tokens));
                }
                showToast(`${editField.field} updated successfully`);
            } else {
                const errorData = await response.json();
                showToast(errorData.error || 'Failed to update', 'error');
            }
        } catch (err) {
            showToast('Could not connect to server', 'error');
        } finally {
            setSaving(false);
            setEditField(null);
        }
    };

    // Logout handler
    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    // Delete account handler
    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(apiEndpoints.profile, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authTokens?.access}` },
            });
            if (response.ok) {
                logoutUser();
                navigate('/');
            } else {
                showToast('Failed to delete account', 'error');
            }
        } catch {
            showToast('Could not connect to server', 'error');
        }
        setShowDeleteConfirm(false);
    };

    // Build display data — JWT fallback when backend is down
    const displayProfile = profile || {
        username: user?.username || 'User',
        email: user?.email || '',
        first_name: '',
        last_name: '',
        date_joined: new Date().toISOString(),
        images_count: 0,
    };

    const memberSince = new Date(displayProfile.date_joined).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long',
    });

    // Loading state
    if (loading) {
        return (
            <div style={{
                width: '100%', minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <Loader2 size={28} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div style={{
                width: '100%', minHeight: '100vh',
                overflowY: 'auto',
                padding: 'var(--space-9) var(--space-6)',
            }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>

                    {/* Page Title */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            fontSize: 28, fontWeight: 700,
                            color: t.textPrimary,
                            marginBottom: 'var(--space-7)',
                            letterSpacing: '-0.5px',
                        }}
                    >
                        Profile
                    </motion.h1>

                    {/* ── Hero Card ── */}
                    <FloatingSection t={t} delay={0.05}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-5)',
                            padding: 'var(--space-6)',
                        }}>
                            {/* Avatar */}
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <div style={{
                                    width: 72, height: 72,
                                    borderRadius: 'var(--radius-2xl)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'linear-gradient(135deg, var(--accent), #5856D6)',
                                    color: '#fff', fontSize: 28, fontWeight: 650,
                                }}>
                                    {displayProfile.username[0].toUpperCase()}
                                </div>
                                <div style={{
                                    position: 'absolute', bottom: -2, right: -2,
                                    width: 24, height: 24, borderRadius: '50%',
                                    background: 'var(--accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid var(--surface)',
                                    cursor: 'pointer',
                                }}>
                                    <Camera size={11} strokeWidth={2.5} style={{ color: 'white' }} />
                                </div>
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontSize: 20, fontWeight: 650,
                                    color: t.textPrimary, letterSpacing: '-0.3px',
                                }}>
                                    {displayProfile.first_name && displayProfile.last_name
                                        ? `${displayProfile.first_name} ${displayProfile.last_name}`
                                        : displayProfile.username}
                                </div>
                                <div style={{
                                    fontSize: 14, color: t.textSecondary, marginTop: 2,
                                    display: 'flex', alignItems: 'center', gap: 4,
                                }}>
                                    @{displayProfile.username}
                                </div>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                    marginTop: 'var(--space-2)',
                                    padding: '3px 10px', borderRadius: 'var(--radius-md)',
                                    fontSize: 12, fontWeight: 600,
                                    background: 'var(--accent-soft)', color: 'var(--accent)',
                                }}>
                                    <Sparkles size={12} strokeWidth={2} />
                                    Free Plan
                                </div>
                            </div>
                        </div>

                        {/* Stats bar */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            borderTop: `1px solid ${t.separator}`,
                        }}>
                            <div style={{
                                padding: 'var(--space-4) var(--space-6)',
                                borderRight: `1px solid ${t.separator}`,
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>
                                    {displayProfile.images_count}
                                </div>
                                <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>
                                    Images Processed
                                </div>
                            </div>
                            <div style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'center' }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary }}>
                                    {memberSince}
                                </div>
                                <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>
                                    Member Since
                                </div>
                            </div>
                        </div>
                    </FloatingSection>

                    {/* ── Account Details ── */}
                    <FloatingSection label="Account Details" t={t} delay={0.1}>
                        <InfoRow
                            icon={User} label="Username" value={displayProfile.username}
                            editable onEdit={() => setEditField({ field: 'Username', key: 'username', value: displayProfile.username })}
                            t={t}
                        />
                        <InfoRow
                            icon={Mail} label="Email" value={displayProfile.email}
                            editable onEdit={() => setEditField({ field: 'Email', key: 'email', value: displayProfile.email })}
                            t={t}
                        />
                        <InfoRow
                            icon={User} label="First Name" value={displayProfile.first_name}
                            editable onEdit={() => setEditField({ field: 'First Name', key: 'first_name', value: displayProfile.first_name })}
                            t={t}
                        />
                        <InfoRow
                            icon={User} label="Last Name" value={displayProfile.last_name}
                            editable onEdit={() => setEditField({ field: 'Last Name', key: 'last_name', value: displayProfile.last_name })}
                            t={t} isLast
                        />
                    </FloatingSection>

                    {/* ── Security ── */}
                    <FloatingSection label="Security" t={t} delay={0.15}>
                        <ActionRow
                            icon={Key} title="Change Password"
                            subtitle="Update your account password"
                            onClick={() => setShowPasswordModal(true)}
                            showChevron t={t}
                        />
                        <ActionRow
                            icon={Shield} title="Two-Factor Authentication"
                            subtitle="Add extra security to your account"
                            showChevron t={t} isLast
                        />
                    </FloatingSection>

                    {/* ── Danger Zone ── */}
                    <FloatingSection t={t} delay={0.2}>
                        <ActionRow
                            icon={LogOut} title="Log Out"
                            destructive onClick={handleLogout} t={t}
                        />
                        <ActionRow
                            icon={Trash2} title="Delete Account"
                            subtitle="Permanently remove all data"
                            destructive onClick={() => setShowDeleteConfirm(true)}
                            t={t} isLast
                        />
                    </FloatingSection>

                </div>
            </div>

            {/* ── Modals ── */}
            <AnimatePresence>
                {editField && (
                    <EditModal
                        field={editField.field}
                        value={editField.value}
                        onSave={handleSave}
                        onCancel={() => setEditField(null)}
                        saving={saving}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPasswordModal && (
                    <PasswordModal
                        onClose={() => setShowPasswordModal(false)}
                        authTokens={authTokens}
                    />
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.25)',
                            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                        }}
                        onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteConfirm(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                width: 'min(380px, calc(100% - 48px))',
                                borderRadius: 'var(--radius-2xl)',
                                background: 'var(--surface)',
                                border: '1px solid var(--border-subtle)',
                                boxShadow: 'var(--depth-3)',
                                padding: 24,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                                    background: t.dangerBg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Trash2 size={20} style={{ color: t.dangerText }} />
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 650, color: t.textPrimary, margin: 0 }}>
                                    Delete Account?
                                </h3>
                            </div>
                            <p style={{ fontSize: 14, color: t.textSecondary, margin: '0 0 20px', lineHeight: 1.5 }}>
                                This will permanently delete your account and all your data. This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowDeleteConfirm(false)}
                                    style={{
                                        padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                                        background: 'var(--fill-tertiary)', color: t.textPrimary,
                                        fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleDeleteAccount}
                                    style={{
                                        padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                                        background: 'var(--error)', color: 'white',
                                        fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
                                    }}
                                >
                                    Delete Account
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} />}
            </AnimatePresence>

            {/* Spinner keyframes */}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </>
    );
};

export default ProfilePage;
