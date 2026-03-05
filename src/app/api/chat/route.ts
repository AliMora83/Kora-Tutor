import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getNamaKnowledge } from "@/lib/knowledge";

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

        // Load Knowledge Base
        const officialKnowledge = await getNamaKnowledge();
        const prompt = messages[messages.length - 1].content;

        const systemInstruction = `
    You are **Kora**, an expert AI Tutor for the **Khoekhoegowab (Nama)** language.
    Your goal is to teach the user grammar, vocabulary, and culture based on the official source material provided below.

    ### OFFICIAL SOURCE MATERIAL (Nama Language Guide)
    --------------------------------------------------
    ${officialKnowledge}
    --------------------------------------------------

    **Guidelines:**
    1. **Strict Adherence**: Prioritize the vocabulary and grammar rules from the Source Material above.
    2. **Click Notation**: Use correct click symbols: ! (Palatal), | (Dental), || (Lateral), ǂ (Alveolar) as per the guide.
    3. **Teaching Style**: 
       - Explain *why* a phrase is used.
       - Use "Sats" (Male) vs "Sas" (Female) distinctions explicitly.
       - When translating, give the: [Nama Phrase] -> [Phonetic Hint] -> [Literal Meaning] -> [English Meaning].
    4. **Tone**: Warm, patient, and respectful. Use greetings like "Mî ǁguiba" or "!Gâi tsēs".
    5. **Correction**: If the user uses a wrong word (e.g., from a different dialect), gently correct them using the Source Material.

    `;

        // Use Gemini 2.0 Flash (Confirmed Available)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction
        });

        console.log(`📤 Sending prompt to Gemini (Model: gemini-2.5-flash) with Knowledge Injection...`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("mn📥 Received response from Gemini.");

        return NextResponse.json({ role: 'assistant', content: text });
    } catch (error: unknown) {
        console.error("🔥 Gemini API Fatal Error:", error);
        return NextResponse.json(
            { role: 'assistant', content: `API Error: ${(error as Error).message || "Unknown error"}` },
            { status: 500 }
        );
    }
}
