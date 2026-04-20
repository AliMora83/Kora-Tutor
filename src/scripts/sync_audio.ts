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
    
    const geminiFiles: any[] = [];

    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const extensions = ['.mp3', '.m4a', '.wav'];
    for (const file of files) {
        const ext = path.extname(file.name).toLowerCase();
        if (extensions.includes(ext)) {
            console.log(`Processing: ${file.name}`);
            const cleanName = file.name.replace(/\//g, '_');
            const tempFilePath = path.join(tempDir, cleanName);
            
            await file.download({ destination: tempFilePath });
            
            const mimeType = ext === '.m4a' ? 'audio/mp4' : ext === '.wav' ? 'audio/wav' : 'audio/mp3';
            console.log(`Uploading ${file.name} to Gemini File API...`);
            const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                mimeType: mimeType as any,
                displayName: cleanName,
            });
            
            console.log(`Uploaded! URI: ${uploadResponse.file.uri}`);
            geminiFiles.push({
                name: file.name,
                uri: uploadResponse.file.uri,
                mimeType: mimeType
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
