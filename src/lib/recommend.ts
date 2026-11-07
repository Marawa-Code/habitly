import challengesData from "@/content/challenges.json";
import type { Challenge } from "@/types";

export interface ChallengeRecommendation {
  challenge: Challenge;
  kebutuhan: number;
  penalti: number;
  nilai: number;
  rank: number;
  label: "Mulai dari sini" | "Bisa kamu coba berikutnya";
}

/**
 * Rekomendasi tantangan berdasarkan formula penalti kesulitan dan skor kebutuhan kuis.
 *
 * kebutuhan_i = skor_i / 3
 * tingkat_umum = total_skor / (jumlah_tantangan * 3)
 * penalti_i = 0.3 * tingkat_umum * (kesulitan_i - 1) / 2
 * nilai_i = kebutuhan_i - penalti_i
 */
export function recommendChallenges(
  challengeScores: number[],
  completedChallengeIds: string[] = []
): ChallengeRecommendation[] {
  const challenges = challengesData as Challenge[];
  const jumlahTantangan = challenges.length; // 8
  const totalSkor = challengeScores.reduce((sum, s) => sum + (s || 0), 0);
  const tingkatUmum = totalSkor / (jumlahTantangan * 3);

  // Hitung nilai per tantangan
  const scored = challenges
    .filter((c) => {
      // Hubungan Sehat (kesulitan 3) hanya jika sudah pernah menyelesaikan min 1 tantangan
      if (c.difficulty === 3 && completedChallengeIds.length === 0) {
        return false;
      }
      return true;
    })
    .map((c) => {
      const skor_i = challengeScores[c.no - 1] ?? 0;
      const kebutuhan_i = skor_i / 3;
      const penalti_i = 0.3 * tingkatUmum * ((c.difficulty - 1) / 2);
      const nilai_i = kebutuhan_i - penalti_i;

      return {
        challenge: c,
        kebutuhan: kebutuhan_i,
        penalti: penalti_i,
        nilai: nilai_i,
      };
    });

  // Urutkan nilai_i menurun; seri: kesulitan lebih rendah dulu, lalu nomor tantangan
  scored.sort((a, b) => {
    if (b.nilai !== a.nilai) {
      return b.nilai - a.nilai;
    }
    if (a.challenge.difficulty !== b.challenge.difficulty) {
      return a.challenge.difficulty - b.challenge.difficulty;
    }
    return a.challenge.no - b.challenge.no;
  });

  // Ambil 3 teratas
  const top3 = scored.slice(0, 3).map((item, index) => ({
    ...item,
    rank: index + 1,
    label: (index === 0 ? "Mulai dari sini" : "Bisa kamu coba berikutnya") as
      | "Mulai dari sini"
      | "Bisa kamu coba berikutnya",
  }));

  return top3;
}
