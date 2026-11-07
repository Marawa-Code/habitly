"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, TrendingUp, Users, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { loadState } from "@/lib/storage";
import type { QuizResult } from "@/types";
import pathsData from "@/content/paths.json";

const PATH_LABELS: Record<string, string> = {
  "percaya-diri": "Percaya Diri Berkomunikasi",
  "bicara-kelas": "Bicara di Kelas",
  "kerja-kelompok": "Kerja Kelompok",
};

const PROFILE_CONFIG = {
  ringan: {
    label: "Hambatan Ringan",
    desc: "Kamu sudah punya fondasi yang bagus. Latihan kecil setiap hari akan semakin memperkuat rasa percaya dirimu.",
    color: "text-action",
    bg: "bg-mint-tint",
  },
  sedang: {
    label: "Hambatan Sedang",
    desc: "Rasa gugup saat komunikasi cukup terasa, tapi itu wajar. Dengan latihan bertahap, kamu bisa melewatinya.",
    color: "text-action",
    bg: "bg-mint-tint",
  },
  tinggi: {
    label: "Hambatan Cukup Terasa",
    desc: "Kamu tidak sendirian. Langkah pertama yang kecil pun sangat berarti. Habitly akan menemanimu mulai dari yang paling ringan.",
    color: "text-info-text",
    bg: "bg-sky-light-tint",
  },
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [pathId, setPathId] = useState<string | null>(null);

  useEffect(() => {
    const state = loadState();
    const latest = state.quizResults.at(-1) ?? null;
    setResult(latest);
    setPathId(state.currentPathId);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-ink-secondary text-sm">Memuat hasil…</p>
      </div>
    );
  }

  const config = PROFILE_CONFIG[result.profile];
  const pathName = pathId ? (PATH_LABELS[pathId] ?? pathId) : "Percaya Diri Berkomunikasi";
  const path = pathsData.find((p) => p.id === pathId);

  return (
    <div className="min-h-screen bg-canvas flex flex-col px-6 py-10">
      <div className="max-w-sm w-full mx-auto flex flex-col gap-6">

        {/* Judul */}
        <div className="text-center flex flex-col gap-2">
          <div className={`inline-flex self-center rounded-full px-4 py-1.5 text-sm font-semibold ${config.bg} ${config.color}`}>
            {config.label}
          </div>
          <h1 className="text-2xl font-bold text-ink">Hasil Kuis-mu</h1>
          <p className="text-sm text-ink-faint">
            Ini bukan diagnosis — hanya gambaran awal untuk memilih latihan yang cocok.
          </p>
        </div>

        {/* Kartu profil */}
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-base text-ink leading-relaxed">{config.desc}</p>
            <div className="flex items-center gap-2 text-sm text-ink-secondary">
              <span className="font-medium">Skor kamu:</span>
              <span className="font-bold text-ink">{result.total} / 18</span>
            </div>
          </div>
        </Card>

        {/* Anjuran bantuan (jika skor tinggi) */}
        {result.suggestHelp && (
          <div className="bg-sky-light-tint rounded-card px-5 py-4 flex flex-col gap-3">
            <div className="flex gap-3">
              <Heart size={20} className="text-info-text shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-sm text-info-text leading-relaxed">
                Skor kamu cukup tinggi. Kami menyarankan kamu untuk berbicara dengan
                orang dewasa yang kamu percaya atau tenaga profesional.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => router.push("/help")}
              className="self-start"
            >
              Lihat sumber bantuan →
            </Button>
          </div>
        )}

        {/* Rekomendasi jalur */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-ink-secondary uppercase tracking-wide text-xs">
            Jalur yang direkomendasikan
          </p>
          <Card accent>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-action" strokeWidth={1.75} />
                <span className="text-sm font-semibold text-ink-secondary eyebrow">
                  Mulai dari Tingkat 1
                </span>
              </div>
              <h2 className="text-lg font-bold text-ink mt-1">{pathName}</h2>
              {path && (
                <p className="text-sm text-ink-secondary leading-relaxed mt-1">
                  {path.description}
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 pt-2">
          <Button fullWidth onClick={() => router.push("/")}>
            Mulai Latihan Hari Ini
            <ArrowRight size={18} />
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => router.push("/quiz")}
          >
            Ulangi kuis
          </Button>
        </div>

      </div>
    </div>
  );
}
