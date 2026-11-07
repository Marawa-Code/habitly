# Tech Spec: Habitly

Keputusan tim: **Next.js** (App Router) + **TypeScript** + **Tailwind CSS (v3)**.

## Stack

| Bagian | Pilihan |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Gaya UI | Tailwind CSS (v3 via `tailwind.config.ts`), sistem token dari `docs/DESIGN.md` |
| Font | Plus Jakarta Sans lewat `next/font/google` |
| Ikon | Lucide React (gaya garis, BUKAN emoji) |
| Grafik | Recharts |
| Penyimpanan | localStorage (client-side, aman hidrasi via `useEffect`) |
| PWA | Web app manifest dan service worker |
| Deploy | Vercel |

## Struktur Folder

```
habitly/
├── AGENTS.md
├── README.md
├── docs/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # beranda: tugas harian dari tantangan aktif
│   │   ├── onboarding/page.tsx
│   │   ├── quiz/page.tsx
│   │   ├── result/page.tsx
│   │   ├── journal/page.tsx
│   │   ├── progress/page.tsx
│   │   ├── community/page.tsx
│   │   └── help/page.tsx
│   ├── components/
│   │   ├── ui/                      # Button, Card, Input/Textarea, Chip, ProgressBar, BadgeCard
│   │   └── AppShell.tsx             # Sidebar desktop + tab bar mobile (4 tab)
│   ├── content/                     # JSON konten
│   │   ├── quiz.json                # 8 pertanyaan tantangan + 2 pertanyaan keselamatan [PERLU DITINJAU TIM]
│   │   ├── challenges.json          # 8 tantangan (3 aktif, 5 segera hadir)
│   │   ├── challenge_tasks.json     # Tugas harian pendekatan Atomic Habits
│   │   └── badges.json
│   ├── lib/
│   │   ├── storage.ts               # Pembungkus localStorage
│   │   ├── scoring.ts               # Perhitungan profil dan batas keselamatan
│   │   ├── recommend.ts             # Algoritma rekomendasi tantangan
│   │   ├── streak.ts                # Logika streak dan hari aktif
│   │   ├── badges.ts                # Evaluasi lencana
│   │   └── seed.ts                  # Data demo untuk presentasi
│   └── types/index.ts
```

## Logika Utama

### 1. Kuis Penilaian Diri (8 Pertanyaan Tantangan + 2 Pertanyaan Keselamatan)

- 8 pertanyaan tantangan berskala 0-3 (0: Tidak pernah, 1: Kadang-kadang, 2: Sering, 3: Hampir selalu).
- Total skor tantangan: 0 - 24.
- 2 pertanyaan keselamatan di akhir (merasa tidak aman atau ditekan orang lain), TIDAK ikut dihitung dalam total skor.
- **Profil netral (bukan diagnosis):**
  - `0 - 8` : **Hambatan Ringan**
  - `9 - 16`: **Hambatan Sedang**
  - `17 - 24`: **Hambatan Cukup Terasa**
- Jika total >= 17 ATAU jawaban keselamatan menandakan masalah, set `suggestHelp = true` dan tampilkan anjuran bicara dengan orang dewasa tepercaya atau profesional kesehatan mental, serta tautan ke halaman Bantuan.

### 2. Rumus Rekomendasi Tantangan (`lib/recommend.ts`)

Untuk setiap tantangan $i$ ($i = 1..8$):
- $\text{kebutuhan}_i = \frac{\text{skor}_i}{3}$
- $\text{tingkat\_umum} = \frac{\text{total\_skor}}{8 \times 3} = \frac{\text{total\_skor}}{24}$
- $\text{penalti}_i = 0.3 \times \text{tingkat\_umum} \times \frac{\text{kesulitan}_i - 1}{2}$
- $\text{nilai}_i = \text{kebutuhan}_i - \text{penalti}_i$

**Aturan pemeringkatan:**
1. Urutkan secara menurun berdasarkan $\text{nilai}_i$.
2. Jika seri: dahulukan tantangan dengan tingkat kesulitan lebih rendah, lalu nomor urut tantangan terkecil.
3. Tantangan *Hubungan Sehat* (kesulitan 3) hanya boleh direkomendasikan jika pengguna sudah pernah menyelesaikan minimal 1 tantangan sebelumnya (`completedChallengeIds.length >= 1`).
4. Ambil 3 tantangan teratas:
   - Peringkat 1: "Mulai dari sini"
   - Peringkat 2 & 3: "Bisa kamu coba berikutnya"
5. Hanya tantangan yang memiliki konten aktif di prototipe (`available: true`) yang dapat dimulai; tantangan "Segera hadir" tetap ditampilkan tetapi tidak menjadi tombol utama mulai.
