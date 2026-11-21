import { useGame } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Flame, SkipForward, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef } from "react";

function WildcardIcon({ intensity }: { intensity?: 1 | 2 | 3 }) {
    if (intensity === 3) return <Flame className="h-4 w-4" aria-hidden="true" />;
    if (intensity === 2) return <Zap className="h-4 w-4" aria-hidden="true" />;
    return <Sparkles className="h-4 w-4" aria-hidden="true" />;
}

export function QuestionBottomSheet() {
    const {
        confirmTurn,
        currentPlayer,
        currentQuestion,
        round,
        session,
        skipQuestion,
    } = useGame();
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    const isVisible = session.config.mode === "DRAFT"
        && round.turnStatus === "REVEALED"
        && currentQuestion !== null;

    useEffect(() => {
        if (!isVisible) return;

        confirmButtonRef.current?.focus();
    }, [currentQuestion?.id, isVisible]);

    return (
        <AnimatePresence>
            {isVisible && currentQuestion && (
                <div
                    key={currentQuestion.id}
                    className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-8"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="pointer-events-auto absolute inset-0 bg-[var(--scrim)] backdrop-blur-[2px]"
                        aria-hidden="true"
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="draft-question-title"
                        initial={{ y: 32, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 32, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="card-stock pointer-events-auto relative flex max-h-[90dvh] w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-b-none p-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:p-7 lg:rounded-[24px] lg:p-8 xl:p-10"
                    >
                        <div className="mx-auto h-1.5 w-12 rounded-full bg-[var(--color-rule)] lg:hidden" aria-hidden="true" />

                        <div className="space-y-4 text-center">
                            <div className="flex flex-col items-center gap-2.5">
                                <span className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3.5 py-1 text-sm font-semibold text-[var(--color-ink-2)]">
                                    <Sparkles className="h-4 w-4 text-[var(--color-accent-2)]" aria-hidden="true" />
                                    <span>Kartu untuk {currentPlayer?.name}</span>
                                </span>
                                {currentQuestion.type === "wildcard" && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-3)] px-3.5 py-1 text-xs font-semibold text-[var(--color-card)] sm:text-sm">
                                        <WildcardIcon intensity={currentQuestion.intensity} />
                                        <span>Wildcard Lv {currentQuestion.intensity || 1}</span>
                                    </span>
                                )}
                            </div>

                            <h2 id="draft-question-title" className="text-balance text-2xl font-semibold leading-snug text-[var(--color-ink)] sm:text-3xl xl:text-4xl">
                                {currentQuestion.text}
                            </h2>
                        </div>

                        <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 text-center lg:hidden">
                            <p className="text-sm font-medium text-[var(--color-ink-2)]">
                                Bacakan pertanyaannya untuk semua pemain.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:mx-auto lg:w-full lg:max-w-lg">
                            <button
                                type="button"
                                onClick={skipQuestion}
                                className="btn-stock flex flex-1 cursor-pointer items-center justify-center gap-2 px-5 py-3.5 text-sm"
                            >
                                <SkipForward className="h-5 w-5" aria-hidden="true" />
                                <span>Lewati</span>
                            </button>
                            <button
                                ref={confirmButtonRef}
                                type="button"
                                onClick={confirmTurn}
                                className="btn-primary flex flex-[1.35] cursor-pointer items-center justify-center gap-2 px-6 py-3.5 text-base"
                            >
                                <CheckCircle className="h-5 w-5" aria-hidden="true" />
                                <span>Selesai menjawab</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
