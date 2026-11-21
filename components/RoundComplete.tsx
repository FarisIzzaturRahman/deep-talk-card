import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function RoundComplete() {
    const { session } = useGame();

    return (
        <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            style={{
                backgroundColor: "var(--color-hill-2)",
                backgroundImage: "var(--grain)",
                boxShadow: "inset 0 0 0 1px var(--cat-reflect-edge), 0 6px 0 0 var(--cat-reflect-edge), var(--shadow-card)",
            }}
            className="mx-auto flex min-h-80 w-full max-w-2xl flex-col items-center justify-center rounded-[24px] p-7 text-center sm:min-h-96 sm:p-10"
        >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-mint-deep)] text-[var(--color-card)]">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="mb-2 text-sm font-semibold text-[var(--color-mint-deep)]">
                Ronde {session.roundCount} selesai
            </p>
            <h2 className="text-balance text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
                Semua pemain sudah mendapat giliran
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-[var(--color-ink-2)]">
                Tarik napas sebentar, lanjutkan obrolannya, atau mulai ronde baru saat semuanya siap.
            </p>
        </motion.section>
    );
}
