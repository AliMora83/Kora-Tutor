'use client';

import { INITIAL_LESSONS, Lesson } from '../data/lessons';

const STORAGE_KEY = 'nama_user_progress';

export interface UserProgress {
    [lessonId: string]: number; // currentXP
}

// Get current progress from storage or return empty object
export const getProgress = (): UserProgress => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
};

// Save progress to storage
export const saveProgress = (progress: UserProgress) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

// Check message for keywords and update progress
// Returns the Lesson that was updated, or null if no update
export const checkAndIncrementProgress = (message: string): Lesson | null => {
    const lowerMsg = message.toLowerCase();
    const currentProgress = getProgress();
    let updatedLesson: Lesson | null = null;

    for (const lesson of INITIAL_LESSONS) {
        const isMatch = lesson.keywords.some(kw => lowerMsg.includes(kw.toLowerCase()));

        if (isMatch) {
            const current = currentProgress[lesson.id] || 0;

            // Only increment if not already finished (optional, or we allow over-leveling?)
            // Let's cap it at totalXP for now
            if (current < lesson.totalXP) {
                currentProgress[lesson.id] = current + 1;
                updatedLesson = { ...lesson, currentXP: currentProgress[lesson.id] };
                saveProgress(currentProgress);
                return updatedLesson; // Return the first match to avoid multi-level ups at once for simplicity?
                // Actually, let's just break after first match to keep it simple and gratifying
                break;
            }
        }
    }

    return updatedLesson;
};

// Get full hydrated lesson objects with progress
export const getHydratedLessons = (): Lesson[] => {
    const progress = getProgress();
    return INITIAL_LESSONS.map(lesson => ({
        ...lesson,
        currentXP: progress[lesson.id] || 0
    }));
};
