"use client";

import { Heart, Phone, MessageCircle, Users, BookOpen, Shield, ExternalLink } from "lucide-react";
import Card from "@/components/ui/Card";

interface ResourceItem {
  name: string;
  description: string;
  note: string; // placeholder — tim perlu verifikasi sebelum mengisi kontak nyata
}

const RESOURCES: ResourceItem[] = [
  {
    name: "Konselor Sekolah / Guru BK",
    description: "Orang pertama yang bisa kamu ajak bicara di sekolah. Mereka ada untuk membantumu.",
    note: "Hubungi langsung di sekolahmu.",
  },
  {
    name: "Orang Dewasa yang Kamu Percaya",
    description: "Orang tua, kakak, paman, bibi, atau guru favorit — siapa pun yang terasa aman bagimu.",
    note: "Mulai dengan kalimat sederhana: \"Aku mau cerita sesuatu.\"",
  },
  {
    name: "Layanan Kesehatan Jiwa Nasional",
    description: "Indonesia memiliki layanan kesehatan jiwa yang bisa diakses melalui Puskesmas atau RSUD terdekat.",
    note: "Tanyakan ke orang tuamu untuk menemanimu ke fasilitas kesehatan terdekat.", // [PERLU VERIFIKASI] tambahkan kontak resmi setelah diverifikasi tim
  },
  {
    name: "Komunitas Online yang Aman",
    description: "Ada komunitas daring untuk remaja yang ingin berbagi pengalaman dan saling mendukung.",
    note: "Pastikan platform yang kamu pilih memiliki moderator dan aturan komunitas yang jelas.", // [PERLU VERIFIKASI]
  },
];

const SELF_HELP_TIPS = [
  {
    Icon: BookOpen,
    title: "Tulis perasaanmu",
    desc: "Jurnal harian membantu kamu mengenali pola kecemasan dan apa yang memicunya.",
  },
  {
    Icon: Users,
    title: "Mulai dari yang kecil",
    desc: "Tidak perlu langsung tampil di depan banyak orang. Satu senyuman atau satu sapaan sudah berarti.",
  },
  {
    Icon: Heart,
    title: "Bersikap baik pada dirimu",
    desc: "Rasa gugup itu wajar. Kamu tidak sendirian — banyak remaja merasakan hal yang sama.",
  },
  {
    Icon: Shield,
    title: "Istirahat itu bukan menyerah",
    desc: "Jika hari ini terasa berat, itu boleh. Besok adalah kesempatan baru untuk mencoba lagi.",
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Judul */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Butuh Bantuan?</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Meminta bantuan adalah tanda keberanian, bukan kelemahan.
        </p>
      </div>

      {/* Banner utama */}
      <div className="bg-sky-light-tint rounded-card px-5 py-5 flex gap-3">
        <Heart size={20} className="text-info-text shrink-0 mt-0.5" strokeWidth={1.75} />
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-info-text">
            Kamu tidak harus melewati ini sendirian.
          </p>
          <p className="text-sm text-info-text leading-relaxed">
            Jika rasa cemas terasa sangat berat dan mengganggu keseharianmu,
            bicarakan dengan orang dewasa yang kamu percaya atau tenaga profesional.
            Habitly hanya alat bantu latihan — bukan pengganti psikolog atau konselor.
          </p>
        </div>
      </div>

      {/* Tips mandiri */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Yang bisa kamu lakukan sekarang
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SELF_HELP_TIPS.map(({ Icon, title, desc }) => (
            <Card key={title}>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-mint-tint flex items-center justify-center shrink-0">
                  <Icon size={18} strokeWidth={1.75} className="text-action" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="text-xs text-ink-secondary leading-relaxed">{desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sumber bantuan profesional */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Sumber bantuan profesional
        </p>
        <div className="flex flex-col gap-3">
          {RESOURCES.map((r) => (
            <div
              key={r.name}
              className="bg-surface border border-hairline rounded-card px-5 py-4 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2">
                <Phone size={15} strokeWidth={1.75} className="text-action shrink-0" />
                <p className="text-sm font-semibold text-ink">{r.name}</p>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">{r.description}</p>
              <p className="text-xs text-info-text bg-sky-light-tint rounded-input px-3 py-1.5 mt-1">
                {r.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 items-start rounded-card border border-hairline px-5 py-4">
        <Shield size={18} strokeWidth={1.75} className="text-ink-faint shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-ink-secondary">Tentang Habitly</p>
          <p className="text-xs text-ink-faint leading-relaxed">
            Habitly adalah alat bantu latihan komunikasi untuk remaja. Aplikasi ini tidak
            memberikan diagnosis, terapi, atau layanan darurat. Data latihanmu hanya
            tersimpan di perangkatmu dan tidak dibagikan ke pihak mana pun.
          </p>
        </div>
      </div>

      {/* Ajakan chat komunitas — placeholder */}
      <div className="bg-sky-light-tint rounded-card px-5 py-4 flex gap-3 items-center">
        <MessageCircle size={18} strokeWidth={1.75} className="text-info-text shrink-0" />
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-info-text">Cerita dengan sesama</p>
          <p className="text-xs text-info-text leading-relaxed">
            Di tab Komunitas, kamu bisa berbagi semangat secara anonim dengan pengguna lain.
          </p>
        </div>
        <ExternalLink size={15} className="text-info-text shrink-0 ml-auto" strokeWidth={1.75} />
      </div>

    </div>
  );
}

