import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, SkipForward, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

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

    const isDraftMode = session.config.mode === 'DRAFT';
    const isRevealed = round.turnStatus === 'REVEALED';

    useEffect(() => {
        if (!isDraftMode || !isRevealed || !currentQuestion || window.matchMedia("(min-width: 1024px)").matches) return;

        confirmButtonRef.current?.focus();
    }, [currentQuestion, isDraftMode, isRevealed]);

    if (!isDraftMode || !isRevealed || !currentQuestion) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center lg:hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-auto absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
                aria-hidden="true"
            />

            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="draft-question-title"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="pointer-events-auto relative flex max-h-[90dvh] w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-t-3xl border border-b-0 border-indigo-400/25 bg-slate-900 p-5 pb-[max(2rem,env(safe-area-inset-bottom))] shadow-2xl sm:p-7"
            >
                <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-700/70" aria-hidden="true" />

                <div className="space-y-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <span className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                            Kartu untuk {currentPlayer?.name}
                        </span>
                        {currentQuestion.type === 'wildcard' && (
                            <span className={cn(
                                "flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm",
                                currentQuestion.intensity === 3
                                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                                    : currentQuestion.intensity === 2
                                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            )}>
                                {currentQuestion.intensity === 3 ? "🔥" : currentQuestion.intensity === 2 ? "⚡" : "✨"}
                                Wildcard
                            </span>
                        )}
                    </div>

                    <h2 id="draft-question-title" className="text-balance text-2xl font-medium leading-relaxed text-white sm:text-3xl">
                        {currentQuestion.text}
                    </h2>
                </div>

                <div className="rounded-2xl border border-indigo-400/15 bg-indigo-500/10 p-4 text-center">
                    <p className="text-sm font-medium text-indigo-100">
                        Bacakan pertanyaannya untuk semua pemain.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={skipQuestion}
                        className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-[0.98]"
                    >
                        <SkipForward className="h-5 w-5" aria-hidden="true" />
                        <span>Lewati</span>
                    </button>
                    <button
                        ref={confirmButtonRef}
                        type="button"
                        onClick={confirmTurn}
                        className="flex min-h-12 flex-[1.35] items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-[0.98]"
                    >
                        <CheckCircle className="h-5 w-5" aria-hidden="true" />
                        <span>Selesai Menjawab</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
