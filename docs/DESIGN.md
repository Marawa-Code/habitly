# DESIGN.md: Habitly

Sumber kebenaran untuk gaya visual. Semua UI wajib mengikuti file ini. Baca sebelum membuat atau mengubah komponen. Jangan memakai warna, font, radius, atau spasi di luar token di bawah. Jika perlu nilai baru, usulkan dulu ke tim dan perbarui file ini.

Terakhir diperbarui: 20 Oktober 2026.

## 1. Karakter

Segar, tenang, lapang, dan ramah. Seperti ruang belajar yang terang dengan jendela terbuka. Bukan korporat, bukan teknis, bukan kekanak-kanakan. Warna dasar diambil dari tiga pita pastel (mint, biru muda, biru langit) yang dipilih tim.

**Catatan:** hex pada palet merek di bawah adalah perkiraan dari gambar acuan. Jika tim punya kode aslinya, ganti nilainya di bagian ini dan di `tailwind.config.ts`; sisa aturan tidak berubah.

## 2. Warna

### Palet merek (dari acuan tim)

| Token | Hex | Catatan |
|---|---|---|
| `mint` | `#86C5A6` | Aksen utama merek; latar ikon, titik, lencana |
| `mint-tint` | `#E4F3EC` | Latar lembut: tugas selesai, chip streak, item nav aktif |
| `sky-light` | `#A5D4EA` | Aksen sekunder; ilustrasi, pita dekorasi |
| `sky-light-tint` | `#E6F3FA` | Latar info dan bantuan |
| `sky` | `#5BB5E0` | Progres dan grafik |

### Warna fungsional (netral dan aksi)

| Token | Hex | Dipakai untuk |
|---|---|---|
| `canvas` | `#F6FAF9` | Latar halaman |
| `surface` | `#FFFFFF` | Kartu, input, sidebar, tab bar |
| `hairline` | `#DDE7E4` | Border dan pemisah 1px |
| `ink` | `#1E2B2A` | Judul dan teks isi (bukan hitam murni) |
| `ink-secondary` | `#52625F` | Keterangan dan teks pendukung |
| `ink-faint` | `#8A9895` | Placeholder dan metadata (bukan untuk teks penting) |
| `action` | `#2F7A5C` | Tombol utama, tautan, fokus, penanda aktif |
| `action-pressed` | `#25634A` | Tombol saat ditekan |
| `info-text` | `#2A5670` | Teks di atas `sky-light-tint` |

### Mengapa ada hijau yang lebih gelap

Mint, biru muda, dan biru langit bersifat pastel, sehingga **teks putih di atasnya tidak terbaca**. Karena itu aksi (tombol, tautan) memakai `action` `#2F7A5C`, yang masih satu keluarga dengan mint. Kontras `action` dengan putih sekitar 5,2:1 (perkiraan; verifikasi dengan alat pemeriksa kontras). Warna pastel hanya untuk latar, aksen, progres, dan dekorasi.

### Warna status (tanpa merah)

| Makna | Perlakuan |
|---|---|
| Berhasil / selesai | `mint-tint` dengan ikon centang `action` |
| Info / bantuan | `sky-light-tint` dengan teks `info-text` |
| Perhatian / terlewat | Netral: `hairline` dan `ink-secondary`, bahasa lembut. Jangan pakai merah atau kuning peringatan |
| Terkunci | `hairline` dan `ink-faint` |

### Aturan warna

- Hanya `action` yang boleh mewarnai tombol utama dan tautan.
- Jangan menaruh teks putih di atas `mint`, `sky-light`, atau `sky`.
- Jangan memakai ketiga warna merek pada saturasi penuh dalam satu elemen.
- Dilarang: gradien (terutama ungu-biru), neon, warna merah, dan warna baru di luar tabel ini.
- Teks tidak pernah hanya dibedakan lewat warna; sertakan ikon atau label.

## 3. Tipografi

Satu keluarga font: **Plus Jakarta Sans** (Google Fonts, dimuat dengan `next/font/google`). Cadangan: `system-ui, sans-serif`.

| Token | Ukuran | Bobot | Tinggi baris | Dipakai untuk |
|---|---|---|---|---|
| `display` | 32px (mobile 28px) | 700 | 1.2 | Judul layar besar |
| `heading-1` | 24px | 700 | 1.25 | Judul layar |
| `heading-2` | 20px | 600 | 1.3 | Judul kartu |
| `task` | 24px | 600 | 1.35 | Teks micro-task di kartu tugas |
| `body` | 16px | 400 | 1.5 | Teks isi (minimal 16px) |
| `body-sm` | 14px | 400 | 1.45 | Keterangan |
| `button` | 16px | 600 | 1.25 | Label tombol |
| `eyebrow` | 12px | 600 | 1.3 | Label kecil (jarak huruf +0.4px) |

Prinsip: hierarki jelas lewat ukuran dan bobot, bukan dekorasi. Jangan memakai jarak huruf negatif yang agresif. Jangan memakai huruf kapital semua untuk kalimat.

## 4. Spasi, Bentuk, dan Kedalaman

