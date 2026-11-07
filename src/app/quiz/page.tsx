"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import quizData from "@/content/quiz.json";
import { processQuizAnswers, getProfile, getSuggestHelp } from "@/lib/scoring";
import { recommendChallenges } from "@/lib/recommend";
import { loadState, saveQuizResult } from "@/lib/storage";
import type { QuizResult } from "@/types";

const questions = quizData.questions;
const options = quizData.options;

export default function QuizPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const progress = Math.round(((index + 1) / questions.length) * 100);

  function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];

    if (isLast) {
      setSubmitting(true);
      const { challengeScores, safetyFlags, total } = processQuizAnswers(newAnswers);
      const profile = getProfile(total);
      const suggestHelp = getSuggestHelp(total, safetyFlags);

      const state = loadState();
      const recs = recommendChallenges(challengeScores, state.completedChallengeIds || []);
      const recommendedChallengeIds = recs.map((r) => r.challenge.id);

      const result: QuizResult = {
        id: crypto.randomUUID(),
        userId: state.user?.id ?? "anon",
        takenAt: new Date().toISOString(),
        answers: newAnswers,
        challengeScores,
        safetyFlags,
        total,
        profile,
        suggestHelp,
        recommendedChallengeIds,
      };

      saveQuizResult(result);
      router.push("/result");
    } else {
      setAnswers(newAnswers);
      setSelected(null);
      setIndex(index + 1);
    }
  }

  function handleBack() {
    if (index === 0) {
      router.back();
      return;
    }
    setSelected(answers[index - 1] ?? null);
    setAnswers(answers.slice(0, index - 1));
    setIndex(index - 1);
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col px-6 py-8">
      <div className="max-w-sm w-full mx-auto flex flex-col gap-8 flex-1">

        {/* Header: tombol kembali + progres */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-ink-secondary hover:text-ink transition-colors -ml-1 py-2 pr-2"
              aria-label="Kembali"
            >
              <ChevronLeft size={18} strokeWidth={2} />
              Kembali
            </button>
            <span className="text-sm text-ink-faint font-medium">
              {index + 1} dari {questions.length}
            </span>
          </div>

          {/* Bilah progres */}
          <div
            className="h-1.5 bg-sky-light-tint rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Pertanyaan ${index + 1} dari ${questions.length}`}
          >
            <div
              className="h-full bg-sky rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Pertanyaan */}
        <div className="flex flex-col gap-6 flex-1">
          {question.isSafety && (
            <span className="text-[11px] font-semibold text-info-text uppercase tracking-wider bg-sky-light-tint px-2.5 py-1 rounded-full self-start">
              Pertanyaan Keselamatan
            </span>
          )}

          <h2 className="text-xl font-semibold text-ink leading-snug">
            {question.text}
          </h2>

          {/* Pilihan jawaban */}
          <div className="flex flex-col gap-3" role="radiogroup">
            {options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelected(opt.value)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-card border transition-all min-h-[52px] ${
                    isSelected
                      ? "border-action border-2 bg-mint-tint"
                      : "border-hairline bg-surface hover:border-action/40"
                  }`}
                >
                  {/* Radio visual */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      isSelected ? "border-action bg-action" : "border-hairline"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-ink" : "text-ink-secondary"
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tombol lanjut */}
        <Button
          fullWidth
          disabled={selected === null || submitting}
          onClick={handleNext}
        >
          {isLast ? (submitting ? "Memproses…" : "Lihat Hasil") : "Lanjut"}
        </Button>

      </div>
    </div>
  );
}
