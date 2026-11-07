import type { QuizResult } from "@/types";
import type { Level } from "@/types";

/**
 * Hitung skor total dari jawaban kuis (tiap jawaban 0-3).
 * Total 0-18.
 */
export function calculateScore(answers: number[]): number {
  return answers.reduce((sum, a) => sum + a, 0);
}

/**
 * Tentukan profil netral berdasarkan total skor.
 * BUKAN alat diagnosis klinis.
 */
export function getProfile(total: number): QuizResult["profile"] {
  if (total <= 6) return "ringan";
  if (total <= 12) return "sedang";
  return "tinggi";
}

/**
 * Apakah skor tinggi dan perlu anjuran bantuan profesional?
 */
export function getSuggestHelp(total: number): boolean {
  return total >= 13;
}

/**
 * Tentukan tingkat awal berdasarkan skor.
 * Skor tinggi → mulai dari tingkat rendah (lebih banyak latihan ringan).
 */
export function getInitialLevel(total: number): Level {
  if (total <= 6) return 3;
  if (total <= 12) return 2;
  return 1;
}

/**
 * Tentukan pertanyaan mana yang skornya paling tinggi
 * untuk merekomendasikan jalur yang sesuai.
 * Indeks: 0=q1(bicara kelas), 1=q2(percaya diri), 2=q3(bertanya),
 *         3=q4(percaya diri), 4=q5(kerja kelompok), 5=q6(percaya diri)
 */
export function getDominantArea(answers: number[]): "bicara-kelas" | "kerja-kelompok" | "percaya-diri" {
  const bicaraKelas = answers[0] + answers[2];     // gugup bicara + susah bertanya
  const kerjaKelompok = answers[4];                // hindari diskusi kelompok
  const percayaDiri = answers[1] + answers[3] + answers[5]; // sisanya

  if (bicaraKelas >= kerjaKelompok && bicaraKelas >= percayaDiri) return "bicara-kelas";
  if (kerjaKelompok >= percayaDiri) return "kerja-kelompok";
  return "percaya-diri";
}

