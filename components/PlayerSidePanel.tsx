import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

export function PlayerSidePanel() {
    const { session, round, currentPlayer } = useGame();

    if (session.config.mode !== 'DRAFT') return null;

    const playersInTurnOrder = session.turnOrder
        .map((playerId) => session.players.find((player) => player.id === playerId))
        .filter((player) => player !== undefined);

    return (
        <section
            aria-labelledby="turn-order-heading"
            className="flex min-w-0 flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur-sm"
        >
            <div className="space-y-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">Mode Draft</p>
                    <h2 id="turn-order-heading" className="mt-1 text-xl font-semibold text-white">Urutan Pemain</h2>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/40 p-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    <span>Ronde {session.roundCount}</span>
                    <span>{round.phase === "COMPLETE" ? "Selesai" : "Berjalan"}</span>
                </div>
            </div>

            <div>
                <ol className="flex flex-col gap-2">
                    {playersInTurnOrder.map((player, turnIndex) => {
                        const isCurrentTurn = player.id === currentPlayer?.id;
                        const isDone = turnIndex < round.currentTurnIndex;
                        const isWaiting = turnIndex > round.currentTurnIndex;

                        return (
                            <motion.li
                                key={player.id}
                                layoutId={`sidebar-player-${player.id}`}
                                initial={false}
                                animate={{
                                    scale: isCurrentTurn ? 1.05 : 1,
                                    opacity: isWaiting ? 0.5 : 1
                                }}
                                className={cn(
                                    "relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 transition-all",
                                    isCurrentTurn
                                        ? "border-indigo-400/40 bg-indigo-500/15"
                                        : isDone
                                            ? "border-emerald-400/15 bg-emerald-500/5"
                                            : "border-white/5 bg-slate-950/30"
                                )}
                            >
                                <div className={cn(
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                                    isCurrentTurn
                                        ? "border-indigo-300 bg-indigo-500 text-white"
                                        : isDone
                                            ? "border-emerald-400/25 bg-emerald-500/15 text-emerald-300"
                                            : "border-slate-600 bg-slate-800 text-slate-400"
                                )}>
                                    {isCurrentTurn ? (
                                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                    ) : isDone ? (
                                        <CheckCircle className="h-4 w-4" aria-hidden="true" />
                                    ) : (
                                        <span className="text-xs font-bold">{turnIndex + 1}</span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "truncate text-sm font-bold transition-colors",
                                        isCurrentTurn ? "text-indigo-200" : isDone ? "text-emerald-200" : "text-slate-400"
                                    )}>
                                        {player.name}
                                    </p>
                                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                                        {isCurrentTurn ? "Sedang bermain" : isDone ? "Sudah selesai" : "Menunggu"}
                                    </p>
                                </div>
                            </motion.li>
                        );
                    })}
                </ol>
            </div>

            <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/30 p-3 text-center">
                <p className="text-xs leading-relaxed text-slate-500">
                    Bacakan kartu sebelum menekan tombol selesai.
                </p>
            </div>
        </section>
    );
}
