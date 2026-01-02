import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ArrowRight, RefreshCw, Shuffle, Users, LogOut } from "lucide-react";
import { useState } from "react";
import { FeedbackModal } from "./FeedbackModal";

export function Controls() {
    const { nextQuestion, resetGame, toggleGroupMode, isGroupMode } = useGame();
    const [showFeedback, setShowFeedback] = useState(false);

    // When ending game, show feedback first, then reset? 
    // Or just separate button.
    // Requirement: "Muncul hanya saat user mengakhiri"

    const handleEndSession = () => {
        setShowFeedback(true);
    };

    const handleFeedbackClose = () => {
        setShowFeedback(false);
        resetGame(); // Navigate back to category selection after feedback
    };

    return (
        <>
            <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto mt-6 px-4">
                {/* Top: Group Mode Toggle */}
                <button
                    onClick={toggleGroupMode}
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all border",
                        isGroupMode
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-transparent text-slate-500 border-transparent hover:bg-white/5"
                    )}
                >
                    <Users className="w-3.5 h-3.5" />
                    {isGroupMode ? "Mode Grup: Aktif" : "Mode Solo"}
                </button>

                {/* Main Action */}
                <button
                    onClick={nextQuestion}
                    className="w-full relative group overflow-hidden bg-slate-100 text-slate-900 rounded-2xl px-8 py-5 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3"
                >
                    <span className="relative z-10 tracking-wide">
                        {isGroupMode ? "Giliran Selanjutnya" : "Pertanyaan Baru"}
                    </span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Secondary Actions Row */}
                <div className="flex w-full gap-3">
                    <button
                        onClick={nextQuestion} // Shuffle effectively just picks another random
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white rounded-xl px-4 py-3 font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <Shuffle className="w-4 h-4" />
                        Acak
                    </button>

                    <button
                        onClick={handleEndSession}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-rose-300/80 hover:text-rose-300 rounded-xl px-4 py-3 font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Selesai
                    </button>
                </div>
            </div>

            <FeedbackModal isOpen={showFeedback} onClose={handleFeedbackClose} />
        </>
    );
}
