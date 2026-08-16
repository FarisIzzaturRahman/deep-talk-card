"use client";

import { useGame } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "./Card";
import { CategorySelector } from "./CategorySelector";
import { Controls } from "./Controls";
import { DraftingBoard } from "./DraftingBoard";
import { GameSetupModal } from "./GameSetupModal";
import { cn } from "@/lib/utils";
import { PlayerSidePanel } from "./PlayerSidePanel";
import { EmotionalClosing } from "./EmotionalClosing";
import { RoundComplete } from "./RoundComplete";

export function GameLayout() {
    const { currentCategory, gameStatus, round, session } = useGame();

    const isDraftMode = session.config.mode === 'DRAFT';
    const isDrafting = isDraftMode && round.phase === 'DRAFTING';
    const isRoundComplete = isDraftMode && round.phase === 'COMPLETE';

    return (
        <div className="relative min-h-screen min-h-[100dvh] w-full overflow-x-hidden bg-slate-950 font-sans text-slate-50 selection:bg-rose-500/30">
            <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />
                <div className="absolute bottom-[-20rem] right-[-12rem] h-[36rem] w-[36rem] rounded-full bg-rose-500/5 blur-[140px]" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-screen min-h-[100dvh] w-full max-w-[1440px] flex-col px-4 sm:px-6 lg:px-8 xl:px-12">
                <AnimatePresence>
                    {gameStatus === 'SETUP' && <GameSetupModal />}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {gameStatus === 'LOBBY' ? (
                        <motion.div
                            key="selector"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-1 py-6 sm:py-10 lg:py-12"
                        >
                            <CategorySelector />
                        </motion.div>
                    ) : gameStatus === 'PLAYING' ? (
                        <motion.div
                            key="game"
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex w-full flex-1 flex-col py-4 sm:py-6 lg:py-8"
                        >
                            <header className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4 sm:mb-7 sm:pb-5">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold tracking-[0.18em] text-yellow-300">
                                        ajakBicara
                                    </p>
                                    <h1 className="mt-1 truncate text-xl font-semibold text-white sm:text-2xl">
                                        {currentCategory?.label ?? "Permainan"}
                                    </h1>
                                </div>
                                <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-300 sm:px-4">
                                    {isDraftMode ? `Draft · Ronde ${session.roundCount}` : "Shared"}
                                </div>
                            </header>

                            <div className={cn(
                                "grid flex-1 items-start gap-5 lg:gap-8 xl:gap-10",
                                isDraftMode
                                    ? "lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]"
                                    : "lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center xl:grid-cols-[minmax(0,1fr)_22rem]",
                            )}>
                                <section
                                    aria-label={isDraftMode ? "Area draft kartu" : "Kartu pertanyaan"}
                                    className={cn(
                                        "min-w-0",
                                        !isDraftMode && "flex flex-col justify-center lg:min-h-[calc(100dvh-12rem)]",
                                    )}
                                >
                                    {isDrafting ? (
                                        <DraftingBoard />
                                    ) : isRoundComplete ? (
                                        <RoundComplete />
                                    ) : (
                                        <Card />
                                    )}

                                    <div className="mt-5 lg:hidden">
                                        <Controls />
                                    </div>
                                </section>

                                <aside className="hidden min-w-0 flex-col gap-5 lg:sticky lg:top-8 lg:flex">
                                    {isDraftMode && <PlayerSidePanel />}
                                    <Controls />
                                </aside>
                            </div>
                        </motion.div>
                    ) : gameStatus === 'FINISHED' ? (
                        <motion.div
                            key="finish"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-1"
                        >
                            <EmotionalClosing />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
                {gameStatus === "LOBBY" && (
                    <footer className="w-full py-6 text-center text-xs tracking-[0.18em] text-slate-600">
                        <p>ajakBicara • Tanpa Login</p>
                    </footer>
                )}
            </div>
        </div>
    );
}
