import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ArrowRight, LogOut, Zap, Clock } from "lucide-react";
import { useState } from "react";
import { FeedbackModal } from "./FeedbackModal";

export function Controls() {
    const {
        startRound,
        resetGame,
        gameStatus,
        timerMode,
        timer,
        startSpeedMode,
        stopSpeedMode,
        session
    } = useGame();
    const [showFeedback, setShowFeedback] = useState(false);

    if (gameStatus !== 'PLAYING') return null;

    const handleEndSession = () => {
        setShowFeedback(true);
    };

    const handleFeedbackClose = () => {
        setShowFeedback(false);
        resetGame();
    };

    const handleNext = () => {
        startRound();
    };

    return (
        <>
            <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto mt-6 px-4">

                {/* Main Action Buttons */}
                <div className="w-full space-y-3">
                    {/* Next Round Button */}
                    <div className="relative">
                        <button
                            onClick={handleNext}
                            className={cn(
                                "w-full relative group overflow-hidden rounded-[1.5rem] px-8 py-5 font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3",
                                timerMode === 'speed' ? "bg-rose-500 text-white shadow-rose-900/20" : "bg-white text-slate-950 shadow-slate-900/40"
                            )}
                        >
                            <span className="relative z-10 tracking-widest uppercase">
                                {session.config.mode === 'DRAFT' ? "New Draft Round" : "Pertanyaan Baru"}
                            </span>
                            <ArrowRight className="w-6 h-6" />

                            <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
                        </button>
                    </div>

                    <div className="flex w-full gap-3">
                        {/* Speed Mode Toggle */}
                        <button
                            onClick={() => timerMode === 'speed' ? stopSpeedMode() : startSpeedMode()}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-xs font-bold transition-all border border-white/5",
                                timerMode === 'speed'
                                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                                    : "bg-slate-800/40 text-slate-500 hover:text-white hover:bg-slate-800/60"
                            )}
                        >
                            {timerMode === 'speed' ? <Clock className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4" />}
                            {timerMode === 'speed' ? `${timer}s` : "Speed Mode"}
                        </button>

                        <button
                            onClick={handleEndSession}
                            className="flex-1 bg-slate-800/40 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-slate-500 hover:text-rose-300 rounded-2xl px-4 py-4 font-bold text-xs transition-all flex items-center justify-center gap-2 tracking-widest uppercase"
                        >
                            <LogOut className="w-4 h-4" />
                            Selesai
                        </button>
                    </div>
                </div>
            </div>

            <FeedbackModal isOpen={showFeedback} onClose={handleFeedbackClose} />
        </>
    );
}
