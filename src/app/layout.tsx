import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nama AI - Kora Tutor",
  description: "Learn Khoekhoegowab with AI",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1b1b1b] text-white`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 relative bg-[#1b1b1b] md:ml-16">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
