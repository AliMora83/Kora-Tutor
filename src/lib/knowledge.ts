import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getNamaKnowledge() {
    try {
        const docRef = doc(db, "resources", "nama_language_guide");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.content as string || "";
        }

        console.warn("Nama Language Guide not found in Firestore.");
        return "";
    } catch (error) {
        console.error("Error reading source material from Firestore:", error);
        return "";
    }
}

