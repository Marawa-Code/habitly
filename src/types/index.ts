export type Level = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  joinedAt: string;       // ISO date
  consentedAt: string;    // ISO date
}

export interface QuizResult {
  id: string;
  userId: string;
  takenAt: string;
  answers: number[];      // skor per pertanyaan (0-3)
  total: number;
  profile: "ringan" | "sedang" | "tinggi"; // label netral, BUKAN diagnosis
  suggestHelp: boolean;   // true bila total >= 13
}

export interface Path {
  id: string;
  name: string;
  description: string;
}

export interface Task {
  id: string;
  pathId: string;
  level: Level;
  text: string;
  easierText: string;     // versi lebih ringan
}

export interface DailyTask {
  id: string;
  userId: string;
  taskId: string;
  date: string;           // YYYY-MM-DD
  status: "pending" | "done" | "swapped";
}

export interface JournalEntry {
  id: string;
  dailyTaskId: string;
  answers: string[];      // jawaban terpandu
  createdAt: string;      // privat
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  rule: string;           // mis. "streak>=3"
  icon: string;           // nama ikon Lucide
}

export interface AppState {
  user: User | null;
  quizResults: QuizResult[];
  currentPathId: string | null;
  currentLevel: Level;
  dailyTasks: DailyTask[];
  journalEntries: JournalEntry[];
  earnedBadgeIds: string[];
}

