import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;
        const expectedText = formData.get('expectedText') as string;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || !audioFile) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Convert file to base64 for Gemini
        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');

        const prompt = `
            Evaluate the pronunciation of this Nama (Khoekhoegowab) language recording.
            The user was trying to say: "${expectedText}".
            
            Provide:
            1. Accuracy Score (1-100).
            2. Specific feedback on clicks (!, |, ||, ǂ) or vowels if any.
            3. Tips for improvement.
            
            Keep the tone encouraging, like a supportive teacher.
            Return result in JSON format:
            {
                "score": number,
                "feedback": "string",
                "tips": "string"
            }
        `;

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: audioFile.type,
                    data: base64Audio
                }
            },
            { text: prompt }
        ]);

        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : responseText;
        
        return NextResponse.json(JSON.parse(cleanJson));
    } catch (error: any) {
        console.error("Speech Evaluation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
