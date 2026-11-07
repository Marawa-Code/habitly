# PRD: Habitly: Latihan Kebiasaan Kecil untuk Remaja yang Ingin Lebih Percaya Diri Berkomunikasi

Versi 0.3, 7 November 2026. Platform: aplikasi web mobile-first (PWA) berbasis Next.js.

## Masalah

Remaja sering kali merasa canggung, ragu, atau kurang percaya diri dalam situasi komunikasi sehari-hari (menyapa orang baru, berbicara di kelas, mengobrol dengan lawan jenis, menyatakan pendapat, atau menolak ajakan). Tanpa latihan bertahap, mereka cenderung menghindar, sehingga rasa canggung semakin menetap.

**Kesenjangan:** Aplikasi motivasi atau habit tracker umum hanya mencatat target tanpa memberikan panduan tindakan komunikasi spesifik, sementara layanan konseling formal sering kali terasa terlalu berat atau intimidatif bagi remaja yang hanya ingin melatih rasa percaya diri sehari-hari.

**Positioning Produk:**
- Habitly adalah alat bantu latihan kebiasaan komunikasi praktis, **BUKAN terapi atau diagnosis medis**.
- Tidak menggunakan istilah diagnosis atau label klinis.
- Seluruh 8 tantangan fokus murni pada keterampilan komunikasi sehari-hari di lingkungan sekolah, kelas, dan pertemanan.
- Tugas tantangan dibingkai sopan dan etis (bukan PDKT/romantis, bukan menghubungi orang asing/internet).

## Pengguna

- **Rani, 15 tahun, pelajar.** Pendiam, canggung saat harus menyapa teman baru atau berbicara di depan kelas. Tidak suka aplikasi yang terasa kaku atau berbau "klinis".
- **Dika, 19 tahun, mahasiswa baru.** Canggung saat harus mengobrol dengan teman sekelompok (termasuk lawan jenis) dan ragu menyampaikan pendapat dalam diskusi. Ingin kebiasaan kecil tanpa tekanan.

## Prinsip Produk

1. **Tindakan komunikasi, bukan sekadar motivasi.** Setiap hari ada satu tugas komunikasi kecil yang jelas.
2. **Kecil dan bertahap (Atomic Habits).** Tugas selesai dalam hitungan menit, naik tingkat perlahan, selalu ada "versi lebih ringan".
3. **Tanpa pendekatan romantis atau kontak asing.** Latihan dilakukan di lingkungan yang sudah dikenal (sekolah, kelas, kampus, kegiatan kelompok).
4. **Tidak menghukum.** Melewatkan sehari tidak menghapus progres. Tidak ada perbandingan atau kompetisi antar pengguna.
5. **Aman, jujur, dan netral.** Tanpa klaim klinis atau penyembuhan.
6. **Bahasa hangat dan santai.** Menggunakan bahasa Indonesia yang bersahabat bagi remaja ("kamu"), netral, tanpa prasangka.

## Tujuan

- **T1.** Mengubah niat berkomunikasi menjadi tindakan nyata lewat micro-task harian.
- **T2.** Menghadirkan 8 tantangan komunikasi modular bertingkat (Pemula, Menengah, Lanjutan).
- **T3.** Memperlihatkan perkembangan nyata (konsistensi harian, streak, lencana).
- **T4.** Prototipe stabil, interaktif, dan mudah didemokan dalam 7 menit.

## Delapan Tantangan Komunikasi

1. **Menjadi Pendengar yang Baik** (14 hari, Pemula 1) - Mendengarkan aktif dan penuh perhatian tanpa terburu-buru memikirkan respon.
2. **Menyapa Orang Baru** (14 hari, Pemula 1) [Tersedia di Prototipe] - Membiasakan senyum ramah, kontak mata santai, dan sapaan wajar pada teman baru di sekolah/kampus.
3. **Ngobrol dengan Lawan Jenis** (14 hari, Menengah 2) [Tersedia di Prototipe] - Percakapan sopan, wajar, dan tenang dalam interaksi belajar atau organisasi dengan teman lawan jenis tanpa unsur romantis.
4. **Ngobrol dengan Orang yang Mulai Dekat** (14 hari, Menengah 2) [Tersedia di Prototipe] - Membuka obrolan santai seputar minat, hobi, dan keseharian dengan teman yang mulai akrab di lingkungan sekitar.
5. **Berbicara di Depan Umum** (21 hari, Menengah 2) - Melatih ketenangan suara dan keberanian saat presentasi atau berbicara di depan kelompok.
6. **Bertanya dan Menjawab di Kelas** (7 hari, Pemula 1) - Membangun keberanian mengangkat tangan, bertanya, dan menjawab dalam sesi belajar di kelas.
7. **Bilang Tidak** (7 hari, Pemula 1) - Menegakkan batasan diri dan menolak ajakan dengan sopan tanpa beban rasa bersalah.
8. **Menyampaikan Pendapat dengan Sopan** (14 hari, Lanjutan 3) - Mengemukakan pandangan pribadi dan perbedaan opini secara tenang, runtut, dan santun.

## Alur Utama

1. Onboarding dan disclaimer, lalu persetujuan wajib.
2. Kuis refleksi kebutuhan komunikasi (8 pertanyaan tantangan + 2 pertanyaan keselamatan).
3. Hasil kuis: profil netral (ringan/sedang/tinggi) dan anjuran bantuan jika skor tinggi.
4. Rekomendasi 3 tantangan terbaik berdasarkan rumus kebutuhan dan penalti kesulitan.
5. Beranda: satu micro-task harian (Atomic Habits: pemicu, tindakan, versi ringan, kalimat identitas).
6. Jurnal refleksi singkat setelah tugas (privat).
7. Progres: streak, total tugas, tren skor kuis, lencana.
8. Komunitas aman berbasis pesan dukungan terpilih (anonim, tanpa teks bebas).

## Kebutuhan Fungsional

Prioritas: **P0** wajib di prototipe, **P1** jika waktu cukup, **P2** hanya dijelaskan sebagai rencana.

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-01 | Layar pembuka dan disclaimer bahwa Habitly bukan pengganti tenaga profesional | P0 |
| F-02 | Persetujuan disclaimer dan kebijakan privasi singkat sebelum lanjut | P0 |
| F-03 | Nama panggilan atau avatar tanpa data identitas asli | P1 |
| F-04 | Kuis 8 pertanyaan tantangan berskala 0-3 ditambah 2 pertanyaan keselamatan | P0 |
| F-05 | Hitung skor 0-24, hasilkan profil netral (ringan/sedang/tinggi) | P0 |
| F-06 | Skor tinggi (>=17) atau penanda keselamatan: tampilkan anjuran bicara dengan orang dewasa tepercaya atau tenaga profesional | P0 |
| F-07 | Ulang kuis dan bandingkan skor dari waktu ke waktu | P1 |
| F-08 | Rekomendasi 3 tantangan terbaik dengan algoritma pembobotan kesulitan | P0 |
| F-09 | Jelajahi dan pilih 8 tantangan terarah | P1 |
| F-10 | Satu micro-task per hari berpendekatan Atomic Habits (pemicu, aksi, versi ringan, identitas) | P0 |
| F-11 | Tandai selesai atau ganti dengan versi lebih ringan | P0 |
| F-12 | 8 tantangan dengan 3 tingkat kesulitan (Pemula, Menengah, Lanjutan) | P0 |
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
