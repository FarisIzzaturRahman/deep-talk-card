import { NextResponse } from "next/server";

const VALID_RATINGS = new Set(["happy", "neutral", "sad"]);
const MAX_FEEDBACK_LENGTH = 1_000;

interface FeedbackPayload {
    rating: string;
    feedback: string;
}

function parseFeedbackPayload(value: unknown): FeedbackPayload | null {
    if (!value || typeof value !== "object") return null;

    const { rating, feedback } = value as Record<string, unknown>;
    if (typeof rating !== "string" || !VALID_RATINGS.has(rating)) return null;
    if (typeof feedback !== "string" || feedback.length > MAX_FEEDBACK_LENGTH) return null;

    return { rating, feedback: feedback.trim() };
}

export async function POST(request: Request) {
    try {
        const payload = parseFeedbackPayload(await request.json());
        if (!payload) {
            return NextResponse.json(
                { success: false, error: "Feedback tidak valid." },
                { status: 400 },
            );
        }

        console.info("FEEDBACK RECEIVED", {
            timestamp: new Date().toISOString(),
            ...payload,
        });

        return NextResponse.json({ success: true }, { status: 202 });
    } catch {
        return NextResponse.json(
            { success: false, error: "Format permintaan tidak valid." },
            { status: 400 },
        );
    }
}
