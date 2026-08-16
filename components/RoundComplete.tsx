import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function RoundComplete() {
    const { session } = useGame();

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className="mx-auto flex min-h-80 w-full max-w-2xl flex-col items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-500/5 p-7 text-center shadow-xl sm:min-h-96 sm:p-10"
        >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                Ronde {session.roundCount} selesai
            </p>
            <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">Semua pemain sudah mendapat giliran</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
                Tarik napas sebentar, lanjutkan obrolannya, atau mulai ronde baru saat semuanya siap.
            </p>
        </motion.section>
    );
}
