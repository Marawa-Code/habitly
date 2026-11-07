export type Difficulty = 1 | 2 | 3; // 1 = Pemula, 2 = Menengah, 3 = Lanjutan

export interface User {
  id: string;
  nickname: string;
  joinedAt: string;       // ISO date
  consentedAt: string;    // ISO date
}

export interface QuizResult {
  id: string;
  userId: string;
  takenAt: string;
  answers: number[];                  // 8 pertanyaan tantangan (0-3) + 2 pertanyaan keselamatan (0-3)
  challengeScores: number[];          // 8 nilai tantangan
  safetyFlags: boolean[];             // 2 penanda keselamatan
  total: number;                      // total skor 8 tantangan (0-24)
  profile: "ringan" | "sedang" | "tinggi"; // label netral, BUKAN diagnosis
  suggestHelp: boolean;               // true bila total >= 17 atau penanda keselamatan menyala
  recommendedChallengeIds: string[]; // 3 ID tantangan teratas hasil rekomendasi
}

export interface Challenge {
  id: string;
  no: number;
  name: string;
  icon: string;           // Nama ikon Lucide (BUKAN emoji)
  durationDays: number;
  difficulty: Difficulty;
  focus: string;
  available: boolean;     // true untuk tantangan aktif di prototipe (1, 2, 4)
}

export interface ChallengeTask {
  id: string;
  challengeId: string;
  day: number;
  trigger: string;             // "Setelah ..."
  text: string;                // Tindakan sangat kecil
  easierText: string;          // Versi lebih ringan
  identityStatement: string;   // "Aku sedang menjadi ..."
}

export interface DailyTask {
  id: string;
  userId: string;
  challengeId: string;
  taskId: string;
  day: number;
  date: string;               // YYYY-MM-DD
  status: "pending" | "done" | "swapped";
}

export interface JournalEntry {
  id: string;
  dailyTaskId: string;
  answers: string[];          // Jawaban terpandu
  createdAt: string;          // Privat
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  rule: string;
  icon: string;               // Nama ikon Lucide
}

export interface AppState {
  user: User | null;
  quizResults: QuizResult[];
  activeChallengeId: string | null;
  completedChallengeIds: string[];
  challengeStartDate: string | null;
  currentLevel?: number;
  dailyTasks: DailyTask[];
  journalEntries: JournalEntry[];
  earnedBadgeIds: string[];
}
