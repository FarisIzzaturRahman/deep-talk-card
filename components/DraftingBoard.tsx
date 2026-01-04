import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, CheckCircle } from "lucide-react";
import { TurnBanner } from "./TurnBanner";
import { QuestionBottomSheet } from "./QuestionBottomSheet";

export function DraftingBoard() {
    const { round, session, currentPlayer, draftCard, confirmTurn } = useGame();

    // Only relevant if we are drafting
    if (session.config.mode !== 'DRAFT' || round.phase !== 'DRAFTING') return null;

    const isRevealed = round.turnStatus === 'REVEALED';
    const activePlayerName = currentPlayer?.name || "Player";

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[400px] gap-8 relative">

            {/* Mobile: Sticky Turn Banner */}
            <TurnBanner />

            {/* Desktop: Status Header */}
            <div className="hidden lg:block text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-bold uppercase tracking-widest border border-indigo-500/30"
                >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Draft Phase
                </motion.div>

                <div className="space-y-1">
                    <h2 className="text-3xl font-light text-white">
                        {isRevealed ? `${activePlayerName} Picked:` : `${activePlayerName}, Pick a Card`}
                    </h2>
                    {isRevealed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-indigo-300 font-bold"
                        >
                            (Read it aloud!)
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Cards Grid */}
            <div className={cn(
                "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full px-4",
                "lg:max-w-none" // Reset max-width on desktop since layout handles it
            )}>
                {round.availableCards.map((card) => (
                    <motion.button
                        key={card.id}
                        layoutId={`card-${card.id}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={!isRevealed ? { scale: 1.05, y: -5 } : {}}
                        whileTap={!isRevealed ? { scale: 0.95 } : {}}
                        onClick={() => !isRevealed && draftCard(card.id)}
                        disabled={isRevealed}
                        className={cn(
                            "aspect-[3/4] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all",
                            !isRevealed
                                ? "cursor-pointer ring-4 ring-transparent hover:ring-indigo-500/50 shadow-xl bg-slate-800"
                                : "cursor-not-allowed opacity-40 grayscale bg-slate-900"
                        )}
                    >
                        {/* Card Back Design */}
                        <div className="absolute inset-0 border-2 border-slate-700/50 rounded-2xl p-4">
                            <div className="w-full h-full rounded-xl border border-dashed border-slate-600/30 flex items-center justify-center bg-slate-900/50">
                                <div className="text-center space-y-2">
                                    <Sparkles className={cn(
                                        "w-8 h-8 mx-auto text-indigo-500/40 transition-all",
                                        !isRevealed && "group-hover:text-indigo-400 group-hover:scale-110"
                                    )} />
                                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Mystery</div>
                                </div>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Mobile: Bottom Sheet (Revealed State) */}
            <QuestionBottomSheet />

            {/* Desktop: Revealed Card Modal/Overlay */}
            <AnimatePresence>
                {isRevealed && currentPlayer && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        // Only show on LG (desktop) screens, Mobile uses Bottom Sheet
                        className="hidden lg:flex fixed inset-x-0 bottom-0 md:static md:w-full max-w-lg z-50 p-4"
                    >
                        <div className="w-full bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-6">

                            <div className="text-center space-y-4">
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                    {currentPlayer.name}'s Card
                                </span>
                                <CurrentQuestionDisplay />
                            </div>

                            <button
                                onClick={confirmTurn}
                                className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-4 rounded-xl font-black text-lg uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-6 h-6" />
                                <span>Selesai / Done</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper to avoid prop drilling loop issues if we need store inside map
function CurrentQuestionDisplay() {
    const { currentQuestion } = useGame();
    if (!currentQuestion) return null;
    return (
        <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
            "{currentQuestion.text}"
        </h3>
    );
}
