"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Zap,
  Brain,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  Rocket,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";
import { loadState, saveState, todayString } from "@/lib/storage";
import type { AppState, Challenge } from "@/types";
import challengesData from "@/content/challenges.json";

export default function DetailTantanganPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = params?.id as string;

  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const s = loadState();
    if (!s.user) {
      router.replace("/onboarding");
      return;
    }
    setState(s);
  }, [router]);

  const challenge = (challengesData as Challenge[]).find((c) => c.id === challengeId);

  if (!state || !challenge) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-ink-secondary text-sm">
          {!challenge ? "Tantangan tidak ditemukan." : "Memuat…"}
        </p>
        {!challenge && (
          <Button variant="secondary" onClick={() => router.push("/tantangan")}>
            Kembali ke Daftar Tantangan
          </Button>
        )}
      </div>
    );
  }

  const isActive = state.activeChallengeId === challenge.id;

  function handleStartChallenge() {
    if (!challenge) return;
    saveState({
      activeChallengeId: challenge.id,
      currentPathId: challenge.pathId,
      challengeStartDate: todayString(),
      currentLevel: 1,
    });
    router.push("/");
  }

  const factIcons = [Zap, Brain, TrendingUp];

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="w-9 h-9 rounded-full bg-surface border border-hairline flex items-center justify-center text-ink-secondary hover:text-ink hover:border-action transition-colors shadow-soft"
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-ink">Detail Tantangan</h1>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-mint-tint/70 to-sky-light-tint/60 border border-hairline px-6 py-6 shadow-soft flex flex-col gap-4">
        <div className="w-14 h-14 rounded-2xl bg-surface border border-hairline/80 flex items-center justify-center text-3xl shadow-soft">
          <span role="img" aria-label={challenge.name}>
            {challenge.emoji}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink">{challenge.name}</h2>
          <p className="mt-1 text-sm text-ink-secondary leading-relaxed">
            {challenge.description}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <Chip variant="sky" className="text-xs py-1 px-3" icon={<Clock size={13} strokeWidth={2} />}>
            {challenge.durationDays} Hari
          </Chip>
          <Chip variant="neutral" className="text-xs py-1 px-3" icon={<Target size={13} strokeWidth={2} />}>
            {challenge.difficulty}
          </Chip>
          {isActive && (
            <Chip variant="mint" className="text-xs py-1 px-3">
              Sedang Aktif ✓
            </Chip>
          )}
        </div>
      </div>

      {/* Section 1: Penjelasan Ilmiah */}
      <Card>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-action">
            <BookOpen size={18} strokeWidth={2} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Penjelasan Ilmiah
            </span>
          </div>

          <h3 className="text-base font-bold text-ink leading-snug">
            {challenge.science.title}
          </h3>

          <p className="text-sm text-ink-secondary leading-relaxed">
            {challenge.science.body}
          </p>
        </div>
      </Card>

      {/* Section 2: Fakta Riset */}
      <Card>
        <div className="flex flex-col gap-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
            Fakta Riset
          </span>

          <div className="flex flex-col gap-3">
            {challenge.facts.map((fact, index) => {
              const IconComponent = factIcons[index % factIcons.length];
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-mint-tint flex items-center justify-center shrink-0 mt-0.5 text-action">
                    <IconComponent size={14} strokeWidth={2} />
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {fact}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Section 3: Yang Akan Kamu Dapatkan */}
      <Card>
        <div className="flex flex-col gap-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
            Yang Akan Kamu Dapatkan
          </span>

          <div className="flex flex-col gap-2.5">
            {challenge.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  strokeWidth={2}
                  className="text-action shrink-0 mt-0.5"
                />
                <p className="text-sm text-ink font-medium leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* CTA Button Fixed/Sticky on Mobile */}
      <div className="sticky bottom-20 lg:bottom-6 z-20 pt-2">
        <Button
          fullWidth
          onClick={handleStartChallenge}
          className="flex items-center justify-center gap-2 py-3.5 shadow-lg text-base"
        >
          {isActive ? (
            <>
              <span>Lanjutkan Tantangan</span>
              <span>→</span>
            </>
          ) : (
            <>
              <Rocket size={18} strokeWidth={2} />
              <span>Mulai Tantangan</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
