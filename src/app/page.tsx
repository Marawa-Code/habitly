"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Flame,
  ChevronRight,
  CheckCircle,
  Compass,
  MessageCircle,
  BarChart2,
  Zap,
  Ear,
  UserPlus,
  Users,
  MessageSquare,
  Mic,
  HelpCircle,
  Shield,
  Sparkles,
  Sprout,
  Clock,
  type LucideIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import Chip from "@/components/ui/Chip";
import { loadState, saveState, getTodayTask, saveDailyTask, todayString } from "@/lib/storage";
import { calculateStreak } from "@/lib/streak";
import { evaluateBadges } from "@/lib/badges";
import type { AppState, DailyTask, Challenge, ChallengeTask } from "@/types";
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

export default function HomePage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [todayTask, setTodayTask] = useState<DailyTask | null>(null);
  const [currentTaskDetail, setCurrentTaskDetail] = useState<ChallengeTask | null>(null);
  const [streak, setStreak] = useState(0);

  const refresh = useCallback(() => {
    const s = loadState();

    // Jika belum onboarding
    if (!s.user) {
      router.replace("/onboarding");
      return;
    }

    setState(s);
    setStreak(calculateStreak(s.dailyTasks));

    const challenges = challengesData as Challenge[];
    const tasks = challengeTasksData as ChallengeTask[];

    // Hitung hari tantangan aktif
    let dayN = 1;
    if (s.activeChallengeId && s.challengeStartDate) {
      const start = new Date(s.challengeStartDate).getTime();
      const now = new Date(todayString()).getTime();
      const diffDays = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
      const activeCh = challenges.find((c) => c.id === s.activeChallengeId);
      const maxDays = activeCh ? activeCh.durationDays : 14;
      dayN = Math.min(maxDays, diffDays + 1);
    }

    // Cari atau buat tugas hari ini
    let dt = getTodayTask(s);
    if (!dt && s.activeChallengeId) {
      const cTask =
        tasks.find((t) => t.challengeId === s.activeChallengeId && t.day === dayN) ??
        tasks.find((t) => t.challengeId === s.activeChallengeId);

      if (cTask) {
        dt = {
          id: crypto.randomUUID(),
          userId: s.user.id,
          challengeId: s.activeChallengeId,
          taskId: cTask.id,
          day: dayN,
          date: todayString(),
          status: "pending",
        };
        saveDailyTask(dt);
      }
    }
    setTodayTask(dt ?? null);

    if (dt) {
      const detail = tasks.find((t) => t.id === dt!.taskId) ?? null;
      setCurrentTaskDetail(detail);
    }
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function markDone(status: "done" | "swapped") {
    if (!todayTask) return;
    const updated: DailyTask = { ...todayTask, status };
    saveDailyTask(updated);

    // Update lencana
    const s2 = loadState();
    const earned = evaluateBadges(s2);
    saveState({ earnedBadgeIds: earned });

    setTodayTask(updated);
  }

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-ink-secondary text-sm">Memuat…</p>
      </div>
    );
  }

  const isDone = todayTask?.status === "done" || todayTask?.status === "swapped";
  const totalDone = state.dailyTasks.filter(
    (t) => t.status === "done" || t.status === "swapped"
  ).length;

  const challenges = challengesData as Challenge[];
  const activeChallenge = challenges.find((c) => c.id === state.activeChallengeId);

  let challengeDayN = 1;
  let challengePercent = 0;
  let remainingDays = 0;
  if (activeChallenge) {
    if (state.challengeStartDate) {
      const start = new Date(state.challengeStartDate).getTime();
      const now = new Date(todayString()).getTime();
      const diffDays = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
      challengeDayN = Math.min(activeChallenge.durationDays, diffDays + 1);
    }
    challengePercent = Math.round((challengeDayN / activeChallenge.durationDays) * 100);
    remainingDays = Math.max(0, activeChallenge.durationDays - challengeDayN);
  }

  const ActiveIcon = activeChallenge ? (ICON_MAP[activeChallenge.icon] ?? Sparkles) : Sparkles;
  const popularChallenges = challenges.filter((c) => c.available).slice(0, 3);

  return (
    <div className="flex flex-col gap-6 pb-6">

      {/* Top Header: Logo + App Name & Streak */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-mint-tint flex items-center justify-center text-action shadow-soft">
            <Sprout size={18} strokeWidth={2.2} />
          </div>
          <span className="font-extrabold text-sm tracking-wider uppercase text-action">
            Habitly
          </span>
        </div>

        <Chip variant="mint" icon={<Flame size={14} strokeWidth={2} />}>
          {streak} Hari
        </Chip>
      </div>

      {/* Hero Banner: Mulai Tumbuh, Satu Hari Satu Langkah */}
      <div className="relative overflow-hidden rounded-card bg-surface border border-hairline p-6 shadow-soft flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-bold text-action uppercase tracking-widest">
            Selamat Datang Kembali
          </p>
          <h1 className="text-2xl font-bold text-ink leading-tight">
            Mulai tumbuh,<br />
            satu hari satu langkah
          </h1>
          <p className="text-xs text-ink-secondary leading-relaxed mt-0.5">
            Latih rasa percaya dirimu berkomunikasi setiap hari, {state.user?.nickname}.
          </p>
        </div>

        <div>
          <button
            onClick={() => router.push("/quiz")}
            className="w-full bg-surface border border-hairline hover:border-action/50 text-ink font-bold text-sm py-3 px-5 rounded-full shadow-soft hover:shadow transition-all flex items-center justify-center gap-2 group"
          >
            <Zap size={16} className="text-action fill-action group-hover:scale-110 transition-transform" />
            <span>Mulai Penilaian Diri</span>
            <ChevronRight size={16} className="text-ink-faint group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Baris Statistik */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-hairline text-center">
          <div>
            <p className="text-lg font-extrabold text-ink">8</p>
            <p className="text-[11px] text-ink-faint">Tantangan</p>
          </div>
          <div className="border-x border-hairline">
            <p className="text-lg font-extrabold text-ink">{totalDone}</p>
            <p className="text-[11px] text-ink-faint">Tugas Selesai</p>
          </div>
          <div>
            <p className="text-lg font-extrabold text-ink">{streak > 0 ? `${streak} Hari` : "Aktif"}</p>
            <p className="text-[11px] text-ink-faint">Konsistensi</p>
          </div>
        </div>
      </div>

      {/* Section: Tantangan Aktif */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Tantangan Aktif</h2>
          <Link
            href="/tantangan"
            className="text-xs font-semibold text-action hover:underline flex items-center gap-0.5"
          >
            <span>Semua tantangan</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {activeChallenge ? (
          <div className="bg-surface border border-hairline rounded-card p-5 shadow-soft flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-mint-tint flex items-center justify-center text-action shrink-0">
                  <ActiveIcon size={24} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-ink truncate">
                    {activeChallenge.name}
                  </h3>
                  <p className="text-xs text-ink-faint">
                    Hari {challengeDayN} dari {activeChallenge.durationDays}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-action bg-mint-tint px-2.5 py-1 rounded-full shrink-0">
                {DIFFICULTY_LABELS[activeChallenge.difficulty]}
              </span>
            </div>

            {/* Bilah Progres */}
            <div>
              <ProgressBar value={challengePercent} />
              <div className="flex items-center justify-between text-xs text-ink-faint mt-1.5">
                <span>{challengePercent}% tercapai</span>
                <span>{remainingDays > 0 ? `${remainingDays} hari lagi` : "Tantangan selesai"}</span>
              </div>
            </div>

            {/* Box Tugas Hari Ini (Atomic Habits) */}
            {currentTaskDetail && (
              <div className="mt-2 pt-4 border-t border-hairline flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-action">
                    Latihan Hari Ini (Hari ke-{challengeDayN})
                  </span>
                </div>

                {isDone ? (
                  <div className="bg-mint-tint border border-mint/40 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle size={18} className="text-action shrink-0 mt-0.5" strokeWidth={2} />
                      <p className="text-sm font-semibold text-ink leading-snug">
                        {todayTask?.status === "swapped"
                          ? currentTaskDetail.easierText
                          : currentTaskDetail.text}
                      </p>
                    </div>
                    <p className="text-xs text-action font-medium">
                      Langkah kecil yang berarti ✨
                    </p>
                    <button
                      onClick={() => router.push("/journal")}
                      className="self-start text-xs font-bold text-action underline mt-1"
                    >
                      Tulis refleksi harian →
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {/* Pemicu Habit */}
                    <div className="bg-canvas border border-hairline rounded-lg px-3 py-2 text-xs text-ink-secondary">
                      <span className="font-semibold text-ink">Pemicu: </span>
                      {currentTaskDetail.trigger}
                    </div>

                    {/* Tindakan */}
                    <p className="text-sm text-ink font-semibold leading-relaxed">
                      {currentTaskDetail.text}
                    </p>

                    {/* Kalimat Identitas */}
                    <p className="text-xs text-ink-faint italic">
                      &ldquo;{currentTaskDetail.identityStatement}&rdquo;
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <Button fullWidth onClick={() => markDone("done")} className="py-2.5 text-xs">
                        Sudah kulakukan ✓
                      </Button>
                      <Button
                        variant="secondary"
                        fullWidth
                        className="py-2.5 text-xs"
                        onClick={() => markDone("swapped")}
                      >
                        Pakai versi lebih ringan
                      </Button>
                    </div>

                    {currentTaskDetail.easierText && (
                      <p className="text-[11px] text-ink-faint">
                        Versi ringan: {currentTaskDetail.easierText}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Jika belum ada tantangan aktif, tampilkan opsi tantangan yang tersedia */
          <div className="flex flex-col gap-2.5">
            {popularChallenges.map((c) => {
              const IconComp = ICON_MAP[c.icon] ?? Sparkles;
              return (
                <div
                  key={c.id}
                  onClick={() => router.push(`/tantangan/${c.id}`)}
                  className="bg-surface border border-hairline rounded-card px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:border-action/40 shadow-soft transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-mint-tint flex items-center justify-center text-action shrink-0 group-hover:scale-105 transition-transform">
                    <IconComp size={20} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-ink truncate group-hover:text-action transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-ink-faint">
                      {c.durationDays} Hari · {DIFFICULTY_LABELS[c.difficulty]}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-ink-faint group-hover:text-action group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section: 3 Kartu Akses Cepat */}
      <div className="grid grid-cols-3 gap-3">
        {/* Jelajahi */}
        <div
          onClick={() => router.push("/tantangan")}
          className="bg-surface border border-hairline rounded-card p-3.5 flex flex-col items-center text-center gap-2 cursor-pointer hover:border-action/40 hover:shadow-soft transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-mint-tint flex items-center justify-center text-action group-hover:scale-110 transition-transform">
            <Compass size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Jelajahi</p>
            <p className="text-[10px] text-ink-faint mt-0.5">8 tantangan</p>
          </div>
        </div>

        {/* Komunitas */}
        <div
          onClick={() => router.push("/community")}
          className="bg-surface border border-hairline rounded-card p-3.5 flex flex-col items-center text-center gap-2 cursor-pointer hover:border-action/40 hover:shadow-soft transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-light-tint flex items-center justify-center text-info-text group-hover:scale-110 transition-transform">
            <MessageCircle size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Komunitas</p>
            <p className="text-[10px] text-ink-faint mt-0.5">Cerita teman</p>
          </div>
        </div>

        {/* Progres */}
        <div
          onClick={() => router.push("/progress")}
          className="bg-surface border border-hairline rounded-card p-3.5 flex flex-col items-center text-center gap-2 cursor-pointer hover:border-action/40 hover:shadow-soft transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-canvas border border-hairline flex items-center justify-center text-ink-secondary group-hover:scale-110 transition-transform">
            <BarChart2 size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Progres</p>
            <p className="text-[10px] text-ink-faint mt-0.5">Lihat statistik</p>
          </div>
        </div>
      </div>

    </div>
  );
}
