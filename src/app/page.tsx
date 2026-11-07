"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Flame, ChevronRight, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import { loadState, saveState, getTodayTask, saveDailyTask, todayString } from "@/lib/storage";
import { pickTask, shouldLevelUp } from "@/lib/recommend";
import { calculateStreak } from "@/lib/streak";
import { evaluateBadges } from "@/lib/badges";
import type { AppState, DailyTask, Task } from "@/types";
import tasksData from "@/content/tasks.json";

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
    // Jika belum kuis
    if (s.quizResults.length === 0) { router.replace("/quiz"); return; }

    setState(s);
    setStreak(calculateStreak(s.dailyTasks));

    // Cari atau buat tugas hari ini
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

  return (
    <div className="flex flex-col gap-6">

      {/* Sapaan */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-secondary">Hai, {state.user?.nickname} 👋</p>
          <h1 className="text-2xl font-bold text-ink mt-0.5">Hari Ini</h1>
        </div>
        <Chip variant="mint" icon={<Flame size={14} strokeWidth={2} />}>
          {streak} hari
        </Chip>
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

      {/* Kartu tugas harian */}
      {taskDetail ? (
        <Card accent>
          <div className="flex flex-col gap-4">
            {/* Label eyebrow */}
            <span className="text-xs font-semibold text-ink-faint tracking-wide uppercase">
              Tingkat {state.currentLevel} dari 5 · {state.currentPathId === "percaya-diri"
                ? "Percaya Diri" : state.currentPathId === "bicara-kelas"
                ? "Bicara di Kelas" : "Kerja Kelompok"}
            </span>

            {isDone ? (
              /* Status selesai */
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={24}
                    className="text-action shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <p className="text-lg font-semibold text-ink leading-snug">
                    {taskDetail.text}
                  </p>
                </div>
                <p className="text-sm text-action font-medium">
                  {todayTask?.status === "swapped"
                    ? "Langkah ringan pun tetap langkah maju. ✨"
                    : "Langkah kecil yang berarti. ✨"}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/journal")}
                  className="self-start"
                >
                  Tulis refleksi →
                </Button>
              </div>
            ) : (
              /* Status pending */
              <div className="flex flex-col gap-5">
                <p className="text-xl font-semibold text-ink leading-snug">
                  {taskDetail.text}
                </p>
                <div className="flex flex-col gap-2">
                  <Button fullWidth onClick={() => markDone("done")}>
                    Sudah kulakukan ✓
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      // Ganti ke versi lebih ringan
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
                    Pakai versi lebih ringan
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
        </Card>
      ) : (
        <Card>
          <p className="text-ink-secondary text-sm text-center py-4">
            Belum ada tugas untuk hari ini. Kembali lagi besok ya!
          </p>
        </Card>
      )}

      {/* Kartu perjalanan */}
      <div
        className="bg-surface border border-hairline rounded-card px-5 py-4 flex items-center justify-between cursor-pointer hover:border-action/40 transition-colors"
        onClick={() => router.push("/progress")}
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide">
            Perjalananmu
          </p>
          <p className="text-sm text-ink">
            <span className="font-bold text-action">{totalDone}</span> tugas selesai ·{" "}
            <span className="font-bold text-action">{streak}</span> hari berturut-turut
          </p>
        </div>
        <ChevronRight size={18} className="text-ink-faint" />
      </div>

    </div>
  );
}
