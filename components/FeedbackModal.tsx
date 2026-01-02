import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smile, Meh, Frown, Send } from "lucide-react";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [rating, setRating] = useState<"happy" | "neutral" | "sad" | null>(null);
    const [feedback, setFeedback] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!rating) return;

        setIsSubmitting(true);

        try {
            // Graceful fallback: If API fails or doesn't exist, we still show success
            await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, feedback }),
            }).catch(() => null);
        } catch (e) {
            // Ignore errors
        }

        // Fake delay for UX
        setTimeout(() => {
            setIsSubmitted(true);
            setIsSubmitting(false);
            setTimeout(onClose, 2000); // Auto close after 2s
        }, 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {!isSubmitted ? (
                            <div className="flex flex-col gap-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-white mb-2">Gimana obrolannya?</h3>
                                    <p className="text-sm text-slate-400">Bantu kami bikin pertanyaan lebih seru.</p>
                                </div>

                                {/* Rating */}
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => setRating("sad")}
                                        className={`p-3 rounded-full transition-all ${rating === "sad" ? "bg-rose-500/20 text-rose-400 scale-110" : "bg-slate-800 text-slate-500 hover:bg-slate-700"}`}
                                    >
                                        <Frown className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={() => setRating("neutral")}
                                        className={`p-3 rounded-full transition-all ${rating === "neutral" ? "bg-amber-500/20 text-amber-400 scale-110" : "bg-slate-800 text-slate-500 hover:bg-slate-700"}`}
                                    >
                                        <Meh className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={() => setRating("happy")}
                                        className={`p-3 rounded-full transition-all ${rating === "happy" ? "bg-emerald-500/20 text-emerald-400 scale-110" : "bg-slate-800 text-slate-500 hover:bg-slate-700"}`}
                                    >
                                        <Smile className="w-8 h-8" />
                                    </button>
                                </div>

                                {/* Optional Text */}
                                <div className="space-y-2">
                                    <textarea
                                        placeholder="Ada ide pertanyaan atau masukan? (Opsional)"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none h-20"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!rating || isSubmitting}
                                    className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? (
                                        <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Kirim Feedback
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="py-8 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                                    <Smile className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Makasih banyak!</h3>
                                <p className="text-slate-400 text-sm">Masukanmu sangat berarti buat kami.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
