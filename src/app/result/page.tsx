"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ear,
  UserPlus,
  Users,
  MessageSquare,
  Mic,
  HelpCircle,
  Shield,
  MessageCircle,
  Sparkles,
  Heart,
  ChevronRight,
  Clock,
  Target,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import { loadState, saveState, todayString } from "@/lib/storage";
import { recommendChallenges, type ChallengeRecommendation } from "@/lib/recommend";
import type { QuizResult, Challenge } from "@/types";

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

const PROFILE_CONFIG = {
  ringan: {
    label: "Hambatan Ringan",
    desc: "Kamu sudah memiliki fondasi awal yang baik. Latihan mikroskopik teratur setiap hari akan semakin memperkuat rasa percaya dirimu.",
    color: "text-action",
    bg: "bg-mint-tint",
  },
  sedang: {
    label: "Hambatan Sedang",
    desc: "Rasa gugup atau cemas saat berkomunikasi cukup terasa, namun hal tersebut sangat wajar. Tantangan bertahap akan membantumu melatihnya pelan-pelan.",
    color: "text-action",
    bg: "bg-mint-tint",
  },
  tinggi: {
    label: "Hambatan Cukup Terasa",
    desc: "Kamu tidak sendirian. Langkah paling ringan sekalipun tetap merupakan kemajuan yang berharga. Habitly akan menemanimu melatih ketenangan diri.",
    color: "text-info-text",
    bg: "bg-sky-light-tint",
  },
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [recommendations, setRecommendations] = useState<ChallengeRecommendation[]>([]);

  useEffect(() => {
    const state = loadState();
    const latest = state.quizResults.at(-1) ?? null;
    setResult(latest);

    if (latest) {
      const recs = recommendChallenges(
        latest.challengeScores || latest.answers.slice(0, 8),
        state.completedChallengeIds || []
      );
      setRecommendations(recs);
    }
  }, []);

  if (!result || recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-ink-secondary text-sm">Memuat hasil…</p>
      </div>
    );
  }

  const config = PROFILE_CONFIG[result.profile];
  const top1 = recommendations[0];
  const nextRecs = recommendations.slice(1);

  function handleStartChallenge(challenge: Challenge) {
    if (!challenge.available) return;
    saveState({
      activeChallengeId: challenge.id,
      challengeStartDate: todayString(),
    });
    router.push("/");
  }

  const Top1Icon = ICON_MAP[top1.challenge.icon] ?? Sparkles;

  return (
    <div className="min-h-screen bg-canvas flex flex-col px-6 py-10">
      <div className="max-w-sm w-full mx-auto flex flex-col gap-6">

        {/* Profil Header */}
        <div className="text-center flex flex-col gap-2">
          <div className={`inline-flex self-center rounded-full px-4 py-1.5 text-sm font-semibold ${config.bg} ${config.color}`}>
            {config.label}
          </div>
          <h1 className="text-2xl font-bold text-ink">Hasil Penilaian Dirimu</h1>
          <p className="text-sm text-ink-faint">
            Ini bukan diagnosis medis — skor ini membantumu menemukan tantangan latihan yang paling tepat.
          </p>
        </div>

        {/* Kartu Profil & Skor */}
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ink leading-relaxed">{config.desc}</p>
            <div className="flex items-center justify-between text-xs text-ink-secondary pt-2 border-t border-hairline/80">
              <span className="font-medium">Total Skor Kuis:</span>
              <span className="font-extrabold text-ink text-sm">{result.total} / 24</span>
            </div>
          </div>
        </Card>

        {/* Anjuran Bantuan (Jika Skor Tinggi atau Flag Keselamatan) */}
        {result.suggestHelp && (
          <div className="bg-sky-light-tint rounded-card px-5 py-4 flex flex-col gap-3 border border-hairline">
            <div className="flex gap-3">
              <Heart size={20} className="text-info-text shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-sm text-info-text leading-relaxed">
                Skor kamu cukup terasa atau kamu sedang menghadapi situasi yang menekan. Kami menyarankanmu untuk berbicara dengan orang dewasa yang kamu percaya atau tenaga profesional.
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

        {/* Rekomendasi 1: Mulai Dari Sini */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-action">
            <span className="text-xs font-bold uppercase tracking-wider">
              {top1.label}
            </span>
          </div>

          <Card accent>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-mint-tint flex items-center justify-center text-action shrink-0 shadow-soft">
                  <Top1Icon size={24} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-ink leading-snug">
                    {top1.challenge.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Chip variant="sky" className="text-[11px] py-0 px-2" icon={<Clock size={11} strokeWidth={2} />}>
                      {top1.challenge.durationDays} Hari
                    </Chip>
                    <Chip variant="neutral" className="text-[11px] py-0 px-2" icon={<Target size={11} strokeWidth={2} />}>
                      {DIFFICULTY_LABELS[top1.challenge.difficulty]}
                    </Chip>
                    {!top1.challenge.available && (
                      <Chip variant="neutral" className="text-[11px] py-0 px-2 text-ink-faint">
                        Segera hadir
                      </Chip>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-ink-secondary leading-relaxed bg-canvas border border-hairline rounded-lg p-3">
                {top1.challenge.focus}
              </p>

              {top1.challenge.available ? (
                <Button
                  fullWidth
                  onClick={() => handleStartChallenge(top1.challenge)}
                  className="flex items-center justify-center gap-2"
                >
                  <span>Mulai Tantangan Ini</span>
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button fullWidth disabled>
                  Segera Hadir
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Rekomendasi 2 & 3: Bisa Kamu Coba Berikutnya */}
        {nextRecs.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Bisa kamu coba berikutnya
            </p>

            <div className="flex flex-col gap-2.5">
              {nextRecs.map((rec) => {
                const IconComponent = ICON_MAP[rec.challenge.icon] ?? Sparkles;
                return (
                  <div
                    key={rec.challenge.id}
                    onClick={() => {
                      if (rec.challenge.available) {
                        handleStartChallenge(rec.challenge);
                      }
                    }}
                    className={`bg-surface border border-hairline rounded-card px-4 py-3 flex items-center gap-3 transition-colors shadow-soft ${
                      rec.challenge.available
                        ? "cursor-pointer hover:border-action/40"
                        : "opacity-80 cursor-default"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-canvas border border-hairline flex items-center justify-center text-action shrink-0">
                      <IconComponent size={20} strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-ink truncate">
                        {rec.challenge.name}
                      </p>
                      <p className="text-xs text-ink-faint">
                        {rec.challenge.durationDays} Hari · {DIFFICULTY_LABELS[rec.challenge.difficulty]}
                      </p>
                    </div>
                    {rec.challenge.available ? (
                      <ChevronRight size={16} className="text-ink-faint" />
                    ) : (
                      <span className="text-[10px] text-ink-faint bg-canvas border border-hairline rounded px-2 py-0.5">
                        Segera hadir
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
