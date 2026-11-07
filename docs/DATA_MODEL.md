# Data Model: Habitly

Garis besar tipe data (TypeScript). Sesuaikan secukupnya dan catat perubahan di `docs/DECISIONS.md`.

```ts
export type Level = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  joinedAt: string;           // ISO date
  consentedAt: string;        // ISO date
}

export interface QuizResult {
  id: string;
  userId: string;
  takenAt: string;
  answers: number[];          // skor per pertanyaan
  total: number;
  profile: "ringan" | "sedang" | "tinggi"; // label netral, BUKAN diagnosis
  suggestHelp: boolean;       // true bila perlu anjuran bantuan profesional
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
  easierText: string;         // versi lebih ringan
}

export interface DailyTask {
  id: string;
  userId: string;
  taskId: string;
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
  rule: string;               // mis. "streak>=3"
}
```

## Aturan Data

- Jurnal bersifat privat: hanya terlihat pemiliknya, tidak pernah dibagikan ke komunitas.
- Kumpulkan data seminimal mungkin; jangan menambah kolom identitas asli.
- Dukungan komunitas disimpan anonim (jenis pesan terpilih dan tanggal saja).
