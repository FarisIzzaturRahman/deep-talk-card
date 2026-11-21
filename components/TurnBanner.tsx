import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function TurnBanner() {
    const { session, round, currentPlayer } = useGame();

    if (session.config.mode !== "DRAFT") return null;

    return (
        <div className="pointer-events-none sticky top-2 z-40 w-full lg:hidden">
            <motion.div
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="card-stock pointer-events-auto flex items-center justify-between px-4 py-3"
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-accent)]">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <span className="block text-xs font-medium text-[var(--color-muted)]">
                            Giliran sekarang
                        </span>
                        <span className="mt-0.5 block truncate text-sm font-semibold text-[var(--color-ink)]">
                            {currentPlayer?.name}
                        </span>
                    </div>
                </div>

                <div className="num ml-3 shrink-0 rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-2)]">
                    {round.currentTurnIndex + 1} / {session.players.length}
                </div>
            </motion.div>
        </div>
    );
}
