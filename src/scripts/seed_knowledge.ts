/**
 * seed_knowledge.ts
 * Seeds resources/nama_language_guide into the "nama-language" Firestore database.
 * Run once: npx tsx src/scripts/seed_knowledge.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const projectId = "nama-language";
const databaseId = "nama-language"; // matches firebase.json + firebase.ts

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
});

const db = admin.firestore();
db.settings({ databaseId });

async function seed() {
    const guidePath = path.join(process.cwd(), "src/lib/nama_language_guide.md");
    const content = fs.readFileSync(guidePath, "utf-8");

    const docRef = db.collection("resources").doc("nama_language_guide");
    await docRef.set({
        content,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        source: "nama_language_guide.md",
    });

    console.log(`✅ Seeded resources/nama_language_guide (${content.length} chars) into Firestore [${databaseId}]`);
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
