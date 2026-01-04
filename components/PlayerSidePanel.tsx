import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { User, CheckCircle, Clock, Loader2 } from "lucide-react";

export function PlayerSidePanel() {
    const { session, round, currentPlayer } = useGame();

    // Only show in DRAFT mode
    if (session.config.mode !== 'DRAFT') return null;

    return (
        <div className="hidden lg:flex flex-col gap-6 w-80 shrink-0 h-fit sticky top-8">
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Round Status</h3>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900/50 p-3 rounded-xl border border-white/5">
                    <span>Round {session.roundCount}</span>
                    <span>{round.phase}</span>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Turn Order</h4>

                <div className="flex flex-col gap-3">
                    {session.players.map((player) => {
                        const turnIndex = session.turnOrder.indexOf(player.id);
                        const isCurrentTurn = player.id === currentPlayer?.id;
                        const isDone = turnIndex < round.currentTurnIndex;
                        const isWaiting = turnIndex > round.currentTurnIndex;

                        return (
                            <motion.div
                                key={player.id}
                                layoutId={`sidebar-player-${player.id}`}
                                initial={false}
                                animate={{
                                    scale: isCurrentTurn ? 1.05 : 1,
                                    opacity: isWaiting ? 0.5 : 1
                                }}
                                className={cn(
                                    "relative p-4 rounded-xl border transition-all flex items-center gap-3 overflow-hidden",
                                    isCurrentTurn
                                        ? "bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                        : isDone
                                            ? "bg-emerald-500/5 border-emerald-500/20"
                                            : "bg-slate-800/40 border-white/5"
                                )}
                            >
                                {/* Status Icon */}
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                    isCurrentTurn
                                        ? "bg-indigo-500 text-white border-indigo-400"
                                        : isDone
                                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                            : "bg-slate-700 text-slate-400 border-slate-600"
                                )}>
                                    {isCurrentTurn ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : isDone ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <span className="text-xs font-bold">{turnIndex + 1}</span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h5 className={cn(
                                        "font-bold truncate transition-colors",
                                        isCurrentTurn ? "text-indigo-200" : isDone ? "text-emerald-200" : "text-slate-400"
                                    )}>
                                        {player.name}
                                    </h5>
                                    <p className="text-[10px] uppercase tracking-widest font-medium opacity-60">
                                        {isCurrentTurn ? "Thinking..." : isDone ? "Ready" : "Waiting"}
                                    </p>
                                </div>

                                {isCurrentTurn && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Desktop-only Key Hint or Decor */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/30 border border-dashed border-white/10 text-center">
                <p className="text-[10px] text-slate-500 font-medium">
                    Pro Tip: Read the card aloud before clicking Done.
                </p>
            </div>
        </div>
    );
}
