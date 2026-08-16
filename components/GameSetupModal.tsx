import { useState } from "react";
import { useGame } from "@/lib/store";
import { LoaderCircle, Minus, Play, Plus, RefreshCw, Shuffle, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GameConfig, GameMode, Player } from "@/lib/game-types";

export function GameSetupModal() {
    const {
        currentCategory,
        questionLoadStatus,
        resetGame,
        retryQuestionLoad,
        setupGame,
    } = useGame();
    const [mode, setMode] = useState<GameMode>('SHARED');
    const [playerCount, setPlayerCount] = useState(2);
    const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);

    if (!currentCategory) return null;
    const questionsReady = questionLoadStatus === "READY";

    const handlePlayerCountChange = (delta: number) => {
        const newCount = Math.max(2, Math.min(8, playerCount + delta));
        setPlayerCount(newCount);
        setPlayerNames(prev => {
            if (newCount > prev.length) {
                return [...prev, `Player ${newCount}`];
            } else {
                return prev.slice(0, newCount);
            }
        });
    };

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...playerNames];
        newNames[index] = value;
        setPlayerNames(newNames);
    };

    const handleStart = () => {
        // Construct Config
        const config: GameConfig = {
            mode,
            categoryId: currentCategory.id
        };

        // Construct Players
        const players: Player[] = mode === 'SHARED'
            ? [{ id: 'shared-p1', name: 'Group' }]
            : playerNames.map((name, i) => ({
                id: `p-${Date.now()}-${i}`,
                name: name.trim() || `Player ${i + 1}`
            }));

        setupGame(config, players);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-setup-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className={cn("p-6 flex items-center gap-4 bg-gradient-to-r", currentCategory.gradient)}>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 id="game-setup-title" className="text-2xl font-black text-white uppercase tracking-tight">Game Setup</h2>
                        <p className="text-white/80 text-sm font-medium">{currentCategory.label}</p>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {questionLoadStatus === "LOADING" && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex items-center justify-center gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-sm font-bold text-indigo-200"
                        >
                            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                            Menyiapkan pertanyaan...
                        </div>
                    )}

                    {questionLoadStatus === "ERROR" && (
                        <div
                            role="alert"
                            className="flex items-center justify-between gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4"
                        >
                            <p className="text-sm font-bold text-rose-200">
                                Pertanyaan belum berhasil dimuat.
                            </p>
                            <button
                                type="button"
                                onClick={retryQuestionLoad}
                                className="flex shrink-0 items-center gap-2 rounded-xl bg-rose-500/20 px-3 py-2 text-xs font-bold text-rose-100 transition-colors hover:bg-rose-500/30"
                            >
                                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {/* Mode Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Mode</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setMode('SHARED')}
                                className={cn(
                                    "p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all",
                                    mode === 'SHARED'
                                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                        : "border-slate-800 bg-slate-800/50 text-slate-500 hover:bg-slate-800"
                                )}
                            >
                                <Users className="w-6 h-6" />
                                <span className="font-bold text-sm">Shared</span>
                                <span className="text-[10px] opacity-60">1 Card for Everyone</span>
                            </button>

                            <button
                                onClick={() => setMode('DRAFT')}
                                className={cn(
                                    "p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all",
                                    mode === 'DRAFT'
                                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                                        : "border-slate-800 bg-slate-800/50 text-slate-500 hover:bg-slate-800"
                                )}
                            >
                                <Shuffle className="w-6 h-6" />
                                <span className="font-bold text-sm">Draft</span>
                                <span className="text-[10px] opacity-60">Pick Unique Cards</span>
                            </button>
                        </div>
                    </div>

                    {/* Draft Settings */}
                    {mode === 'DRAFT' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                        >
                            {/* Player Count */}
                            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                                <span className="text-sm font-bold text-slate-300">Total Players:</span>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        aria-label="Kurangi jumlah pemain"
                                        onClick={() => handlePlayerCountChange(-1)}
                                        className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
                                    >
                                        <Minus className="w-4 h-4 text-white" />
                                    </button>
                                    <span className="text-xl font-black text-white w-6 text-center">{playerCount}</span>
                                    <button
                                        type="button"
                                        aria-label="Tambah jumlah pemain"
                                        onClick={() => handlePlayerCountChange(1)}
                                        className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20"
                                    >
                                        <Plus className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Player Names */}
                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {playerNames.map((name, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                            {idx + 1}
                                        </div>
                                        <input
                                            aria-label={`Nama pemain ${idx + 1}`}
                                            type="text"
                                            value={name}
                                            onChange={(e) => handleNameChange(idx, e.target.value)}
                                            placeholder={`Player ${idx + 1}`}
                                            className="flex-1 bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                        <button
                            onClick={resetGame}
                            className="px-6 py-4 rounded-2xl text-slate-500 font-bold text-sm hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStart}
                            disabled={!questionsReady}
                            className="flex-1 bg-white text-slate-950 px-6 py-4 rounded-2xl font-black text-base uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <span>Start Game</span>
                            <Play className="w-4 h-4 fill-current" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
