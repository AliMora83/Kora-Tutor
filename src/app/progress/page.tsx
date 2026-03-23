"use client";

import React, { useEffect, useState } from 'react';
import { getHydratedLessons } from '@/lib/progress';
import { Lesson } from '@/data/lessons';
import { Trophy, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProgressPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);

    // Initial load — deferred to avoid synchronous setState on mount (hydration guard)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLessons(getHydratedLessons());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Cross-tab sync — updates progress if chat is open in another tab
    useEffect(() => {
        const handleStorageChange = () => {
            setLessons(getHydratedLessons());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const totalCompleted = lessons.filter(l => l.currentXP >= l.totalXP).length;
    const totalXP = lessons.reduce((acc, l) => acc + l.currentXP, 0);

    return (
        <div className="min-h-screen bg-[#0f0f0f] pb-24 md:pb-0 md:pl-20 pt-8 px-4 md:px-8">
            <div className="max-w-5xl mx-auto animate-fade-in-up">

                {/* Header Dashboard */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl font-serif text-white mb-2">My Progress</h1>
                        <p className="text-gray-400">Track your fluency journey in Khoekhoegowab.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-[#2a2a2a] rounded-2xl p-4 flex items-center gap-3 border border-white/5">
                            <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{totalCompleted}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Completed</div>
                            </div>
                        </div>
                        <div className="bg-[#2a2a2a] rounded-2xl p-4 flex items-center gap-3 border border-white/5">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                <Star size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{totalXP}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Total XP</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lesson Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {lessons.map((lesson) => (
                        <LessonCard key={lesson.id} lesson={lesson} />
                    ))}
                </div>

            </div>
        </div>
    );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
    const percent = Math.min(100, Math.round((lesson.currentXP / lesson.totalXP) * 100));
    const isComplete = percent >= 100;

    return (
        <div className="glass-card p-6 md:p-8 relative overflow-hidden group hover:border-white/20 transition-all">
            {/* Background Glow */}
            <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity ${lesson.color}`}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ${isComplete ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}>
                        {lesson.level}
                    </span>
                    {isComplete && <CheckCircle className="text-green-500" size={24} />}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{lesson.title}</h3>
                <p className="text-gray-400 mb-6 h-12">{lesson.description}</p>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-mono">{lesson.currentXP} / {lesson.totalXP} XP</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${lesson.color}`}
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                </div>

                {/* Action */}
                <Link
                    href="/?ref=progress"
                    className={`w-full block text-center py-3 rounded-xl font-medium transition-colors ${isComplete
                        ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
                        : 'bg-white text-black hover:bg-gray-200'
                        }`}
                >
                    {isComplete ? 'Review Lesson' : 'Practice Now'}
                </Link>
            </div>
        </div>
    );
}
