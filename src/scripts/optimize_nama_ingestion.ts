import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeIngestion() {
    try {
        const serviceAccountPath = path.join(__dirname, "../../service-account.json");
        if (!fs.existsSync(serviceAccountPath)) {
            console.error("Error: service-account.json not found.");
            return;
        }

        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

        if (!initializeApp.length) {
            initializeApp({
                credential: cert(serviceAccount)
            });
        }

        const db = getFirestore("nama-language");
        const guidePath = path.join(__dirname, "../../src/data/nama_language_guide.md");
        const content = fs.readFileSync(guidePath, "utf-8");

        // 1. Split by Headings
        const sections = content.split(/\n## /);
        console.log(`Found ${sections.length} potential sections.`);

        const chunks = sections.map((section, index) => {
            const lines = section.split('\n');
            const title = lines[0].replace('## ', '').trim();
            const body = lines.slice(1).join('\n').trim();

            return {
                id: `nama_chunk_${index}`,
                title,
                content: body,
                category: "Linguistics",
                keywords: title.split(' '),
                last_updated: FieldValue.serverTimestamp()
            };
        }).filter(c => c.content.length > 0);

        // 2. Upload Chunks to a new collection 'knowledge_base'
        console.log(`Uploading ${chunks.length} optimized chunks...`);
        const batch = db.batch();
        const kbCollection = db.collection("knowledge_base");

        for (const chunk of chunks) {
            const docRef = kbCollection.doc(chunk.id);
            batch.set(docRef, chunk);
        }

        await batch.commit();
        console.log("Ingestion optimization complete. High-granularity indices created.");

    } catch (error) {
        console.error("Optimization failed:", error);
    }
}

optimizeIngestion();
