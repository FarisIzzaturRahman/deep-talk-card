"use client";

import { useGame } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "./Card";
import { CategorySelector } from "./CategorySelector";
import { Controls } from "./Controls";
import { DraftingBoard } from "./DraftingBoard";
import { GameSetupModal } from "./GameSetupModal";
import { RoundPhase } from "@/lib/game-types";
import { cn } from "@/lib/utils";
import { PlayerSidePanel } from "./PlayerSidePanel";

export function GameLayout() {
    const { gameStatus, round, session } = useGame();

    const isDraftMode = session.config.mode === 'DRAFT';

    return (
        <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 bg-slate-950 text-slate-50 overflow-x-hidden font-sans selection:bg-rose-500/30">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-slate-950">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col relative z-10">

                {/* Modals / Overlays */}
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
                            className="flex-1 flex"
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
                            className={cn(
                                "flex-1 w-full",
                                isDraftMode
                                    ? "lg:grid lg:grid-cols-[1fr_320px] lg:gap-12 lg:items-start"
                                    : "flex flex-col items-center justify-center"
                            )}
                        >
                            {/* Main Content Area */}
                            <div className={cn(
                                "w-full flex flex-col items-center",
                                isDraftMode ? "lg:pt-8" : "max-w-md mx-auto min-h-[85vh] justify-center"
                            )}>
                                {/* 
                                    Drafting Board is shown during DRAFTING phase for DRAFT mode.
                                    Otherwise show the active Card (Shared Mode OR Draft Result).
                                */}
                                {session.config.mode === 'DRAFT' && round.phase === RoundPhase.DRAFTING ? (
                                    <DraftingBoard />
                                ) : (
                                    <Card />
                                )}

                                {/* Controls always shown during gameplay to allow Exit / Speed Mode */}
                                {/* In desktop layout, maybe Controls should stick to bottom or be part of sidebar? 
                                    For now keep under card for consistency, but ensure spacing. */}
                                <div className="w-full max-w-md mt-6">
                                    <Controls />
                                </div>
                            </div>

                            {/* Desktop Side Panel */}
                            {isDraftMode && (
                                <PlayerSidePanel />
                            )}
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>

            <footer className="w-full py-8 text-center text-slate-600 text-xs tracking-widest uppercase opacity-50">
                <p>Deep Talk • No Login Required</p>
            </footer>
        </div>
    );
}
