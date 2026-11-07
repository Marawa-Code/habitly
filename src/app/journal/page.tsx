"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Heart } from "lucide-react";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { loadState, saveJournalEntry, saveState, getTodayTask } from "@/lib/storage";
import { evaluateBadges } from "@/lib/badges";
import type { DailyTask } from "@/types";
import tasksData from "@/content/tasks.json";
import challengeTasksData from "@/content/challenge_tasks.json";

const JOURNAL_PROMPTS = [
  "Apa yang kamu rasakan sebelum dan sesudah melakukannya?",
  "Apa yang berhasil hari ini?",
  "Satu hal kecil yang ingin kamu coba besok?",
];

// Kata kunci krisis — deteksi dilakukan sepenuhnya di sisi klien, tidak dikirim ke mana pun
const CRISIS_KEYWORDS = [
  "bunuh diri",
  "menyakiti diri",
  "ingin mati",
  "tak sanggup lagi",
  "putus asa",
  "akhiri hidup",
  "mengakhiri hidup",
  "tidak ingin hidup",
];

function hasCrisisKeyword(texts: string[]): boolean {
  const combined = texts.join(" ").toLowerCase();
  return CRISIS_KEYWORDS.some((k) => combined.includes(k));
}

export default function JournalPage() {
  const router = useRouter();
  const [todayTask, setTodayTask] = useState<DailyTask | null>(null);
  const [taskText, setTaskText] = useState("");
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [saved, setSaved] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  useEffect(() => {
    const s = loadState();
    if (!s.user) { router.replace("/onboarding"); return; }
    const dt = getTodayTask(s);
    setTodayTask(dt ?? null);
    if (dt) {
      const detail =
        (challengeTasksData as { id: string; text: string }[]).find((t) => t.id === dt.taskId) ??
        (tasksData as { id: string; text: string }[]).find((t) => t.id === dt.taskId);
      setTaskText(detail?.text ?? "");
    }
  }, [router]);

  function doSave() {
    if (!todayTask) return;
    saveJournalEntry({
      id: crypto.randomUUID(),
      dailyTaskId: todayTask.id,
      answers,
      createdAt: new Date().toISOString(),
    });
    // Evaluasi lencana setelah menyimpan jurnal
    const currentState = loadState();
    const earned = evaluateBadges(currentState);
    if (earned.length !== currentState.earnedBadgeIds.length) {
      saveState({ earnedBadgeIds: earned });
    }
    setSaved(true);
  }

  function handleSave() {
    if (!todayTask) return;
    if (hasCrisisKeyword(answers)) {
      setShowCrisisModal(true);
      return;
    }
    doSave();
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-sm w-full flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-mint-tint flex items-center justify-center">
            <span className="text-3xl">✨</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Refleksi tersimpan!</h2>
            <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
              Pelan-pelan juga maju. Terus berlatih ya!
            </p>
          </div>
          <Button fullWidth onClick={() => router.push("/")}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-6 py-10">
      <div className="max-w-sm w-full mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-ink">Jurnal Refleksi</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Luangkan sebentar untuk merenungkan latihanmu hari ini.
          </p>
        </div>

        {/* Tugas yang dilakukan */}
        {taskText && (
          <Card>
            <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-2">
              Tugas hari ini
            </p>
            <p className="text-sm text-ink leading-relaxed">{taskText}</p>
          </Card>
        )}

        {/* Pertanyaan jurnal */}
        <div className="flex flex-col gap-5">
          {JOURNAL_PROMPTS.map((prompt, i) => (
            <Textarea
              key={i}
              label={prompt}
              placeholder="Tulis jawabanmu di sini…"
              value={answers[i]}
              onChange={(e) => {
                const updated = [...answers];
                updated[i] = e.target.value;
                setAnswers(updated);
              }}
            />
          ))}
        </div>

        {/* Catatan privasi */}
        <div className="flex items-center gap-2 text-xs text-ink-faint">
          <Lock size={13} strokeWidth={1.75} />
          <span>Jurnal ini hanya bisa dilihat olehmu.</span>
        </div>

        {/* Simpan */}
        <Button
          fullWidth
          disabled={answers.every((a) => a.trim() === "")}
          onClick={handleSave}
        >
          Simpan Refleksi
        </Button>

        <Button variant="secondary" fullWidth onClick={() => router.push("/")}>
          Lewati untuk sekarang
        </Button>

      </div>

      {/* Modal Krisis — tampil jika terdeteksi kata kunci, nada hangat bukan menakutkan */}
      {showCrisisModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: "rgba(30, 43, 42, 0.45)" }}
        >
          <div className="bg-sky-light-tint rounded-card shadow-soft max-w-sm w-full flex flex-col gap-5 px-6 py-7">
            {/* Ikon & Judul */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-canvas flex items-center justify-center">
                <Heart size={28} className="text-info-text" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-bold text-ink leading-snug">
                Kamu tidak sendirian
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Kami melihat kamu sedang menghadapi sesuatu yang berat. Perasaanmu
                valid, dan kamu layak mendapat dukungan. Ada sumber bantuan yang
                bisa menemanimu — kapan pun kamu butuh.
              </p>
            </div>

            {/* Tombol aksi */}
            <div className="flex flex-col gap-3">
              <Button
                fullWidth
                onClick={() => {
                  setShowCrisisModal(false);
                  router.push("/help");
                }}
              >
                Lihat Sumber Bantuan
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setShowCrisisModal(false);
                  doSave();
                }}
              >
                Lanjut Simpan Refleksi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
