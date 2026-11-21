import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2 } from "lucide-react";

export function PlayerSidePanel() {
    const { session, round, currentPlayer } = useGame();

    if (session.config.mode !== "DRAFT") return null;

    const playersInTurnOrder = session.turnOrder
        .map((playerId) => session.players.find((player) => player.id === playerId))
        .filter((player) => player !== undefined);

    return (
        <section
            aria-labelledby="turn-order-heading"
            className="card-stock flex min-w-0 flex-col gap-5 p-5"
        >
            <div className="space-y-3">
                <div>
                    <p className="text-sm font-semibold text-[var(--color-muted)]">Giliran kartu</p>
                    <h2 id="turn-order-heading" className="mt-0.5 text-xl font-semibold text-[var(--color-ink)]">
                        Urutan pemain
                    </h2>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3.5 py-2.5 text-sm font-semibold text-[var(--color-ink-2)]">
                    <span>Ronde {session.roundCount}</span>
                    <span>{round.phase === "COMPLETE" ? "Selesai" : "Berjalan"}</span>
                </div>
            </div>

            <ol className="flex flex-col gap-2">
                {playersInTurnOrder.map((player, turnIndex) => {
                    const isCurrentTurn = player.id === currentPlayer?.id;
                    const isDone = turnIndex < round.currentTurnIndex;
                    const isWaiting = turnIndex > round.currentTurnIndex;

                    return (
                        <li
                            key={player.id}
                            className={cn(
                                "relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 transition-[background-color,border-color,opacity] duration-150",
                                isCurrentTurn
                                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-card)]"
                                    : isDone
                                        ? "border-[var(--color-mint-deep)] bg-[var(--color-hill-2)] text-[var(--color-ink)]"
                                        : "border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-ink-2)]",
                                isWaiting && "opacity-70"
                            )}
                        >
                            <div className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                isCurrentTurn
                                    ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                                    : isDone
                                        ? "bg-[var(--color-mint-deep)] text-[var(--color-card)]"
                                        : "bg-[var(--color-card)] text-[var(--color-muted)]"
                            )}>
                                {isCurrentTurn ? (
                                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                ) : isDone ? (
                                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                    <span className="num text-xs font-semibold">{turnIndex + 1}</span>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                    {player.name}
                                </p>
                                <p className={cn(
                                    "text-xs font-medium",
                                    isCurrentTurn ? "text-[var(--color-paper-2)]" : "text-[var(--color-muted)]"
                                )}>
                                    {isCurrentTurn ? "Sedang bermain" : isDone ? "Sudah selesai" : "Menunggu"}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ol>

            <div className="rounded-xl border border-dashed border-[var(--color-rule)] bg-[var(--color-paper-2)] p-3 text-center">
                <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                    Bacakan kartu sebelum menekan tombol selesai.
                </p>
            </div>
        </section>
    );
}
