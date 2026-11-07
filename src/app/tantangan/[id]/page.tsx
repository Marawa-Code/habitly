"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
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
  ChevronRight,
  CheckCircle2,
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
          <p className="mt-1 text-sm text-ink-secondary leading-relaxed font-medium">
            {challenge.focus}
          </p>
          {challenge.description && (
            <p className="mt-2 text-xs text-ink-secondary leading-relaxed border-t border-hairline pt-2">
              {challenge.description}
            </p>
          )}
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
            Satu Kebiasaan Mikro Setiap Hari
          </h3>

          <p className="text-sm text-ink-secondary leading-relaxed">
            Setiap misi harian dirancang spesifik dengan pemicu yang jelas, tindakan yang dapat diselesaikan dalam hitungan menit, versi lebih ringan saat merasa cemas, dan kalimat afirmasi identitas.
          </p>
        </div>
      </Card>

      {/* Daftar Misi Tantangan */}
      {tasks.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink">
              Misi Latihan ({tasks.length} Hari Tersedia)
            </h3>
            <span className="text-xs text-ink-faint">Bertahap & Terukur</span>
          </div>

          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/task/${task.id}`}
                className="group p-4 bg-surface border border-hairline rounded-card shadow-soft hover:border-action/40 hover:shadow-modal transition-all flex flex-col gap-2.5"
              >
                {/* Header Misi: Hari & Judul */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold bg-mint-tint text-action px-2.5 py-0.5 rounded-full">
                      Hari {task.day}
                    </span>
                    <h4 className="text-sm font-bold text-ink group-hover:text-action transition-colors">
                      {task.title}
                    </h4>
                  </div>
                  <ChevronRight size={16} className="text-ink-faint group-hover:text-action group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </div>

                {/* Deskripsi Misi */}
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {task.description}
                </p>

                {/* Box Tindakan */}
                <div className="p-2.5 bg-canvas border border-hairline/80 rounded-lg flex flex-col gap-1">
                  <p className="text-xs text-ink font-medium leading-relaxed">
                    <span className="text-action font-bold">Tindakan: </span>
                    {task.text}
                  </p>
                </div>

                {/* Kalimat Identitas */}
                <p className="text-[11px] text-ink-faint italic">
                  &ldquo;{task.identityStatement}&rdquo;
                </p>
              </Link>
            ))}
          </div>
        </div>
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
