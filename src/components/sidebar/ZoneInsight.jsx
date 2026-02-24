import React, { useEffect } from 'react';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { Sparkles, AlertTriangle, ScanEye, User, Maximize, Palette, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RECIPES } from '../../data/CommandRegistry';

// ─────────────────────────────────────────────────────────────
// RECIPE CHIP COMPONENT
// ─────────────────────────────────────────────────────────────

const RecipeChip = ({ recipe, onClick, active }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(recipe.id)}
        className={`
            flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all
            ${active
                ? 'bg-primary/20 border border-primary/50 text-primary shadow-lg shadow-primary/10'
                : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 hover:text-text-main hover:border-white/20'
            }
        `}
    >
        <span className="text-sm">{recipe.label.split(' ')[0]}</span>
        <span>{recipe.label.split(' ').slice(1).join(' ')}</span>
    </motion.button>
);

// ─────────────────────────────────────────────────────────────
// INSIGHT CARD COMPONENT
// ─────────────────────────────────────────────────────────────

const InsightCard = ({ icon: Icon, label, value, color = 'blue', action }) => (
    <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
            flex items-center justify-between p-2.5 rounded-lg
            bg-${color}-500/10 border border-${color}-500/20
        `}
    >
        <div className="flex items-center gap-2">
            <Icon size={14} className={`text-${color}-400`} />
            <span className="text-xs text-text-secondary">{label}</span>
        </div>
        <span className={`text-xs font-medium text-${color}-400`}>{value}</span>
    </motion.div>
);

// ─────────────────────────────────────────────────────────────
// MAIN ZONE INSIGHT
// ─────────────────────────────────────────────────────────────

const ZoneInsight = ({ isMobile }) => {
    const { aiInsights, analyzeImage, applyRecipe, pendingQueue } = useCommand();
    const { originalImage } = useImage();

    // Trigger analysis when image changes
    useEffect(() => {
        if (originalImage) {
            analyzeImage(originalImage);
        }
    }, [originalImage, analyzeImage]);

    // Don't render if no image
    if (!originalImage) return null;

    const recipeIds = Object.keys(RECIPES);

    return (
        <div className="bg-gradient-to-b from-black/60 to-transparent border-b border-white/5 p-4 space-y-4 z-10 sticky top-0 backdrop-blur-xl">

            {/* ─── Header ─── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${aiInsights.analyzing ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                        <ScanEye className={`w-3.5 h-3.5 ${aiInsights.analyzing ? 'text-blue-400 animate-pulse' : 'text-text-tertiary'}`} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        {aiInsights.analyzing ? 'Analyzing...' : 'AI Insights'}
                    </span>
                </div>

                {!aiInsights.analyzing && aiInsights.quality && (
                    <span className={`
                        text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                        ${aiInsights.quality === 'low'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                        }
                    `}>
                        {aiInsights.quality} res
                    </span>
                )}
            </div>

            {/* ─── Analysis Results ─── */}
            <AnimatePresence>
                {!aiInsights.analyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                    >
                        {/* Warning Banner */}
                        {aiInsights.quality === 'low' && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3"
                            >
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-amber-200 font-medium">Low Resolution</p>
                                    <p className="text-[11px] text-amber-200/70 leading-relaxed mt-0.5">
                                        We recommend upscaling for better quality.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Detection Stats */}
                        <div className="grid grid-cols-2 gap-2">
                            {aiInsights.facesDetected > 0 && (
                                <InsightCard
                                    icon={User}
                                    label="Faces"
                                    value={aiInsights.facesDetected}
                                    color="blue"
                                />
                            )}
                            {aiInsights.isGrayscale && (
                                <InsightCard
                                    icon={Palette}
                                    label="B&W"
                                    value="Detected"
                                    color="purple"
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Quick Recipes ─── */}
            <div className="space-y-2">
                <p className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
                    Quick Actions
                </p>
                <div className="flex flex-wrap gap-2">
                    {recipeIds.map(id => (
                        <RecipeChip
                            key={id}
                            recipe={RECIPES[id]}
                            onClick={applyRecipe}
                            active={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ZoneInsight;