- **Basis spasi:** 8px. Token: 4, 8, 12, 16, 24, 32, 48, 64.
- **Padding kartu:** 24px (mobile 20px). Jarak antar blok besar: 32-48px.
- **Radius:** `input` 8px, `card` 12px, `container` 16px, `pill` 9999px (tombol utama, chip, badge).
- **Kedalaman:** border 1px `hairline` sebagai default. Bayangan hanya sangat tipis: `0 1px 2px rgba(30,43,42,0.04), 0 4px 12px rgba(30,43,42,0.04)`. Modal: `0 12px 32px rgba(30,43,42,0.10)`.
- **Lapang:** whitespace adalah pengelompok utama. Hindari grid kartu seragam; beri satu elemen fokus per layar.

## 5. Tata Letak dan Responsif

Habitly adalah aplikasi web mobile-first yang juga nyaman di desktop.

| Lebar | Tata letak |
|---|---|
| < 768px (mobile) | Satu kolom, tab bar bawah (4 tab), konten penuh dengan margin 16-20px |
| 768-1023px | Satu kolom terpusat (maks 640px), tab bar bawah atau sidebar ramping |
| >= 1024px (desktop) | Sidebar kiri 240px, kolom utama terpusat (maks sekitar 680px), panel kanan 300px yang lebih sepi |

- **Satu aksi utama per layar.** Aksi sekunder berupa tombol teks.
- **Area sentuh minimal 44x44px.**
- Konten utama (kartu tugas) selalu menjadi pusat perhatian; panel kanan bersifat pendukung dan boleh disembunyikan di layar kecil.

## 6. Komponen

### Tombol

- **Utama:** pill, latar `action`, teks putih `button`, tinggi minimal 48px, penuh lebar di mobile. Ditekan: `action-pressed`. Fokus: cincin 2px `action` dengan offset 2px.
- **Sekunder:** tombol teks `action`, tanpa latar, garis bawah saat fokus. Contoh: "Pakai versi lebih ringan".
- **Dinonaktifkan:** latar `hairline`, teks `ink-faint`.

### Kartu tugas harian (komponen utama)

- Latar `surface`, border `hairline`, radius 12px, padding 24px; strip tipis `mint` di tepi kiri atau pojok sebagai aksen (tanpa gradien).
- Isi berurutan: label `eyebrow` "Level 2 dari 5 · Memulai", teks tugas `task`, baris bantu `ink-secondary`, tombol utama "Sudah kulakukan", tombol teks "Pakai versi lebih ringan".
- Setelah selesai: latar `mint-tint`, ikon centang `action`, pesan hangat ("Langkah kecil yang berarti."). Tidak ada animasi berlebihan.

### Pilihan jawaban kuis

- Daftar vertikal, tiap opsi berupa baris `surface` 56px dengan border `hairline`, radius 12px.
- Terpilih: border `action` 2px dan latar `mint-tint`, plus ikon radio terisi (bukan hanya warna).
- Satu pertanyaan per layar, progres tipis "2 dari 6" di atas.

### Chip streak

- Pill `mint-tint` dengan ikon garis dan teks `action`. Contoh: "3 hari berturut-turut".
- Hari terlewat ditampilkan netral (`hairline`), tidak pernah dengan warna negatif.

### Progres

- Bilah tipis 8px: trek `sky-light-tint`, isi `sky`, radius pill. Keterangan teks selalu menyertai angka.
- Grafik tren skor: garis `sky`, titik `sky`, sumbu `hairline`, label `ink-secondary`. Sertakan keterangan teks: "Skor lebih rendah berarti hambatan terasa lebih ringan."

### Lencana

- Diperoleh: lingkaran `mint-tint` dengan ikon garis `action`, nama di bawahnya.
- Terkunci: lingkaran `hairline` dengan ikon `ink-faint`.

### Jurnal

- Textarea: latar `surface`, border `hairline`, radius 8px, padding 12px, tinggi awal 96px. Fokus: border `action`.
- Catatan privasi di bawah: "Jurnal ini hanya bisa dilihat olehmu." dengan ikon gembok garis.

### Banner bantuan

- Latar `sky-light-tint`, teks `info-text`, radius 12px, ikon garis. Nada mengajak, bukan alarm.
- Tombol "Lihat sumber bantuan" memakai gaya sekunder. Jangan menaruh nomor telepon yang belum diverifikasi tim.

### Navigasi

- **Desktop:** sidebar `surface` 240px dengan border kanan `hairline`. Item aktif: latar `mint-tint`, teks `action`, ikon terisi.
- **Mobile:** tab bar bawah `surface` dengan border atas `hairline`, 4 tab (Hari Ini, Progres, Komunitas, Bantuan), tinggi 64px. Tab aktif: ikon dan label `action`.
- Ikon: gaya garis sederhana yang konsisten (mis. Lucide), tidak ada emoji sebagai ikon.

### Komunitas

- Kartu dukungan berisi pesan terpilih (tanpa teks bebas) dengan chip "Kirim dukungan". Catatan kecil: "Semua anonim dan tanpa peringkat."

