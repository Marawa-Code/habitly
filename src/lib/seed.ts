"use client";

/**
 * Seed data demo untuk presentasi hackathon.
 * Panggil seedDemoData() untuk mengisi localStorage dengan data contoh.
 */

import { saveState } from "@/lib/storage";
import type { AppState } from "@/types";

export function seedDemoData(): void {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const daysAgo = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return fmt(d);
  };

  const demoState: AppState = {
    user: {
      id: "demo-user",
      nickname: "Rani",
      joinedAt: daysAgo(10),
      consentedAt: daysAgo(10),
    },
    quizResults: [
      {
        id: "qr-1",
        userId: "demo-user",
        takenAt: daysAgo(10),
        answers: [2, 3, 2, 2, 1, 1, 2, 2, 0, 0],
        challengeScores: [2, 3, 2, 2, 1, 1, 2, 2],
        safetyFlags: [false, false],
        total: 15,
        profile: "sedang",
        suggestHelp: false,
        recommendedChallengeIds: ["menyapa-orang-baru", "ngobrol-dengan-lawan-jenis", "ngobrol-dengan-orang-mulai-dekat"],
      },
      {
        id: "qr-2",
        userId: "demo-user",
        takenAt: daysAgo(3),
        answers: [1, 2, 1, 1, 1, 0, 1, 1, 0, 0],
        challengeScores: [1, 2, 1, 1, 1, 0, 1, 1],
        safetyFlags: [false, false],
        total: 8,
        profile: "ringan",
        suggestHelp: false,
        recommendedChallengeIds: ["menyapa-orang-baru", "ngobrol-dengan-orang-mulai-dekat", "ngobrol-dengan-lawan-jenis"],
      },
    ],
    activeChallengeId: "menyapa-orang-baru",
    completedChallengeIds: [],
    challengeStartDate: daysAgo(4),
    dailyTasks: [
      { id: "dt-1", userId: "demo-user", challengeId: "menyapa-orang-baru", taskId: "task-2-1", day: 1, date: daysAgo(4), status: "done" },
      { id: "dt-2", userId: "demo-user", challengeId: "menyapa-orang-baru", taskId: "task-2-2", day: 2, date: daysAgo(3), status: "swapped" },
      { id: "dt-3", userId: "demo-user", challengeId: "menyapa-orang-baru", taskId: "task-2-3", day: 3, date: daysAgo(2), status: "done" },
      { id: "dt-4", userId: "demo-user", challengeId: "menyapa-orang-baru", taskId: "task-2-4", day: 4, date: daysAgo(1), status: "done" },
      { id: "dt-5", userId: "demo-user", challengeId: "menyapa-orang-baru", taskId: "task-2-5", day: 5, date: fmt(today), status: "pending" },
    ],
    journalEntries: [
      {
        id: "je-1",
        dailyTaskId: "dt-1",
        answers: ["Awalnya agak ragu, tapi ternyata menyenangkan setelah dicoba.", "Teman sekelasku merespons dengan senyum yang ramah.", "Besok aku mau menyapa dengan suara lebih jelas."],
        createdAt: daysAgo(4),
      },
      {
        id: "je-2",
        dailyTaskId: "dt-3",
        answers: ["Senang rasanya bisa mengucapkan terima kasih secara tulus.", "Hubungan terasa lebih hangat dan tidak kaku.", "Lanjut mencoba tugas berikutnya besok."],
        createdAt: daysAgo(2),
      },
    ],
    earnedBadgeIds: ["first-step", "streak-3", "first-journal", "level-up", "tasks-5"],
  };

  saveState(demoState);
}
