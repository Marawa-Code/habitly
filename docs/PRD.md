# PRD: Habitly

Versi 0.2, 20 Oktober 2026. Platform: aplikasi web mobile-first (PWA) berbasis Next.js.

## Masalah

Remaja yang cemas secara sosial cenderung menghindari situasi komunikasi (bicara di kelas, memulai percakapan, bergaul). Semakin dihindari, semakin sulit dihadapi. Langkah pertama terasa terlalu besar dan tidak jelas.

**Kesenjangan:** aplikasi motivasi dan habit tracker umum tidak memandu latihan bertahap yang spesifik untuk kecemasan sosial.

**Catatan data:** jangan mengarang statistik. Tandai `[PERLU SUMBER]` dan minta tim memverifikasi dari sumber resmi.

## Pengguna

- **Rani, 15 tahun, pelajar.** Pendiam, takut ditertawakan saat bicara di kelas, menghindari kerja kelompok. Tidak suka aplikasi yang terasa seperti "terapi".
- **Dika, 19 tahun, mahasiswa baru.** Sulit memulai percakapan dengan teman baru dan ragu bertanya di perkuliahan. Ingin kebiasaan kecil tanpa tekanan.

## Prinsip Produk

1. **Tindakan, bukan motivasi.** Setiap hari ada satu tugas kecil yang jelas.
2. **Kecil dan bertahap.** Tugas selesai dalam beberapa menit, naik tingkat perlahan, selalu ada "versi lebih ringan".
3. **Tidak menghukum.** Melewatkan sehari tidak menghapus progres. Tidak ada peringkat atau perbandingan antar pengguna.
4. **Aman dan jujur.** Alat bantu latihan, bukan terapi dan bukan diagnosis.
5. **Hangat dan sederhana.** Bahasa Indonesia santai, tidak menghakimi, tanpa istilah klinis.

## Tujuan

- **T1.** Mengubah niat menjadi tindakan komunikasi kecil setiap hari.
- **T2.** Jalur latihan yang naik tingkat bertahap sesuai kondisi pengguna.
- **T3.** Progres yang terlihat (statistik, lencana).
- **T4.** Prototipe stabil dan mudah didemokan dalam 7 menit.

## Alur Utama

1. Onboarding dan disclaimer, lalu persetujuan.
2. Kuis penilaian diri (5-8 pertanyaan).
3. Hasil kuis: profil hambatan dan tingkat awal (bukan diagnosis).
4. Rekomendasi jalur tantangan.
5. Beranda: satu micro-task hari ini, tandai selesai (atau ganti ke versi lebih ringan).
6. Jurnal refleksi singkat setelah tugas.
7. Progres: streak, total tugas, tren skor kuis, lencana.
8. Naik tingkat setelah beberapa tugas selesai.
9. Komunitas (opsional).

## Kebutuhan Fungsional

Prioritas: **P0** wajib di prototipe, **P1** jika waktu cukup, **P2** hanya dijelaskan sebagai rencana.

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-01 | Layar pembuka dan disclaimer bahwa Habitly bukan pengganti tenaga profesional | P0 |
| F-02 | Persetujuan disclaimer dan kebijakan privasi singkat sebelum lanjut | P0 |
| F-03 | Nama panggilan atau avatar tanpa data identitas asli | P1 |
| F-04 | Kuis 5-8 pertanyaan berskala | P0 |
| F-05 | Hitung skor dengan aturan sederhana, hasilkan profil dan tingkat awal | P0 |
| F-06 | Skor tinggi: tampilkan anjuran bicara dengan orang dewasa tepercaya atau tenaga profesional, tanpa label diagnosis | P0 |
| F-07 | Ulang kuis dan bandingkan skor dari waktu ke waktu | P1 |
| F-08 | Rekomendasi satu jalur tantangan (rule-based) | P0 |
| F-09 | Ganti jalur tantangan | P1 |
| F-10 | Satu micro-task per hari sesuai jalur dan tingkat | P0 |
| F-11 | Tandai selesai atau ganti dengan versi lebih ringan | P0 |
| F-12 | Minimal 3 tingkat kesulitan | P0 |
| F-13 | Pengingat harian (dukungan notifikasi PWA terbatas, terutama iOS) | P2 |
| F-14 | Jurnal refleksi terpandu setelah tugas | P0 |
| F-15 | Jurnal privat, hanya terlihat pemiliknya | P0 |
| F-16 | Riwayat jurnal | P1 |
| F-17 | Tampilkan streak, total tugas selesai, tingkat saat ini | P0 |
| F-18 | Grafik tren skor kuis | P0 |
| F-19 | Lencana berbasis aturan | P0 |
| F-20 | Streak tidak menghukum (toleransi 1 hari terlewat) | P1 |
| F-21 | Bagikan pencapaian secara anonim | P1 |
| F-22 | Dukungan komunitas hanya berupa pesan terpilih (kartu atau emoji), tanpa teks bebas | P1 |
| F-23 | Moderasi dan pelaporan | P2 |
| F-24 | Layar "Butuh bantuan?" dengan anjuran bantuan profesional dan kontak yang diverifikasi tim | P0 |
| F-25 | Deteksi kata kunci bahaya di jurnal, tampilkan pesan peduli dan arahkan ke bantuan | P1 |

## Di Luar Cakupan

Jangan dikerjakan tanpa persetujuan tim:

- Chat bebas antar pengguna tanpa moderasi.
- Fitur AI generatif yang memberi saran kesehatan mental atau menyerupai terapi.
- Diagnosis atau label klinis.
- Pembayaran, monetisasi, integrasi pihak ketiga yang rumit.
- Peringkat atau papan skor antar pengguna.

## Metrik (Hipotesis)

| Metrik | Cara ukur |
|---|---|
| Penyelesaian tugas harian | Tugas selesai dibagi tugas diberikan |
| Konsistensi | Jumlah hari aktif berturut-turut |
| Perubahan skor kuis | Skor kuis ulang dibanding skor awal |
| Kelanjutan tingkat | Persentase pengguna naik tingkat |

Untuk prototipe, metrik ditampilkan sebagai rencana pengukuran dan data demo, bukan klaim hasil nyata.
