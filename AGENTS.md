# AGENTS.md: Habitly: Latihan Kebiasaan Kecil untuk Remaja yang Ingin Lebih Percaya Diri Berkomunikasi

Titik masuk untuk AI agent. Baca file ini dulu, lalu buka dokumen di `docs/` sesuai tugas. Jika ada konflik antar dokumen, `docs/PRD.md` dan file ini yang berlaku. Terakhir diperbarui: 7 November 2026.

## Ringkasan

**Habitly: Latihan Kebiasaan Kecil untuk Remaja yang Ingin Lebih Percaya Diri Berkomunikasi** adalah aplikasi web mobile-first (PWA) berbasis **Next.js** untuk remaja yang ingin membangun rasa percaya diri dalam berkomunikasi sehari-hari. Fokus produk sepenuhnya pada **keterampilan komunikasi** praktis di lingkungan nyata (sekolah, kelas, pertemanan, organisasi) tanpa menggunakan label diagnosis klinis.

Pengguna dipandu lewat latihan kebiasaan kecil harian (pendekatan *Atomic Habits*): kuis refleksi kebutuhan komunikasi, rekomendasi tantangan personal, micro-task harian bertingkat dengan jurnal refleksi, pelacakan progres konsistensi (statistik, lencana), dan ruang dukungan yang aman.

Pembeda: aplikasi motivasi dan habit tracker yang ada berhenti pada motivasi pasif. Habitly memberi **tindakan kecil yang spesifik, bertingkat, dan terukur**. Semua tantangan HANYA tentang komunikasi.

Proyek ini dibuat untuk **Hackathon FIRETECH 2026** (tema: *Harmonizing Tech and Humanity: Creating Solutions for a Better Society*).

## Tech Stack

- **Next.js** (App Router) dengan **TypeScript**.
- **Tailwind CSS** untuk seluruh gaya. Pakai kelas semantik dari token di `docs/DESIGN.md` (mis. `bg-canvas`, `text-ink`, `bg-action`), bukan nilai hex mentah atau CSS inline.
- Font **Plus Jakarta Sans** lewat `next/font/google`.
- Grafik: **Recharts**. Ikon: gaya garis (mis. Lucide).
- Penyimpanan prototipe: localStorage/IndexedDB. Deploy: Vercel.
- **Cek versi Tailwind di `package.json` sebelum menulis konfigurasi.** Tailwind v3 memakai `tailwind.config.ts`; Tailwind v4 memakai blok `@theme` di `globals.css`. Ikuti cara yang sesuai versi terpasang (keduanya ada di `docs/DESIGN.md` bagian 10).

Detail lengkap ada di `docs/TECH_SPEC.md`.

## Peta Dokumen

| File | Isi | Buka bila |
|---|---|---|
| `docs/COMPETITION.md` | Aturan lomba, jadwal, kriteria penilaian, demo 7 menit, risiko | Perlu konteks lomba atau menyiapkan demo |
| `docs/PRD.md` | Masalah, pengguna, prinsip, alur, daftar fitur dan prioritas | Memutuskan apa yang dibangun |
| `docs/TECH_SPEC.md` | Stack Next.js, struktur folder, logika skor/rekomendasi/streak | Menulis kode |
| `docs/DATA_MODEL.md` | Tipe data TypeScript | Membuat model dan penyimpanan |
| `docs/CONTENT_CHALLENGES.md` | Jalur, tingkat, micro-task, jurnal, lencana | Mengisi konten JSON |
| `docs/SAFETY_ETHICS.md` | Disclaimer, rujukan bantuan, privasi, komunitas | Fitur sensitif apa pun |
| `docs/UI_GUIDELINES.md` | Gaya bahasa, prinsip UI, daftar layar | Membangun antarmuka |
| `docs/DESIGN.md` | Palet warna, tipografi, komponen, token Tailwind, Do dan Don't | Membuat atau mengubah tampilan apa pun |
| `docs/TASKS.md` | Rencana kerja per fase (setup, UI, kuis, beranda, progres, deploy, demo) | Menentukan apa yang dikerjakan berikutnya |
| `docs/DECISIONS.md` | Keputusan yang sudah diambil dan pertanyaan terbuka | Ragu atau menemukan konflik |

## Aturan Lomba yang Tidak Boleh Dilanggar

- Dilarang memakai prototipe atau kode utuh yang pernah dibuat atau dilombakan sebelumnya. **Hanya setup awal proyek yang diperbolehkan** (`create-next-app`, konfigurasi Tailwind, folder kosong).
- Fitur inti ditulis dari nol saat hackathon. Jangan menyalin proyek lain. Dokumentasi resmi dan pola umum boleh jadi referensi.
- Pelanggaran administrasi atau etika dapat berakibat diskualifikasi.

## Aturan Kerja untuk Agent

1. **Ikuti cakupan.** Usulkan fitur tambahan sebagai saran, jangan langsung mengerjakannya.
2. **Jangan mengarang** data, statistik, kontak layanan, atau klaim klinis. Tandai `[PERLU SUMBER]` atau `[PERLU VERIFIKASI]`.
3. **Jangan menyalin kode utuh** dari proyek lain.
4. **Tanyakan dulu** jika instruksi ambigu atau berpotensi melanggar aturan lomba atau etika.
5. **Kerjakan bertahap:** P0 dulu, selesaikan satu fitur sampai berjalan sebelum pindah.
6. **Kode bersih:** TypeScript ketat, komponen kecil, nama jelas, README singkat, komentar seperlunya.
7. **Catat keputusan penting** di `docs/DECISIONS.md` agar tim bisa menjawab juri.
8. **Uji alur P0** dari awal sampai akhir sebelum menyatakan selesai.
9. **Semua UI wajib mengikuti `docs/DESIGN.md`.** Baca sebelum membuat atau mengubah komponen; jangan pakai warna, font, atau spasi di luar token yang ada.
10. **Tulis dalam Bahasa Indonesia** kecuali diminta lain; istilah teknis boleh tetap dalam bahasa Inggris.

## Definisi Selesai (Prototipe)

- Seluruh kebutuhan P0 berjalan dari awal sampai akhir di tampilan ponsel.
- Dapat dibuka dari tautan Vercel dan berjalan dengan data contoh tanpa bergantung pada jaringan.
- Disclaimer, anjuran bantuan, dan privasi jurnal terpasang.
- README menjelaskan cara menjalankan; source code diunggah sebelum batas waktu.
- Alur demo sudah dilatih.
