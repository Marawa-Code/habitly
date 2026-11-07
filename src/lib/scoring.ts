import type { QuizResult } from "@/types";

/**
 * Pisahkan jawaban menjadi 8 skor tantangan dan 2 penanda keselamatan.
 */
export function processQuizAnswers(allAnswers: number[]): {
  challengeScores: number[];
  safetyFlags: boolean[];
  total: number;
} {
  const challengeScores = allAnswers.slice(0, 8);
  const safetyAnswers = allAnswers.slice(8, 10);

  // Total hanya dihitung dari 8 pertanyaan tantangan (0 - 24)
  const total = challengeScores.reduce((sum, score) => sum + (score || 0), 0);

  // Pertanyaan keselamatan (jawaban > 0: kadang-kadang, sering, hampir selalu menunjukkan indikasi masalah)
  const safetyFlags = safetyAnswers.map((ans) => ans > 0);

  return { challengeScores, safetyFlags, total };
}

/**
 * Tentukan profil netral berdasarkan total skor 8 tantangan.
 * BUKAN alat diagnosis klinis.
 */
export function getProfile(total: number): QuizResult["profile"] {
  if (total <= 8) return "ringan";
  if (total <= 16) return "sedang";
  return "tinggi";
}

/**
 * Cek apakah perlu anjuran rujukan bantuan profesional:
 * Total >= 17 ATAU ada indikasi pada pertanyaan keselamatan.
 */
export function getSuggestHelp(total: number, safetyFlags: boolean[]): boolean {
  if (total >= 17) return true;
  if (safetyFlags.some((flag) => flag === true)) return true;
  return false;
}
