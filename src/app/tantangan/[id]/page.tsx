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
  ArrowRight,
  Ear,
  UserPlus,
  Users,
  MessageSquare,
  Mic,
  HelpCircle,
  Shield,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";
import { loadState, saveState, todayString } from "@/lib/storage";
import type { AppState, Challenge, ChallengeTask } from "@/types";
import challengesData from "@/content/challenges.json";
import challengeTasksData from "@/content/challenge_tasks.json";

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
  const tasks = (challengeTasksData as ChallengeTask[]).filter(
    (t) => t.challengeId === challengeId
  );

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
  const ChallengeIcon = ICON_MAP[challenge.icon] ?? Sparkles;

  function handleStartChallenge() {
    if (!challenge || !challenge.available) return;
    saveState({
      activeChallengeId: challenge.id,
      challengeStartDate: todayString(),
    });
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="w-10 h-10 rounded-full bg-surface border border-hairline flex items-center justify-center text-ink-secondary hover:text-ink hover:border-action transition-colors shadow-soft"
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-ink">Detail Tantangan</h1>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-card bg-surface border border-hairline px-6 py-6 shadow-soft flex flex-col gap-4">
        <div className="w-14 h-14 rounded-2xl bg-mint-tint flex items-center justify-center text-action shadow-soft">
          <ChallengeIcon size={30} strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink">{challenge.name}</h2>
          <p className="mt-1 text-sm text-ink-secondary leading-relaxed">
            {challenge.focus}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <Chip variant="sky" className="text-xs py-1 px-3" icon={<Clock size={13} strokeWidth={2} />}>
            {challenge.durationDays} Hari
          </Chip>
          <Chip variant="neutral" className="text-xs py-1 px-3" icon={<Target size={13} strokeWidth={2} />}>
            {DIFFICULTY_LABELS[challenge.difficulty]}
          </Chip>
          {isActive && (
            <Chip variant="mint" className="text-xs py-1 px-3">
              Sedang Aktif ✓
            </Chip>
          )}
          {!challenge.available && (
            <Chip variant="neutral" className="text-xs py-1 px-3 text-ink-faint">
              Segera Hadir
            </Chip>
          )}
        </div>
      </div>

      {/* Pendekatan Atomic Habits */}
      <Card>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-action">
            <BookOpen size={18} strokeWidth={2} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Metode Latihan Bertahap
            </span>
          </div>

          <h3 className="text-base font-bold text-ink leading-snug">
            Satu Langkah Kecil Setiap Hari
          </h3>

          <p className="text-sm text-ink-secondary leading-relaxed">
            Tantangan ini dirancang dengan pendekatan kebiasaan mikroskopik: dimulai dari tindakan yang dapat diselesaikan dalam hitungan menit, selalu disertai pemicu yang jelas, dan memiliki alternatif latihan yang lebih ringan saat kecemasan sedang memuncak.
          </p>
        </div>
      </Card>

      {/* Pratinjau 3 Hari Pertama */}
      {tasks.length > 0 && (
        <Card>
          <div className="flex flex-col gap-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Contoh Latihan 3 Hari Pertama
            </span>

            <div className="flex flex-col gap-3">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex flex-col gap-1 p-3 bg-canvas border border-hairline rounded-lg">
                  <div className="flex items-center justify-between text-[11px] text-action font-semibold">
                    <span>Hari {task.day}</span>
                  </div>
                  <p className="text-xs text-ink font-medium leading-relaxed">
                    {task.text}
                  </p>
                  <p className="text-[11px] text-ink-faint italic mt-0.5">
                    &ldquo;{task.identityStatement}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* CTA Button Fixed/Sticky on Mobile */}
      <div className="sticky bottom-20 lg:bottom-6 z-20 pt-2">
        {challenge.available ? (
          <Button
            fullWidth
            onClick={handleStartChallenge}
            className="flex items-center justify-center gap-2 py-3.5 shadow-soft text-base"
          >
            <span>{isActive ? "Lanjutkan Latihan Hari Ini" : "Mulai Tantangan Ini"}</span>
            <ArrowRight size={18} />
          </Button>
        ) : (
          <Button fullWidth disabled className="py-3.5 text-base">
            Tantangan Ini Segera Hadir
          </Button>
        )}
      </div>
    </div>
  );
}
