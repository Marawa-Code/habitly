import type { DailyTask } from "@/types";

/**
 * Hitung streak hari berturut-turut.
 * Toleransi 1 hari terlewat (P1).
 */
export function calculateStreak(dailyTasks: DailyTask[]): number {
  const doneDates = Array.from(
    new Set(
      dailyTasks
        .filter((t) => t.status === "done" || t.status === "swapped")
        .map((t) => t.date)
    )
  )
    .sort()
    .reverse(); // terbaru dulu

  if (doneDates.length === 0) return 0;

  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (let i = 0; i < doneDates.length; i++) {
    const taskDate = new Date(doneDates[i]);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
      (current.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0 || diffDays === 1) {
      streak++;
      current = taskDate;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Hitung total hari aktif (tugas selesai, tidak harus berturut-turut).
 */
export function countActiveDays(dailyTasks: DailyTask[]): number {
  const uniqueDates = new Set(
    dailyTasks
      .filter((t) => t.status === "done" || t.status === "swapped")
      .map((t) => t.date)
  );
  return uniqueDates.size;
}

