import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, SkipForward } from "lucide-react";

export function Card() {
    const {
        activeFollowUp,
        closeFollowUp,
        currentCategory,
        currentQuestion,
        favorites,
        showFollowUp,
        skipQuestion,
        toggleFavorite,
    } = useGame();

    if (!currentQuestion || !currentCategory) return null;

    const isFavorite = favorites.includes(currentQuestion.id);
    const hasFollowUps = currentQuestion.followUps && currentQuestion.followUps.length > 0;

    return (
        <div className="relative mx-auto w-full max-w-3xl perspective-1000">
            <AnimatePresence mode="wait" initial={false}>

                {/* Main Card State */}
                {!activeFollowUp ? (
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-[16/10]"
                    >
                        <div className={cn(
                            "relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl border bg-gradient-to-br p-6 text-center shadow-2xl transition-colors duration-300 sm:p-10 lg:p-14",
                            currentQuestion.type === 'wildcard'
                                ? "border-amber-300/80 shadow-amber-950/30 saturate-[1.15]"
                                : "border-white/15 shadow-black/30",
                            currentCategory.gradient
                        )}>
                            <div className="absolute inset-0 bg-slate-950/10" aria-hidden="true" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/20 to-transparent" aria-hidden="true" />

                            {/* Interactive Glow for Wildcard */}
                            {(currentQuestion.type === 'wildcard') && (
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 0.6, 0.3],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="pointer-events-none absolute inset-0 bg-amber-300 opacity-20 blur-[100px]"
                                    aria-hidden="true"
                                />
                            )}

                            <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-5 sm:p-7 lg:p-8">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <span className="max-w-full truncate rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md sm:text-xs">
                                        {currentCategory.label}
                                    </span>
                                    {currentQuestion.depth === 3 && (
                                        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
                                            <span className="h-1.5 w-1.5 rounded-full bg-rose-200" aria-hidden="true" />
                                            Deep
                                        </span>
                                    )}
                                    {currentQuestion.type === 'wildcard' && (
                                        <span className={cn(
                                            "flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm",
                                            currentQuestion.intensity === 3
                                                ? "border-rose-300/40 bg-rose-500/20 text-rose-100"
                                                : currentQuestion.intensity === 2
                                                    ? "border-amber-300/40 bg-amber-500/20 text-amber-100"
                                                    : "border-emerald-300/40 bg-emerald-500/20 text-emerald-100"
                                        )}>
                                            <span className="text-xs" aria-hidden="true">
                                                {currentQuestion.intensity === 3 ? "🔥" : currentQuestion.intensity === 2 ? "⚡" : "✨"}
                                            </span>
                                            Wildcard · Lv {currentQuestion.intensity || 1}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggleFavorite(currentQuestion.id)}
                                    aria-label={isFavorite ? "Hapus dari favorit" : "Tambahkan ke favorit"}
                                    aria-pressed={isFavorite}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/10 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    <Heart
                                        className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-white text-white" : "text-white/70")}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>

                            <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center py-16 sm:py-20">
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="max-w-3xl text-balance text-2xl font-medium leading-relaxed tracking-tight text-white drop-shadow-sm sm:text-3xl sm:leading-relaxed lg:text-4xl xl:text-5xl xl:leading-snug"
                                >
                                    {currentQuestion.text}
                                </motion.h2>
                            </div>

                            <div className="absolute inset-x-5 bottom-5 z-20 flex flex-wrap justify-center gap-2 sm:inset-x-7 sm:bottom-7 lg:bottom-8">
                                {hasFollowUps && (
                                    <button
                                        type="button"
                                        onClick={() => showFollowUp(currentQuestion.followUps![0])}
                                        className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                    >
                                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                        <span className="sm:hidden">Dalami</span>
                                        <span className="hidden sm:inline">Perdalam Topik</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={skipQuestion}
                                    aria-label="Lewati pertanyaan ini"
                                    className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-slate-950/15 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:bg-slate-950/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    <SkipForward className="h-4 w-4" aria-hidden="true" />
                                    <span>Lewati</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Follow-Up Card State */
                    <motion.div
                        key="follow-up"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-[16/10]"
                    >
                        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-2xl shadow-black/30 sm:p-10 lg:p-14">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />

                            <div className="absolute inset-x-0 top-6 z-20 flex justify-center sm:top-8">
                                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Pertanyaan Lanjutan
                                </span>
                            </div>

                            <div className="relative z-10 max-w-3xl py-16">
                                <h2 className="text-balance text-2xl font-medium leading-relaxed text-slate-100 sm:text-3xl lg:text-4xl">
                                    {activeFollowUp}
                                </h2>
                            </div>

                            <div className="absolute bottom-5 z-20 sm:bottom-8">
                                <button
                                    type="button"
                                    onClick={closeFollowUp}
                                    className="min-h-11 rounded-full border border-slate-700 px-6 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
