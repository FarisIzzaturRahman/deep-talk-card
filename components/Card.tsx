import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";

export function Card() {
    const { currentQuestion, currentCategory, favorites, toggleFavorite, activeFollowUp, showFollowUp, closeFollowUp } = useGame();

    if (!currentQuestion || !currentCategory) return null;

    const isFavorite = favorites.includes(currentQuestion.id);
    const hasFollowUps = currentQuestion.followUps && currentQuestion.followUps.length > 0;

    return (
        <div className="relative w-full max-w-md mx-auto perspective-1000 min-h-[400px]">
            <AnimatePresence mode="wait">

                {/* Main Card State */}
                {!activeFollowUp ? (
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 50, rotate: 2 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        exit={{ opacity: 0, x: -50, rotate: -2 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="w-full h-full aspect-[3/4] md:aspect-[4/3]"
                    >
                        <div className={cn(
                            "relative w-full h-full rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden bg-gradient-to-br transition-colors duration-700",
                            currentCategory.gradient
                        )}>
                            {/* Texture/Pattern Overlay */}
                            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-125" />

                            {/* Top Metadata */}
                            <div className="absolute top-8 w-full px-8 flex justify-between items-center z-20">
                                <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md border border-white/20">
                                    {currentCategory.label}
                                </span>
                                <button
                                    onClick={() => toggleFavorite(currentQuestion.id)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <Heart className={cn("w-6 h-6 transition-colors", isFavorite ? "fill-white text-white" : "text-white/60 hover:text-white")} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full">
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-2xl md:text-4xl font-normal leading-relaxed text-white drop-shadow-sm tracking-wide font-sans"
                                >
                                    {currentQuestion.text}
                                </motion.h2>
                            </div>

                            {/* Bottom Actions (Follow Up) */}
                            {hasFollowUps && (
                                <div className="absolute bottom-8 z-20">
                                    <button
                                        onClick={() => showFollowUp(currentQuestion.followUps![0])}
                                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-all backdrop-blur-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Perdalam Topik</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    /* Follow-Up Card State */
                    <motion.div
                        key="follow-up"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full h-full aspect-[3/4] md:aspect-[4/3]"
                    >
                        <div className={cn(
                            "relative w-full h-full rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden bg-slate-900 border border-slate-800"
                        )}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                            <div className="absolute top-8 left-0 w-full flex justify-center z-20">
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                                    Pertanyaan Lanjutan
                                </span>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-light leading-relaxed text-slate-100">
                                    {activeFollowUp}
                                </h3>
                            </div>

                            <div className="absolute bottom-8 z-20">
                                <button
                                    onClick={closeFollowUp}
                                    className="px-6 py-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors text-sm"
                                >
                                    Kembali ke Pertanyaan Utama
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
