import { CLOSING_MESSAGES } from "@/lib/data";
import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { Coffee, Home } from "lucide-react";
import { useState } from "react";
import { SaweriaSupportLink } from "./SaweriaSupportLink";

export function EmotionalClosing() {
    const { resetGame } = useGame();
    const [message] = useState(() => {
        const randomIndex = Math.floor(Math.random() * CLOSING_MESSAGES.length);
        return CLOSING_MESSAGES[randomIndex];
    });

    return (
        <div className="paper-surface fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto p-5 text-center sm:p-8">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="card-stock relative z-10 flex w-full max-w-2xl flex-col items-center gap-6 p-7 sm:gap-8 sm:p-12"
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-[var(--color-accent-ink)] sm:h-20 sm:w-20">
                    <Coffee className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" />
                </div>

                <h1 className="max-w-[26ch] text-balance text-2xl font-semibold leading-snug text-[var(--color-ink)] sm:text-3xl lg:text-4xl">
                    &ldquo;{message}&rdquo;
                </h1>

                <div className="h-px w-16 bg-[var(--color-rule)]" aria-hidden="true" />

                <div className="flex flex-col items-center gap-4">
                    <button
                        type="button"
                        onClick={resetGame}
                        className="btn-primary flex cursor-pointer items-center gap-2.5 px-7 py-3.5 text-base"
                    >
                        <Home className="h-4 w-4" aria-hidden="true" />
                        <span>Kembali ke awal</span>
                    </button>

                    <SaweriaSupportLink />
                    <p className="max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
                        Dukunganmu sepenuhnya opsional, tetapi sangat berarti untuk ajakBicara.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
