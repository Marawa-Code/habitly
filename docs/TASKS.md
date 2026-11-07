# TASKS.md: Rencana Kerja Habitly

Daftar tugas berurutan per fase. Kerjakan berurutan; jangan lompat ke fase berikutnya sebelum "Selesai bila" terpenuhi. Centang `[x]` saat tugas selesai dan perbarui status di bagian 3.

Terakhir diperbarui: 20 Oktober 2026.

## 0. Cara Membaca

- **Fase 0-9** adalah urutan pengerjaan. Jangan dibingung dengan **P0/P1/P2** pada `docs/PRD.md`, yang adalah prioritas fitur. Satu fase bisa berisi fitur dengan prioritas berbeda.
- **ID F-xx** menunjuk ke kebutuhan di `docs/PRD.md`.
- **Estimasi waktu** hanya perkiraan kasar dan bergantung pada kecepatan tim. Sesuaikan setelah studi kasus diumumkan.
- **Aturan lomba:** hanya setup awal proyek yang boleh disiapkan sebelum hackathon (Fase 0). Fitur inti (Fase 1 ke atas) ditulis dari nol saat lomba, 7-8 November 2026. Jangan memakai kode utuh dari proyek lain.

## 1. Ringkasan Fase

| Fase | Nama | Kapan | Prioritas fitur terkait | Perkiraan porsi waktu |
|---|---|---|---|---|
| 0 | Setup proyek | Sebelum hackathon | Fondasi | n/a (disiapkan lebih dulu) |
| 1 | Fondasi UI dan layout | Hari-H, awal | Fondasi | 10% |
| 2 | Onboarding, kuis, hasil | Hari-H | P0 | 15% |
| 3 | Beranda: tugas harian dan jurnal | Hari-H | P0 | 20% |
| 4 | Progres: streak, grafik, lencana | Hari-H | P0 | 15% |
| 5 | Bantuan dan keselamatan | Hari-H | P0 | 5% |
| 6 | Komunitas | Hari-H, jika waktu cukup | P1 | 10% |
| 7 | PWA, polesan, dan deploy | Hari-H, sore | P0/P1 | 10% |
| 8 | Demo dan pengumpulan | Sebelum batas waktu | P0 | 10% |
| 9 | Adaptasi studi kasus | Jika diperlukan | n/a | Cadangan |

Garis potong: bila waktu mepet, **selesaikan Fase 1-5 dan 7-8 lebih dulu**. Fase 6 (komunitas) dan semua tugas P1/P2 adalah yang pertama dikorbankan.

## 2. Rincian Tugas

### Fase 0: Setup proyek (boleh disiapkan sebelum hackathon)

Tujuan: kerangka kosong yang siap dipakai. Tidak ada fitur.

- [ ] Buat repositori Git dan undang seluruh anggota tim.
- [ ] Inisialisasi proyek: `create-next-app` (TypeScript, App Router, Tailwind, ESLint, folder `src/`).
- [ ] Cek versi Tailwind di `package.json` (v3 atau v4) dan pasang token dari `docs/DESIGN.md` sesuai versinya.
- [ ] Muat font Plus Jakarta Sans lewat `next/font/google` di `layout.tsx`.
- [ ] Pasang dependensi: Recharts dan pustaka ikon gaya garis (mis. Lucide).
- [ ] Buat struktur folder sesuai `docs/TECH_SPEC.md` (folder kosong dan file placeholder).
- [ ] Salin `AGENTS.md` dan folder `docs/` ke repositori.
- [ ] Hubungkan repositori ke Vercel dan pastikan deploy halaman kosong berhasil.
- [ ] Tulis `README.md` awal (cara menjalankan).
- [ ] Sepakati pembagian peran dan alur Git (cabang per fitur, tinjau sebelum digabung).

**Selesai bila:** `npm run dev` menampilkan halaman kosong berlatar `canvas`, font sudah termuat, dan tautan Vercel aktif.

### Fase 1: Fondasi UI dan layout

Tujuan: cangkang aplikasi dan komponen dasar yang dipakai semua layar.

- [ ] Layout aplikasi: sidebar di desktop, tab bar bawah di mobile (4 tab: Hari Ini, Progres, Komunitas, Bantuan).
- [ ] Komponen dasar: `Button` (utama, sekunder teks, nonaktif), `Card`, `Input/Textarea`, `Chip`, `ProgressBar`, `Badge`.
- [ ] Pembungkus penyimpanan lokal `lib/storage.ts` (client-side, aman dari masalah hidrasi).
- [ ] Muat data statis awal dari `src/content/*.json` (kuis, jalur, tugas, lencana).
- [ ] Data contoh (seed) dan mode demo untuk presentasi.

