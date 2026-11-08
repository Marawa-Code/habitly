"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Clock,
  Zap,
  Shield,
  type LucideIcon,
  Ear,
  UserPlus,
  Users,
  MessageSquare,
  Mic,
  MessageCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { loadState, saveDailyTask, todayString } from "@/lib/storage";
import type { AppState, Challenge, ChallengeTask, DailyTask } from "@/types";
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

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string;

  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const s = loadState();
    if (!s.user) {
      router.replace("/onboarding");
      return;
    }
    queueMicrotask(() => setState(s));
  }, [router]);

  const task = (challengeTasksData as ChallengeTask[]).find((t) => t.id === taskId);
  const challenge = task
    ? (challengesData as Challenge[]).find((c) => c.id === task.challengeId)
    : null;

  if (!state || !task || !challenge) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-ink-secondary text-sm">
          {!task ? "Misi tidak ditemukan." : "Memuat…"}
        </p>
        {!task && (
          <Button variant="secondary" onClick={() => router.push("/tantangan")}>
            Kembali ke Tantangan
          </Button>
        )}
      </div>
    );
  }

  const ChallengeIcon = ICON_MAP[challenge.icon] ?? Sparkles;
  const isActiveChallenge = state.activeChallengeId === challenge.id;
  const existingDailyTask = state.dailyTasks.find((dt) => dt.taskId === task.id);
  const isDone = existingDailyTask?.status === "done" || existingDailyTask?.status === "swapped";

  function handleMarkDone(status: "done" | "swapped") {
    if (!state || !state.user || !task) return;
    const dt: DailyTask = {
      id: existingDailyTask?.id || crypto.randomUUID(),
      userId: state.user.id,
      challengeId: task.challengeId,
      taskId: task.id,
      day: task.day,
      date: todayString(),
      status,
    };
    saveDailyTask(dt);
    router.push("/journal");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <main className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 pb-28 pt-4 sm:px-6 lg:px-8">
      {/* Top Bar Navigation */}
      <div className="sticky top-0 z-20 -mx-4 flex items-center gap-3 border-b border-hairline bg-canvas/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface text-ink-secondary shadow-soft transition-colors hover:border-action hover:text-ink"
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <div>
          <p className="max-w-[220px] truncate text-xs font-semibold text-action">
            {challenge.name}
          </p>
          <h1 className="text-base font-bold text-ink">Misi Hari ke-{task.day}</h1>
        </div>
      </div>

      {/* Hero Header Misi */}
      <section className="flex flex-col gap-5 rounded-card border border-hairline bg-surface p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-container bg-mint-tint text-action">
            <ChallengeIcon size={24} strokeWidth={2} />
          </div>
          <div>
            <span className="inline-flex rounded-pill bg-mint-tint px-2.5 py-1 text-xs font-semibold text-action">
              Hari {task.day}
            </span>
            <h2 className="mt-2 text-xl font-bold leading-snug text-ink sm:text-2xl">
              {task.title}
            </h2>
          </div>
        </div>

        {/* Deskripsi Lengkap Misi */}
        <div className="rounded-container border border-hairline bg-canvas p-4 sm:p-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
            Tentang Misi Ini
          </h3>
          <p className="max-w-[640px] text-base leading-relaxed text-ink-secondary">
            {task.description}
          </p>
        </div>
      </section>

      {/* Rincian Pelaksanaan (Atomic Habits) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          Panduan Langkah
        </h3>

        {/* Pemicu */}
        <div className="flex flex-col gap-1.5 rounded-card border border-hairline bg-surface p-5 shadow-soft">
          <div className="flex items-center gap-2 text-action">
            <Clock size={16} strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              1. Pemicu
            </span>
          </div>
          <p className="text-xs text-ink-faint">Lakukan segera setelah momen ini terjadi:</p>
          <p className="mt-0.5 max-w-[640px] text-base font-semibold leading-relaxed text-ink">
            {task.trigger}
          </p>
        </div>

        {/* Tindakan Utama */}
        <div className="flex flex-col gap-1.5 rounded-card border-2 border-action/30 bg-surface p-5 shadow-soft">
          <div className="flex items-center gap-2 text-action">
            <Zap size={16} strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              2. Tindakan Utama
            </span>
          </div>
          <p className="text-xs text-ink-faint">Tindakan kecil yang terukur dan selesai cepat:</p>
          <p className="mt-0.5 max-w-[640px] text-base font-bold leading-relaxed text-ink">
            {task.text}
          </p>
        </div>

        {/* Alternatif Lebih Ringan */}
        <div className="flex flex-col gap-1.5 rounded-card border border-hairline bg-surface p-5 shadow-soft">
          <div className="flex items-center gap-2 text-info-text">
            <HelpCircle size={16} strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              3. Alternatif Lebih Ringan
            </span>
          </div>
          <p className="text-xs text-ink-faint">Jika merasa sangat cemas atau situasi belum memungkinkan:</p>
          <p className="mt-0.5 max-w-[640px] text-base leading-relaxed text-ink-secondary">
            {task.easierText}
          </p>
        </div>

        {/* Afirmasi Identitas */}
        <div className="flex flex-col gap-1.5 rounded-card border border-hairline bg-sky-light-tint p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-info-text">
            Penegasan Identitas
          </span>
          <p className="max-w-[640px] text-base italic leading-relaxed text-ink-secondary">
            &ldquo;{task.identityStatement}&rdquo;
          </p>
        </div>
      </div>

      {/* Aksi Selesai / Tombol Interaksi */}
      <div className="-mx-4 border-t border-hairline bg-canvas/95 px-4 pb-4 pt-4 backdrop-blur sm:mx-0 sm:rounded-card sm:border sm:bg-surface sm:px-5">
        {isDone ? (
          <div className="bg-mint-tint border border-mint/40 rounded-card p-4 flex flex-col gap-3 items-center text-center">
            <CheckCircle size={24} className="text-action" />
            <div>
              <p className="text-sm font-bold text-ink">Misi Hari ke-{task.day} sudah selesai!</p>
              <p className="text-xs text-action font-medium mt-0.5">Langkah kecil yang berarti.</p>
            </div>

            {/* Tombol Lanjutkan ke Misi Berikutnya */}
            {(() => {
              const nextTask = (challengeTasksData as ChallengeTask[]).find(
                (t) => t.challengeId === challenge.id && t.day === task.day + 1
              );
              if (nextTask) {
                return (
                  <Button
                    fullWidth
                    onClick={() => {
                      if (state.user && state.activeChallengeId === challenge.id) {
                        const existing = state.dailyTasks.find((dt) => dt.taskId === nextTask.id);
                        if (!existing) {
                          saveDailyTask({
                            id: crypto.randomUUID(),
                            userId: state.user.id,
                            challengeId: challenge.id,
                            taskId: nextTask.id,
                            day: nextTask.day,
                            date: todayString(),
                            status: "pending",
                          });
                        }
                      }
                      router.push(`/task/${nextTask.id}`);
                    }}
                    className="flex items-center justify-center gap-2 py-3 text-sm shadow-soft mt-1"
                  >
                    <span>Lanjutkan ke Misi Hari ke-{nextTask.day}</span>
                    <ArrowRight size={16} />
                  </Button>
                );
              }
              return (
                <p className="text-xs text-action font-bold">
                  Selamat! Kamu telah menuntaskan seluruh misi tantangan ini.
                </p>
              );
            })()}

            <div className="flex gap-3 pt-1">
              <Button
                variant="secondary"
                onClick={() => router.push("/journal")}
                className="text-xs underline text-action"
              >
                Lihat Jurnal Refleksi →
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/")}
                className="text-xs text-ink-secondary"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        ) : isActiveChallenge ? (
          <div className="flex flex-col gap-2">
            <Button
              fullWidth
              onClick={() => handleMarkDone("done")}
              className="flex items-center justify-center gap-2 py-3"
            >
              <CheckCircle size={18} />
              <span>Sudah Kulakukan Hari Ini</span>
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => handleMarkDone("swapped")}
              className="py-2.5 text-xs text-ink-secondary"
            >
              Pakai Versi Lebih Ringan
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => router.push(`/tantangan/${challenge.id}`)}
          >
            Lihat Semua Misi Tantangan Ini
          </Button>
        )}
      </div>
      </main>
    </div>
  );
}
