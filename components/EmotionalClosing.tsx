import { CLOSING_MESSAGES } from "@/lib/data";
import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { Coffee, Home } from "lucide-react";
import { useState } from "react";

export function EmotionalClosing() {
    const { resetGame } = useGame();
    const [message] = useState(() => {
        const randomIndex = Math.floor(Math.random() * CLOSING_MESSAGES.length);
        return CLOSING_MESSAGES[randomIndex];
    });

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-slate-950 p-5 text-center sm:p-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-indigo-500/10 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6 sm:gap-8"
            >
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20 sm:mb-4 sm:h-20 sm:w-20">
                    <Coffee className="h-8 w-8 opacity-80 sm:h-10 sm:w-10" aria-hidden="true" />
                </div>

                <h1 className="text-balance font-serif text-2xl font-light italic leading-relaxed text-slate-100 sm:text-3xl lg:text-4xl">
                    &ldquo;{message}&rdquo;
                </h1>

                <div className="h-px w-16 bg-slate-800" aria-hidden="true" />

                <button
                    type="button"
                    onClick={resetGame}
                    className="group mt-4 flex min-h-12 items-center gap-3 rounded-full border border-slate-700 bg-transparent px-7 py-3 text-sm font-medium uppercase tracking-[0.14em] text-slate-300 transition-all hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:mt-8 sm:px-8 sm:py-4"
                >
                    <Home className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                    <span>Kembali ke Awal</span>
                </button>
            </motion.div>
        </div>
    );
}
