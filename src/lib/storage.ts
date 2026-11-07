"use client";

import type { AppState, DailyTask, JournalEntry, QuizResult, User } from "@/types";

const KEY = "habitly_state";

const defaultState: AppState = {
  user: null,
  quizResults: [],
  activeChallengeId: null,
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
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveState(state: Partial<AppState>): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadState();
    localStorage.setItem(KEY, JSON.stringify({ ...current, ...state }));
  } catch {
    // penyimpanan penuh atau tidak tersedia
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
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
  return state.dailyTasks.find((t) => t.date === todayString());
}
