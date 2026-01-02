"use client";

import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";

export function AIInputForm({ onBack }: { onBack: () => void }) {
    const { generateQuestions, isGenerating } = useGame();
    const [context, setContext] = useState("");
    const [audience, setAudience] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!context || !audience) return;
        await generateQuestions(context, audience);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto p-8 rounded-[2.5rem] bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl relative"
        >
            <button
                onClick={onBack}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">AI Magic ✨</h2>
                    <p className="text-sm text-slate-400">Generate kartu kustommu sendiri</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Konteks Obrolan</label>
                    <textarea
                        required
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Contoh: 'Membahas masa depan karir', 'Bicara tentang hobi aneh', dll"
                        className="w-full h-24 p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-slate-100 placeholder:text-slate-600 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Dengan Siapa?</label>
                    <input
                        required
                        type="text"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder="Contoh: 'Teman lama', 'Pasangan', 'Rekan kerja'"
                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-slate-100 placeholder:text-slate-600"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isGenerating || !context || !audience}
                    className={cn(
                        "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                        isGenerating
                            ? "bg-amber-500/20 text-amber-500/50 cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-400 to-orange-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/25"
                    )}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Merapalkan Mantra...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            <span>Generate Kartu</span>
                        </>
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest">
                Powered by Gemini AI • 12 Kartu Spesial
            </p>
        </motion.div>
    );
}
