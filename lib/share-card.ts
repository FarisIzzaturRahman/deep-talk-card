import type { Category, Question } from "./data";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;
const SITE_DOMAIN = "ajakbicara.web.id";

export type ShareOutcome = "shared" | "downloaded" | "cancelled";

export interface RecapShareInput {
    categoryLabel: string;
    message: string;
    answeredCount: number;
    skippedCount: number;
    durationLabel: string;
}

export function wrapTextLines(
    text: string,
    maxWidth: number,
    measure: (line: string) => number,
): string[] {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const candidate = `${currentLine} ${words[i]}`;
        if (measure(candidate) <= maxWidth) {
            currentLine = candidate;
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }

    lines.push(currentLine);
    return lines;
}

export function buildShareFilename(prefix: string, id: string): string {
    const safeId = id.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "kartu";
    return `ajakbicara-${prefix}-${safeId}.png`;
}

function readToken(name: string, fallback: string): string {
    if (typeof window === "undefined") return fallback;
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return raw || fallback;
}

function resolveColorToken(value: string, fallback: string): string {
    const match = /^var\((--[^)]+)\)$/.exec(value.trim());
    if (!match) return value || fallback;
    return readToken(match[1], fallback);
}

function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.closePath();
}

function drawPaperGround(ctx: CanvasRenderingContext2D, paperColor: string, inkColor: string) {
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle deterministic paper grain matching Hum's tactile surface.
    ctx.save();
    ctx.fillStyle = inkColor;
    ctx.globalAlpha = 0.03;
    let seed = 1337;
    for (let i = 0; i < 2400; i++) {
        seed = (seed * 16807) % 2147483647;
        const x = (seed % CANVAS_WIDTH);
        seed = (seed * 16807) % 2147483647;
        const y = (seed % CANVAS_HEIGHT);
        ctx.fillRect(x, y, 2, 2);
    }
    ctx.restore();
}

function drawPill(
    ctx: CanvasRenderingContext2D,
    label: string,
    x: number,
    y: number,
    bg: string,
    fg: string,
    border?: string,
): number {
    ctx.save();
    ctx.font = '600 28px "Chillax", ui-rounded, ui-sans-serif, sans-serif';
    const textWidth = ctx.measureText(label).width;
    const padX = 28;
    const height = 56;
    const width = textWidth + padX * 2;

    drawRoundedRect(ctx, x, y, width, height, height / 2);
    ctx.fillStyle = bg;
    ctx.fill();
    if (border) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = border;
        ctx.stroke();
    }

    ctx.fillStyle = fg;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(label, x + padX, y + height / 2 + 1);
    ctx.restore();
    return width;
}

function drawStoryChrome(
    ctx: CanvasRenderingContext2D,
    badgeLabel: string,
    tokens: { ink: string; paper2: string; rule: string; accent: string; muted: string },
) {
    // Top wordmark + context pill
    ctx.save();
    ctx.font = '600 40px "Chillax", ui-rounded, ui-sans-serif, sans-serif';
    ctx.fillStyle = tokens.ink;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("ajakBicara", 88, 168);
    ctx.restore();

    ctx.save();
    ctx.font = '600 28px "Chillax", ui-rounded, ui-sans-serif, sans-serif';
    const pillWidth = ctx.measureText(badgeLabel).width + 56;
    ctx.restore();
    drawPill(
        ctx,
        badgeLabel,
        CANVAS_WIDTH - 88 - pillWidth,
        140,
        tokens.paper2,
        tokens.ink,
        tokens.rule,
    );

    // Bottom domain with Hum pear highlighter band
    ctx.save();
    ctx.font = '600 36px "Chillax", ui-rounded, ui-sans-serif, sans-serif';
    const domainWidth = ctx.measureText(SITE_DOMAIN).width;
    const bandX = (CANVAS_WIDTH - domainWidth) / 2 - 22;
    const bandY = 1712;
    drawRoundedRect(ctx, bandX, bandY, domainWidth + 44, 58, 16);
    ctx.fillStyle = tokens.accent;
    ctx.fill();

    ctx.fillStyle = tokens.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(SITE_DOMAIN, CANVAS_WIDTH / 2, bandY + 30);

    ctx.font = '500 26px "Chillax", ui-rounded, ui-sans-serif, sans-serif';
    ctx.fillStyle = tokens.muted;
    ctx.fillText("Permainan kartu percakapan tanpa login", CANVAS_WIDTH / 2, 1812);
    ctx.restore();
}

function drawCardStockFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    bg: string,
    edge: string,
) {
    const radius = 48;
    const lip = 16;

    // Soft top-left-lit drop shadow
    ctx.save();
    ctx.shadowColor = "rgba(25, 29, 38, 0.18)";
    ctx.shadowBlur = 44;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 26;
    drawRoundedRect(ctx, x, y + lip, w, h, radius);
    ctx.fillStyle = edge;
    ctx.fill();
    ctx.restore();

    // Solid tactile bottom lip
    drawRoundedRect(ctx, x, y + lip, w, h, radius);
    ctx.fillStyle = edge;
    ctx.fill();

    // Main cut-paper card face
    drawRoundedRect(ctx, x, y, w, h, radius);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = edge;
    ctx.stroke();
}

async function deliverCanvasImage(
    canvas: HTMLCanvasElement,
    filename: string,
    shareTitle: string,
): Promise<ShareOutcome> {
    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
            if (result) resolve(result);
            else reject(new Error("Gagal membuat gambar kartu."));
        }, "image/png");
    });

    const file = new File([blob], filename, { type: "image/png" });
    if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
        try {
            await navigator.share({ files: [file], title: shareTitle });
            return "shared";
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return "cancelled";
            }
        }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return "downloaded";
}

export async function shareQuestionCardImage(
    question: Question,
    category: Category,
): Promise<ShareOutcome> {
    await document.fonts.ready;

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas tidak tersedia.");

    const tokens = {
        paper: readToken("--color-paper", "#f5f3ea"),
        paper2: readToken("--color-paper-2", "#ede9dc"),
        ink: readToken("--color-ink", "#1a1f2b"),
        muted: readToken("--color-muted", "#5b606e"),
        rule: readToken("--color-rule", "#d8d4c5"),
        accent: readToken("--color-accent", "#f2dc3a"),
        accent3: readToken("--color-accent-3", "#e26d4b"),
        card: readToken("--color-card", "#fbfaf4"),
        wildcardEdge: readToken("--cat-wildcard-edge", "#b5492b"),
    };

    const isWildcard = question.type === "wildcard";
    const isDarkCard = Boolean(category.isDarkSurface) && !isWildcard;
    const cardBg = isWildcard
        ? tokens.accent3
        : resolveColorToken(category.surfaceBg, tokens.card);
    const cardEdge = isWildcard
        ? tokens.wildcardEdge
        : resolveColorToken(category.surfaceEdge, tokens.rule);
    const cardInk = isWildcard
        ? tokens.card
        : resolveColorToken(category.surfaceInk, tokens.ink);

    drawPaperGround(ctx, tokens.paper, tokens.ink);
    drawStoryChrome(ctx, "Kartu pertanyaan", tokens);

    const cardX = 80;
    const cardY = 290;
    const cardW = 920;
    const cardH = 1260;
    drawCardStockFrame(ctx, cardX, cardY, cardW, cardH, cardBg, cardEdge);

    // Top pills inside card
    const pillBg = isDarkCard || isWildcard ? "rgba(0, 0, 0, 0.22)" : "rgba(255, 255, 255, 0.65)";
    const pillBorder = isDarkCard || isWildcard ? "rgba(255, 255, 255, 0.28)" : "rgba(26, 31, 43, 0.14)";
    let cursorX = cardX + 64;
    const pillY = cardY + 64;

    cursorX += drawPill(ctx, category.label, cursorX, pillY, pillBg, cardInk, pillBorder) + 16;
    if (question.depth === 3) {
        cursorX += drawPill(ctx, "Mendalam", cursorX, pillY, pillBg, cardInk, pillBorder) + 16;
    }
    if (isWildcard) {
        drawPill(ctx, `Wildcard Lv ${question.intensity || 1}`, cursorX, pillY, tokens.ink, tokens.accent);
    }

    // Question text centered in card
    const fontSize = question.text.length > 110 ? 52 : question.text.length > 75 ? 60 : 68;
    const lineHeight = Math.round(fontSize * 1.3);
    ctx.save();
    ctx.font = `600 ${fontSize}px "Chillax", ui-rounded, ui-sans-serif, sans-serif`;
    const lines = wrapTextLines(question.text, cardW - 144, (line) => ctx.measureText(line).width);
    const totalHeight = lines.length * lineHeight;
    let textY = cardY + (cardH - totalHeight) / 2 + fontSize * 0.45;

    ctx.fillStyle = cardInk;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const line of lines) {
        ctx.fillText(line, CANVAS_WIDTH / 2, textY);
        textY += lineHeight;
    }
    ctx.restore();

    // Subtle prompt at card bottom
    ctx.save();
    ctx.font = '500 28px "Chillax", ui-rounded, ui-sans-serif, sans-serif';
    ctx.fillStyle = cardInk;
    ctx.globalAlpha = 0.72;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Jawabanmu apa? Mainkan kartu lainnya di ajakBicara.", CANVAS_WIDTH / 2, cardY + cardH - 82);
    ctx.restore();

    return deliverCanvasImage(
        canvas,
        buildShareFilename(category.id, question.id),
        `ajakBicara — ${category.label}`,
    );
}

