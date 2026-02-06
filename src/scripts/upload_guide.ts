import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadGuide() {
    try {
        // 1. Load Service Account
        const serviceAccountPath = path.join(__dirname, "../../service-account.json");
        if (!fs.existsSync(serviceAccountPath)) {
            console.error("Error: service-account.json not found in project root.");
            process.exit(1);
        }

        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

        // 2. Initialize Admin SDK
        initializeApp({
            credential: cert(serviceAccount)
        });

        const db = getFirestore("nama-language");

        // 3. Read Markdown File
        const guidePath = path.join(__dirname, "../lib/nama_language_guide.md");
        if (!fs.existsSync(guidePath)) {
            console.error("Guide file not found at:", guidePath);
            process.exit(1);
        }

        const content = fs.readFileSync(guidePath, "utf-8");

        // 4. Create Resource Object
        const resource = {
            id: "nama_language_guide",
            title: "Nama Language Guide",
            category: "Learning Material",
            type: "Markdown Guide",
            content: content,
            status: "available",
            last_updated: new Date().toISOString()
        };

        // 5. Upload to Firestore
        await db.collection("resources").doc(resource.id).set(resource);
        console.log(`Successfully uploaded: ${resource.title}`);

    } catch (error) {
        console.error("Error uploading guide:", error);
    }
}

uploadGuide();
