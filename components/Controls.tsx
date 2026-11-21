import { useGame } from "@/lib/store";
import { ArrowRight, LogOut, MessageCircleMore } from "lucide-react";

export function Controls() {
    const { startRound, endGame, gameStatus, session, round } = useGame();
    const canStartRound = session.config.mode === "SHARED" || round.phase === "COMPLETE";
    const isSharedMode = session.config.mode === "SHARED";

    if (gameStatus !== "PLAYING") return null;

    return (
        <section
            aria-label="Kontrol permainan"
            className="card-stock w-full p-4 sm:p-5 lg:p-6"
        >
            <div className="mb-5 hidden lg:flex lg:items-start lg:gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-paper-2)] text-[var(--color-ink)]">
                    <MessageCircleMore className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-[var(--color-muted)]">
                        {isSharedMode ? "Main bareng" : `Ronde ${session.roundCount}`}
                    </p>
                    <h2 className="mt-0.5 text-lg font-semibold text-[var(--color-ink)]">
                        {isSharedMode ? "Satu pertanyaan untuk semua" : "Mainkan sesuai giliran"}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
                        {isSharedMode
                            ? "Beri ruang untuk semua orang menjawab sebelum mengambil kartu berikutnya."
                            : "Setiap pemain memilih satu kartu, lalu membacanya dengan lantang."}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                {canStartRound && (
                    <button
                        type="button"
                        onClick={startRound}
                        className="btn-primary group flex flex-1 cursor-pointer items-center justify-center gap-2.5 px-5 py-3.5 text-base"
                    >
                        <span>
                            {isSharedMode ? "Pertanyaan baru" : "Mulai ronde baru"}
                        </span>
                        <ArrowRight className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                )}

                <button
                    type="button"
                    onClick={endGame}
                    className="btn-stock flex flex-1 cursor-pointer items-center justify-center gap-2 px-5 py-3.5 text-sm text-[var(--color-ink-2)] hover:text-[var(--color-error)]"
                >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>Akhiri permainan</span>
                </button>
            </div>
        </section>
    );
}
