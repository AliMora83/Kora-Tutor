import fs from 'fs';
import path from 'path';

export function getNamaKnowledge() {
    try {
        // Adjust path: Go up from src/lib to root, then up to brain root, then into source_materials
        // This pathing might be fragile depending on deployment, but works for local.
        // For production, we might want to copy this file into the build.
        // BUT for now, let's just hardcod the absolute path for this specific user session to be safe,
        // or cleaner: use process.cwd() which usually points to nama-app root in dev.

        // Let's assume process.cwd() is .../nama-app
        // So we need ../source_materials/
        const filePath = path.resolve(process.cwd(), '../source_materials/nama_language_guide.md');

        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return content;
        }
        return "";
    } catch (error) {
        console.error("Error reading source material:", error);
        return "";
    }
}
