import { useGame } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "./Card";
import { CategorySelector } from "./CategorySelector";
import { Controls } from "./Controls";

export function GameLayout() {
    const { currentCategory } = useGame();

    return (
        <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 bg-slate-950 text-slate-50 overflow-x-hidden font-sans selection:bg-rose-500/30">
            <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col relative z-10">

                {/* Background Gradients - Dynamic based on state could be added here */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-slate-950">
                    {/* Static Ambient Light */}
                    <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
                </div>

                <AnimatePresence mode="wait">
                    {!currentCategory ? (
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
                    ) : (
                        <motion.div
                            key="game"
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex-1 flex flex-col items-center justify-center min-h-[85vh]"
                        >
                            <div className="w-full max-w-md">
                                <Card />
                                <Controls />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <footer className="w-full py-8 text-center text-slate-600 text-xs tracking-widest uppercase opacity-50">
                <p>Deep Talk V2 • For Meaningful Connections</p>
            </footer>
        </div>
    );
}
