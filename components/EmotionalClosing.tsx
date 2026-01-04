import { CLOSING_MESSAGES } from "@/lib/data";
import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { Coffee, Home } from "lucide-react";
import { useEffect, useState } from "react";

export function EmotionalClosing() {
    const { resetGame } = useGame();
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Pick a random message on mount
        const randomIndex = Math.floor(Math.random() * CLOSING_MESSAGES.length);
        setMessage(CLOSING_MESSAGES[randomIndex]);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950 text-center">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 max-w-lg w-full flex flex-col items-center gap-8"
            >
                {/* Icon */}
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-300 mb-4 ring-1 ring-indigo-500/20">
                    <Coffee className="w-10 h-10 opacity-80" />
                </div>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-serif text-slate-100 leading-relaxed font-light italic">
                    &ldquo;{message}&rdquo;
                </h2>

                <div className="w-16 h-px bg-slate-800" />

                {/* Action */}
                <button
                    onClick={resetGame}
                    className="mt-8 group flex items-center gap-3 px-8 py-4 bg-transparent border border-slate-700 hover:border-slate-500 rounded-full text-slate-400 hover:text-white transition-all text-sm uppercase tracking-widest font-medium"
                >
                    <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Kembali ke Awal</span>
                </button>
            </motion.div>
        </div>
    );
}
