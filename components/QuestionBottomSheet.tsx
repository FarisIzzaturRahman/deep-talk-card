import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";

export function QuestionBottomSheet() {
    const { round, session, currentPlayer, currentQuestion, confirmTurn } = useGame();

    const isDraftMode = session.config.mode === 'DRAFT';
    const isRevealed = round.turnStatus === 'REVEALED';

    // Only show on Mobile, when Revealed, in Draft Mode
    // Check viewport? We can just use CSS media queries to hide/show 
    // or rely on the parent to only render this on mobile. 
    // Let's rely on CSS 'lg:hidden' for safety.

    if (!isDraftMode || !isRevealed || !currentQuestion) return null;

    return (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
            />

            {/* Sheet */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full bg-slate-900 border-t border-indigo-500/30 rounded-t-[2.5rem] p-6 pb-12 shadow-2xl pointer-events-auto flex flex-col gap-6"
            >
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-slate-700/50 rounded-full mx-auto" />

                <div className="space-y-2 text-center">
                    <span className="text-[10px] uppercase text-indigo-400 font-bold tracking-widest flex items-center justify-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        {currentPlayer?.name}&apos;s Card
                    </span>

                    <h2 className="text-xl font-medium text-white leading-relaxed">
                        {currentQuestion.text}
                    </h2>
                </div>

                <div className="bg-indigo-500/10 rounded-xl p-4 text-center border border-indigo-500/20">
                    <p className="text-xs text-indigo-200 font-medium">
                        Read the question aloud to the group!
                    </p>
                </div>

                <button
                    onClick={confirmTurn}
                    className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-4 rounded-xl font-black text-lg uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <CheckCircle className="w-6 h-6" />
                    <span>Selesai / Done</span>
                </button>
            </motion.div>
        </div>
    );
}
