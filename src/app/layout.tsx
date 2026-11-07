import type { Metadata } from "next";
import React, { Suspense } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import AppShell from "@/components/AppShell";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Habitly — Latih Percaya Dirimu",
  description:
    "Habitly membantu remaja membangun rasa percaya diri berkomunikasi lewat latihan kebiasaan kecil harian.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink font-sans">
        <Suspense fallback={null}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
