import type { Task, AppState } from "@/types";
import type { Level } from "@/types";
import tasks from "@/content/tasks.json";

const TASKS_PER_LEVEL = 5; // naik tingkat setelah N tugas selesai

/**
 * Ambil satu tugas yang belum pernah dimunculkan hari ini,
 * sesuai jalur dan tingkat pengguna.
 */
export function pickTask(pathId: string, level: Level, usedTaskIds: string[]): Task | null {
  const pool = (tasks as Task[]).filter(
    (t) => t.pathId === pathId && t.level === level && !usedTaskIds.includes(t.id)
  );
  if (pool.length === 0) {
    // Semua tugas di tingkat ini sudah dipakai, ulangi dari awal
    const fallback = (tasks as Task[]).filter(
      (t) => t.pathId === pathId && t.level === level
    );
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Cek apakah pengguna sudah cukup tugas selesai untuk naik tingkat.
 */
export function shouldLevelUp(state: AppState): boolean {
  if (state.currentLevel >= 5) return false;
  const doneTasks = state.dailyTasks.filter(
    (t) => t.status === "done" || t.status === "swapped"
  );
  // Hitung tugas selesai di tingkat saat ini (sederhana: semua done sejak terakhir level up)
  return doneTasks.length > 0 && doneTasks.length % TASKS_PER_LEVEL === 0;
}

