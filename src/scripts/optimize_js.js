const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

async function optimize() {
    try {
        const serviceAccountPath = path.join(__dirname, "../../service-account.json");
        if (!fs.existsSync(serviceAccountPath)) {
            console.error("Service account not found.");
            return;
        }

        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        const db = admin.firestore();
        // Point to the correct guide path
        const guidePath = path.join(__dirname, "../data/nama_language_guide.md");
        const content = fs.readFileSync(guidePath, "utf-8");

        const sections = content.split(/\n## /);
        console.log(`Processing ${sections.length} sections...`);

        const batch = db.batch();
        const kbCollection = db.collection("knowledge_base");

        sections.forEach((section, index) => {
            const lines = section.split('\n');
            const title = lines[0].replace('## ', '').trim();
            const body = lines.slice(1).join('\n').trim();

            if (body.length > 0) {
                const docRef = kbCollection.doc(`nama_chunk_${index}`);
                batch.set(docRef, {
                    id: `nama_chunk_${index}`,
                    title,
                    content: body,
                    category: "Linguistics",
                    last_updated: admin.firestore.FieldValue.serverTimestamp()
                });
            }
        });

        await batch.commit();
        console.log("SUCCESS: Nama Language Knowledge Base optimized.");
    } catch (e) {
        console.error("ERROR:", e);
    }
}

optimize();
