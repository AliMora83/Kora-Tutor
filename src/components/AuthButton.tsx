"use client";

import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login Failed:", error);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    if (!user) {
        return (
            <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-sm font-medium border border-white/5"
            >
                <UserIcon size={16} />
                <span>Sign in</span>
            </button>
        );
    }

    return (
        <div className="flex items-center gap-3 bg-[#2a2a2a] pl-2 pr-4 py-1.5 rounded-full border border-white/5 shadow-sm">
            {user.photoURL ? (
                <Image
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    width={28}
                    height={28}
                    className="rounded-full"
                />
            ) : (
                <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {user.displayName?.[0] || "U"}
                </div>
            )}

            <span className="text-sm truncate max-w-[80px] hidden md:block text-gray-300">
                {user.displayName?.split(" ")[0]}
            </span>

            <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors"
                title="Sign Out"
            >
                <LogOut size={14} />
            </button>
        </div>
    );
}
