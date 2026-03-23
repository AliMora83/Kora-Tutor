"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageSquare, BarChart2, Settings } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);
    
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = (path: string) => {
        if (!mounted) return false;
        return pathname === path;
    };

    return (
        <nav className="fixed z-50 bg-[#0f0f0f] border-[#2a2a2a]
            bottom-0 left-0 right-0 w-full h-16 border-t flex flex-row items-center justify-around
            md:top-0 md:bottom-0 md:left-0 md:w-16 md:h-auto md:border-r md:border-t-0 md:flex-col md:py-6
        ">
            {/* Logo - Desktop Only */}
            <div className="hidden md:block mb-8">
                <Link href="/" className="block p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-secondary/20 hover:border-secondary/50 transition-colors">
                        <Image
                            src="/logo.png"
                            alt="Kora Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                </Link>
            </div>

            {/* Nav Items Container */}
            <div className="flex flex-row justify-around w-full items-center md:flex-col md:gap-6 md:w-full md:px-2 md:h-full">
                <NavItem
                    href="/"
                    icon={<MessageSquare size={20} />}
                    label="Chat"
                    active={isActive('/')}
                />

                <NavItem
                    href="/progress"
                    icon={<BarChart2 size={20} />}
                    label="Progress"
                    active={isActive('/progress')}
                />

                {/* Spacer pushes settings to bottom on desktop */}
                <div className="hidden md:block md:flex-1" />

                <NavItem
                    href="/settings"
                    icon={<Settings size={20} />}
                    label="Settings"
                    active={isActive('/settings')}
                />
            </div>
        </nav>
    );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={`
        relative flex justify-center items-center w-10 h-10 rounded-xl transition-all duration-200 group mx-auto
        ${active ? 'bg-secondary/20 text-secondary' : 'text-gray-400 hover:text-white hover:bg-white/5'}
      `}
            title={label}
        >
            {icon}
            {/* Tooltip on hover (optional, browser handles 'title' attribute but we could do custom) */}
            <span className="sr-only">{label}</span>

            {/* Active Indicator (Dot/Tab) */}
            {active && (
                <>
                    {/* Mobile: Top Tab */}
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-secondary rounded-b-lg md:hidden"></span>

                    {/* Desktop: Right Bar */}
                    <span className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-secondary rounded-l-full"></span>
                </>
            )}
        </Link>
    );
}
