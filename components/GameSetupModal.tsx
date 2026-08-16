import { useEffect, useRef, useState } from "react";
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
    const [playerNames, setPlayerNames] = useState<string[]>(['Pemain 1', 'Pemain 2']);
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dialogRef.current?.focus();
    }, []);

    if (!currentCategory) return null;
    const questionsReady = questionLoadStatus === "READY";

    const handlePlayerCountChange = (delta: number) => {
        const newCount = Math.max(2, Math.min(8, playerCount + delta));
        setPlayerCount(newCount);
        setPlayerNames(prev => {
            if (newCount > prev.length) {
                return [...prev, `Pemain ${newCount}`];
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
            ? [{ id: 'shared-p1', name: 'Semua' }]
            : playerNames.map((name, i) => ({
                id: `p-${Date.now()}-${i}`,
                name: name.trim() || `Pemain ${i + 1}`
            }));

        setupGame(config, players);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-setup-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm sm:p-6"
        >
            <motion.div
                ref={dialogRef}
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 outline-none sm:max-h-[calc(100dvh-3rem)]"
            >
                <div className={cn("flex items-center gap-4 bg-gradient-to-r p-5 sm:p-6", currentCategory.gradient)}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md sm:h-12 sm:w-12">
                        <Users className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white/80">{currentCategory.label}</p>
                        <h2 id="game-setup-title" className="text-xl font-bold tracking-tight text-white sm:text-2xl">Siapkan Permainan</h2>
                    </div>
                </div>

                <div className="space-y-6 p-4 sm:p-6">
                    {questionLoadStatus === "LOADING" && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex items-center justify-center gap-3 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4 text-sm font-bold text-indigo-100"
                        >
                            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                            Menyiapkan pertanyaan...
                        </div>
                    )}

                    {questionLoadStatus === "ERROR" && (
                        <div
                            role="alert"
                            className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 sm:flex-row sm:items-center"
                        >
                            <p className="text-sm font-bold text-rose-200">
                                Pertanyaan belum berhasil dimuat.
                            </p>
                            <button
                                type="button"
                                onClick={retryQuestionLoad}
                                className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-rose-500/20 px-4 py-2 text-xs font-bold text-rose-100 transition-colors hover:bg-rose-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                            >
                                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    <fieldset className="space-y-3">
                        <legend className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Pilih Cara Bermain</legend>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <button
                                type="button"
                                onClick={() => setMode('SHARED')}
                                aria-pressed={mode === 'SHARED'}
                                className={cn(
                                    "flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:p-4",
                                    mode === 'SHARED'
                                        ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-300"
                                        : "border-white/5 bg-slate-800/40 text-slate-400 hover:border-white/10 hover:bg-slate-800"
                                )}
                            >
                                <Users className="h-6 w-6" aria-hidden="true" />
                                <span className="text-sm font-bold">Main Bareng</span>
                                <span className="text-xs leading-snug opacity-70">Satu kartu untuk semua</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode('DRAFT')}
                                aria-pressed={mode === 'DRAFT'}
                                className={cn(
                                    "flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:p-4",
                                    mode === 'DRAFT'
                                        ? "border-indigo-400/60 bg-indigo-500/10 text-indigo-300"
                                        : "border-white/5 bg-slate-800/40 text-slate-400 hover:border-white/10 hover:bg-slate-800"
                                )}
                            >
                                <Shuffle className="h-6 w-6" aria-hidden="true" />
                                <span className="text-sm font-bold">Giliran Kartu</span>
                                <span className="text-xs leading-snug opacity-70">Satu kartu setiap giliran</span>
                            </button>
                        </div>
                    </fieldset>

                    {mode === 'DRAFT' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-800/40 p-4">
                                <span className="text-sm font-bold text-slate-300">Jumlah Pemain</span>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        aria-label="Kurangi jumlah pemain"
                                        onClick={() => handlePlayerCountChange(-1)}
                                        disabled={playerCount === 2}
                                        className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700 transition-colors hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Minus className="h-4 w-4 text-white" aria-hidden="true" />
                                    </button>
                                    <span aria-live="polite" className="w-6 text-center text-xl font-black tabular-nums text-white">{playerCount}</span>
                                    <button
                                        type="button"
                                        aria-label="Tambah jumlah pemain"
                                        onClick={() => handlePlayerCountChange(1)}
                                        disabled={playerCount === 8}
                                        className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500 shadow-lg shadow-indigo-950/30 transition-colors hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Plus className="h-4 w-4 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Nama Pemain</p>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {playerNames.map((name, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-500">
                                            {idx + 1}
                                        </div>
                                        <input
                                            aria-label={`Nama pemain ${idx + 1}`}
                                            type="text"
                                            value={name}
                                            onChange={(e) => handleNameChange(idx, e.target.value)}
                                            placeholder={`Pemain ${idx + 1}`}
                                            className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/5 bg-slate-800/40 px-3 py-2.5 text-sm font-bold text-white placeholder-slate-600 transition focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                        />
                                    </div>
                                ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-white/5 bg-slate-900/95 px-4 pb-1 pt-4 backdrop-blur sm:-mx-6 sm:px-6">
                        <button
                            type="button"
                            onClick={resetGame}
                            className="min-h-12 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-6"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleStart}
                            disabled={!questionsReady}
                            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-xl transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 sm:px-6"
                        >
                            <span>Mulai Bermain</span>
                            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
