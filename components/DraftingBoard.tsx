import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TurnBanner } from "./TurnBanner";
import { QuestionBottomSheet } from "./QuestionBottomSheet";

export function DraftingBoard() {
    const {
        currentPlayer,
        draftCard,
        round,
        session,
    } = useGame();
    const isDrafting = session.config.mode === "DRAFT" && round.phase === "DRAFTING";
    const isRevealed = round.turnStatus === "REVEALED";

    if (!isDrafting) return null;

    const activePlayerName = currentPlayer?.name || "Pemain";

    return (
        <div className="relative flex w-full flex-col items-start gap-5 sm:gap-7">
            <TurnBanner />

            <div className="hidden space-y-2 lg:block">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3.5 py-1.5 text-sm font-semibold text-[var(--color-ink-2)]">
                    <Sparkles className="h-4 w-4 text-[var(--color-accent-2)]" aria-hidden="true" />
                    <span className="num">
                        Giliran {round.currentTurnIndex + 1} dari {session.players.length}
                    </span>
                </div>

                <div>
                    <h2 className="text-balance text-2xl font-semibold text-[var(--color-ink)] xl:text-3xl">
                        {isRevealed ? `${activePlayerName} sudah memilih` : `${activePlayerName}, pilih satu kartu`}
                    </h2>
                    <p className="mt-1 text-base text-[var(--color-muted)]">
                        {isRevealed ? "Bacakan pertanyaannya untuk semua pemain." : "Semua kartu masih tertutup."}
                    </p>
                </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
                {round.availableCards.map((card, index) => (
                    <motion.button
                        key={card.id}
                        type="button"
                        aria-label={`Pilih kartu misteri ${index + 1}`}
                        layoutId={`card-${card.id}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => !isRevealed && draftCard(card.id)}
                        disabled={isRevealed}
                        className={cn(
                            "card-stock group relative flex aspect-[3/4] min-w-0 flex-col items-center justify-center overflow-hidden p-3",
                            !isRevealed
                                ? "card-stock-interactive cursor-pointer"
                                : "cursor-not-allowed opacity-45"
                        )}
                    >
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-edge)] bg-[var(--color-paper-2)]">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-ink)]">
                                <Sparkles className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <span className="num text-sm font-semibold text-[var(--color-ink-2)]">
                                Kartu {index + 1}
                            </span>
                        </div>
                    </motion.button>
                ))}
            </div>

            <QuestionBottomSheet />
        </div>
    );
}
