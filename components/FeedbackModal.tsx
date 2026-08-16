import { AnimatePresence, motion } from "framer-motion";
import { Frown, Meh, Send, Smile, X } from "lucide-react";
import { useState } from "react";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Rating = "happy" | "neutral" | "sad";

const RATING_OPTIONS = [
    { value: "sad", label: "Kurang seru", icon: Frown, activeClass: "bg-rose-500/20 text-rose-400" },
    { value: "neutral", label: "Biasa saja", icon: Meh, activeClass: "bg-amber-500/20 text-amber-400" },
    { value: "happy", label: "Seru", icon: Smile, activeClass: "bg-emerald-500/20 text-emerald-400" },
] satisfies Array<{
    value: Rating;
    label: string;
    icon: typeof Smile;
    activeClass: string;
}>;

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [rating, setRating] = useState<Rating | null>(null);
    const [feedback, setFeedback] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!rating || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, feedback }),
            });

            if (!response.ok) {
                throw new Error("Feedback request failed");
            }

            setIsSubmitted(true);
        } catch {
            setSubmitError("Feedback belum berhasil dikirim. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.button
                        type="button"
                        aria-label="Tutup formulir feedback"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="feedback-title"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
                    >
                        <button
                            type="button"
                            aria-label="Tutup formulir feedback"
                            onClick={onClose}
                            className="absolute right-4 top-4 text-slate-500 transition-colors hover:text-white"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="text-center">
                                    <h3 id="feedback-title" className="mb-2 text-xl font-semibold text-white">
                                        Gimana obrolannya?
                                    </h3>
                                    <p className="text-sm text-slate-400">
                                        Bantu kami bikin pertanyaan lebih seru.
                                    </p>
                                </div>

                                <fieldset>
                                    <legend className="sr-only">Pilih penilaian obrolan</legend>
                                    <div className="flex justify-center gap-4">
                                        {RATING_OPTIONS.map((option) => {
                                            const Icon = option.icon;
                                            const isActive = rating === option.value;

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    aria-label={option.label}
                                                    aria-pressed={isActive}
                                                    onClick={() => setRating(option.value)}
                                                    className={`rounded-full p-3 transition-all ${
                                                        isActive
                                                            ? `${option.activeClass} scale-110`
                                                            : "bg-slate-800 text-slate-500 hover:bg-slate-700"
                                                    }`}
                                                >
                                                    <Icon className="h-8 w-8" aria-hidden="true" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </fieldset>

                                <div className="space-y-2">
                                    <label htmlFor="feedback-message" className="sr-only">
                                        Pesan feedback opsional
                                    </label>
                                    <textarea
                                        id="feedback-message"
                                        maxLength={1000}
                                        placeholder="Ada ide pertanyaan atau masukan? (Opsional)"
                                        value={feedback}
                                        onChange={(event) => setFeedback(event.target.value)}
                                        className="h-20 w-full resize-none rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                    />
                                </div>

                                {submitError && (
                                    <p role="alert" className="text-center text-sm text-rose-300">
                                        {submitError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={!rating || isSubmitting}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-bold text-slate-900 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span
                                            className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"
                                            aria-label="Mengirim feedback"
                                        />
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" aria-hidden="true" />
                                            Kirim Feedback
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center py-8 text-center" role="status">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                    <Smile className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <h3 id="feedback-title" className="mb-2 text-xl font-bold text-white">
                                    Makasih banyak!
                                </h3>
                                <p className="mb-6 text-sm text-slate-400">
                                    Feedback berhasil diterima.
                                </p>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition-colors hover:bg-slate-200"
                                >
                                    Tutup
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
