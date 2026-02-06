export interface Lesson {
    id: string;
    title: string;
    description: string;
    totalXP: number;
    currentXP: number; // Placeholder for initial state, actual value comes from user state
    level: 'Beginner' | 'Intermediate';
    keywords: string[];
    color: string; // Taildwind color class for the bar
}

export const INITIAL_LESSONS: Lesson[] = [
    {
        id: 'clicks',
        title: 'The 4 Clicks',
        description: 'Master the unique sounds of Nama: |, ||, !, ǂ.',
        totalXP: 5,
        currentXP: 0,
        level: 'Beginner',
        keywords: ['click', 'clicks', 'sounds', '|', '||', '!', 'ǂ', 'dental', 'lateral', 'alveolar', 'palatal'],
        color: 'bg-secondary'
    },
    {
        id: 'counting',
        title: 'Counting 1-10',
        description: 'Learn to count from |Gui to Disi.',
        totalXP: 10,
        currentXP: 0,
        level: 'Beginner',
        keywords: ['count', 'counting', 'number', 'numbers', 'one', 'two', 'three', 'gui', 'gam', 'nona', 'haka', 'koro', 'nani', 'hu', 'khaisa', 'khoese', 'disi'],
        color: 'bg-green-500'
    },
    {
        id: 'greetings',
        title: 'Basic Greetings',
        description: 'Essential daily phrases like "!Gâi tsēs".',
        totalXP: 8,
        currentXP: 0,
        level: 'Beginner',
        keywords: ['hello', 'hi', 'morning', 'day', 'gai', 'tses', 'matisa', 'how are you', 'goodbye'],
        color: 'bg-blue-500'
    },
    {
        id: 'intro',
        title: 'Self Introduction',
        description: 'Learn to say who you are: "Ti |ons ge..."',
        totalXP: 5,
        currentXP: 0,
        level: 'Beginner',
        keywords: ['name', 'names', 'called', 'ti', 'ons', 'ge', 'who are you', 'i am'],
        color: 'bg-purple-500'
    }
];
