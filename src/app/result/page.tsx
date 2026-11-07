"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ChevronRight, Clock, Target, Rocket } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import { loadState, saveState, todayString } from "@/lib/storage";
import type { QuizResult, Challenge } from "@/types";
import challengesData from "@/content/challenges.json";

const PROFILE_CONFIG = {
  ringan: {
    label: "Hambatan Ringan",
    desc: "Kamu sudah punya fondasi yang bagus. Latihan eksposur bertahap akan semakin memperkuat kelancaran komunikasimu.",
    color: "text-action",
    bg: "bg-mint-tint",
    recommendedId: "belajar-mengobrol",
  },
  sedang: {
    label: "Hambatan Sedang",
    desc: "Rasa gugup saat komunikasi cukup terasa, tapi itu sangat wajar. Dengan tantangan terarah, kamu bisa melatihnya hari demi hari.",
    color: "text-action",
    bg: "bg-mint-tint",
    recommendedId: "membangun-kepercayaan-diri",
  },
  tinggi: {
    label: "Hambatan Cukup Terasa",
    desc: "Kamu tidak sendirian. Langkah pertama yang paling ringan pun bernilai besar. Habitly akan menemanimu mulai dari menenangkan pikiran.",
    color: "text-info-text",
    bg: "bg-sky-light-tint",
    recommendedId: "stop-overthinking",
  },
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const state = loadState();
    const latest = state.quizResults.at(-1) ?? null;
    setResult(latest);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-ink-secondary text-sm">Memuat hasil…</p>
      </div>
    );
  }

  const config = PROFILE_CONFIG[result.profile];
  const challenges = challengesData as Challenge[];

  const recommendedChallenge =
    challenges.find((c) => c.id === config.recommendedId) ?? challenges[0];

  const otherChallenges = challenges.filter(
    (c) => c.id !== recommendedChallenge.id
  ).slice(0, 2);

  function handleStartChallenge(challenge: Challenge) {
    saveState({
      activeChallengeId: challenge.id,
      currentPathId: challenge.pathId,
      challengeStartDate: todayString(),
      currentLevel: 1,
    });
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col px-6 py-10">
      <div className="max-w-sm w-full mx-auto flex flex-col gap-6">

        {/* Profil Header */}
        <div className="text-center flex flex-col gap-2">
          <div className={`inline-flex self-center rounded-full px-4 py-1.5 text-sm font-semibold ${config.bg} ${config.color}`}>
            {config.label}
          </div>
          <h1 className="text-2xl font-bold text-ink">Hasil Kuis-mu</h1>
          <p className="text-sm text-ink-faint">
            Ini bukan diagnosis — skor ini membantumu menemukan tantangan yang paling pas.
          </p>
        </div>

        {/* Kartu skor */}
        <Card>
          <div className="flex flex-col gap-2.5">
            <p className="text-sm text-ink leading-relaxed">{config.desc}</p>
            <div className="flex items-center justify-between text-xs text-ink-secondary pt-1 border-t border-hairline/80">
              <span className="font-medium">Total Skor Kuis:</span>
              <span className="font-extrabold text-ink text-sm">{result.total} / 18</span>
            </div>
          </div>
        </Card>

        {/* Anjuran bantuan (jika skor tinggi) */}
        {result.suggestHelp && (
          <div className="bg-sky-light-tint rounded-card px-5 py-4 flex flex-col gap-3 border border-sky-light">
            <div className="flex gap-3">
              <Heart size={20} className="text-info-text shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-sm text-info-text leading-relaxed">
                Skor kamu cukup terasa. Kami menyarankan kamu untuk berbicara dengan
                orang dewasa yang kamu percaya atau tenaga profesional jika dirasa perlu.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => router.push("/help")}
              className="self-start text-xs py-2 px-3.5"
            >
              Lihat sumber bantuan →
            </Button>
          </div>
        )}

        {/* Tantangan terbaik untukmu (layout/Hasil kuis.png) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-action">
            <span className="text-xs font-bold uppercase tracking-wider">
              ✨ Rekomendasi untukmu
            </span>
          </div>

          <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-mint-tint/80 via-mint-tint/50 to-sky-light-tint/50 border border-hairline p-5 shadow-soft flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-hairline flex items-center justify-center text-2xl shrink-0 shadow-soft">
                <span role="img" aria-label={recommendedChallenge.name}>
                  {recommendedChallenge.emoji}
                </span>
              </div>
              <div>
                <h2 className="text-base font-bold text-ink">
                  {recommendedChallenge.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Chip variant="sky" className="text-[11px] py-0 px-2" icon={<Clock size={11} />}>
                    {recommendedChallenge.durationDays} Hari
                  </Chip>
                  <Chip variant="neutral" className="text-[11px] py-0 px-2" icon={<Target size={11} />}>
                    {recommendedChallenge.difficulty}
                  </Chip>
                </div>
              </div>
            </div>

            <p className="text-xs text-ink-secondary italic leading-relaxed bg-surface/70 border border-hairline/60 rounded-xl p-3">
              &ldquo;{recommendedChallenge.description} — cocok banget buat kamu yang ingin mulai perjalanan pertumbuhan diri sekarang.&rdquo;
            </p>

            <Button
              fullWidth
              onClick={() => handleStartChallenge(recommendedChallenge)}
              className="flex items-center justify-center gap-2 py-3"
            >
              <Rocket size={16} />
              <span>Mulai Tantangan Ini</span>
            </Button>
          </div>
        </div>

        {/* Tantangan lain yang cocok */}
        <div className="flex flex-col gap-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
            Tantangan lain yang cocok
          </p>
          {otherChallenges.map((c) => (
            <div
              key={c.id}
              onClick={() => router.push(`/tantangan/${c.id}`)}
              className="bg-surface border border-hairline rounded-card px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-action/40 transition-colors shadow-soft group"
            >
              <div className="w-9 h-9 rounded-xl bg-canvas border border-hairline flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                <span role="img" aria-label={c.name}>{c.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate group-hover:text-action transition-colors">
                  {c.name}
                </p>
                <p className="text-xs text-ink-faint">
                  {c.durationDays} Hari · {c.difficulty}
                </p>
              </div>
              <ChevronRight size={16} className="text-ink-faint group-hover:text-action transition-colors" />
            </div>
          ))}
        </div>

        {/* Opsi Ulangi Kuis */}
        <div className="pt-2 text-center">
          <button
            onClick={() => router.push("/quiz")}
            className="text-xs text-ink-faint hover:text-ink underline"
          >
            Ulangi kuis dari awal
          </button>
        </div>

      </div>
    </div>
  );
}
