# Habitly

Aplikasi web mobile-first (PWA) untuk remaja dengan kecemasan sosial dan hambatan komunikasi. Dibuat untuk **Hackathon FIRETECH 2026**.

## Tentang

Habitly membantu remaja membangun rasa percaya diri berkomunikasi lewat latihan kebiasaan kecil harian (pendekatan *Atomic Habits*): kuis penilaian diri, rekomendasi tantangan personal, micro-task harian dengan jurnal refleksi, dan pelacakan progres.

> **Disclaimer:** Habitly adalah alat bantu latihan, bukan pengganti psikolog atau tenaga profesional.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Recharts** (grafik progres)
- **Lucide React** (ikon)
- Penyimpanan: `localStorage`
- Deploy: Vercel

## Cara Menjalankan

```bash
# Install dependensi
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

```bash
# Build produksi
npm run build
npm run start
```

## Struktur Folder

```
src/
├── app/           # Halaman (App Router)
├── components/    # Komponen UI
├── content/       # Konten JSON (kuis, jalur, tugas, lencana)
├── lib/           # Logika bisnis (scoring, storage, streak, badges)
└── types/         # TypeScript types
```

## Fitur

- Onboarding dan disclaimer
- Kuis penilaian diri (6 pertanyaan)
- Rekomendasi jalur tantangan personal
- Micro-task harian dengan versi lebih ringan
- Jurnal refleksi terpandu (privat)
- Progres: streak, grafik tren skor, lencana
- Halaman bantuan dan rujukan profesional

## Tim

<!-- Isi nama anggota tim -->

## Prototipe

<!-- Isi tautan Vercel setelah deploy -->
