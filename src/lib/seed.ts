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
        answers: [2, 2, 1, 2, 1, 2],
        total: 10,
        profile: "sedang",
        suggestHelp: false,
      },
      {
        id: "qr-2",
        userId: "demo-user",
        takenAt: daysAgo(3),
        answers: [1, 2, 1, 1, 1, 1],
        total: 7,
        profile: "sedang",
        suggestHelp: false,
      },
    ],
    currentPathId: "percaya-diri",
    currentLevel: 2,
    dailyTasks: [
      { id: "dt-1", userId: "demo-user", taskId: "t-pd-1-1", date: daysAgo(7), status: "done" },
      { id: "dt-2", userId: "demo-user", taskId: "t-pd-1-2", date: daysAgo(6), status: "done" },
      { id: "dt-3", userId: "demo-user", taskId: "t-pd-1-3", date: daysAgo(5), status: "done" },
      { id: "dt-4", userId: "demo-user", taskId: "t-pd-2-1", date: daysAgo(4), status: "done" },
      { id: "dt-5", userId: "demo-user", taskId: "t-pd-2-2", date: daysAgo(3), status: "swapped" },
      { id: "dt-6", userId: "demo-user", taskId: "t-pd-2-3", date: daysAgo(2), status: "done" },
      { id: "dt-7", userId: "demo-user", taskId: "t-pd-2-1", date: daysAgo(1), status: "done" },
      { id: "dt-8", userId: "demo-user", taskId: "t-pd-2-2", date: fmt(today), status: "pending" },
    ],
    journalEntries: [
      {
        id: "je-1",
        dailyTaskId: "dt-1",
        answers: ["Awalnya gugup, tapi senang setelah berhasil.", "Tersenyum terasa lebih mudah dari yang aku bayangkan.", "Besok aku mau mencoba menyapa duluan."],
        createdAt: daysAgo(7),
      },
      {
        id: "je-2",
        dailyTaskId: "dt-4",
        answers: ["Deg-degan, tapi akhirnya berhasil menyapa.", "Temanku merespons dengan hangat.", "Aku mau coba bertanya di kelas besok."],
        createdAt: daysAgo(4),
      },
    ],
    earnedBadgeIds: ["first-step", "streak-3", "first-journal", "level-up", "tasks-5"],
  };

  saveState(demoState);
}

