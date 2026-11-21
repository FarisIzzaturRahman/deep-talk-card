import { cn } from "@/lib/utils";
import { Coffee, ExternalLink } from "lucide-react";

const SAWERIA_URL = "https://saweria.co/ajakbicara";

export function SaweriaSupportLink({ className }: { className?: string }) {
    return (
        <a
            href={SAWERIA_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Dukung ajakBicara lewat Saweria (terbuka di tab baru)"
            className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-rule)] bg-[var(--color-card)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-2)] transition-[background-color,border-color] duration-150 hover:border-[var(--color-accent-2)] hover:bg-[var(--color-paper-2)]",
                className,
            )}
        >
            <Coffee className="h-4 w-4" aria-hidden="true" />
            <span>Dukung lewat Saweria</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-75" aria-hidden="true" />
        </a>
    );
}
