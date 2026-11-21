import { CATEGORIES } from "@/lib/data";
import { useGame } from "@/lib/store";
import { motion } from "framer-motion";

export function CategorySelector() {
    const { selectCategory } = useGame();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 14 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const },
        },
    };

    return (
        <section
            aria-labelledby="category-heading"
            className="mx-auto flex w-full max-w-6xl flex-col justify-center"
        >
            <header className="mb-8 flex flex-col gap-3 sm:mb-10">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-[var(--color-ink)]">
                        ajakBicara
                    </span>
                    <span className="rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3.5 py-1.5 text-sm font-medium text-[var(--color-ink-2)]">
                        6 topik siap main
                    </span>
                </div>

                <h1
                    id="category-heading"
                    className="mt-2 max-w-[20ch] text-4xl font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-5xl lg:text-[3.5rem]"
                >
                    Pilih topik obrolan
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
                    Buka satu kartu pertanyaan untuk mencairkan suasana, mengenal lebih dekat, atau ngobrol lebih jujur bersama.
                </p>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
            >
                {CATEGORIES.map((category, index) => (
                    <motion.button
                        key={category.id}
                        type="button"
                        variants={item}
                        onClick={() => selectCategory(category.id)}
                        className="card-stock card-stock-interactive group relative flex min-h-40 cursor-pointer flex-col items-start justify-between overflow-hidden p-5 text-left sm:min-h-44 sm:p-6"
                    >
                        <div
                            className="pointer-events-none absolute inset-x-0 top-0 h-2.5"
                            style={{ backgroundColor: category.surfaceBg }}
                            aria-hidden="true"
                        />

                        <div className="mb-4 flex w-full items-center justify-between gap-4 pt-1">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-semibold"
                                style={{
                                    backgroundColor: category.surfaceBg,
                                    color: category.surfaceInk,
                                    boxShadow: `inset 0 0 0 1px ${category.surfaceEdge}`,
                                }}
                            >
                                <span aria-hidden="true">{category.label.charAt(0)}</span>
                            </div>
                            <span
                                className="num text-sm font-semibold text-[var(--color-muted)]"
                                aria-hidden="true"
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-[var(--color-ink)]">
                                {category.label}
                            </h2>
                            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)] sm:text-[15px]">
                                {category.description}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </motion.div>
        </section>
    );
}
