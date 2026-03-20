import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Sparkles, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

/* ═══════════════════════════════════════════════════════
   Step Data
═══════════════════════════════════════════════════════ */
const steps = [
    {
        icon: UploadCloud,
        step: '01',
        title: 'Upload Your Photo',
        description:
            'Drag & drop or select an image from your device. We support JPG, PNG, HEIC, and WebP files.',
        accent: '#007AFF',
        accentRgb: '0, 122, 255',
    },
    {
        icon: Sparkles,
        step: '02',
        title: 'AI Does the Magic',
        description:
            'Our neural engine restores, colorizes, and enhances your image in under 10 seconds.',
        accent: '#AF52DE',
        accentRgb: '175, 82, 222',
    },
    {
        icon: Download,
        step: '03',
        title: 'Download in 4K',
        description:
            'Preview a side-by-side comparison, then download your high-resolution restored image.',
        accent: '#34C759',
        accentRgb: '52, 199, 89',
    },
];

/* ═══════════════════════════════════════════════════════
   Step Card
═══════════════════════════════════════════════════════ */
const StepCard = ({ item, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: index * 0.1, duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
        style={{ flex: 1, minWidth: 0 }}
    >
        <div
            className="step-card-inner"
            style={{
                padding: 'clamp(28px, 3vw, 36px)',
                borderRadius: 'var(--radius-2xl, 20px)',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 300ms ease, transform 300ms ease, border-color 300ms ease',
                cursor: 'default',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 16px 40px rgba(${item.accentRgb}, 0.15), 0 4px 16px rgba(0,0,0,0.08)`;
                e.currentTarget.style.borderColor = `rgba(${item.accentRgb}, 0.45)`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
        >
            {/* Accent top stripe */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${item.accent}dd, ${item.accent}44)`,
                    borderRadius: '3px 3px 0 0',
                }}
            />

            {/* Large ghost step number */}
            <div
                style={{
                    position: 'absolute',
                    top: 12,
                    right: 16,
                    fontSize: '80px',
                    fontWeight: 900,
                    lineHeight: 1,
                    color: `rgba(${item.accentRgb}, 0.06)`,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    letterSpacing: '-4px',
                    userSelect: 'none',
                    pointerEvents: 'none',
                }}
            >
                {item.step}
            </div>

            {/* Icon bubble */}
            <div
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    backgroundColor: `rgba(${item.accentRgb}, 0.12)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    flexShrink: 0,
                    border: `1px solid rgba(${item.accentRgb}, 0.2)`,
                    transition: 'background-color 300ms ease, transform 300ms ease',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = `rgba(${item.accentRgb}, 0.2)`;
                    e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = `rgba(${item.accentRgb}, 0.12)`;
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                <item.icon size={24} strokeWidth={1.75} style={{ color: item.accent }} />
            </div>

            {/* Step label */}
            <span
                style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: item.accent,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    marginBottom: '8px',
                    display: 'block',
                }}
            >
                STEP {item.step}
            </span>

            {/* Title */}
            <h3
                style={{
                    fontSize: 'clamp(18px, 2.2vw, 22px)',
                    fontWeight: 700,
                    letterSpacing: '-0.4px',
                    lineHeight: 1.25,
                    color: 'var(--text-primary)',
                    marginBottom: '10px',
                }}
            >
                {item.title}
            </h3>

            {/* Description */}
            <p
                style={{
                    fontSize: 'clamp(14px, 1.4vw, 15px)',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    marginTop: 'auto',
                    paddingTop: '4px',
                }}
            >
                {item.description}
            </p>
        </div>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════
   Desktop Gradient Connector Arrow
═══════════════════════════════════════════════════════ */
const Connector = ({ index, fromAccent, toAccent }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.18 + index * 0.1, duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '0 4px',
        }}
    >
        {/* Desktop: horizontal gradient line + arrow */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0' }}>
            <div
                style={{
                    width: 32,
                    height: 2,
                    background: `linear-gradient(90deg, ${fromAccent}88, ${toAccent}88)`,
                    borderRadius: '1px',
                }}
            />
            <div
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(${steps[index + 1]?.accentRgb || '175,82,222'}, 0.12) 0%, transparent 70%)`,
                    border: `1px solid rgba(${steps[index + 1]?.accentRgb || '175,82,222'}, 0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ArrowRight size={13} strokeWidth={2.5} style={{ color: toAccent, opacity: 0.7 }} />
            </div>
            <div
                style={{
                    width: 32,
                    height: 2,
                    background: `linear-gradient(90deg, ${toAccent}88, transparent)`,
                    borderRadius: '1px',
                }}
            />
        </div>

        {/* Mobile: vertical dot */}
        <div
            className="flex md:hidden"
            style={{
                width: 2,
                height: 32,
                background: `linear-gradient(180deg, ${fromAccent}88, ${toAccent}44)`,
                borderRadius: '1px',
                margin: '0 auto',
            }}
        />
    </motion.div>
);

/* ═══════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════ */
const HowItWorks = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleCTA = () => {
        if (user) {
            navigate('/app/restoration');
        } else {
            navigate('/login');
        }
    };

    return (
        <section
            id="how-it-works"
            style={{
                paddingTop: 'clamp(80px, 10vw, 140px)',
                paddingBottom: 'clamp(80px, 10vw, 140px)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Ambient background blobs */}
            <div
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '-10%',
                    width: '40vw',
                    height: '40vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '-10%',
                    width: '35vw',
                    height: '35vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(52, 199, 89, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                }}
            >
                {/* ── Section Header ── */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 80px)' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                color: 'var(--accent)',
                                marginBottom: '16px',
                                padding: '5px 16px',
                                borderRadius: '20px',
                                backgroundColor: 'var(--accent-soft)',
                            }}
                        >
                            HOW IT WORKS
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.07, duration: 0.5 }}
                        style={{
                            fontSize: 'clamp(28px, 4.5vw, 42px)',
                            fontWeight: 800,
                            letterSpacing: '-0.8px',
                            lineHeight: 1.15,
                            color: 'var(--text-primary)',
                            marginBottom: '14px',
                        }}
                    >
                        Three Steps to a{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #007AFF 0%, #AF52DE 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Perfect Photo
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.12, duration: 0.45 }}
                        style={{
                            fontSize: 'clamp(15px, 1.8vw, 17px)',
                            lineHeight: 1.65,
                            color: 'var(--text-secondary)',
                            maxWidth: '440px',
                            margin: '0 auto',
                        }}
                    >
                        No technical skills needed. Upload your photo and let our AI handle the rest.
                    </motion.p>
                </div>

                {/* ── Step Cards + Connectors ── */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        gap: '0',
                        flexWrap: 'nowrap',
                    }}
                    className="flex-col md:flex-row"
                >
                    {steps.map((item, index) => (
                        <React.Fragment key={index}>
                            <StepCard item={item} index={index} />
                            {index < steps.length - 1 && (
                                <Connector
                                    index={index}
                                    fromAccent={steps[index].accent}
                                    toAccent={steps[index + 1].accent}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* ── Bottom CTA Block ── */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ delay: 0.2, duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                    style={{ textAlign: 'center', marginTop: 'clamp(48px, 7vw, 80px)' }}
                >
                    <p
                        style={{
                            fontSize: 'clamp(15px, 1.8vw, 18px)',
                            color: 'var(--text-secondary)',
                            marginBottom: '20px',
                            fontWeight: 400,
                        }}
                    >
                        Start restoring your photos today.
                    </p>
                    <button
                        onClick={handleCTA}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '14px 36px',
                            borderRadius: '50px',
                            background: 'linear-gradient(135deg, #007AFF 0%, #AF52DE 100%)',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 650,
                            letterSpacing: '-0.2px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 6px 24px rgba(0, 122, 255, 0.3)',
                            transition: 'transform 200ms ease, box-shadow 200ms ease, filter 200ms ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 10px 32px rgba(0, 122, 255, 0.4)';
                            e.currentTarget.style.filter = 'brightness(1.08)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 122, 255, 0.3)';
                            e.currentTarget.style.filter = 'none';
                        }}
                        onMouseDown={e => {
                            e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                        }}
                        onMouseUp={e => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        }}
                    >
                        <UploadCloud size={18} strokeWidth={2} />
                        Upload Image
                    </button>

                    {/* Trust micro badges */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'clamp(12px, 3vw, 28px)',
                            marginTop: '16px',
                            flexWrap: 'wrap',
                        }}
                    >
                        {[
                            { icon: '✔', label: '100% Private' },
                            { icon: '⚡', label: 'Under 10s' },
                            { icon: '📷', label: 'Up to 4K Output' },
                        ].map(({ icon, label }) => (
                            <span
                                key={label}
                                style={{
                                    fontSize: '13px',
                                    color: 'var(--text-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                }}
                            >
                                {icon} {label}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