### Kondisi kosong dan pesan kesalahan

- Ilustrasi garis sederhana atau ikon besar dalam lingkaran `mint-tint`, satu kalimat hangat, satu aksi. Pesan kesalahan netral dan membantu, tanpa merah.

## 7. Gerak

- Minimal dan halus: transisi 150-200ms (opacity dan translate kecil).
- Hormati `prefers-reduced-motion`: matikan animasi non-esensial.
- Tidak ada konfeti, getar, atau animasi yang menekan. Perayaan cukup lewat teks hangat dan perubahan warna lembut.

## 8. Aksesibilitas

- Teks isi minimal 16px. Kontras teks minimal 4,5:1 (teks besar 3:1); verifikasi semua pasangan warna.
- Area sentuh minimal 44x44px. Fokus keyboard selalu terlihat.
- Jangan hanya mengandalkan warna untuk menyampaikan makna.
- Label formulir yang jelas dan pesan kesalahan yang dibaca pembaca layar.
- Dukungan zoom hingga 200% tanpa kehilangan fungsi.

## 9. Suara dan Nada Teks

- Bahasa Indonesia santai dan hangat, sapaan "kamu".
- Rayakan langkah kecil: "Langkah kecil yang berarti.", "Pelan-pelan juga maju."
- Hindari kata menekan ("gagal", "harus", "terlambat") dan istilah klinis.
- Kalimat pendek, satu ide per kalimat.

## 10. Token untuk Tailwind

Letakkan di `tailwind.config.ts` lalu pakai kelas semantik, bukan nilai hex mentah.

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F6FAF9",
        surface: "#FFFFFF",
        hairline: "#DDE7E4",
        ink: { DEFAULT: "#1E2B2A", secondary: "#52625F", faint: "#8A9895" },
        mint: { DEFAULT: "#86C5A6", tint: "#E4F3EC" },
        sky: { DEFAULT: "#5BB5E0", light: "#A5D4EA", "light-tint": "#E6F3FA" },
        action: { DEFAULT: "#2F7A5C", pressed: "#25634A" },
        "info-text": "#2A5670",
      },
      fontFamily: { sans: ["var(--font-jakarta)", "system-ui", "sans-serif"] },
      borderRadius: { input: "8px", card: "12px", container: "16px" },
      boxShadow: {
        soft: "0 1px 2px rgba(30,43,42,0.04), 0 4px 12px rgba(30,43,42,0.04)",
        modal: "0 12px 32px rgba(30,43,42,0.10)",
      },
    },
  },
};
export default config;
```

### Jika memakai Tailwind v4

Proyek baru dari `create-next-app` mungkin memakai Tailwind v4, yang tidak memakai `tailwind.config.ts` secara default. Di versi itu, definisikan token di `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-canvas: #F6FAF9;
  --color-surface: #FFFFFF;
  --color-hairline: #DDE7E4;
  --color-ink: #1E2B2A;
  --color-ink-secondary: #52625F;
  --color-ink-faint: #8A9895;
  --color-mint: #86C5A6;
  --color-mint-tint: #E4F3EC;
  --color-sky: #5BB5E0;
  --color-sky-light: #A5D4EA;
  --color-sky-light-tint: #E6F3FA;
  --color-action: #2F7A5C;
  --color-action-pressed: #25634A;
  --color-info-text: #2A5670;

  --font-sans: var(--font-jakarta), system-ui, sans-serif;

  --radius-input: 8px;
  --radius-card: 12px;
  --radius-container: 16px;

  --shadow-soft: 0 1px 2px rgba(30,43,42,0.04), 0 4px 12px rgba(30,43,42,0.04);
  --shadow-modal: 0 12px 32px rgba(30,43,42,0.10);
}
```

Nama kelas yang dihasilkan sama: `bg-canvas`, `text-ink`, `text-ink-secondary`, `bg-mint-tint`, `bg-action`, `rounded-card`, `shadow-soft`.

## 11. Do dan Don't

### Do

- Pakai `canvas` untuk latar halaman dan `surface` untuk kartu agar ada figur-latar yang lembut.
- Beri satu fokus per layar dan ruang kosong yang lega.
- Pakai `action` hanya untuk aksi dan tautan.
- Pakai pita pastel (mint, biru muda, biru langit) untuk dekorasi, progres, dan latar lembut.
- Sertakan ikon atau teks di samping warna untuk menyampaikan status.
- Tulis teks contoh yang nyata, bukan "Lorem ipsum".

### Don't

- Jangan pakai gradien, neon, atau warna di luar palet ini.
- Jangan pakai merah atau teks peringatan keras untuk apa pun.
- Jangan taruh teks putih di atas warna pastel.
- Jangan pakai emoji sebagai ikon.
- Jangan membuat grid kartu seragam, papan peringkat, atau perbandingan antar pengguna.
- Jangan pakai maskot atau foto stok orang.
- Jangan menambah navbar bergaya halaman pemasaran; ini aplikasi, bukan landing page.
- Jangan memakai nilai hex mentah di komponen; selalu lewat token.
