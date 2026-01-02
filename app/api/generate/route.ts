import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { context, audience } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error("API Key is missing in environment variables.");
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    // Initialize inside handler to ensure env vars are loaded
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using standard model name for better compatibility
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
            Anda adalah asisten pembuat kartu permainan obrolan (deep talk).
            Buatlah 12 pertanyaan obrolan yang unik, bermakna, dan menarik untuk konteks berikut:
            Konteks: ${context}
            Audiens: ${audience}

            Format keluaran HARUS berupa JSON murni dengan struktur seperti ini:
            {
              "questions": [
                {
                  "id": "ai-1",
                  "categoryId": "ai-custom",
                  "text": "Pertanyaan di sini?",
                  "depth": 1,
                  "followUps": ["Pertanyaan lanjutan 1?", "Pertanyaan lanjutan 2?"]
                }
              ]
            }

            Aturan:
            1. Gunakan Bahasa Indonesia yang natural, santai (tapi tetap sopan jika konteksnya formal).
            2. 'depth' bernilai 1 (ringan/ice breaker), 2 (sedikit mendalam), atau 3 (sangat mendalam/emosional).
            3. Berikan variasi depth (setidaknya ada beberapa level 1, 2, dan 3).
            4. 'followUps' adalah array string berisi 1-2 pertanyaan untuk memperdalam topik tersebut.
            5. Pastikan ID unik (ai-1, ai-2, dst).
            6. Jangan berikan teks penjelasan apapun diluar JSON.
        `;

    console.log("Generating questions with context:", context);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response received.");

    // Extract JSON from response (sometimes Gemini wraps it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;

    try {
      const data = JSON.parse(jsonStr);
      const questions = data.questions;

      // Save to server-side JSON file
      const historyPath = path.join(process.cwd(), "data", "ai_history.json");
      const aiCategory = {
        id: `ai-custom-${Date.now()}`,
        label: "AI Magic ✨",
        description: `Hasil generate untuk: ${context}`,
        color: "bg-amber-500",
        gradient: "from-amber-400 to-amber-600"
      };

      let history = [];
      if (fs.existsSync(historyPath)) {
        const fileContent = fs.readFileSync(historyPath, "utf-8");
        history = JSON.parse(fileContent || "[]");
      }

      const newSession = { category: aiCategory, questions };
      history.unshift(newSession);

      fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

      return NextResponse.json(data);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output:", text);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

  } catch (error: any) {
    // Detailed logging for debugging 404 and other errors
    console.error("AI Generation Detailed Error:");
    console.error("Status Code:", error?.status);
    console.error("Message:", error?.message);
    console.error("Details:", error?.response?.data || error?.details);

    // Map status codes for better user feedback
    const status = error?.status || 500;
    const message = error?.message || "Internal Server Error";

    return NextResponse.json({
      error: "Failed to generate questions",
      details: message,
      isApiError: true
    }, { status });
  }
}
