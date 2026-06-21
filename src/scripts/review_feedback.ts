/**
 * review_feedback.ts
 * Reads message_feedback from the "nama-language" Firestore database and
 * prints a thumbs up/down summary plus the most recent ratings.
 *
 * Auth: uses your own `gcloud auth login` session (not ADC), via
 * `gcloud auth print-access-token`. You must have Firestore read access
 * on the "nama-language" GCP project.
 *
 * Run: npx tsx src/scripts/review_feedback.ts
 */

import { execSync } from "child_process";

const projectId = "nama-language";
const databaseId = "nama-language";

interface FirestoreDoc {
    name: string;
    fields: Record<string, { stringValue?: string; timestampValue?: string }>;
}

async function review() {
    const token = execSync("gcloud auth print-access-token").toString().trim();

    const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/message_feedback?pageSize=300`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
        throw new Error(`Firestore REST error ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as { documents?: FirestoreDoc[] };
    const documents = data.documents ?? [];

    if (documents.length === 0) {
        console.log("No feedback recorded yet.");
        return;
    }

    let up = 0;
    let down = 0;
    const rows = documents.map((doc) => {
        const f = doc.fields;
        const rating = f.rating?.stringValue ?? "unknown";
        if (rating === "up") up++;
        if (rating === "down") down++;
        return {
            userId: f.userId?.stringValue ?? "unknown",
            messageId: f.messageId?.stringValue ?? "unknown",
            rating,
            timestamp: f.timestamp?.timestampValue ?? "unknown",
        };
    });

    rows.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

    console.log(`\n📊 Feedback Summary — ${documents.length} total ratings`);
    console.log(`   👍 Up:   ${up}`);
    console.log(`   👎 Down: ${down}`);
    console.log(`   Ratio:  ${up + down > 0 ? Math.round((up / (up + down)) * 100) : 0}% positive\n`);

    console.log("Most recent 20 ratings:");
    rows.slice(0, 20).forEach((r) => {
        const icon = r.rating === "up" ? "👍" : "👎";
        console.log(`  ${icon}  user=${r.userId.slice(0, 8)}...  message=${r.messageId.slice(0, 8)}...  ${r.timestamp}`);
    });
}

review().catch((err) => {
    console.error("❌ Review failed:", err);
    process.exit(1);
});
