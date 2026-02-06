"use client";

import { useState } from "react";
import { Send, Loader2, Tv, MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, arrayUnion, setDoc } from "firebase/firestore";

export default function AdultsGeneratorPage() {
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
                body: JSON.stringify({ scenario, style: "The Simpsons" }),
            });

            const data = await response.json();
            if (data.script) {
                setScript(data.script);
            } else {
                setScript("Error: Could not generate script. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setScript("System Error. Please check console.");
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
                role: 'system',
                content: `[CONTEXT: SIMPSONS SCRIPT]\n\n${script}\n\n(User wants to discuss this script)`
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
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <header className="space-y-4 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-4">
                        <Tv className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                        The Sitcom Engine
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Generate funny &quot;Simpsons-style&quot; scripts that teach you Nama vocabulary.
                        (Powered by Firestore Knowledge Base)
                    </p>
                </header>

                {/* Input Area */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                        What happens in this episode?
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={scenario}
                            onChange={(e) => setScenario(e.target.value)}
                            placeholder="e.g. Homer tries to buy goat meat at the market..."
                            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all placeholder:text-neutral-600"
                            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !scenario.trim()}
                            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Action!</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Area */}
                {script && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="prose prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-neutral-300">
                                {script}
                            </pre>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSaveAndChat}
                                className="flex items-center gap-2 text-black font-bold bg-yellow-500 hover:bg-yellow-400 px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
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
