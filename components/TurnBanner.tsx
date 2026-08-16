import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function TurnBanner() {
    const { session, round, currentPlayer } = useGame();

    if (session.config.mode !== 'DRAFT') return null;

    return (
        <div className="pointer-events-none sticky top-2 z-40 w-full lg:hidden">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="pointer-events-auto flex items-center justify-between rounded-2xl border border-indigo-400/25 bg-slate-900/95 px-3 py-3 shadow-xl backdrop-blur-md sm:px-4"
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase leading-none tracking-[0.16em] text-indigo-300">
                            Giliran Sekarang
                        </span>
                        <span className="mt-1.5 block truncate text-sm font-bold leading-none text-white">
                            {currentPlayer?.name}
                        </span>
                    </div>
                </div>

                <div className="ml-3 shrink-0 rounded-full border border-white/5 bg-slate-800 px-3 py-1.5 text-[10px] font-bold text-slate-400">
                    {round.currentTurnIndex + 1} / {session.players.length}
                </div>
            </motion.div>
        </div>
    );
}
