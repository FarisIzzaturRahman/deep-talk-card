import { CATEGORIES } from "@/lib/data";
import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { AIInputForm } from "./AIInputForm";

export function CategorySelector() {
    const { selectCategory } = useGame();
    const [showAIForm, setShowAIForm] = useState(false);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-6 ring-1 ring-white/10">
                    <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
                    <span className="text-sm font-medium tracking-wider uppercase text-yellow-400/90">Deep Talk Cards</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                    Pilih Topik Obrolan
                </h1>
                <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Temukan pertanyaan yang memicu percakapan bermakna, kejujuran, dan keseruan bersama.
                </p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
            >
                {CATEGORIES.map((category) => (
                    <motion.button
                        key={category.id}
                        variants={item}
                        onClick={() => selectCategory(category.id)}
                        className="group relative flex flex-col items-start p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 text-left"
                    >
                        <div className={cn(
                            "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                            category.gradient
                        )} />

                        <div className={cn(
                            "w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white shadow-lg",
                            category.color
                        )}>
                            <span className="text-lg font-bold">{category.label.charAt(0)}</span>
                        </div>

                        <h3 className="text-xl font-semibold mb-2 text-slate-100 group-hover:text-white transition-colors">
                            {category.label}
                        </h3>
                        <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                            {category.description}
                        </p>
                    </motion.button>
                ))}

                {/* AI MAGIC CATEGORY */}
                <motion.button
                    variants={item}
                    onClick={() => setShowAIForm(true)}
                    className="group relative flex flex-col items-start p-6 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 text-left"
                >
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-amber-400 to-orange-600" />

                    <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-amber-400 to-orange-600 shadow-amber-500/20">
                        <Wand2 className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-semibold mb-2 text-amber-100 group-hover:text-white transition-colors">
                        AI Magic ✨
                    </h3>
                    <p className="text-sm text-amber-500/60 group-hover:text-amber-400 transition-colors leading-relaxed">
                        Generate kartu kustom khusus untuk momenmu lewat bantuan AI.
                    </p>
                </motion.button>
            </motion.div>

            <AnimatePresence>
                {showAIForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <AIInputForm onBack={() => setShowAIForm(false)} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
