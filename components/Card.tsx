import { useGame } from "@/lib/store";
import { shareQuestionCardImage } from "@/lib/share-card";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Flame, MessageCircle, Share2, SkipForward, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

function WildcardIcon({ intensity }: { intensity?: 1 | 2 | 3 }) {
    if (intensity === 3) return <Flame className="h-4 w-4" aria-hidden="true" />;
    if (intensity === 2) return <Zap className="h-4 w-4" aria-hidden="true" />;
    return <Sparkles className="h-4 w-4" aria-hidden="true" />;
}

export function Card() {
    const {
        activeFollowUp,
        closeFollowUp,
        currentCategory,
        currentQuestion,
        showFollowUp,
        skipQuestion,
    } = useGame();
    const [shareFeedback, setShareFeedback] = useState<"idle" | "busy" | "done">("idle");

    if (!currentQuestion || !currentCategory) return null;

    const handleShare = async () => {
        if (shareFeedback === "busy") return;
        setShareFeedback("busy");
        try {
            const outcome = await shareQuestionCardImage(currentQuestion, currentCategory);
            if (outcome === "downloaded" || outcome === "shared") {
                setShareFeedback("done");
                setTimeout(() => setShareFeedback("idle"), 2000);
                return;
            }
        } catch {
            // Keep play uninterrupted if sharing fails.
        }
        setShareFeedback("idle");
    };

    const followUps = currentQuestion.followUps ?? [];
    const hasFollowUps = followUps.length > 0;
    const activeFollowUpIndex = activeFollowUp ? followUps.indexOf(activeFollowUp) : -1;
    const nextFollowUp = activeFollowUpIndex >= 0 ? followUps[activeFollowUpIndex + 1] : undefined;
    const isWildcard = currentQuestion.type === "wildcard";
    const isDarkCard = Boolean(currentCategory.isDarkSurface) && !isWildcard;

    const cardSurfaceStyle = isWildcard
        ? {
            backgroundColor: "var(--color-accent-3)",
            color: "var(--color-card)",
            boxShadow:
                "inset 0 0 0 2px var(--cat-wildcard-edge), 0 8px 0 0 var(--cat-wildcard-edge), var(--shadow-card)",
        }
        : {
            backgroundColor: currentCategory.surfaceBg,
            color: currentCategory.surfaceInk,
            boxShadow: `inset 0 0 0 1px ${currentCategory.surfaceEdge}, 0 8px 0 0 ${currentCategory.surfaceEdge}, var(--shadow-card)`,
        };

    const pillClass = isDarkCard || isWildcard
        ? "border-white/25 bg-black/15 text-[var(--color-card)]"
        : "border-black/15 bg-white/55 text-[var(--color-ink)]";

    return (
        <div className="relative mx-auto w-full max-w-3xl">
            <AnimatePresence mode="wait" initial={false}>
                {!activeFollowUp ? (
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-[16/10]"
                    >
                        <div
                            style={{
                                ...cardSurfaceStyle,
                                backgroundImage: "var(--grain)",
                            }}
                            className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[24px] p-6 text-center sm:p-10 lg:p-14"
                        >
                            <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-5 sm:p-7 lg:p-8">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <span className={`max-w-full truncate rounded-full border px-3.5 py-1 text-xs font-semibold sm:text-sm ${pillClass}`}>
                                        {currentCategory.label}
                                    </span>
                                    {currentQuestion.depth === 3 && (
                                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold sm:text-sm ${pillClass}`}>
                                            Mendalam
                                        </span>
                                    )}
                                    {isWildcard && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3.5 py-1 text-xs font-semibold text-[var(--color-accent)] sm:text-sm">
                                            <WildcardIcon intensity={currentQuestion.intensity} />
                                            <span>Wildcard Lv {currentQuestion.intensity || 1}</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center py-14 sm:py-16">
                                <h2 className="max-w-2xl text-balance text-2xl font-semibold leading-snug tracking-[-0.02em] sm:text-3xl sm:leading-snug lg:text-4xl lg:leading-tight">
                                    {currentQuestion.text}
                                </h2>
                            </div>

                            <div className="absolute inset-x-5 bottom-5 z-20 flex flex-wrap justify-center gap-3 sm:inset-x-7 sm:bottom-7 lg:bottom-8">
                                {hasFollowUps && (
                                    <button
                                        type="button"
                                        onClick={() => showFollowUp(followUps[0])}
                                        className="btn-stock flex min-h-11 cursor-pointer items-center gap-2 px-5 py-2.5 text-sm"
                                    >
                                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                        <span className="sm:hidden">Dalami</span>
                                        <span className="hidden sm:inline">Perdalam topik</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    disabled={shareFeedback === "busy"}
                                    aria-label="Bagikan kartu pertanyaan sebagai gambar"
                                    className="btn-stock flex min-h-11 cursor-pointer items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60"
                                >
                                    {shareFeedback === "done" ? (
                                        <Check className="h-4 w-4" aria-hidden="true" />
                                    ) : (
                                        <Share2 className="h-4 w-4" aria-hidden="true" />
                                    )}
                                    <span>{shareFeedback === "done" ? "Tersimpan" : "Bagikan"}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={skipQuestion}
                                    aria-label="Lewati pertanyaan ini"
                                    className="btn-stock flex min-h-11 cursor-pointer items-center gap-2 px-5 py-2.5 text-sm"
                                >
                                    <SkipForward className="h-4 w-4" aria-hidden="true" />
                                    <span>Lewati</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={`follow-up-${activeFollowUpIndex}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-[16/10]"
                    >
                        <div
                            style={{
                                backgroundColor: "var(--color-ink)",
                                backgroundImage: "var(--grain)",
                                color: "var(--color-card)",
                                boxShadow: "0 8px 0 0 var(--cat-deep-edge), var(--shadow-card)",
                            }}
                            className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[24px] p-6 text-center sm:p-10 lg:p-14"
                        >
                            <div className="absolute inset-x-0 top-6 z-20 flex justify-center sm:top-8">
                                <span className="rounded-full bg-[var(--color-accent)] px-3.5 py-1 text-xs font-semibold text-[var(--color-accent-ink)] sm:text-sm">
                                    {followUps.length > 1
                                        ? `Pertanyaan lanjutan ${activeFollowUpIndex + 1} dari ${followUps.length}`
                                        : "Pertanyaan lanjutan"}
                                </span>
                            </div>

                            <div className="relative z-10 max-w-2xl py-14">
                                <h2 className="text-balance text-2xl font-semibold leading-snug text-[var(--color-card)] sm:text-3xl lg:text-4xl">
                                    {activeFollowUp}
                                </h2>
                            </div>

                            <div className="absolute inset-x-5 bottom-5 z-20 flex flex-wrap justify-center gap-3 sm:bottom-8">
                                <button
                                    type="button"
                                    onClick={closeFollowUp}
                                    className="btn-stock min-h-11 cursor-pointer px-5 py-2.5 text-sm"
                                >
                                    Kembali ke pertanyaan utama
                                </button>
                                {nextFollowUp && (
                                    <button
                                        type="button"
                                        onClick={() => showFollowUp(nextFollowUp)}
                                        className="btn-primary flex min-h-11 cursor-pointer items-center gap-2 px-5 py-2.5 text-sm"
                                    >
                                        <span>Lanjutan berikutnya</span>
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
