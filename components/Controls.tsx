import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ArrowRight, Clock, LogOut, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const SPEED_MODE_DURATION = 60;

export function Controls() {
    const { startRound, endGame, gameStatus, session, round } = useGame();
    const [speedModeEnabled, setSpeedModeEnabled] = useState(false);
    const [timer, setTimer] = useState(SPEED_MODE_DURATION);

    const isSpeedMode = speedModeEnabled && timer > 0;
    const canStartRound = session.config.mode === "SHARED" || round.phase === "COMPLETE";

    useEffect(() => {
        if (!isSpeedMode) return;

        const timeout = window.setTimeout(() => {
            setTimer((currentTimer) => Math.max(0, currentTimer - 1));
        }, 1000);

        return () => window.clearTimeout(timeout);
    }, [isSpeedMode, timer]);

    if (gameStatus !== "PLAYING") return null;

    const toggleSpeedMode = () => {
        if (isSpeedMode) {
            setSpeedModeEnabled(false);
            return;
        }

        setTimer(SPEED_MODE_DURATION);
        setSpeedModeEnabled(true);
    };

    return (
        <div className="mx-auto mt-6 flex w-full max-w-md flex-col items-center gap-6 px-4">
            <div className="w-full space-y-3">
                {canStartRound && (
                    <button
                        onClick={startRound}
                        className={cn(
                            "group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-3xl px-8 py-5 text-xl font-black shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                            isSpeedMode
                                ? "bg-rose-500 text-white shadow-rose-900/20"
                                : "bg-white text-slate-950 shadow-slate-900/40",
                        )}
                    >
                        <span className="relative z-10 uppercase tracking-widest">
                            {session.config.mode === "DRAFT"
                                ? "Mulai Ronde Baru"
                                : "Pertanyaan Baru"}
                        </span>
                        <ArrowRight className="h-6 w-6" aria-hidden="true" />
                        <span className="absolute inset-x-0 top-0 h-px bg-white/20" />
                    </button>
                )}

                <div className="flex w-full gap-3">
                    <button
                        onClick={toggleSpeedMode}
                        aria-pressed={isSpeedMode}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/5 px-4 py-4 text-xs font-bold transition-all",
                            isSpeedMode
                                ? "border-rose-500/30 bg-rose-500/20 text-rose-300"
                                : "bg-slate-800/40 text-slate-500 hover:bg-slate-800/60 hover:text-white",
                        )}
                    >
                        {isSpeedMode ? (
                            <Clock className="h-4 w-4 animate-pulse" aria-hidden="true" />
                        ) : (
                            <Zap className="h-4 w-4" aria-hidden="true" />
                        )}
                        {isSpeedMode ? `${timer}s` : "Speed Mode"}
                    </button>

                    <button
                        onClick={endGame}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/5 bg-slate-800/40 px-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 transition-all hover:border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-300"
                    >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Selesai
                    </button>
                </div>
            </div>
        </div>
    );
}
