# Data Model: Habitly

Garis besar tipe data TypeScript. Konsep telah diselaraskan menjadi 8 Tantangan terarah dengan pendekatan Atomic Habits.

```ts
export type Difficulty = 1 | 2 | 3; // 1 = Pemula, 2 = Menengah, 3 = Lanjutan

export interface User {
  id: string;
  nickname: string;
  joinedAt: string;           // ISO date
  consentedAt: string;        // ISO date
}

export interface QuizResult {
  id: string;
  userId: string;
  takenAt: string;
  answers: number[];          // 8 pertanyaan tantangan (0-3) + 2 pertanyaan keselamatan (0-1)
  challengeScores: number[];  // 8 skor tantangan (0-3)
  safetyFlags: boolean[];     // 2 boolean penanda keselamatan
  total: number;              // total skor 8 tantangan (0-24)
  profile: "ringan" | "sedang" | "tinggi"; // 0-8 ringan, 9-16 sedang, 17-24 tinggi
  suggestHelp: boolean;       // true bila total >= 17 atau safetyFlags menunjukkan masalah
  recommendedChallengeIds: string[]; // 3 ID tantangan teratas hasil rekomendasi
}

export interface Challenge {
  id: string;
  no: number;
  name: string;
  icon: string;               // nama ikon Lucide (BUKAN emoji)
  durationDays: number;
  difficulty: Difficulty;
  focus: string;
  description: string;        // Deskripsi lengkap tantangan & tujuan komunikasinya
  available: boolean;         // true untuk tantangan aktif di prototipe (2, 3, 4)
}

export interface ChallengeTask {
  id: string;
  challengeId: string;
  day: number;                // 1..durationDays
  title: string;              // Judul spesifik misi harian
  description: string;        // Deskripsi lengkap misi, tujuan & panduan menjalankannya
  trigger: string;            // Pemicu: "Setelah ..."
  text: string;               // Tindakan sangat kecil
  easierText: string;         // Alternatif lebih ringan jika cemas
  identityStatement: string;  // Penegasan identitas: "Aku sedang menjadi ..."
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
  answers: string[];
  createdAt: string;          // privat
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  rule: string;
  icon: string;
}

export interface AppState {
  user: User | null;
  quizResults: QuizResult[];
  activeChallengeId: string | null;
  joinedChallengeIds?: string[];      // Daftar tantangan yang sedang diikuti (progres tersimpan utuh)
  completedChallengeIds: string[];
  challengeStartDate: string | null;
  dailyTasks: DailyTask[];
  journalEntries: JournalEntry[];
  earnedBadgeIds: string[];
}
```

## Aturan Data

- **Privasi Jurnal:** Jurnal bersifat privat, hanya tersimpan lokal pada perangkat, tidak dibagikan.
- **Data Minimal:** Tidak meminta data identitas sensitif (hanya nama panggilan opsional).
- **Integritas:** Seluruh data berjalan rule-based di sisi klien tanpa pengiriman ke model AI eksternal.
