import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

async function analyzeAudio() {
    console.log("🚀 Starting Smart Audio Ingestion...");
    
    const audioListPath = path.join(process.cwd(), 'src/data/gemini_audio_list.json');
    const audioRefsPath = path.join(process.cwd(), 'src/data/gemini_audio_refs.json');
    
    if (!fs.existsSync(audioListPath) || !fs.existsSync(audioRefsPath)) {
        console.error("❌ Missing audio list or refs. please run 'sync_audio' script first.");
        return;
    }

    const audioList = JSON.parse(fs.readFileSync(audioListPath, 'utf-8'));
    const audioRefs = JSON.parse(fs.readFileSync(audioRefsPath, 'utf-8'));
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const audioMap: Record<string, any> = {};

    console.log(`🔍 Analyzing ${audioRefs.length} audio files...`);

    for (const ref of audioRefs) {
        console.log(`  - Processing: ${ref.name}`);
        
        const prompt = `
            Analyze this audio file. It is a recording of Nama (Khoekhoegowab) language.
            1. Transcribe the exact Nama word or phrase being spoken.
            2. Provide the English translation.
            3. Identify the category (e.g., Click, Vowel, Greeting, Noun, etc.).
            4. If it's a click, identify which one (Dental |, Alveolar ǂ, Palatal !, Lateral ||).
            
            Return the result in strictly valid JSON format like this:
            {
                "nama": "word",
                "english": "translation",
                "category": "category",
                "phonetic": "phonetic hint",
                "clickType": "type or null"
            }
        `;

        try {
            const result = await model.generateContent([
                {
                    fileData: {
                        mimeType: ref.mimeType,
                        fileUri: ref.uri
                    }
                },
                { text: prompt }
            ]);

            const responseText = result.response.text();
            // Clean the response (sometimes Gemini adds ```json ... ```)
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const analysis = JSON.parse(cleanJson);
            
            audioMap[ref.name] = {
                ...analysis,
                uri: ref.uri
            };
        } catch (error) {
            console.error(`  ⚠️ Failed to analyze ${ref.name}:`, error);
        }
    }

    const outputPath = path.join(process.cwd(), 'src/data/audio_context_map.json');
    fs.writeFileSync(outputPath, JSON.stringify(audioMap, null, 2));
    console.log(`✅ Smart Audio Map saved to ${outputPath}`);
}

analyzeAudio().catch(console.error);
