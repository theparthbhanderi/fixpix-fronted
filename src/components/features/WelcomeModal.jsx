import React from 'react';
import { X, Upload, Wand2, Sparkles, Download } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Welcome Modal Content
 * A mobile-friendly onboarding modal that explains the app.
 * This is the CONTENT only - it renders inside the global ModalPortal.
 */
const WelcomeModalContent = ({ onClose, onGetStarted }) => {
    const steps = [
        {
            icon: Upload,
            title: 'Upload',
            description: 'Drop or select an old photo'
        },
        {
            icon: Wand2,
            title: 'Enhance',
            description: 'Choose AI restoration tools'
        },
        {
            icon: Download,
            title: 'Download',
            description: 'Save your restored memory'
        }
    ];

    return (
        <div className="welcome-modal-content">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--fill-tertiary)' }}
                aria-label="Close"
            >
                <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
                <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--accent), rgb(88 86 214))' }}
                >
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Welcome to FixPix!
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Restore your precious memories with AI
                </p>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-6">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-xl"
                        style={{ backgroundColor: 'var(--fill-tertiary)' }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'var(--accent-soft)' }}
                        >
                            <step.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                        </div>
                        <div>
                            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                {step.title}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {step.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <Button
                variant="filled"
                size="lg"
                className="w-full justify-center"
                onClick={onGetStarted}
            >
                Get Started
            </Button>

            {/* Skip Link */}
            <button
                onClick={onClose}
                className="w-full mt-3 py-2 text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
            >
                Skip for now
            </button>
        </div>
    );
};

export default WelcomeModalContent;
