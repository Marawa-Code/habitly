"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Sparkles,
  Compass,
  ArrowRight,
  MessageCircle,
  Ear,
  Mic,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { saveUser } from "@/lib/storage";

// Langkah onboarding: hero → isi nama & consent → pilih cara mulai
type Step = "hero" | "setup" | "choose";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("hero");
  const [agreed, setAgreed] = useState(false);
  const [nickname, setNickname] = useState("");

  function handleMulai(tujuan: "quiz" | "tantangan") {
    if (!agreed) return;
    saveUser({
      id: crypto.randomUUID(),
      nickname: nickname.trim() || "Kamu",
      joinedAt: new Date().toISOString(),
      consentedAt: new Date().toISOString(),
    });
    router.push(tujuan === "quiz" ? "/quiz" : "/tantangan");
  }

  /* ─────────────────────────── STEP 1: HERO ─────────────────────────── */
  if (step === "hero") {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        {/* Hero area – dekoratif ikon floating */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-6 overflow-hidden">

          {/* Ikon-ikon floating sebagai ilustrasi */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
            {/* kiri atas */}
            <div className="absolute top-12 left-6 w-12 h-12 rounded-2xl bg-mint-tint flex items-center justify-center text-action shadow-soft opacity-70">
              <Ear size={22} strokeWidth={1.75} />
            </div>
            {/* kanan atas */}
            <div className="absolute top-20 right-8 w-10 h-10 rounded-2xl bg-sky-light-tint flex items-center justify-center text-info-text shadow-soft opacity-60">
              <Mic size={18} strokeWidth={1.75} />
            </div>
            {/* kiri tengah */}
            <div className="absolute top-[42%] left-4 w-9 h-9 rounded-xl bg-mint-tint flex items-center justify-center text-action shadow-soft opacity-50">
              <UserPlus size={16} strokeWidth={1.75} />
            </div>
            {/* kanan tengah */}
            <div className="absolute top-[38%] right-5 w-11 h-11 rounded-2xl bg-sky-light-tint flex items-center justify-center text-info-text shadow-soft opacity-50">
              <MessageCircle size={20} strokeWidth={1.75} />
            </div>
            {/* bawah kiri */}
            <div className="absolute bottom-32 left-8 w-8 h-8 rounded-xl bg-mint-tint flex items-center justify-center text-action shadow-soft opacity-40">
              <CheckCircle2 size={15} strokeWidth={1.75} />
            </div>
          </div>

          {/* Konten utama */}
          <div className="relative z-10 max-w-sm w-full flex flex-col items-center gap-8">

            {/* Logo */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-action flex items-center justify-center shadow-modal">
                <span className="text-white font-bold text-3xl tracking-tight">H</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-action">Habitly</p>
                <h1 className="mt-2 text-3xl font-bold text-ink leading-tight tracking-tight">
                  Percaya diri itu<br />
                  bisa dilatih.
                </h1>
                <p className="mt-3 text-base text-ink-secondary leading-relaxed max-w-xs mx-auto">
                  Kuasai komunikasi sehari-hari lewat kebiasaan kecil yang terukur — mulai dari menyapa hingga menyampaikan pendapat.
                </p>
              </div>
            </div>

            {/* 3 Pilar singkat */}
            <div className="w-full flex flex-col gap-3">
              {[
                { icon: <Sparkles size={16} strokeWidth={2} />, text: "Rekomendasi tantangan sesuai kebutuhanmu" },
                { icon: <CheckCircle2 size={16} strokeWidth={2} />, text: "Tugas kecil harian yang bisa selesai dalam menit" },
                { icon: <Compass size={16} strokeWidth={2} />, text: "8 jalur komunikasi — dari menyapa hingga berpendapat" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-surface border border-hairline rounded-container px-4 py-3 shadow-soft">
                  <div className="w-8 h-8 rounded-xl bg-mint-tint flex items-center justify-center text-action shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-sm text-ink-secondary leading-snug">{item.text}</p>
                </div>
              ))}
            </div>

            {/* CTA utama */}
            <div className="flex flex-col gap-3 w-full">
              <Button fullWidth onClick={() => setStep("setup")}>
                Mulai Sekarang
              </Button>
              <p className="text-xs text-ink-faint text-center leading-relaxed">
                Gratis sepenuhnya. Tidak perlu akun. Data tersimpan di perangkatmu.
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────── STEP 2: SETUP (nama + consent) ──────────────────────── */
  if (step === "setup") {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 py-10">
        <div className="max-w-sm w-full flex flex-col gap-6">

          {/* Back + judul */}
          <div>
            <button
              onClick={() => setStep("hero")}
              className="text-xs font-semibold text-action mb-4 flex items-center gap-1 hover:underline"
            >
              ← Kembali
            </button>
            <h2 className="text-2xl font-bold text-ink leading-tight">Sebelum mulai,<br />kenalan dulu yuk!</h2>
            <p className="mt-1.5 text-sm text-ink-secondary">
              Isi nama panggilanmu — atau langsung lanjut tanpa nama.
            </p>
          </div>

          {/* Input nama */}
          <div>
            <Input
              label="Nama panggilanmu (opsional)"
              placeholder="misal: Rani, Dika, Ara…"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={32}
            />
            <p className="mt-1.5 text-[11px] text-ink-faint">
              Dikosongkan juga boleh — kami akan menyapamu sebagai &quot;Kamu&quot;.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-sky-light-tint rounded-card px-4 py-3.5 flex gap-3 border border-hairline/80">
            <Shield size={16} className="text-info-text shrink-0 mt-0.5" strokeWidth={1.75} />
            <p className="text-xs text-info-text leading-relaxed">
              Habitly adalah <strong>alat bantu latihan</strong>, bukan terapi atau diagnosis medis. Tidak ada data yang dikirim ke luar perangkatmu.
            </p>
          </div>

          {/* Persetujuan */}
          <label className="flex items-start gap-3 cursor-pointer bg-surface border border-hairline rounded-card p-3.5 shadow-soft hover:border-action/40 transition-colors">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 shrink-0 accent-action cursor-pointer"
            />
            <span className="text-xs text-ink-secondary leading-relaxed">
              Saya paham Habitly adalah alat bantu latihan (bukan terapi) dan setuju data disimpan hanya di perangkat ini.
            </span>
          </label>

          {/* Tombol lanjut */}
          <Button
            fullWidth
            disabled={!agreed}
            onClick={() => setStep("choose")}
            className="flex items-center justify-center gap-2"
          >
            <span>Lanjut Pilih Cara Mulai</span>
            <ArrowRight size={16} />
          </Button>

        </div>
      </div>
    );
  }

  /* ──────────────────────── STEP 3: CHOOSE (kuis atau pilih sendiri) ──────────────────────── */
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 py-10">
      <div className="max-w-sm w-full flex flex-col gap-6">

        {/* Back + judul */}
        <div>
          <button
            onClick={() => setStep("setup")}
            className="text-xs font-semibold text-action mb-4 flex items-center gap-1 hover:underline"
          >
            ← Kembali
          </button>
          <h2 className="text-2xl font-bold text-ink leading-tight">
            Bagaimana kamu ingin<br />memulai?
          </h2>
          <p className="mt-1.5 text-sm text-ink-secondary">
            Pilih cara yang paling nyaman buatmu — keduanya sama baiknya.
          </p>
        </div>

        {/* Kartu: Kuis Rekomendasi */}
        <button
          onClick={() => handleMulai("quiz")}
          className="group w-full text-left border-2 border-action/30 bg-surface rounded-container p-5 shadow-soft hover:border-action/60 hover:shadow-modal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-mint-tint flex items-center justify-center text-action shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles size={22} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-ink">Lewat Kuis Singkat</h3>
                <span className="text-[10px] font-bold bg-action text-white px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  Rekomendasi
                </span>
              </div>
              <p className="text-sm text-ink-secondary mt-1.5 leading-relaxed">
                Jawab 8 pertanyaan refleksi diri dan Habitly akan merekomendasikan tantangan yang paling sesuai untukmu.
              </p>
              <div className="flex items-center gap-1 mt-3 text-action font-semibold text-sm">
                <span>Mulai Kuis</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </button>

        {/* Pemisah */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-hairline" />
          <span className="text-xs text-ink-faint font-medium">atau</span>
          <div className="flex-1 h-px bg-hairline" />
        </div>

        {/* Kartu: Pilih Sendiri */}
        <button
          onClick={() => handleMulai("tantangan")}
          className="group w-full text-left border border-hairline bg-surface rounded-container p-5 shadow-soft hover:border-action/40 hover:shadow-modal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-light-tint flex items-center justify-center text-info-text shrink-0 group-hover:scale-105 transition-transform">
              <Compass size={22} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-ink">Pilih Tantangan Sendiri</h3>
              <p className="text-sm text-ink-secondary mt-1.5 leading-relaxed">
                Langsung jelajahi 8 jalur komunikasi dan pilih sendiri yang paling ingin kamu coba.
              </p>
              <div className="flex items-center gap-1 mt-3 text-ink-secondary font-semibold text-sm group-hover:text-action transition-colors">
                <span>Jelajahi Tantangan</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </button>

        <p className="text-[11px] text-ink-faint text-center leading-relaxed">
          Kamu bisa mengubah pilihan ini kapan saja dari menu Tantangan.
        </p>

      </div>
    </div>
  );
}