export async function shareRecapCardImage(recap: RecapShareInput): Promise<ShareOutcome> {
    await document.fonts.ready;

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas tidak tersedia.");

    const tokens = {
        paper: readToken("--color-paper", "#f5f3ea"),
        paper2: readToken("--color-paper-2", "#ede9dc"),
        ink: readToken("--color-ink", "#1a1f2b"),
        muted: readToken("--color-muted", "#5b606e"),
        rule: readToken("--color-rule", "#d8d4c5"),
        accent: readToken("--color-accent", "#f2dc3a"),
        card: readToken("--color-card", "#fbfaf4"),
        edge: readToken("--color-edge", "#cfc8b4"),
    };

    drawPaperGround(ctx, tokens.paper, tokens.ink);
    drawStoryChrome(ctx, "Ringkasan sesi", tokens);

    const cardX = 80;
    const cardY = 290;
    const cardW = 920;
    const cardH = 1260;
    drawCardStockFrame(ctx, cardX, cardY, cardW, cardH, tokens.card, tokens.edge);

    // Top pear badge
    drawPill(ctx, recap.categoryLabel, cardX + 64, cardY + 64, tokens.accent, tokens.ink);

    // Closing message
    const quoted = `“${recap.message}”`;
    const fontSize = quoted.length > 95 ? 50 : 58;
    const lineHeight = Math.round(fontSize * 1.32);
    ctx.save();
    ctx.font = `600 ${fontSize}px "Chillax", ui-rounded, ui-sans-serif, sans-serif`;
    const lines = wrapTextLines(quoted, cardW - 144, (line) => ctx.measureText(line).width);
    const totalHeight = lines.length * lineHeight;
    let textY = cardY + 480 - totalHeight / 2 + fontSize * 0.4;

    ctx.fillStyle = tokens.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const line of lines) {
        ctx.fillText(line, CANVAS_WIDTH / 2, textY);
        textY += lineHeight;
    }
    ctx.restore();

    // Stats strip inside card
    const boxX = cardX + 64;
    const boxY = cardY + cardH - 290;
    const boxW = cardW - 128;
    const boxH = 200;
    drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 32);
    ctx.fillStyle = tokens.paper2;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = tokens.rule;
    ctx.stroke();

    const stats = [
        { label: "Topik", value: recap.categoryLabel },
        {
            label: "Dijawab",
            value: recap.skippedCount > 0
                ? `${recap.answeredCount} kartu (${recap.skippedCount} skip)`
                : `${recap.answeredCount} kartu`,
        },
        { label: "Durasi", value: recap.durationLabel },
    ];

    const colW = boxW / stats.length;
    stats.forEach((stat, index) => {
        const cx = boxX + colW * index + colW / 2;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = '500 24px "Chillax", ui-rounded, ui-sans-serif, sans-serif';
        ctx.fillStyle = tokens.muted;
        ctx.fillText(stat.label, cx, boxY + 68);

        ctx.font = '600 30px "Chillax", ui-rounded, ui-sans-serif, sans-serif';
        ctx.fillStyle = tokens.ink;
        ctx.fillText(stat.value, cx, boxY + 126, colW - 24);
        ctx.restore();
    });

    return deliverCanvasImage(
        canvas,
        buildShareFilename("ringkasan", recap.categoryLabel),
        `Ringkasan obrolan ajakBicara — ${recap.categoryLabel}`,
    );
}
