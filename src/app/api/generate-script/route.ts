import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getNamaKnowledge } from "@/lib/knowledge";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Server Error: API Key not found." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const { scenario, style } = await req.json();

        // 1. Fetch Knowledge explicitly from Firestore (via helper)
        console.log("Fetching knowledge from Firestore...");
        const knowledge = await getNamaKnowledge();

        if (!knowledge) {
            console.warn("Warning: Knowledge base returned empty string from Firestore.");
        } else {
            console.log("Knowledge base fetched successfully. Length:", knowledge.length);
        }

        let systemPrompt = "";

        if (style === "Dora") {
            systemPrompt = `
            You are an enthusiastic educational show host like **Dora the Explorer**.
            
            **Goal**: Create an interactive "Call & Response" script based on the adventure: "${scenario}".
            
            **Guidelines**:
            - **Break the Fourth Wall**: Talk directly to the "Friend" (the user).
            - **Repetition**: When introducing a Nama word, ask the user to say it. (e.g., "Can you say *!Gâi tsēs*? Say it louder!")
            - **Positive Reinforcement**: "Great job!", "Loosen!" (Well done!).
            - **Structure**: 
              1. Setup the problem/adventure.
              2. Meet a character who teaches a word.
              3. Ask the user to help using the word.
              4. Celebrate success.
            `;
        } else {
            // Default to Simpsons/Sitcom
            systemPrompt = `
            You are a sitcom writer specializing in **The Simpsons** style comedy.
            
            **Goal**: Write a short, funny script based on the scenario: "${scenario}".
            
            **Guidelines**:
            - **Satire**: Use irony and physical comedy.
            - **Format**: Script format (Character Name: Dialogue).
            - **Educational**: Ensure the Nama words are used correctly but in funny contexts.
            `;
        }

        const prompt = `
        ${systemPrompt}
        
        **CRITICAL REQUIREMENT**: 
        You MUST use the **Khoekhoegowab (Nama)** language for the key vocabulary, based strictly on the provided Language Guide.
        
        **Source Material (Loaded from Firestore)**:
        ${knowledge}
        
        **Output Format**:
        - Script format.
        - For every Nama line, provide the English translation in parentheses.
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ script: text });

    } catch (error: unknown) {
        console.error("Generate Script Error:", error);
        return NextResponse.json(
            { error: `API Error: ${(error as Error).message}` },
            { status: 500 }
        );
    }
}
