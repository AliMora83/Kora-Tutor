import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getNamaKnowledge } from "@/lib/knowledge";
import * as fs from 'fs';
import * as path from 'path';
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
    You are a male tutor (him/he).
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
    6. **Playing Audio**: You have access to specific pronunciation audio files in Firebase. 
       - Here is the EXACT list of available audio files:
       ${fs.existsSync(path.join(process.cwd(), 'src/data/gemini_audio_list.json')) ? fs.readFileSync(path.join(process.cwd(), 'src/data/gemini_audio_list.json'), 'utf-8') : '[]'}
       - If the user asks for audio or when teaching clicks, vowels, or glossary terms, you MUST check this list. If the term matches an available file, respond with a markdown link shaped exactly like this: 
         \`[Play <Title>](audio:<filename>)\`
       - Example: If the user asks for the Alveolar click, output \`[Play The Alveolar click](audio:1-The Alveolar click.m4a)\`
       - Please use exact filenames from the list above. Do NOT hallucinate audio files.
       - This will trigger a custom audio player on their screen so they can listen to the pronunciation!

    7. **Speech Lab & Practice**: 
       - Encourage students to use the **Microphone icon** 🎙️ below to record themselves. 
       - You can then evaluate their pronunciation, analyze their clicks, and provide a score!
       - Tell them: "Hold the mic, say it back to me, and let's see how close you get to the authentic sound!"
    `;

        // Use Gemini 2.0 Flash (Confirmed Available)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction
        });

        // Load Audio Files if they exist
        const audioRefsPath = path.join(process.cwd(), 'src/data/gemini_audio_refs.json');
        let fileParts: any[] = [];
        if (fs.existsSync(audioRefsPath)) {
            const fileData = fs.readFileSync(audioRefsPath, 'utf8');
            const audioData = JSON.parse(fileData);
            
            // Limit to 20 files to avoid hitting request limits/timeouts
            fileParts = audioData.slice(0, 20).map((file: any) => ({
                fileData: {
                    mimeType: file.mimeType,
                    fileUri: file.uri
                }
            }));
            console.log(`🎙️  Injected ${fileParts.length} audio files into Kora's brain.`);
        }

        console.log(`📤 Sending prompt to Gemini (Model: gemini-2.5-flash) with Knowledge Injection...`);
        
        // Combine prompt and audio files
        const contentParts = [
            ...fileParts,
            { text: prompt }
        ];

        const result = await model.generateContent(contentParts);
        const response = await result.response;
        const text = response.text();
        console.log("📥 Received response from Gemini.");

        return NextResponse.json({ role: 'assistant', content: text });
    } catch (error: unknown) {
        console.error("🔥 Gemini API Fatal Error:", error);
        return NextResponse.json(
            { role: 'assistant', content: `API Error: ${(error as Error).message || "Unknown error"}` },
            { status: 500 }
        );
    }
}
