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
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-5 py-2.5 text-sm font-semibold tracking-normal text-amber-100 transition hover:border-amber-300/35 hover:bg-amber-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                className,
            )}
        >
            <Coffee className="h-4 w-4" aria-hidden="true" />
            <span>Dukung lewat Saweria</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
        </a>
    );
}
