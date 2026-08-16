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
            className="w-full rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-xl backdrop-blur-sm sm:p-5 lg:p-6"
        >
            <div className="mb-5 hidden lg:flex lg:items-start lg:gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-slate-200">
                    <MessageCircleMore className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        {isSharedMode ? "Mode Shared" : `Ronde ${session.roundCount}`}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-white">
                        {isSharedMode ? "Satu pertanyaan untuk semua" : "Mainkan sesuai giliran"}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
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
                        className="group flex min-h-12 flex-1 items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
                    >
                        <span>
                            {isSharedMode ? "Pertanyaan Baru" : "Mulai Ronde Baru"}
                        </span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                )}

                <button
                    type="button"
                    onClick={endGame}
                    className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4 text-sm font-bold text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
                >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Akhiri Permainan
                </button>
            </div>
        </section>
    );
}
