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
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import ProgressBar from "@/components/ui/ProgressBar";
import { loadState, saveState, getTodayTask, saveDailyTask, todayString } from "@/lib/storage";
import { pickTask, shouldLevelUp } from "@/lib/recommend";
import { calculateStreak } from "@/lib/streak";
import { evaluateBadges } from "@/lib/badges";
import type { AppState, DailyTask, Task, Challenge } from "@/types";
import tasksData from "@/content/tasks.json";
import challengesData from "@/content/challenges.json";

export default function HomePage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [todayTask, setTodayTask] = useState<DailyTask | null>(null);
  const [taskDetail, setTaskDetail] = useState<Task | null>(null);
  const [streak, setStreak] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);

  const refresh = useCallback(() => {
    const s = loadState();

    // Jika belum onboarding
    if (!s.user) { router.replace("/onboarding"); return; }

    setState(s);
    setStreak(calculateStreak(s.dailyTasks));

    // Cari atau buat tugas hari ini jika ada jalur latihan aktif
    let dt = getTodayTask(s);
    if (!dt && s.currentPathId) {
      const usedIds = s.dailyTasks.map((t) => t.taskId);
      const picked = pickTask(s.currentPathId, s.currentLevel, usedIds);
      if (picked) {
        dt = {
          id: crypto.randomUUID(),
          userId: s.user.id,
          taskId: picked.id,
          date: todayString(),
          status: "pending",
        };
        saveDailyTask(dt);
      }
    }
    setTodayTask(dt ?? null);

    if (dt) {
      const detail = (tasksData as Task[]).find((t) => t.id === dt!.taskId) ?? null;
      setTaskDetail(detail);
    }
  }, [router]);

  useEffect(() => { refresh(); }, [refresh]);

  function markDone(status: "done" | "swapped") {
    if (!todayTask) return;
    const updated: DailyTask = { ...todayTask, status };
    saveDailyTask(updated);

    // Cek naik tingkat
    const s = loadState();
    if (shouldLevelUp(s) && s.currentLevel < 5) {
      saveState({ currentLevel: (s.currentLevel + 1) as AppState["currentLevel"] });
      setLeveledUp(true);
    }

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

  // Cek tantangan aktif
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

  // 3 Tantangan Populer untuk fallback ketika belum ada tantangan aktif
  const popularChallenges = challenges.slice(0, 3);

  return (
    <div className="flex flex-col gap-6 pb-6">

      {/* Top Header: Logo + App Name & Streak */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-mint-tint flex items-center justify-center text-action font-bold text-sm shadow-soft">
            🌱
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
      <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-mint-tint/80 via-mint-tint/50 to-sky-light-tint/50 border border-hairline p-6 shadow-soft flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-bold text-action uppercase tracking-widest">
            Selamat Datang Kembali 👋
          </p>
          <h1 className="text-2xl font-bold text-ink leading-tight">
            Mulai tumbuh,<br />
            satu hari satu langkah 🌿
          </h1>
          <p className="text-xs text-ink-secondary leading-relaxed mt-0.5">
            Temukan tantangan yang tepat untukmu dan jadilah versi terbaik dirimu, {state.user?.nickname}.
          </p>
        </div>

        <div>
          <button
            onClick={() => router.push("/quiz")}
            className="w-full bg-surface border border-hairline/80 hover:border-action/50 text-ink font-bold text-sm py-3 px-5 rounded-full shadow-soft hover:shadow transition-all flex items-center justify-center gap-2 group"
          >
            <Zap size={16} className="text-action fill-action group-hover:scale-110 transition-transform" />
            <span>Mulai Kuis Sekarang</span>
            <ChevronRight size={16} className="text-ink-faint group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-hairline/60 text-center">
          <div>
            <p className="text-lg font-extrabold text-ink">8</p>
            <p className="text-[11px] text-ink-faint">Tantangan</p>
          </div>
          <div className="border-x border-hairline/60">
            <p className="text-lg font-extrabold text-ink">{totalDone > 0 ? totalDone : "2.1k"}</p>
            <p className="text-[11px] text-ink-faint">{totalDone > 0 ? "Tugas Selesai" : "Pengguna"}</p>
          </div>
          <div>
            <p className="text-lg font-extrabold text-ink">84%</p>
            <p className="text-[11px] text-ink-faint">Berhasil</p>
          </div>
        </div>
      </div>

      {/* Notifikasi naik tingkat */}
      {leveledUp && (
        <div className="bg-mint-tint border border-mint rounded-card px-5 py-4">
          <p className="text-action font-semibold text-sm">
            🎉 Selamat! Kamu naik ke Tingkat {state.currentLevel}.
          </p>
          <p className="text-action/80 text-xs mt-1">
            Tantangan baru menunggumu. Pelan-pelan juga maju!
          </p>
        </div>
      )}

      {/* Section: Tantangan Aktif */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Tantangan Aktif</h2>
          <Link
            href="/tantangan"
            className="text-xs font-semibold text-action hover:underline flex items-center gap-0.5"
          >
            <span>Lihat semua</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {activeChallenge ? (
          <div className="bg-surface border border-hairline rounded-card p-5 shadow-soft flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-canvas border border-hairline flex items-center justify-center text-2xl shrink-0">
                  <span role="img" aria-label={activeChallenge.name}>
                    {activeChallenge.emoji}
                  </span>
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

              <Button
                variant="primary"
                onClick={() => router.push(`/tantangan/${activeChallenge.id}`)}
                className="text-xs py-2 px-4 shrink-0 shadow-none"
              >
                Lanjut
              </Button>
            </div>

            {/* Progress bar */}
            <div>
              <ProgressBar value={challengePercent} />
              <div className="flex items-center justify-between text-xs text-ink-faint mt-1.5">
                <span>{challengePercent}% selesai</span>
                <span>{remainingDays > 0 ? `${remainingDays} hari lagi 🎯` : "Tantangan selesai! 🎉"}</span>
              </div>
            </div>

            {/* Box Tantangan Hari Ini */}
            {taskDetail && (
              <div className="mt-2 pt-4 border-t border-hairline flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-action">
                    Tantangan Hari Ini
                  </span>
                  <span className="text-xs text-ink-faint">
                    Tingkat {state.currentLevel} dari 5
                  </span>
                </div>

                {isDone ? (
                  <div className="bg-mint-tint/40 border border-mint/40 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle size={18} className="text-action shrink-0 mt-0.5" strokeWidth={2} />
                      <p className="text-sm font-semibold text-ink leading-snug">
                        {taskDetail.text}
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
                    <p className="text-sm text-ink font-semibold leading-relaxed">
                      {taskDetail.text}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button fullWidth onClick={() => markDone("done")} className="py-2.5 text-xs">
                        Sudah kulakukan ✓
                      </Button>
                      <Button
                        variant="secondary"
                        fullWidth
                        className="py-2.5 text-xs"
                        onClick={() => {
                          const usedIds = state.dailyTasks.map((t) => t.taskId);
                          const easier = pickTask(
                            state.currentPathId!,
                            Math.max(1, state.currentLevel - 1) as AppState["currentLevel"],
                            usedIds
                          );
                          if (easier && todayTask) {
                            const updated: DailyTask = { ...todayTask, taskId: easier.id };
                            saveDailyTask(updated);
                            setTodayTask(updated);
                            setTaskDetail(easier);
                          }
                        }}
                      >
                        Versi lebih ringan
                      </Button>
                    </div>
                    {taskDetail.easierText && (
                      <p className="text-xs text-ink-faint italic">
                        Versi ringan: {taskDetail.easierText}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Jika belum ada tantangan aktif, tampilkan kartu tantangan populer */
          <div className="flex flex-col gap-2.5">
            {popularChallenges.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/tantangan/${c.id}`)}
                className="bg-surface border border-hairline rounded-card px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:border-action/40 shadow-soft transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-canvas border border-hairline flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  <span role="img" aria-label={c.name}>{c.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-ink truncate group-hover:text-action transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-ink-faint">
                    {c.durationDays} Hari · {c.difficulty}
                  </p>
                </div>
                <ChevronRight size={16} className="text-ink-faint group-hover:text-action group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section: 3 Quick Access Cards (Jelajahi, Komunitas, Progress) */}
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

        {/* Progress */}
        <div
          onClick={() => router.push("/progress")}
          className="bg-surface border border-hairline rounded-card p-3.5 flex flex-col items-center text-center gap-2 cursor-pointer hover:border-action/40 hover:shadow-soft transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
            <BarChart2 size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Progress</p>
            <p className="text-[10px] text-ink-faint mt-0.5">Lihat statistik</p>
          </div>
        </div>
      </div>

    </div>
  );
}
