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
    const [mode, setMode] = useState<GameMode>("SHARED");
    const [playerCount, setPlayerCount] = useState(2);
    const [playerNames, setPlayerNames] = useState<string[]>(["Pemain 1", "Pemain 2"]);
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dialogRef.current?.focus();
    }, []);

    if (!currentCategory) return null;
    const questionsReady = questionLoadStatus === "READY";

    const handlePlayerCountChange = (delta: number) => {
        const newCount = Math.max(2, Math.min(8, playerCount + delta));
        setPlayerCount(newCount);
        setPlayerNames((prev) => {
            if (newCount > prev.length) {
                return [...prev, `Pemain ${newCount}`];
            }
            return prev.slice(0, newCount);
        });
    };

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...playerNames];
        newNames[index] = value;
        setPlayerNames(newNames);
    };

    const handleStart = () => {
        const config: GameConfig = {
            mode,
            categoryId: currentCategory.id,
        };

        const players: Player[] = mode === "SHARED"
            ? [{ id: "shared-p1", name: "Semua" }]
            : playerNames.map((name, i) => ({
                id: `p-${Date.now()}-${i}`,
                name: name.trim() || `Pemain ${i + 1}`,
            }));

        setupGame(config, players);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-setup-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim)] p-3 backdrop-blur-[2px] sm:p-6"
        >
            <motion.div
                ref={dialogRef}
                tabIndex={-1}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="card-stock max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto outline-none sm:max-h-[calc(100dvh-3rem)]"
            >
                <div
                    className="flex items-center gap-4 border-b border-[var(--color-rule)] p-5 sm:p-6"
                    style={{
                        backgroundColor: currentCategory.surfaceBg,
                        color: currentCategory.surfaceInk,
                    }}
                >
                    <div className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12",
                        currentCategory.isDarkSurface ? "bg-white/15" : "bg-black/10",
                    )}>
                        <Users className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium opacity-80">{currentCategory.label}</p>
                        <h2 id="game-setup-title" className="text-xl font-semibold sm:text-2xl">
                            Siapkan permainan
                        </h2>
                    </div>
                </div>

                <div className="space-y-6 p-4 sm:p-6">
                    {questionLoadStatus === "LOADING" && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex items-center justify-center gap-3 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 text-sm font-semibold text-[var(--color-ink)]"
                        >
                            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                            Menyiapkan pertanyaan...
                        </div>
                    )}

                    {questionLoadStatus === "ERROR" && (
                        <div
                            role="alert"
                            className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-[var(--color-error)] bg-[var(--color-paper-2)] p-4 sm:flex-row sm:items-center"
                        >
                            <p className="text-sm font-semibold text-[var(--color-error)]">
                                Pertanyaan belum berhasil dimuat.
                            </p>
                            <button
                                type="button"
                                onClick={retryQuestionLoad}
                                className="btn-stock flex min-h-11 shrink-0 cursor-pointer items-center gap-2 px-4 py-2 text-sm"
                            >
                                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                                Coba lagi
                            </button>
                        </div>
                    )}

                    <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold text-[var(--color-muted)]">
                            Pilih cara bermain
                        </legend>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <button
                                type="button"
                                onClick={() => setMode("SHARED")}
                                aria-pressed={mode === "SHARED"}
                                className={cn(
                                    "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-[background-color,border-color,color] duration-150",
                                    mode === "SHARED"
                                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-card)]"
                                        : "border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-ink-2)] hover:bg-[var(--color-paper-3)]"
                                )}
                            >
                                <Users className="h-6 w-6" aria-hidden="true" />
                                <span className="text-base font-semibold">Main bareng</span>
                                <span className="text-xs leading-snug opacity-80">Satu kartu untuk semua</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode("DRAFT")}
                                aria-pressed={mode === "DRAFT"}
                                className={cn(
                                    "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-[background-color,border-color,color] duration-150",
                                    mode === "DRAFT"
                                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-card)]"
                                        : "border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-ink-2)] hover:bg-[var(--color-paper-3)]"
                                )}
                            >
                                <Shuffle className="h-6 w-6" aria-hidden="true" />
                                <span className="text-base font-semibold">Giliran kartu</span>
                                <span className="text-xs leading-snug opacity-80">Satu kartu setiap giliran</span>
                            </button>
                        </div>
                    </fieldset>

                    {mode === "DRAFT" && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between rounded-2xl border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4">
                                <span className="text-sm font-semibold text-[var(--color-ink)]">Jumlah pemain</span>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        aria-label="Kurangi jumlah pemain"
                                        onClick={() => handlePlayerCountChange(-1)}
                                        disabled={playerCount === 2}
                                        className="btn-stock flex h-11 min-h-0 w-11 cursor-pointer items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Minus className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <span aria-live="polite" className="num w-6 text-center text-xl font-semibold text-[var(--color-ink)]">
                                        {playerCount}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label="Tambah jumlah pemain"
                                        onClick={() => handlePlayerCountChange(1)}
                                        disabled={playerCount === 8}
                                        className="btn-primary flex h-11 min-h-0 w-11 cursor-pointer items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Plus className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="mb-3 text-sm font-semibold text-[var(--color-muted)]">Nama pemain</p>
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                    {playerNames.map((name, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] text-xs font-semibold text-[var(--color-muted)]">
                                                {idx + 1}
                                            </div>
                                            <input
                                                aria-label={`Nama pemain ${idx + 1}`}
                                                type="text"
                                                value={name}
                                                onChange={(e) => handleNameChange(idx, e.target.value)}
                                                placeholder={`Pemain ${idx + 1}`}
                                                className="min-h-[52px] min-w-0 flex-1 rounded-[14px] border border-[var(--color-muted)] bg-[var(--color-card)] px-3.5 py-2.5 text-sm font-medium text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-[var(--color-rule)] bg-[var(--color-card)] px-4 pb-1 pt-4 sm:-mx-6 sm:px-6">
                        <button
                            type="button"
                            onClick={resetGame}
                            className="btn-stock cursor-pointer px-5 py-3 text-sm sm:px-6"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleStart}
                            disabled={!questionsReady}
                            className="btn-primary flex flex-1 cursor-pointer items-center justify-center gap-2 px-5 py-3 text-base disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span>Mulai bermain</span>
                            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
