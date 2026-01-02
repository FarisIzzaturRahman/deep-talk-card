import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { rating, feedback } = body;

        // Log to console (Server-side)
        // In a real Vercel deployment without a DB, this logs to the Vercel Function Logs
        console.log("FEEDBACK RECEIVED:", {
            timestamp: new Date().toISOString(),
            rating,
            feedback
        });

        // TODO: Connect to a real database (Supabase/Firebase) or email service if needed.
        // For now, we return success to ensure the UI feels responsive.

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Feedback Error:", error);
        // Graceful fallback: return success even if something went wrong internally
        return NextResponse.json({ success: true }, { status: 200 });
    }
}
