import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        // Debug logging (Server-side)
        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY is missing from environment variables.");
            return NextResponse.json(
                { role: 'assistant', content: "Server Error: API Key not found. Please check .env.local" },
                { status: 500 }
            );
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);

        // Parse request
        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { role: 'assistant', content: "Error: Invalid message format." },
                { status: 400 }
            );
        }

        const prompt = messages[messages.length - 1].content;

        const systemInstruction = `
    You are an expert linguist specializing in the **Khoekhoegowab (Nama)** language of Namibia.
    Your goal is to be a helpful, encouraging "Kora Tutor" for students learning Nama.

    **Guidelines:**
    1. Always use correct click notation: ! (Dental), | (Dental), || (Lateral), ≠ (Palatal).
    2. Explain grammar concepts simply.
    3. If asked to translate, provide the Nama phrase, then a phonetic breakdown, then the literal meaning.
    4. Be culturally sensitive and respectful of Khoisan history.
    5. If you don't know a word, admit it rather than hallucinating.

    **Tone:**
    Friendly, patient, and educational. Start responses with "Mî ǁguiba!" (Hello) occasionally.
    `;

        // Use Gemini 2.0 Flash (Confirmed Available via REST API)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: systemInstruction
        });

        console.log(`📤 Sending prompt to Gemini (Model: gemini-2.0-flash)...`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("mn📥 Received response from Gemini.");

        return NextResponse.json({ role: 'assistant', content: text });
    } catch (error: any) {
        console.error("🔥 Gemini API Fatal Error:", error);
        return NextResponse.json(
            { role: 'assistant', content: `API Error: ${error.message || "Unknown error"}` },
            { status: 500 }
        );
    }
}
