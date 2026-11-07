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
  Check,
  Shield,
  type LucideIcon,
  Ear,
  UserPlus,
  Users,
  MessageSquare,
  Mic,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
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
    setState(s);
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
    <div className="flex flex-col gap-6 pb-20">
      
      {/* Top Header / Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali ke halaman sebelumnya"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-ink-secondary hover:text-action bg-surface border border-hairline shadow-soft hover:border-action/40 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <Chip variant="mint" icon={<ChallengeIcon size={14} />}>
            {challenge.name}
          </Chip>
        </div>
      </div>

      {/* Hero Header Misi Card */}
      <div className="relative overflow-hidden bg-surface border border-hairline rounded-[22px] p-6 sm:p-7 shadow-soft flex flex-col gap-4">
        {/* Decorative Mint Accent Ring in corner */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-mint/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-mint-tint border border-mint/40 flex items-center justify-center text-action shrink-0 shadow-xs">
            <ChallengeIcon size={26} strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold bg-mint-tint text-action px-3 py-0.5 rounded-full">
                Hari ke-{task.day} dari {challenge.durationDays} Hari
              </span>
              {isDone && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-action text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                  <Check size={12} strokeWidth={3} /> Selesai
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-ink leading-tight tracking-tight">
              {task.title}
            </h1>
          </div>
        </div>

        {/* Deskripsi Lengkap Misi */}
        <div className="bg-canvas/70 border border-hairline rounded-[16px] p-4 mt-1">
          <div className="flex items-center gap-1.5 text-ink-faint mb-1">
            <BookOpen size={14} />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Tentang Misi Ini
            </span>
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed">
            {task.description}
          </p>
        </div>
      </div>

      {/* Rincian Pelaksanaan (Panduan Langkah Atomic Habits) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-ink-faint uppercase tracking-widest">
            Panduan Langkah Latihan
          </h2>
          <span className="text-[11px] text-ink-faint">Atomic Habits</span>
        </div>

        {/* Langkah 1: Pemicu */}
        <div className="bg-surface border border-hairline rounded-[18px] p-4 sm:p-5 shadow-soft flex flex-col gap-2 hover:border-action/30 transition-colors">
          <div className="flex items-center gap-2 text-action">
            <div className="w-7 h-7 rounded-full bg-mint-tint flex items-center justify-center shrink-0">
              <Clock size={15} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">
              1. Pemicu (Habit Trigger)
            </span>
          </div>
          <p className="text-xs text-ink-faint">Lakukan segera setelah momen ini terjadi di harimu:</p>
          <div className="bg-canvas/60 border border-hairline/70 rounded-card p-3 mt-0.5">
            <p className="text-sm text-ink font-semibold leading-relaxed">
              &ldquo;{task.trigger}&rdquo;
            </p>
          </div>
        </div>

        {/* Langkah 2: Tindakan Utama (Hero Action Box) */}
        <div className="bg-surface border-2 border-action/40 rounded-[18px] p-4 sm:p-5 shadow-soft flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-action">
              <div className="w-7 h-7 rounded-full bg-action text-white flex items-center justify-center shrink-0 shadow-xs">
                <Zap size={15} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                2. Tindakan Utama
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-mint-tint text-action px-2.5 py-0.5 rounded-full">
              Hanya 2–5 Menit
            </span>
          </div>

          <p className="text-xs text-ink-faint">Tindakan mikroskopik yang terukur dan mudah dilakukan:</p>
          <div className="bg-mint-tint/30 border border-mint/40 rounded-card p-3.5 mt-0.5">
            <p className="text-sm sm:text-base text-ink font-bold leading-relaxed">
              {task.text}
            </p>
          </div>
        </div>

        {/* Langkah 3: Alternatif Lebih Ringan */}
        <div className="bg-surface border border-hairline rounded-[18px] p-4 sm:p-5 shadow-soft flex flex-col gap-2 hover:border-action/30 transition-colors">
          <div className="flex items-center gap-2 text-info-text">
            <div className="w-7 h-7 rounded-full bg-sky-light-tint flex items-center justify-center shrink-0">
              <HelpCircle size={15} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">
              3. Opsi Lebih Ringan (Fallback)
            </span>
          </div>
          <p className="text-xs text-ink-faint">Jika merasa sangat cemas atau situasi belum memungkinkan:</p>
          <div className="bg-canvas/60 border border-hairline/70 rounded-card p-3 mt-0.5">
            <p className="text-sm text-ink-secondary leading-relaxed">
              {task.easierText}
            </p>
          </div>
        </div>

        {/* Langkah 4: Afirmasi Identitas */}
        <div className="bg-sky-light-tint/40 border border-sky-light/60 rounded-[18px] p-4 flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-full bg-sky-light-tint flex items-center justify-center text-info-text shrink-0">
            <Sparkles size={16} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-info-text block mb-0.5">
              Penegasan Identitas Positif
            </span>
            <p className="text-xs text-ink italic leading-relaxed">
              &ldquo;{task.identityStatement}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Aksi Selesai / Tombol Interaksi */}
      <div className="pt-2">
        {isDone ? (
          <div className="bg-mint-tint/40 border border-mint/50 rounded-[20px] p-6 flex flex-col gap-4 items-center text-center shadow-soft">
            <div className="w-12 h-12 rounded-full bg-mint-tint border border-mint text-action flex items-center justify-center shadow-xs">
              <CheckCircle size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">
                Misi Hari ke-{task.day} Sudah Selesai!
              </h3>
              <p className="text-xs text-action font-semibold mt-1">
                Langkah kecil yang sangat berarti ✨
              </p>
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
                    className="flex items-center justify-center gap-2 py-3.5 text-sm font-bold shadow-soft mt-1"
                  >
                    <span>Lanjutkan ke Misi Hari ke-{nextTask.day}</span>
                    <ArrowRight size={16} />
                  </Button>
                );
              }
              return (
                <div className="p-3 bg-surface rounded-card border border-action/30 text-center">
                  <p className="text-xs text-action font-bold">
                    🎉 Luar biasa! Kamu telah menuntaskan seluruh misi dalam tantangan ini!
                  </p>
                </div>
              );
            })()}

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <Button
                variant="secondary"
                onClick={() => router.push("/journal")}
                className="text-xs underline text-action"
              >
                Lihat Catatan Jurnal →
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
          <div className="flex flex-col gap-2.5">
            <Button
              fullWidth
              onClick={() => handleMarkDone("done")}
              className="flex items-center justify-center gap-2 py-3.5 text-base font-bold shadow-soft"
            >
              <CheckCircle size={20} />
              <span>Sudah Kulakukan Hari Ini</span>
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => handleMarkDone("swapped")}
              className="py-2.5 text-xs text-ink-secondary hover:text-action"
            >
              Pakai Versi Lebih Ringan
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              fullWidth
              onClick={() => {
                // Aktifkan tantangan ini jika belum aktif
                router.push(`/tantangan/${challenge.id}`);
              }}
              className="flex items-center justify-center gap-2 py-3.5 text-sm font-bold shadow-soft"
            >
              <span>Buka Halaman Tantangan Ini</span>
              <ArrowRight size={16} />
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => router.push("/tantangan")}
              className="py-2.5 text-xs text-ink-secondary"
            >
              Lihat Semua Tantangan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
