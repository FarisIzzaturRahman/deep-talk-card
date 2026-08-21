import { CATEGORIES } from "@/lib/data";
import { useGame } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function CategorySelector() {
    const { selectCategory } = useGame();

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
        <section
            aria-labelledby="category-heading"
            className="mx-auto flex w-full max-w-6xl flex-col justify-center"
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center sm:mb-10 lg:mb-12"
            >
                <div className="mb-5 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 sm:mb-6">
                    <Sparkles className="h-5 w-5 text-yellow-300" aria-hidden="true" />
                    <span className="text-sm font-semibold tracking-[0.12em] text-yellow-200">ajakBicara</span>
                </div>
                <h1 id="category-heading" className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Pilih Topik Obrolan
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                    Temukan pertanyaan yang memicu percakapan bermakna, kejujuran, dan keseruan bersama.
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    6 topik obrolan · tanpa login
                </p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
            >
                {CATEGORIES.map((category, index) => (
                    <motion.button
                        key={category.id}
                        type="button"
                        variants={item}
                        onClick={() => selectCategory(category.id)}
                        className="group relative flex min-h-36 flex-col items-start overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:min-h-44 sm:p-6"
                    >
                        <div className={cn(
                            "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80",
                            category.gradient
                        )} aria-hidden="true" />

                        <div className="mb-5 flex w-full items-start justify-between gap-4">
                            <div className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg sm:h-11 sm:w-11",
                                category.color
                            )}>
                                <span aria-hidden="true">{category.label.charAt(0)}</span>
                            </div>
                            <span className="text-xs font-bold tabular-nums text-slate-700" aria-hidden="true">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                        </div>

                        <h2 className="text-lg font-semibold text-slate-100 transition-colors group-hover:text-white sm:text-xl">
                            {category.label}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                            {category.description}
                        </p>
                    </motion.button>
                ))}
            </motion.div>
        </section>
    );
}
