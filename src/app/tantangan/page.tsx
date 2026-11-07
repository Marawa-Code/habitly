"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Sparkles,
  Ear,
  UserPlus,
  Users,
  MessageSquare,
  Mic,
  HelpCircle,
  Shield,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";
import { loadState } from "@/lib/storage";
import type { AppState, Challenge } from "@/types";
import challengesData from "@/content/challenges.json";

const ICON_MAP: Record<string, LucideIcon> = {
  Ear,
  UserPlus,
  Users,
  MessageSquare,
  Mic,
  HelpCircle,
  Shield,
  MessageCircle,
  Sparkles,
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Pemula",
  2: "Menengah",
  3: "Lanjutan",
};

export default function TantanganPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const s = loadState();
    if (!s.user) {
      router.replace("/onboarding");
      return;
    }
    setState(s);
  }, [router]);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-ink-secondary text-sm">Memuat…</p>
      </div>
    );
  }

  const challenges = challengesData as Challenge[];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Semua Tantangan</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Pilih tantangan yang paling kamu butuhkan untuk mulai melatih kebiasaan berkomunikasi.
        </p>
      </div>

      {/* List Tantangan */}
      <div className="flex flex-col gap-3">
        {challenges.map((c) => {
          const isActive = state.activeChallengeId === c.id;
          const IconComponent = ICON_MAP[c.icon] ?? Sparkles;

          return (
            <div
              key={c.id}
              onClick={() => {
                if (c.available) {
                  router.push(`/tantangan/${c.id}`);
                }
              }}
              className={[
                "group bg-surface border rounded-card px-4 py-4 flex items-center gap-3.5 shadow-soft transition-all",
                c.available ? "cursor-pointer hover:border-action/40 hover:shadow-md" : "opacity-80 cursor-default",
                isActive ? "border-action bg-mint-tint/20 ring-1 ring-action/20" : "border-hairline",
              ].join(" ")}
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-mint-tint flex items-center justify-center text-action shrink-0 group-hover:scale-105 transition-transform">
                <IconComponent size={22} strokeWidth={2} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-bold text-ink truncate group-hover:text-action transition-colors">
                    {c.name}
                  </h2>
                  {isActive && (
                    <Chip variant="mint" className="text-[11px] py-0 px-2 font-medium">
                      Aktif ✓
                    </Chip>
                  )}
                  {!c.available && (
                    <span className="text-[10px] text-ink-faint bg-canvas border border-hairline px-2 py-0.5 rounded">
                      Segera hadir
                    </span>
                  )}
                </div>

                <p className="text-xs text-ink-secondary line-clamp-1 leading-relaxed">
                  {c.focus}
                </p>

                <div className="flex items-center gap-2 mt-0.5">
                  <Chip variant="sky" className="text-[11px] py-0 px-2 font-medium">
                    {c.durationDays} Hari
                  </Chip>
                  <Chip variant="neutral" className="text-[11px] py-0 px-2 font-medium">
                    {DIFFICULTY_LABELS[c.difficulty]}
                  </Chip>
                </div>
              </div>

              {/* Chevron */}
              {c.available && (
                <ChevronRight
                  size={18}
                  className="text-ink-faint shrink-0 group-hover:text-action group-hover:translate-x-0.5 transition-all"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Pembatas */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-hairline" />
        <span className="text-xs text-ink-faint uppercase font-medium tracking-wider">
          atau
        </span>
        <div className="flex-1 h-px bg-hairline" />
      </div>

      {/* Opsi Kuis Dulu */}
      <div className="pb-4">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => router.push("/quiz")}
          className="flex items-center justify-center gap-2"
        >
          <Sparkles size={16} className="text-action" />
          <span>Mulai Kuis Penilaian Diri</span>
        </Button>
      </div>
    </div>
  );
}
