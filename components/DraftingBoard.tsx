import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, User, CheckCircle, ArrowRight } from "lucide-react";

export function DraftingBoard() {
    const { round, session, currentPlayer, draftCard, confirmTurn } = useGame();

    // Only relevant if we are drafting
    if (session.config.mode !== 'DRAFT' || round.phase !== 'DRAFTING') return null;

    const isRevealed = round.turnStatus === 'REVEALED';
    const activePlayerName = currentPlayer?.name || "Player";

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[400px] gap-8">

            {/* Status Header */}
            <div className="text-center space-y-4">
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

                {/* Turn Order Indicator */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    {session.players.map((p) => {
                        // We need to find this player's index in turnOrder to know if they went or are going
                        const turnIndex = session.turnOrder.indexOf(p.id);
                        const isActive = p.id === currentPlayer?.id;
                        const isDone = turnIndex < round.currentTurnIndex;

                        return (
                            <div key={p.id} className="relative group">
                                <div className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    isActive ? "w-8 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" :
                                        isDone ? "bg-slate-600" : "bg-slate-800"
                                )} />
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {p.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl px-4">
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
                                ? "cursor-pointer ring-4 ring-transparent hover:ring-indigo-500/50 shadow-xl"
                                : "cursor-not-allowed opacity-40 grayscale"
                        )}
                    >
                        {/* Card Back Design */}
                        <div className="absolute inset-0 bg-slate-800 border-2 border-slate-700/50 rounded-2xl p-4">
                            <div className="w-full h-full rounded-xl border border-dashed border-slate-600/30 flex items-center justify-center bg-slate-900/50">
                                <div className="text-center space-y-2">
                                    <Sparkles className="w-8 h-8 mx-auto text-indigo-500/40 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
                                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Mystery</div>
                                </div>
                            </div>
                        </div>
                    </motion.button>
                ))}

                {/* The Revealed Card (if any) */}
                {/* 
                   Actually, if isRevealed, the picked card is theoretically removed from availableCards 
                   in the engine logic (splice). We should show it prominently instead.
                */}
            </div>

            {/* Revealed Card Overlay / Modal-ish */}
            <AnimatePresence>
                {isRevealed && currentPlayer && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-x-0 bottom-0 md:static md:w-full max-w-lg z-50 p-4"
                    >
                        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-6">

                            {/* Card Content Placeholder - ideally we grab currentQuestion from store */}
                            {/* We need the question text here. The store computes currentQuestion for us based on reveals. */}
                            <div className="text-center space-y-4">
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                    {currentPlayer.name}'s Card
                                </span>
                                {/* We need to access the text. But the component implies we need to connect `currentQuestion` */}
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
