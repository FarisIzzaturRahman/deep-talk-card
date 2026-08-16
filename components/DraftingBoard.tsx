import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, CheckCircle, SkipForward } from "lucide-react";
import { useEffect, useRef } from "react";
import { TurnBanner } from "./TurnBanner";
import { QuestionBottomSheet } from "./QuestionBottomSheet";

export function DraftingBoard() {
    const {
        confirmTurn,
        currentPlayer,
        currentQuestion,
        draftCard,
        round,
        session,
        skipQuestion,
    } = useGame();
    const desktopConfirmButtonRef = useRef<HTMLButtonElement>(null);
    const isDrafting = session.config.mode === 'DRAFT' && round.phase === 'DRAFTING';
    const isRevealed = round.turnStatus === 'REVEALED';

    useEffect(() => {
        if (!isDrafting || !isRevealed || !window.matchMedia("(min-width: 1024px)").matches) return;

        desktopConfirmButtonRef.current?.focus();
    }, [isDrafting, isRevealed]);

    if (!isDrafting) return null;

    const activePlayerName = currentPlayer?.name || "Pemain";

    return (
        <div className="relative flex w-full flex-col items-center gap-5 sm:gap-7">
            <TurnBanner />

            <div className="hidden space-y-3 text-center lg:block">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-200"
                >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-300" aria-hidden="true" />
                    Giliran {round.currentTurnIndex + 1} dari {session.players.length}
                </motion.div>

                <div>
                    <h2 className="text-balance text-2xl font-semibold text-white xl:text-3xl">
                        {isRevealed ? `${activePlayerName} sudah memilih` : `${activePlayerName}, pilih satu kartu`}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        {isRevealed ? "Bacakan pertanyaannya untuk semua pemain." : "Semua kartu masih menjadi misteri."}
                    </p>
                </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 xl:gap-5">
                {round.availableCards.map((card, index) => (
                    <motion.button
                        key={card.id}
                        type="button"
                        aria-label={`Pilih kartu misteri ${index + 1}`}
                        layoutId={`card-${card.id}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={!isRevealed ? { scale: 1.05, y: -5 } : {}}
                        whileTap={!isRevealed ? { scale: 0.95 } : {}}
                        onClick={() => !isRevealed && draftCard(card.id)}
                        disabled={isRevealed}
                        className={cn(
                            "group relative flex aspect-[3/4] min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                            !isRevealed
                                ? "cursor-pointer border-white/10 bg-slate-900 shadow-xl shadow-black/20 hover:border-indigo-400/50 hover:bg-slate-800"
                                : "cursor-not-allowed border-white/5 bg-slate-900 opacity-35 grayscale"
                        )}
                    >
                        <div className="absolute inset-0 p-2.5 sm:p-3.5">
                            <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-slate-600/50 bg-slate-950/40">
                                <div className="text-center space-y-2">
                                    <Sparkles className={cn(
                                        "mx-auto h-7 w-7 text-indigo-400/40 transition sm:h-8 sm:w-8",
                                        !isRevealed && "group-hover:scale-110 group-hover:text-indigo-300"
                                    )} aria-hidden="true" />
                                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Misteri</div>
                                </div>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            <QuestionBottomSheet />

            <AnimatePresence>
                {isRevealed && currentPlayer && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="desktop-draft-question-title"
                        className="fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/80 p-8 backdrop-blur-sm lg:flex"
                    >
                        <div className="flex w-full max-w-2xl flex-col items-center gap-7 rounded-3xl border border-indigo-400/25 bg-slate-900 p-8 text-center shadow-2xl shadow-black/40 xl:p-10">

                            <div className="space-y-4">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">
                                    Kartu untuk {currentPlayer.name}
                                </p>
                                {currentQuestion && (
                                    <h2 id="desktop-draft-question-title" className="text-balance text-3xl font-medium leading-relaxed text-white xl:text-4xl">
                                        &ldquo;{currentQuestion.text}&rdquo;
                                    </h2>
                                )}
                            </div>

                            <div className="flex w-full max-w-lg gap-3">
                                <button
                                    type="button"
                                    onClick={skipQuestion}
                                    className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-[0.98]"
                                >
                                    <SkipForward className="h-5 w-5" aria-hidden="true" />
                                    <span>Lewati</span>
                                </button>
                                <button
                                    ref={desktopConfirmButtonRef}
                                    type="button"
                                    onClick={confirmTurn}
                                    className="flex min-h-12 flex-[1.35] items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-[0.98]"
                                >
                                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                                    <span>Selesai Menjawab</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
