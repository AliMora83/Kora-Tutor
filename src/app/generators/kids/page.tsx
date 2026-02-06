"use client";

import { useState } from "react";
import { Sparkles, Map, Star, Volume2, MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, arrayUnion, setDoc } from "firebase/firestore";

export default function KidsGeneratorPage() {
    const [scenario, setScenario] = useState("");
    const [script, setScript] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGenerate = async () => {
        if (!scenario.trim()) return;

        setLoading(true);
        setScript("");

        try {
            const response = await fetch("/api/generate-script", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scenario, style: "Dora" }),
            });

            const data = await response.json();
            if (data.script) {
                setScript(data.script);
            } else {
                setScript("Uh oh! We couldn't find the map. Try again!");
            }
        } catch (error) {
            console.error("Error:", error);
            setScript("Something went wrong with our adventure!");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAndChat = async () => {
        const user = auth.currentUser;
        if (!user || !script) return;

        try {
            const chatRef = doc(db, 'users', user.uid, 'chats', 'default');

            // 1. Add System/Context Message
            const contextMsg = {
                role: 'system', // Or 'user' if we want it to look like a user paste
                content: `[CONTEXT: DORA SCRIPT]\n\n${script}\n\n(User wants to discuss this script)`
            };

            await setDoc(chatRef, {
                messages: arrayUnion(contextMsg),
                updatedAt: new Date()
            }, { merge: true });

            // 2. Redirect to Chat
            router.push('/');
        } catch (error) {
            console.error("Failed to save to chat:", error);
            alert("Could not save to chat. Are you signed in?");
        }
    };

    return (
        <div className="min-h-screen bg-fuchsia-950 text-white p-6 md:p-12 font-sans selection:bg-pink-500 selection:text-white">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <header className="space-y-4 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-pink-500 rounded-full mb-4 shadow-lg shadow-pink-500/20 animate-bounce">
                        <Map className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-sm">
                        Kora&apos;s Adventure!
                    </h1>
                    <p className="text-pink-200 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
                        Let&apos;s go on an adventure to learn Nama! <br />
                        <span className="text-sm opacity-80">(Backpack, Backpack!)</span>
                    </p>
                </header>

                {/* Input Area */}
                <div className="bg-white/10 border-4 border-pink-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-20"></div>

                    <label className="block text-lg font-bold text-pink-300 mb-3 uppercase tracking-wider">
                        Where are we going today?
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={scenario}
                            onChange={(e) => setScenario(e.target.value)}
                            placeholder="e.g. Crossing the Crocodile River..."
                            className="flex-1 bg-fuchsia-900/50 border-2 border-fuchsia-700/50 rounded-2xl px-6 py-4 text-xl text-white placeholder-fuchsia-400/50 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 focus:outline-none transition-all"
                            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !scenario.trim()}
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xl rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-purple-900/50 hover:scale-105 active:scale-95"
                        >
                            {loading ? (
                                <Sparkles className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Star className="w-6 h-6 fill-current" />
                                    <span>Let&apos;s Go!</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Area */}
                {script && (
                    <div className="bg-white text-fuchsia-950 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-8 duration-700 border-4 border-purple-200">
                        <div className="prose prose-lg prose-p:text-fuchsia-900 prose-headings:text-purple-700 max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-lg md:text-xl leading-loose font-medium">
                                {script}
                            </pre>
                        </div>
                        <div className="mt-8 flex justify-center gap-4 flex-wrap">
                            <button className="flex items-center gap-2 text-purple-600 font-bold bg-purple-100 hover:bg-purple-200 px-6 py-3 rounded-full transition-colors">
                                <Volume2 className="w-5 h-5" />
                                <span>Read it out loud!</span>
                            </button>

                            <button
                                onClick={handleSaveAndChat}
                                className="flex items-center gap-2 text-white font-bold bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-full transition-colors shadow-lg hover:shadow-xl"
                            >
                                <MessageSquarePlus className="w-5 h-5" />
                                <span>Save & Chat</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
