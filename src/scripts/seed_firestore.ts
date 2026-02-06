import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedFirestore() {
    try {
        // 1. Load Service Account
        const serviceAccountPath = path.join(__dirname, "../../service-account.json");
        if (!fs.existsSync(serviceAccountPath)) {
            console.error("Error: service-account.json not found in project root.");
            console.error("Expected at:", serviceAccountPath);
            process.exit(1);
        }

        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

        // 2. Initialize Admin SDK
        initializeApp({
            credential: cert(serviceAccount)
        });

        const db = getFirestore("nama-language");

        // 3. Load Resources
        const resourcesPath = path.join(__dirname, "../data/resources.json");
        if (!fs.existsSync(resourcesPath)) {
            console.error("Resources file not found at:", resourcesPath);
            process.exit(1);
        }

        const rawData = fs.readFileSync(resourcesPath, "utf-8");
        const data = JSON.parse(rawData);

        if (!data.resources || !Array.isArray(data.resources)) {
            console.error("Invalid data format: 'resources' array matches not found.");
            process.exit(1);
        }

        console.log(`Found ${data.resources.length} resources to upload.`);

        // 4. Upload to Firestore
        const batch = db.batch();
        let count = 0;

        for (const resource of data.resources) {
            if (!resource.id) {
                console.warn("Skipping resource without ID:", resource);
                continue;
            }

            // Use the correct 'resources' collection
            const docRef = db.collection("resources").doc(resource.id);
            batch.set(docRef, resource);
            count++;
        }

        await batch.commit();
        console.log(`Successfully batch uploaded ${count} documents.`);

    } catch (error) {
        console.error("Error seeding Firestore:", error);
    }
}

seedFirestore();
