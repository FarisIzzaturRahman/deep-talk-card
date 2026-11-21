import { CLOSING_MESSAGES } from "@/lib/data";
import { shareRecapCardImage } from "@/lib/share-card";
import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { Check, Coffee, Home, Share2 } from "lucide-react";
import { useState } from "react";
import { SaweriaSupportLink } from "./SaweriaSupportLink";

function formatDuration(startedAt: number, endedAt: number): string {
    const minutes = Math.floor(Math.max(0, endedAt - startedAt) / 60_000);
    if (minutes < 1) return "Kurang dari 1 menit";
    return `${minutes} menit`;
}

export function EmotionalClosing() {
    const { currentCategory, endedAt, resetGame, session } = useGame();
    const [message] = useState(() => {
        const randomIndex = Math.floor(Math.random() * CLOSING_MESSAGES.length);
        return CLOSING_MESSAGES[randomIndex];
    });
    const [fallbackEndTime] = useState(() => Date.now());
    const [shareFeedback, setShareFeedback] = useState<"idle" | "busy" | "done">("idle");
    const durationLabel = formatDuration(session.startedAt, endedAt ?? fallbackEndTime);
    const categoryLabel = currentCategory?.label ?? "Obrolan";

    const handleShareRecap = async () => {
        if (shareFeedback === "busy") return;
        setShareFeedback("busy");
        try {
            const outcome = await shareRecapCardImage({
                categoryLabel,
                message,
                answeredCount: session.answeredCount,
                skippedCount: session.skippedCount,
                durationLabel,
            });
            if (outcome === "downloaded" || outcome === "shared") {
                setShareFeedback("done");
                setTimeout(() => setShareFeedback("idle"), 2000);
                return;
            }
        } catch {
            // Keep closing screen uninterrupted if sharing fails.
        }
        setShareFeedback("idle");
    };

    return (
        <div className="paper-surface fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto p-5 text-center sm:p-8">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="card-stock relative z-10 flex w-full max-w-2xl flex-col items-center gap-6 p-7 sm:gap-8 sm:p-12"
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-[var(--color-accent-ink)] sm:h-20 sm:w-20">
                    <Coffee className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" />
                </div>

                <h1 className="max-w-[26ch] text-balance text-2xl font-semibold leading-snug text-[var(--color-ink)] sm:text-3xl lg:text-4xl">
                    &ldquo;{message}&rdquo;
                </h1>

                <dl
                    aria-label="Ringkasan sesi"
                    className="grid w-full max-w-md grid-cols-2 gap-3 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 text-left sm:grid-cols-3"
                >
                    <div className="min-w-0">
                        <dt className="text-xs font-medium text-[var(--color-muted)]">Topik</dt>
                        <dd className="mt-0.5 truncate text-sm font-semibold text-[var(--color-ink)]">
                            {currentCategory?.label ?? "Obrolan"}
                        </dd>
                    </div>
                    <div className="min-w-0">
                        <dt className="text-xs font-medium text-[var(--color-muted)]">Dijawab</dt>
                        <dd className="num mt-0.5 text-sm font-semibold text-[var(--color-ink)]">
                            {session.answeredCount} kartu
                            {session.skippedCount > 0 ? ` (${session.skippedCount} dilewati)` : ""}
                        </dd>
                    </div>
                    <div className="col-span-2 min-w-0 sm:col-span-1">
                        <dt className="text-xs font-medium text-[var(--color-muted)]">Durasi</dt>
                        <dd className="num mt-0.5 text-sm font-semibold text-[var(--color-ink)]">
                            {durationLabel}
                        </dd>
                    </div>
                </dl>

                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={handleShareRecap}
                            disabled={shareFeedback === "busy"}
                            className="btn-stock flex cursor-pointer items-center gap-2 px-6 py-3.5 text-base disabled:opacity-60"
                        >
                            {shareFeedback === "done" ? (
                                <Check className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <Share2 className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span>{shareFeedback === "done" ? "Ringkasan tersimpan" : "Bagikan ringkasan"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={resetGame}
                            className="btn-primary flex cursor-pointer items-center gap-2.5 px-7 py-3.5 text-base"
                        >
                            <Home className="h-4 w-4" aria-hidden="true" />
                            <span>Kembali ke awal</span>
                        </button>
                    </div>

                    <SaweriaSupportLink />
                    <p className="max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
                        Dukunganmu sepenuhnya opsional, tetapi sangat berarti untuk ajakBicara.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
