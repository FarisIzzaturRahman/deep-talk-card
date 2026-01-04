import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function TurnBanner() {
    const { session, round, currentPlayer } = useGame();

    if (session.config.mode !== 'DRAFT') return null;

    // Progress: How many people have picked?
    // picking = currentTurnIndex
    // If turnStatus is REVEALED, they are arguably "done picking" but not "done turn".
    // Let's just use currentTurnIndex as "Done Count" for simplicity, 
    // or maybe (currentTurnIndex + (turnStatus === 'REVEALED' ? 1 : 0))?
    // Actually simplicity is better: "Player X's Turn"

    return (
        <div className="lg:hidden w-full sticky top-0 z-40 px-4 py-2 pointer-events-none">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 rounded-full px-4 py-2 shadow-xl flex items-center justify-between pointer-events-auto"
            >
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                        <Loader2 className="w-3 h-3 animate-spin" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-indigo-300 font-bold tracking-widest leading-none">
                            Active Turn
                        </span>
                        <span className="text-xs font-bold text-white leading-none mt-1">
                            {currentPlayer?.name}
                        </span>
                    </div>
                </div>

                <div className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-full border border-white/5">
                    {round.currentTurnIndex} / {session.players.length} Done
                </div>
            </motion.div>
        </div>
    );
}
