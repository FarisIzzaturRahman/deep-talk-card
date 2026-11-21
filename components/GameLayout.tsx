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
import { SaweriaSupportLink } from "./SaweriaSupportLink";

export function GameLayout() {
    const { currentCategory, gameStatus, round, session } = useGame();

    const isDraftMode = session.config.mode === "DRAFT";
    const isDrafting = isDraftMode && round.phase === "DRAFTING";
    const isRoundComplete = isDraftMode && round.phase === "COMPLETE";

    return (
        <div className="paper-surface relative min-h-screen min-h-[100dvh] w-full overflow-x-clip">
            <div className="relative z-10 mx-auto flex min-h-screen min-h-[100dvh] w-full max-w-[1440px] flex-col px-4 sm:px-6 lg:px-10 xl:px-16">
                {gameStatus === "SETUP" && <GameSetupModal />}

                <AnimatePresence mode="wait">
                    {gameStatus === "LOBBY" ? (
                        <motion.div
                            key="selector"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-1 flex-col justify-center py-8 sm:py-10 lg:py-12"
                        >
                            <CategorySelector />
                        </motion.div>
                    ) : gameStatus === "PLAYING" ? (
                        <motion.div
                            key="game"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                            className="flex w-full flex-1 flex-col py-5 sm:py-7 lg:py-8"
                        >
                            <header className="mb-6 flex items-center justify-between gap-4 border-b border-[var(--color-rule)] pb-4 sm:mb-8 sm:pb-5">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[var(--color-muted)]">
                                        ajakBicara
                                    </p>
                                    <h1 className="mt-0.5 truncate text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
                                        {currentCategory?.label ?? "Permainan"}
                                    </h1>
                                </div>
                                <div className="shrink-0 rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-2 text-sm font-medium text-[var(--color-ink-2)]">
                                    {isDraftMode ? (
                                        <>
                                            <span className="sm:hidden">Ronde {session.roundCount}</span>
                                            <span className="hidden sm:inline">Giliran kartu, ronde {session.roundCount}</span>
                                        </>
                                    ) : "Main bareng"}
                                </div>
                            </header>

                            <div className={cn(
                                "grid flex-1 items-start gap-6 lg:gap-8 xl:gap-10",
                                isDraftMode
                                    ? "lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]"
                                    : "lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center xl:grid-cols-[minmax(0,1fr)_22rem]",
                            )}>
                                <section
                                    aria-label={isDraftMode ? "Area giliran kartu" : "Kartu pertanyaan"}
                                    className={cn(
                                        "min-w-0",
                                        !isDraftMode && "flex flex-col justify-center lg:min-h-[calc(100dvh-13rem)]",
                                    )}
                                >
                                    {isDrafting ? (
                                        <DraftingBoard />
                                    ) : isRoundComplete ? (
                                        <RoundComplete />
                                    ) : (
                                        <Card />
                                    )}

                                    <div className="mt-6 lg:hidden">
                                        <Controls />
                                    </div>
                                </section>

                                <aside className="hidden min-w-0 flex-col gap-5 lg:sticky lg:top-8 lg:flex">
                                    {isDraftMode && <PlayerSidePanel />}
                                    <Controls />
                                </aside>
                            </div>
                        </motion.div>
                    ) : gameStatus === "FINISHED" ? (
                        <motion.div
                            key="finish"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.24 }}
                            className="flex flex-1"
                        >
                            <EmotionalClosing />
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {gameStatus === "LOBBY" && (
                    <footer className="mt-auto flex w-full flex-col items-start justify-between gap-4 border-t border-[var(--color-rule)] py-6 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center">
                        <p>ajakBicara — permainan kartu percakapan tanpa login.</p>
                        <SaweriaSupportLink />
                    </footer>
                )}
            </div>
        </div>
    );
}
