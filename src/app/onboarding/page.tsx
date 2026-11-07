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
  ChevronLeft,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { saveUser } from "@/lib/storage";

type Step = "hero" | "setup" | "choose";

/* Dekorasi ikon floating di hero */
const FLOATS = [
  { Icon: Ear, top: "14%", left: "8%", bg: "bg-mint-tint", color: "text-action", size: 18, delay: "0s" },
  { Icon: Mic, top: "10%", right: "10%", bg: "bg-sky-light-tint", color: "text-info-text", size: 16, delay: "0.4s" },
  { Icon: MessageCircle, bottom: "22%", left: "6%", bg: "bg-sky-light-tint", color: "text-info-text", size: 15, delay: "0.8s" },
  { Icon: UserPlus, bottom: "26%", right: "8%", bg: "bg-mint-tint", color: "text-action", size: 17, delay: "0.6s" },
];

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

  /* ══════════════════════════════════════════════
     STEP 1 — HERO
  ══════════════════════════════════════════════ */
  if (step === "hero") {
    return (
      <div className="relative h-screen bg-canvas flex flex-col overflow-hidden">

        {/* ── Ikon floating ── */}
        {FLOATS.map(({ Icon, top, left, right, bottom, bg, color, size, delay }, i) => (
          <div
            key={i}
            className="absolute pointer-events-none select-none"
            style={{ top, left, right, bottom, animationDelay: delay }}
            aria-hidden
          >
            <div className={`w-11 h-11 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-soft opacity-70`}>
              <Icon size={size} strokeWidth={1.75} />
            </div>
          </div>
        ))}

        {/* ── Konten utama ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-between px-6 pt-16 pb-8 max-w-sm mx-auto w-full">

          {/* Logo + Nama */}
          <div className="flex flex-col items-center gap-4">
            {/* Lingkaran besar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-action flex items-center justify-center shadow-modal">
                <span className="text-white font-bold text-4xl tracking-tighter">H</span>
              </div>
              {/* Cincin */}
              <div className="absolute inset-0 rounded-full border-[6px] border-action/15 scale-[1.3]" />
            </div>

            {/* Headline */}
            <div className="text-center mt-2">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-action">Habitly</p>
              <h1 className="mt-2 text-[28px] font-bold text-ink leading-[1.2] tracking-tight">
                Percaya diri itu<br />bisa dilatih.
              </h1>
              <p className="mt-3 text-sm text-ink-secondary leading-relaxed">
                Latihan komunikasi kecil setiap hari — langkah demi langkah, sesuai ritme kamu.
              </p>
            </div>
          </div>

          {/* 3 Poin horizontal — compact */}
          <div className="flex gap-3 w-full">
            {[
              { icon: <Sparkles size={14} strokeWidth={2} />, label: "Personal" },
              { icon: <CheckCircle2 size={14} strokeWidth={2} />, label: "Harian" },
              { icon: <Compass size={14} strokeWidth={2} />, label: "8 Jalur" },
            ].map((f, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 bg-surface border border-hairline rounded-container py-3 px-1 shadow-soft">
                <div className="w-8 h-8 rounded-xl bg-mint-tint flex items-center justify-center text-action">
                  {f.icon}
                </div>
                <span className="text-[11px] font-semibold text-ink">{f.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2 w-full">
            <Button fullWidth onClick={() => setStep("setup")}>
              Mulai Sekarang
              <ArrowRight size={16} />
            </Button>
            <p className="text-[11px] text-ink-faint text-center">
              Gratis · Tanpa akun · Data tersimpan di perangkatmu
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════
     STEP 2 — SETUP (nama + consent)
  ══════════════════════════════════════════════ */
  if (step === "setup") {
    return (
      <div className="h-screen bg-canvas flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col justify-between px-6 pt-5 pb-8 max-w-sm mx-auto w-full">

          {/* Back + header */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setStep("hero")}
              className="text-sm font-semibold text-action flex items-center gap-1 hover:underline self-start min-h-[44px] -ml-1 px-1"
            >
              <ChevronLeft size={16} />
              Kembali
            </button>

            {/* Angka langkah */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-6 h-1.5 rounded-full bg-hairline" />
                <div className="w-6 h-1.5 rounded-full bg-action" />
                <div className="w-6 h-1.5 rounded-full bg-hairline" />
              </div>
              <span className="text-[11px] text-ink-faint">Langkah 1 dari 2</span>
            </div>

            <div className="mt-1">
              <h2 className="text-2xl font-bold text-ink leading-tight">Siapa kamu?</h2>
              <p className="mt-1 text-sm text-ink-secondary">Nama panggilanmu (boleh dikosongkan).</p>
            </div>
          </div>

          {/* Input + disclaimer */}
          <div className="flex flex-col gap-3">
            <Input
              label="Nama panggilan"
              placeholder="misal: Rani, Dika, Ara…"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={32}
            />
            <p className="text-[11px] text-ink-faint -mt-1">
              Dikosongkan juga boleh — kami menyapamu sebagai &quot;Kamu&quot;.
            </p>

            {/* Disclaimer */}
            <div className="flex gap-2.5 bg-sky-light-tint border border-hairline/70 rounded-card px-3 py-2.5">
              <Shield size={14} className="text-info-text shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-[11px] text-info-text leading-relaxed">
                Habitly adalah <strong>alat bantu latihan</strong>, bukan terapi. Data tidak dikirim ke mana pun dan tersimpan hanya di perangkat ini.
              </p>
            </div>

            {/* Checkbox consent */}
            <label className="flex items-start gap-3 cursor-pointer bg-surface border border-hairline rounded-card px-3.5 py-3.5 shadow-soft hover:border-action/50 transition-colors">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-action cursor-pointer"
              />
              <span className="text-xs text-ink-secondary leading-relaxed">
                Saya paham Habitly bukan terapi dan setuju data latihan disimpan hanya di perangkat ini.
              </span>
            </label>
          </div>

          {/* Lanjut */}
          <Button
            fullWidth
            disabled={!agreed}
            onClick={() => setStep("choose")}
            className="flex items-center justify-center gap-2"
          >
            Lanjut
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════
     STEP 3 — CHOOSE
  ══════════════════════════════════════════════ */
  return (
    <div className="h-screen bg-canvas flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col px-6 pt-5 pb-8 max-w-sm mx-auto w-full gap-5">

        {/* Back + langkah */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setStep("setup")}
            className="text-sm font-semibold text-action flex items-center gap-1 hover:underline self-start min-h-[44px] -ml-1 px-1"
          >
            <ChevronLeft size={16} />
            Kembali
          </button>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-6 h-1.5 rounded-full bg-hairline" />
              <div className="w-6 h-1.5 rounded-full bg-hairline" />
              <div className="w-6 h-1.5 rounded-full bg-action" />
            </div>
            <span className="text-[11px] text-ink-faint">Langkah 2 dari 2</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink leading-tight">Bagaimana kamu<br />ingin memulai?</h2>
            <p className="mt-1 text-sm text-ink-secondary">Keduanya sama baiknya.</p>
          </div>
        </div>

        {/* Dua kartu — full flex-1 */}
        <div className="grid grid-cols-2 gap-3 flex-1">

          {/* Kuis */}
          <button
            onClick={() => handleMulai("quiz")}
            className="group relative text-left flex flex-col bg-action rounded-container px-4 py-5 shadow-modal hover:bg-action-pressed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2"
          >
            {/* Badge */}
            <span className="absolute top-3 right-3 text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
              Rekomendasi
            </span>

            <div className="flex-1 flex flex-col justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <Sparkles size={22} strokeWidth={1.75} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-snug">Lewat Kuis Singkat</h3>
                <p className="mt-1 text-[11px] text-white/75 leading-relaxed">
                  Jawab 8 pertanyaan, dapat rekomendasi yang cocok.
                </p>
              </div>
              <div className="flex items-center gap-1 text-white font-semibold text-xs">
                <span>Mulai Kuis</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </button>

          {/* Pilih Sendiri */}
          <button
            onClick={() => handleMulai("tantangan")}
            className="group text-left flex flex-col bg-surface border-2 border-hairline rounded-container px-4 py-5 shadow-soft hover:border-action/40 hover:shadow-modal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2"
          >
            <div className="flex-1 flex flex-col justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-light-tint flex items-center justify-center">
                <Compass size={22} strokeWidth={1.75} className="text-info-text" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink leading-snug">Pilih Sendiri</h3>
                <p className="mt-1 text-[11px] text-ink-secondary leading-relaxed">
                  Jelajahi 8 jalur dan tentukan pilihanmu.
                </p>
              </div>
              <div className="flex items-center gap-1 text-ink-secondary font-semibold text-xs group-hover:text-action transition-colors">
                <span>Jelajahi</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        <p className="text-[11px] text-ink-faint text-center leading-relaxed">
          Kamu bisa mengubah pilihan ini kapan saja dari menu Tantangan.
        </p>
      </div>
    </div>
  );
}