**Selesai bila:** semua komponen dasar tampil sesuai `docs/DESIGN.md` dan navigasi antar tab berjalan (halaman boleh masih kosong).

### Fase 2: Onboarding, kuis, hasil

Kebutuhan: F-01, F-02, F-04, F-05, F-06, F-08 (F-03, F-07 jika waktu cukup).

- [ ] Layar pembuka dan disclaimer, dengan persetujuan wajib sebelum lanjut.
- [ ] Kuis: satu pertanyaan per layar, progres "n dari 6", tombol kembali.
- [ ] `lib/scoring.ts`: hitung skor total dan profil netral (`ringan`/`sedang`/`tinggi`) serta `suggestHelp`.
- [ ] Layar hasil: profil ramah (tanpa diagnosis), anjuran bantuan jika skor tinggi.
- [ ] `lib/recommend.ts`: tentukan jalur tantangan dan tingkat awal.
- [ ] Simpan hasil kuis ke penyimpanan lokal.

**Selesai bila:** pengguna bisa melewati onboarding, mengisi kuis, melihat hasil, dan mendapat jalur serta tingkat awal yang tersimpan.

### Fase 3: Beranda, tugas harian, dan jurnal (dashboard)

Kebutuhan: F-10, F-11, F-12, F-14, F-15 (F-16 jika waktu cukup).

- [ ] Beranda "Hari Ini": sapaan, kartu tugas harian, chip streak, kartu "Perjalananmu".
- [ ] Logika memilih satu tugas per hari sesuai jalur dan tingkat.
- [ ] Tombol "Sudah kulakukan" dan "Pakai versi lebih ringan".
- [ ] Kondisi tugas selesai (kartu berwarna `mint-tint`, pesan hangat).
- [ ] Layar jurnal refleksi terpandu, catatan privasi, simpan lokal.
- [ ] Logika naik tingkat setelah N tugas selesai (usulan N = 5).

**Selesai bila:** satu siklus lengkap berjalan: lihat tugas, selesaikan atau ganti ke versi ringan, isi jurnal, kembali ke beranda dengan status selesai.

### Fase 4: Progres: streak, grafik, lencana

Kebutuhan: F-17, F-18, F-19 (F-20 jika waktu cukup).

- [ ] `lib/streak.ts`: hitung hari berturut-turut (toleransi 1 hari bila sempat).
- [ ] Halaman Progres: statistik (tugas selesai, streak, tingkat).
- [ ] Grafik tren skor kuis dengan Recharts dan keterangan teks.
- [ ] `lib/badges.ts` dan tampilan lencana (diperoleh dan terkunci).
- [ ] Data demo agar grafik dan lencana langsung terlihat saat presentasi.

**Selesai bila:** halaman Progres menampilkan streak, grafik, dan lencana yang berubah sesuai aktivitas.

### Fase 5: Bantuan dan keselamatan

Kebutuhan: F-24 (F-25 jika waktu cukup).

- [ ] Layar "Butuh bantuan?" dengan banner `sky-light-tint` dan anjuran bantuan profesional.
- [ ] Pasang kontak layanan **hanya jika sudah diverifikasi tim**; jika belum, gunakan placeholder tanpa nomor.
- [ ] Tautan ke layar bantuan dari hasil kuis tinggi dan dari tab Bantuan.
- [ ] (P1) Deteksi kata kunci bahaya di jurnal dan tampilkan pesan peduli.

**Selesai bila:** layar bantuan bisa dicapai dari tab, hasil kuis tinggi, dan tidak berisi nomor yang belum diverifikasi.

### Fase 6: Komunitas (P1, hanya jika waktu cukup)

Kebutuhan: F-21, F-22 (F-23 hanya dijelaskan sebagai rencana).

- [ ] Halaman Komunitas dengan 4-5 kartu dukungan terpilih (tanpa teks bebas).
- [ ] Aksi "Kirim dukungan" anonim (boleh disimulasikan secara lokal).
- [ ] Catatan: "Semua anonim dan tanpa peringkat."
- [ ] Bagikan pencapaian secara anonim (opsional).

