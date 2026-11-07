"use client";

import type { AppState, DailyTask, JournalEntry, QuizResult, User } from "@/types";

const KEY = "habitly_state";

const defaultState: AppState = {
  user: null,
  quizResults: [],
  activeChallengeId: null,
  joinedChallengeIds: [],
  completedChallengeIds: [],
  challengeStartDate: null,
  dailyTasks: [],
  journalEntries: [],
  earnedBadgeIds: [],
};

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    const joined = parsed.joinedChallengeIds || (
      parsed.activeChallengeId ? [parsed.activeChallengeId] : []
    );
    return { ...defaultState, ...parsed, joinedChallengeIds: joined };
  } catch {
    return defaultState;
  }
}

export function saveState(state: Partial<AppState>): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadState();
    localStorage.setItem(KEY, JSON.stringify({ ...current, ...state }));
    window.dispatchEvent(new Event("habitly_state_change"));
  } catch {
    // penyimpanan penuh atau tidak tersedia
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("habitly_state_change"));
}

// --- Helpers per entitas ---

export function saveUser(user: User): void {
  saveState({ user });
}

export function saveQuizResult(result: QuizResult): void {
  const state = loadState();
  saveState({ quizResults: [...state.quizResults, result] });
}

export function saveDailyTask(task: DailyTask): void {
  const state = loadState();
  const existing = state.dailyTasks.findIndex((t) => t.id === task.id);
  if (existing >= 0) {
    const updated = [...state.dailyTasks];
    updated[existing] = task;
    saveState({ dailyTasks: updated });
  } else {
    saveState({ dailyTasks: [...state.dailyTasks, task] });
  }
}

export function saveJournalEntry(entry: JournalEntry): void {
  const state = loadState();
  saveState({ journalEntries: [...state.journalEntries, entry] });
}

export function addEarnedBadge(badgeId: string): void {
  const state = loadState();
  if (!state.earnedBadgeIds.includes(badgeId)) {
    saveState({ earnedBadgeIds: [...state.earnedBadgeIds, badgeId] });
  }
}

export function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getTodayTask(state: AppState): DailyTask | undefined {
  if (!state.activeChallengeId) {
    return state.dailyTasks[state.dailyTasks.length - 1];
  }
  const challengeTasks = state.dailyTasks.filter((t) => t.challengeId === state.activeChallengeId);
  // Prioritaskan task yang masih pending
  const pending = challengeTasks.find((t) => t.status === "pending");
  if (pending) return pending;
  // Jika semua sudah selesai, kembalikan task dengan hari tertinggi
  if (challengeTasks.length > 0) {
    return challengeTasks.reduce((prev, curr) => (curr.day > prev.day ? curr : prev));
  }
  return undefined;
}

/**
 * Mengambil seluruh ID tantangan yang sedang diikuti (progres aman tersimpan).
 */
export function getJoinedChallengeIds(state: AppState): string[] {
  const fromState = state.joinedChallengeIds || [];
  const fromActive = state.activeChallengeId ? [state.activeChallengeId] : [];
  const fromTasks = state.dailyTasks.map((t) => t.challengeId);
  return Array.from(new Set([...fromState, ...fromActive, ...fromTasks]));
}

/**
 * Menghitung detail progres untuk suatu tantangan spesifik.
 */
export function getChallengeProgress(
  state: AppState,
  challengeId: string,
  durationDays: number
) {
  const tasks = state.dailyTasks.filter((t) => t.challengeId === challengeId);
  const completedTasks = tasks.filter((t) => t.status === "done" || t.status === "swapped");
  const completedCount = completedTasks.length;
  const currentTask =
    tasks.find((t) => t.status === "pending") ||
    (tasks.length > 0
      ? tasks.reduce((prev, curr) => (curr.day > prev.day ? curr : prev))
      : null);
  const currentDay = currentTask
    ? currentTask.day
    : completedCount > 0
    ? Math.min(durationDays, completedCount + 1)
    : 1;
  const percent = Math.min(100, Math.round((completedCount / durationDays) * 100));
  const isCompleted =
    state.completedChallengeIds.includes(challengeId) || completedCount >= durationDays;

  return {
    completedCount,
    currentDay,
    percent,
    isCompleted,
    hasStarted: tasks.length > 0 || (state.joinedChallengeIds || []).includes(challengeId),
  };
}
