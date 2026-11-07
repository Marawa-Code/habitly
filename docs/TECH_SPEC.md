# Tech Spec: Habitly

Keputusan tim: **Next.js**. Konfirmasi dengan tim sebelum mengganti.

## Stack

| Bagian | Pilihan |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Tampilan | Tailwind CSS, komponen siap pakai (mis. shadcn/ui) |
| Grafik | Recharts |
| Penyimpanan prototipe | localStorage atau IndexedDB; Supabase atau Firebase hanya jika butuh akun dan data bersama |
| PWA | Web app manifest dan service worker agar bisa dipasang ke layar utama dan alur P0 tetap jalan saat sinyal buruk |
| Deploy | Vercel (tautan prototipe wajib diunggah) |

## Catatan Teknis

- **Client component:** komponen yang membaca atau menulis localStorage/IndexedDB harus ditandai `"use client"`. Jangan mengakses `window` saat render di server.
- **Hidrasi:** muat data dari penyimpanan lokal di `useEffect` agar tidak terjadi ketidakcocokan hidrasi.
- **Demo tanpa jaringan:** alur P0 tidak boleh bergantung pada API eksternal. Sediakan data contoh (seed) dan mode demo.
- **Konten modular:** tugas, kuis, dan lencana disimpan sebagai JSON terpisah dari kode agar mudah diganti jika studi kasus hari-H berbeda.
- **Mobile-first:** lebar ponsel sebagai acuan utama; target sentuh cukup besar.
- **Notifikasi:** jangan menjanjikan notifikasi yang andal. Tulis sebagai rencana (P2).

## Struktur Folder

```
habitly/
├── AGENTS.md
├── README.md
├── docs/
├── public/
│   ├── manifest.webmanifest
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # beranda: tugas hari ini
│   │   ├── onboarding/page.tsx
│   │   ├── quiz/page.tsx
│   │   ├── result/page.tsx
│   │   ├── task/[id]/page.tsx
│   │   ├── journal/page.tsx
│   │   ├── progress/page.tsx
│   │   ├── community/page.tsx
│   │   └── help/page.tsx
│   ├── components/
│   ├── content/                     # JSON konten
│   │   ├── quiz.json
│   │   ├── paths.json
│   │   ├── tasks.json
│   │   └── badges.json
│   ├── lib/
│   │   ├── storage.ts               # pembungkus penyimpanan lokal
│   │   ├── scoring.ts               # skor kuis dan profil
│   │   ├── recommend.ts             # pilih jalur dan tugas
│   │   ├── streak.ts
│   │   └── badges.ts
│   └── types/index.ts
```

## Logika Utama

### Skor kuis (usulan, perlu ditinjau tim)

- 6 pertanyaan, tiap pertanyaan berskala 0-3 (tidak pernah, kadang, sering, hampir selalu).
- Total 0-18. Contoh label netral: 0-6 `ringan`, 7-12 `sedang`, 13-18 `tinggi`.
- Jika `tinggi`, set `suggestHelp = true` dan tampilkan anjuran bicara dengan orang dewasa tepercaya atau tenaga profesional.
- **Penting:** bukan alat diagnosis, dan batas skor belum divalidasi secara klinis. Jelaskan itu di UI dan proposal. Idealnya ditinjau konselor atau psikolog.

### Rekomendasi jalur dan tugas

- Pilih jalur berdasarkan pertanyaan dengan skor tertinggi (memulai percakapan, bicara di kelas, kerja kelompok).
- Tingkat awal diturunkan dari total skor (skor tinggi mulai dari tingkat lebih rendah).
- Naik tingkat setelah N tugas selesai di tingkat itu (usulan: 5). Jika pengguna sering memakai versi ringan, tahan di tingkat yang sama.

### Streak

- Hitung hari berturut-turut dengan tugas selesai.
- Toleransi 1 hari terlewat tanpa mereset total (P1). Tampilkan pesan dukungan, bukan peringatan.

### Lencana

Aturan didefinisikan di `src/content/badges.json` (contoh di `docs/CONTENT_CHALLENGES.md`) dan dievaluasi oleh `lib/badges.ts`.
