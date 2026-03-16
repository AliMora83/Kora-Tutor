import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode: "en-AU",
                        name: "en-AU-Neural2-B",
                    },
                    audioConfig: {
                        audioEncoding: "MP3",
                        speakingRate: 1.0,
                        pitch: 0.0,
                    },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Google Cloud TTS Error:", error);
            return NextResponse.json({ error: error.message || "TTS Failed" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ audioContent: data.audioContent });
    } catch (error: any) {
        console.error("TTS API Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
