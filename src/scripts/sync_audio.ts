import { GoogleAIFileManager } from "@google/generative-ai/server";
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert('./service-account.json'),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
}

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);

async function main() {
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles();
    
    console.log(`Found ${files.length} files in Firebase Storage`);
    
    let geminiFiles: any[] = [];

    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    for (const file of files) {
        if (file.name.endsWith('.mp3')) {
            console.log(`Processing: ${file.name}`);
            const cleanName = file.name.replace(/\//g, '_');
            const tempFilePath = path.join(tempDir, cleanName);
            
            await file.download({ destination: tempFilePath });
            
            console.log(`Uploading ${file.name} to Gemini File API...`);
            const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                mimeType: "audio/mp3",
                displayName: cleanName,
            });
            
            console.log(`Uploaded! URI: ${uploadResponse.file.uri}`);
            geminiFiles.push({
                name: file.name,
                uri: uploadResponse.file.uri,
                mimeType: "audio/mp3"
            });
            
            fs.unlinkSync(tempFilePath);
        }
    }
    
    const refsDir = path.join(process.cwd(), 'src/data');
    if (!fs.existsSync(refsDir)) fs.mkdirSync(refsDir, { recursive: true });
    
    const refsPath = path.join(refsDir, 'gemini_audio_refs.json');
    fs.writeFileSync(refsPath, JSON.stringify(geminiFiles, null, 2));
    console.log(`Saved ${geminiFiles.length} audio references to ${refsPath}`);
}

main().catch(console.error);