**Selesai bila:** halaman Komunitas berfungsi untuk demo tanpa chat bebas dan tanpa peringkat.

### Fase 7: PWA, polesan, dan deploy

- [ ] Web app manifest dan ikon; service worker sederhana agar alur P0 tetap jalan offline.
- [ ] Periksa seluruh layar di lebar ponsel dan desktop.
- [ ] Periksa aksesibilitas: kontras, area sentuh 44px, fokus keyboard, `prefers-reduced-motion`.
- [ ] Periksa kepatuhan terhadap `docs/DESIGN.md` (token, tanpa gradien/merah/emoji).
- [ ] Rapikan teks: nada hangat, tanpa istilah klinis, tanpa "Lorem ipsum".
- [ ] Deploy ke Vercel dan uji tautan produksi di ponsel sungguhan.

**Selesai bila:** tautan Vercel berjalan mulus di ponsel dan alur P0 berjalan tanpa jaringan stabil.

### Fase 8: Demo dan pengumpulan

- [ ] Siapkan akun/data demo dan alur 7 menit (lihat `docs/COMPETITION.md`).
- [ ] Latih demo minimal dua kali dan siapkan rencana cadangan bila demo bermasalah.
- [ ] Siapkan jawaban Q&A juri (etika, privasi, dampak, keputusan teknis).
- [ ] Rapikan `README.md`: fitur, cara menjalankan, tautan prototipe, anggota tim.
- [ ] **Unggah source code dan tautan prototipe sebelum batas waktu** (area dikunci pukul 21.00 WIB).
- [ ] Verifikasi bahwa tautan dan repositori bisa dibuka dari akun lain.

**Selesai bila:** source code dan tautan sudah terunggah, dan tim telah melatih demo.

### Fase 9: Adaptasi studi kasus (jika diperlukan)

Studi kasus baru diumumkan di hari-H. Jika tema berbeda dari kecemasan sosial:

- [ ] Tinjau studi kasus bersama dan putuskan apakah Habitly cukup diadaptasi.
- [ ] Ganti isi `src/content/*.json` (jalur, tugas, kuis, lencana) agar sesuai tema baru.
- [ ] Sesuaikan teks UI dan narasi demo; pertahankan inti: tugas kecil bertahap, jurnal, progres.
- [ ] Catat keputusan di `docs/DECISIONS.md`.

## 3. Status dan Pembagian Peran

Isi saat hackathon. Sesuaikan dengan jumlah anggota (3-5 orang).

| Peran | Fokus | Nama | Fase utama |
|---|---|---|---|
| UI | Komponen, layout, kepatuhan desain | | 1, 7 |
| Logika dan data | Skor, rekomendasi, streak, lencana, penyimpanan | | 2, 3, 4 |
| Fitur | Kuis, beranda, jurnal, bantuan, komunitas | | 2, 3, 5, 6 |
| Konten dan presentasi | Konten tantangan, naskah demo, Q&A | | 8, 9 |

| Fase | Status | Penanggung jawab | Catatan |
|---|---|---|---|
| 0 | Belum | | |
| 1 | Belum | | |
| 2 | Belum | | |
| 3 | Belum | | |
| 4 | Belum | | |
| 5 | Belum | | |
| 6 | Belum | | |
| 7 | Belum | | |
| 8 | Belum | | |
| 9 | Belum | | |

## 4. Titik Pemeriksaan

- **Pemeriksaan 1:** akhir Fase 1. Kerangka dan komponen berjalan.
- **Pemeriksaan 2:** akhir Fase 3. Alur inti dari kuis sampai jurnal berjalan.
- **Pemeriksaan 3:** akhir Fase 5. Seluruh fitur P0 selesai; putuskan apakah Fase 6 dikerjakan.
- **Pemeriksaan 4:** sebelum batas unggah. Deploy, demo, dan pengumpulan siap.

Di setiap titik, uji alur dari awal sampai akhir sebelum melanjutkan.

## 5. Aturan Kerja

- Satu fitur selesai dan teruji sebelum pindah ke fitur lain.
- Jangan menambah fitur di luar cakupan `docs/PRD.md` tanpa persetujuan tim.
- Setiap keputusan teknis penting dicatat di `docs/DECISIONS.md`.
- Tandai `[PERLU SUMBER]` atau `[PERLU VERIFIKASI]` untuk data, statistik, atau kontak yang belum pasti.
