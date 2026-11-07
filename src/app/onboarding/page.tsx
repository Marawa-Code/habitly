"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Compass,
  ArrowRight,
  Check,
  ShieldCheck,
  Clock,
  Target,
} from "lucide-react";
import { saveUser } from "@/lib/storage";

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

  /* ══════════════════════════════════════════════════════════════════
     SCREEN 1: HERO & VALUE PROPOSITION (Sesuai Habitly Teen Onboarding Flow.png)
  ══════════════════════════════════════════════════════════════════ */
  if (step === "hero") {
    return (
      <div className="min-h-screen bg-canvas flex flex-col justify-between px-6 py-6 lg:px-16 lg:py-8">
        {/* Top Navbar */}
        <header className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Habitly Logo"
              className="w-9 h-9 rounded-full shadow-soft object-cover"
            />
            <span className="font-extrabold text-lg text-ink tracking-tight">
              Habitly
            </span>
          </div>

          <div className="bg-surface border border-hairline px-3.5 py-1.5 rounded-full shadow-soft text-xs font-medium text-ink-secondary">
            Latihan Komunikasi Remaja
          </div>
        </header>

        {/* Hero Section Split Layout */}
        <main className="flex-1 flex items-center justify-center my-6">
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Kolom Kiri: Copywriting & CTA */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="bg-mint-tint text-action font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4 inline-block">
                Atomic Habits untuk Komunikasi
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-ink leading-[1.2] tracking-tight">
                Percaya diri itu bisa dilatih, satu hari satu langkah.
              </h1>

              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed mt-4 max-w-xl">
                Bukan teori rumit. Habitly memberi tindakan kecil harian yang
                spesifik dan terukur agar kamu berani menyapa, mengobrol, dan
                berpendapat di kelas maupun pertemanan.
              </p>

              <div className="mt-8 flex flex-col items-start gap-2.5">
                <button
                  onClick={() => setStep("setup")}
                  className="bg-action text-white hover:bg-action-pressed font-semibold px-8 py-3.5 rounded-full text-base inline-flex items-center gap-2 shadow-soft transition-all cursor-pointer"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight size={18} />
                </button>
                <p className="text-xs text-ink-faint">
                  Gratis · Tanpa akun · Data tersimpan privat di browser
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Pratinjau Misi Harian Elevated Card */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-surface border border-hairline rounded-[24px] p-6 lg:p-7 shadow-soft flex flex-col gap-3.5">
                <div className="bg-mint-tint text-action font-bold text-xs px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-action" />
                  <span>Pratinjau Misi Harian</span>
                </div>

                {/* Card 1: Personal */}
                <div className="bg-canvas/50 border border-hairline rounded-[16px] p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-mint-tint flex items-center justify-center text-action shrink-0">
                    <Sparkles size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ink leading-snug">Personal</h3>
                    <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                      Rekomendasi kuis sesuai hambatan unikmu.
                    </p>
                  </div>
                </div>

                {/* Card 2: Mikro & Terukur */}
                <div className="bg-canvas/50 border border-hairline rounded-[16px] p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-sky-light-tint flex items-center justify-center text-info-text shrink-0">
                    <Check size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ink leading-snug">Mikro & Terukur</h3>
                    <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                      Misi 2–5 menit dengan opsi &apos;versi lebih ringan&apos;.
                    </p>
                  </div>
                </div>

                {/* Card 3: 8 Jalur Bertingkat */}
                <div className="bg-canvas/50 border border-hairline rounded-[16px] p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-mint-tint flex items-center justify-center text-action shrink-0">
                    <Compass size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ink leading-snug">8 Jalur Bertingkat</h3>
                    <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                      Dari menyapa orang baru hingga presentasi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full text-center text-xs text-ink-faint py-2">
          Habitly © 2026 · Harmonizing Tech and Humanity
        </footer>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════
     SCREEN 2: SETUP & KENALAN (Sesuai Habitly Teen Onboarding Flow-1.png)
  ══════════════════════════════════════════════════════════════════ */
  if (step === "setup") {
    return (
      <div className="min-h-screen bg-canvas flex flex-col justify-between px-6 py-6 lg:px-16 lg:py-8">
        {/* Top Navbar */}
        <header className="flex items-center gap-4 w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Habitly Logo"
              className="w-9 h-9 rounded-full shadow-soft object-cover"
            />
            <span className="font-extrabold text-lg text-ink tracking-tight">
              Habitly
            </span>
          </div>

          <button
            onClick={() => setStep("hero")}
            className="text-xs font-semibold text-action hover:underline cursor-pointer flex items-center gap-1"
          >
            ← Kembali
          </button>
        </header>

        {/* Card Form Centered */}
        <main className="flex-1 flex items-center justify-center my-6">
          <div className="max-w-[560px] w-full bg-surface border border-hairline rounded-[24px] p-6 sm:p-10 shadow-soft flex flex-col gap-6">
            {/* Step Indicator */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-ink-secondary font-medium">
                Langkah 1 dari 2
              </span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 rounded-full bg-action flex-1" />
                <div className="h-1.5 rounded-full bg-hairline flex-1" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="text-2xl font-bold text-ink leading-tight">
                Kenalan dulu, yuk!
              </h2>
              <p className="text-sm text-ink-secondary mt-1 leading-relaxed">
                Isi nama panggilanmu agar kami bisa menyapamu secara personal.
              </p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="nickname"
                  className="text-xs font-bold text-ink"
                >
                  Nama Panggilan (opsional)
                </label>
                <input
                  id="nickname"
                  type="text"
                  placeholder="misal: Rani, Dika, Ara…"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={32}
                  className="w-full bg-surface border border-hairline rounded-[12px] px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-all"
                />
                <span className="text-xs text-ink-faint">
                  Boleh dikosongkan — kami menyapamu sebagai &apos;Kamu&apos;.
                </span>
              </div>

              {/* Box Batas Keamanan & Privasi */}
              <div className="bg-sky-light-tint/60 border border-hairline/80 rounded-[14px] p-4 flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="text-action shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-ink">
                    Batas Keamanan & Privasi
                  </h4>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Habitly adalah alat bantu latihan kebiasaan praktis, bukan
                    terapi atau diagnosis medis. Seluruh data latihan tersimpan
                    secara lokal di perangkatmu dan tidak dikirim ke server mana
                    pun.
                  </p>
                </div>
              </div>

              {/* Checkbox Consent */}
              <label className="border border-hairline rounded-[14px] p-4 flex items-center gap-3 cursor-pointer hover:border-action/40 transition-colors bg-surface">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 accent-action cursor-pointer rounded shrink-0"
                />
                <span className="text-xs font-medium text-ink leading-relaxed">
                  Saya paham Habitly bukan pengganti terapi dan menyetujui
                  penyimpanan data lokal.
                </span>
              </label>
            </div>

            {/* Tombol Lanjutkan */}
            <button
              disabled={!agreed}
              onClick={() => setStep("choose")}
              className={`w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                agreed
                  ? "bg-action text-white hover:bg-action-pressed cursor-pointer shadow-soft"
                  : "bg-hairline text-ink-faint cursor-not-allowed"
              }`}
            >
              <span>Lanjutkan</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full text-center text-xs text-ink-faint py-2">
          Habitly © 2026 · Data Anda aman dan tersimpan privat
        </footer>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════
     SCREEN 3: CHOOSE PATH (Sesuai Habitly Teen Onboarding Flow-2.png)
  ══════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between px-6 py-6 lg:px-16 lg:py-8">
      {/* Top Navbar */}
      <header className="flex items-center gap-4 w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Habitly Logo"
            className="w-9 h-9 rounded-full shadow-soft object-cover"
          />
          <span className="font-extrabold text-lg text-ink tracking-tight">
            Habitly
          </span>
        </div>

        <button
          onClick={() => setStep("setup")}
          className="text-xs font-semibold text-action hover:underline cursor-pointer flex items-center gap-1"
        >
          ← Kembali ke Kenalan
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center my-6 max-w-4xl w-full mx-auto">
        {/* Header Title */}
        <div className="flex flex-col items-center text-center">
          <span className="bg-mint-tint text-action font-bold text-xs px-3.5 py-1 rounded-full mb-3">
            Langkah 2 dari 2 — Siap Memulai
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
            Bagaimana kamu ingin memulai perjalananmu?
          </h1>

          <p className="text-sm text-ink-secondary mt-1.5 max-w-md">
            Pilih cara yang paling kamu sukai. Keduanya sama baiknya dan bisa
            diubah kapan saja.
          </p>
        </div>

        {/* 2 Big Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
          {/* Card 1: Ikuti Kuis Refleksi Singkat (Green Card) */}
          <div className="bg-action text-white rounded-[24px] p-7 shadow-modal flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Sparkles size={22} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full">
                  Rekomendasi Personal
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mt-5 leading-snug">
                Ikuti Kuis Refleksi Singkat
              </h3>

              <p className="text-xs text-white/80 leading-relaxed mt-2">
                Jawab 8 pertanyaan santai seputar situasimu sehari-hari. Algoritma
                kami akan merekomendasikan tantangan terbaik untukmu.
              </p>
            </div>

            <div className="pt-6 flex flex-col gap-3">
              <div className="bg-white/15 px-3 py-1 rounded-full text-xs text-white w-fit flex items-center gap-1.5">
                <Clock size={13} strokeWidth={2} />
                <span>Cukup 2 menit</span>
              </div>

              <button
                onClick={() => handleMulai("quiz")}
                className="bg-white text-action hover:bg-white/95 font-bold py-3.5 px-6 rounded-full text-sm w-full text-center transition-all shadow-soft cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Mulai Kuis Sekarang</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Card 2: Pilih Tantangan Sendiri (White Card) */}
          <div className="bg-surface border-2 border-hairline rounded-[24px] p-7 shadow-soft hover:border-action/40 transition-all flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="w-12 h-12 rounded-full bg-sky-light-tint flex items-center justify-center text-info-text">
                <Compass size={22} strokeWidth={2} />
              </div>

              <h3 className="text-xl font-bold text-ink mt-5 leading-snug">
                Pilih Tantangan Sendiri
              </h3>

              <p className="text-xs text-ink-secondary leading-relaxed mt-2">
                Jelajahi langsung 8 jalur tantangan komunikasi (Menyapa Orang
                Baru, Obrolan Santai, hingga Berpendapat) dan tentukan sendiri.
              </p>
            </div>

            <div className="pt-6 flex flex-col gap-3">
              <div className="bg-mint-tint text-action px-3 py-1 rounded-full text-xs font-semibold w-fit flex items-center gap-1.5">
                <Target size={13} strokeWidth={2} />
                <span>Bebas eksplorasi</span>
              </div>

              <button
                onClick={() => handleMulai("tantangan")}
                className="border-2 border-action text-action hover:bg-mint-tint/30 font-bold py-3 px-6 rounded-full text-sm w-full text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Jelajahi Semua Tantangan</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-xs text-ink-faint text-center mt-6">
          Kamu selalu bisa mengikuti kuis atau berganti tantangan nanti dari menu
          Tantangan.
        </p>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-ink-faint py-2">
        Habitly © 2026 · Latihan Kebiasaan Kecil Komunikasi
      </footer>
    </div>
  );
}
