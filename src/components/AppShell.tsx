"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BarChart2, Users, LifeBuoy } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/tantangan", label: "Tantangan", Icon: Compass },
  { href: "/progress", label: "Progres", Icon: BarChart2 },
  { href: "/community", label: "Komunitas", Icon: Users },
  { href: "/help", label: "Bantuan", Icon: LifeBuoy },
];

// Halaman yang tidak menampilkan navigasi
const NO_NAV_PATHS = ["/onboarding", "/quiz", "/result", "/journal"];

function isNoNav(pathname: string) {
  return NO_NAV_PATHS.some((p) => pathname.startsWith(p)) || pathname.startsWith("/task/");
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isNoNav(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Skip link — aksesibilitas keyboard */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-action focus:text-white focus:rounded-card focus:text-sm focus:font-semibold"
      >
        Langsung ke konten
      </a>

      {/* Sidebar — desktop, tidak ikut scroll */}
      <aside
        className="hidden lg:flex flex-col w-60 shrink-0 border-r border-hairline bg-surface h-screen"
        aria-label="Navigasi utama"
      >
        <div className="px-6 py-8 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Habitly Logo"
            className="w-9 h-9 rounded-full shadow-soft object-cover"
          />
          <span className="text-xl font-bold text-action tracking-tight">Habitly</span>
        </div>
        <nav className="flex flex-col gap-1 px-3 flex-1" aria-label="Menu">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-3 rounded-container text-sm font-semibold transition-colors ${
                  active
                    ? "bg-mint-tint text-action"
                    : "text-ink-secondary hover:bg-canvas hover:text-ink"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.75} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-6 text-xs text-ink-faint">
          Alat bantu latihan, bukan terapi.
        </div>
      </aside>

      {/* Konten utama — hanya area ini yang scroll */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        <main id="main-content" className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {children}
          </div>
        </main>

        {/* Tab bar — mobile */}
        <nav
          className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-hairline bg-surface h-16 flex items-center"
          aria-label="Navigasi tab"
        >
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[11px] font-semibold transition-colors ${
                  active ? "text-action" : "text-ink-faint"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.75} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

