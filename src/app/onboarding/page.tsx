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

  /* ─────────── STEP 1: HERO — satu layar penuh tanpa scroll ─────────── */
  if (step === "hero") {
    return (
      <div className="h-screen bg-canvas flex flex-col overflow-hidden">
        {/* Ikon floating dekoratif */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div className="absolute top-6 left-5 w-10 h-10 rounded-2xl bg-mint-tint flex items-center justify-center text-action shadow-soft opacity-60">
            <Ear size={18} strokeWidth={1.75} />
          </div>
          <div className="absolute top-10 right-6 w-9 h-9 rounded-2xl bg-sky-light-tint flex items-center justify-center text-info-text shadow-soft opacity-50">
            <Mic size={16} strokeWidth={1.75} />
          </div>
          <div className="absolute bottom-28 left-5 w-8 h-8 rounded-xl bg-sky-light-tint flex items-center justify-center text-info-text shadow-soft opacity-40">
            <MessageCircle size={14} strokeWidth={1.75} />
          </div>
          <div className="absolute bottom-24 right-6 w-9 h-9 rounded-2xl bg-mint-tint flex items-center justify-center text-action shadow-soft opacity-40">
            <UserPlus size={16} strokeWidth={1.75} />
          </div>
        </div>

        {/* Konten utama: flex-1 distribute ruang */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-between px-6 py-8 max-w-sm mx-auto w-full">

          {/* Logo + headline */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-3xl bg-action flex items-center justify-center shadow-modal">
              <span className="text-white font-bold text-2xl tracking-tight">H</span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-action">Habitly</p>
              <h1 className="mt-1.5 text-2xl font-bold text-ink leading-tight tracking-tight">
                Percaya diri itu<br />bisa dilatih.
              </h1>
            </div>
          </div>

          {/* 3 fitur utama — horizontal grid */}
          <div className="grid grid-cols-3 gap-2.5 w-full">
            {[
              { icon: <Sparkles size={18} strokeWidth={2} />, label: "Rekomendasi", sub: "Personal sesuai kebutuhanmu" },
              { icon: <CheckCircle2 size={18} strokeWidth={2} />, label: "Tugas Harian", sub: "Selesai dalam hitungan menit" },
              { icon: <Compass size={18} strokeWidth={2} />, label: "8 Jalur", sub: "Dari menyapa hingga berpendapat" },
            ].map((f, i) => (
              <div key={i} className="bg-surface border border-hairline rounded-container px-2.5 py-3 flex flex-col items-center gap-1.5 text-center shadow-soft">
                <div className="w-9 h-9 rounded-xl bg-mint-tint flex items-center justify-center text-action">
                  {f.icon}
                </div>
                <p className="text-xs font-bold text-ink leading-tight">{f.label}</p>
                <p className="text-[10px] text-ink-faint leading-tight">{f.sub}</p>
              </div>
            ))}
          </div>

          {/* CTA + footnote */}
          <div className="flex flex-col gap-2 w-full">
            <Button fullWidth onClick={() => setStep("setup")}>
              Mulai Sekarang
            </Button>
            <p className="text-[11px] text-ink-faint text-center">
              Gratis · Tanpa akun · Data pribadi tersimpan di perangkatmu
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* ─────────── STEP 2: SETUP — satu layar penuh tanpa scroll ─────────── */
  if (step === "setup") {
    return (
      <div className="h-screen bg-canvas flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col justify-between px-6 py-6 max-w-sm mx-auto w-full">

          {/* Header */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setStep("hero")}
              className="text-xs font-semibold text-action flex items-center gap-1 hover:underline self-start"
            >
              ← Kembali
            </button>
            <h2 className="mt-2 text-xl font-bold text-ink leading-tight">Kenalan dulu, yuk!</h2>
            <p className="text-sm text-ink-secondary">Isi nama panggilanmu — atau langsung lanjut.</p>
          </div>

          {/* Form area */}
          <div className="flex flex-col gap-3">
            {/* Input nama */}
            <div>
              <Input
                label="Nama panggilanmu (opsional)"
                placeholder="misal: Rani, Dika, Ara…"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={32}
              />
              <p className="mt-1 text-[11px] text-ink-faint">
                Dikosongkan juga boleh — kami menyapamu sebagai &quot;Kamu&quot;.
              </p>
            </div>

            {/* Disclaimer: ringkas horizontal */}
            <div className="bg-sky-light-tint rounded-card px-3 py-2.5 flex gap-2.5 border border-hairline/80">
              <Shield size={15} className="text-info-text shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-[11px] text-info-text leading-relaxed">
                Habitly adalah <strong>alat bantu latihan</strong>, bukan terapi. Data tidak dikirim ke mana pun.
              </p>
            </div>

            {/* Persetujuan */}
            <label className="flex items-start gap-3 cursor-pointer bg-surface border border-hairline rounded-card px-3 py-3 shadow-soft hover:border-action/40 transition-colors">
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

          {/* Tombol lanjut */}
          <Button
            fullWidth
            disabled={!agreed}
            onClick={() => setStep("choose")}
            className="flex items-center justify-center gap-2"
          >
            <span>Lanjut</span>
            <ArrowRight size={16} />
          </Button>

        </div>
      </div>
    );
  }

  /* ─────────── STEP 3: CHOOSE — dua kartu side-by-side ─────────── */
  return (
    <div className="h-screen bg-canvas flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col justify-between px-6 py-6 max-w-sm mx-auto w-full">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setStep("setup")}
            className="text-xs font-semibold text-action flex items-center gap-1 hover:underline self-start"
          >
            ← Kembali
          </button>
          <h2 className="mt-2 text-xl font-bold text-ink leading-tight">Bagaimana kamu ingin memulai?</h2>
          <p className="text-sm text-ink-secondary">Keduanya sama baiknya — pilih yang paling nyaman.</p>
        </div>

        {/* Dua kartu horizontal side-by-side */}
        <div className="grid grid-cols-2 gap-3 flex-1 my-4">

          {/* Kartu: Kuis Rekomendasi */}
          <button
            onClick={() => handleMulai("quiz")}
            className="group relative text-left border-2 border-action/30 bg-surface rounded-container px-3.5 py-4 shadow-soft hover:border-action/60 hover:shadow-modal transition-all flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          >
            {/* Badge rekomendasi */}
            <span className="absolute top-3 right-3 text-[9px] font-bold bg-action text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
              Rekomendasi
            </span>

            <div className="w-11 h-11 rounded-2xl bg-mint-tint flex items-center justify-center text-action group-hover:scale-105 transition-transform">
              <Sparkles size={20} strokeWidth={2} />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <h3 className="text-sm font-bold text-ink leading-snug">Lewat Kuis Singkat</h3>
              <p className="text-[11px] text-ink-secondary leading-relaxed">
                Jawab 8 pertanyaan dan dapatkan tantangan yang paling cocok untukmu.
              </p>
            </div>

            <div className="flex items-center gap-1 text-action font-semibold text-xs">
              <span>Mulai Kuis</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Kartu: Pilih Sendiri */}
          <button
            onClick={() => handleMulai("tantangan")}
            className="group text-left border border-hairline bg-surface rounded-container px-3.5 py-4 shadow-soft hover:border-action/40 hover:shadow-modal transition-all flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-light-tint flex items-center justify-center text-info-text group-hover:scale-105 transition-transform">
              <Compass size={20} strokeWidth={2} />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <h3 className="text-sm font-bold text-ink leading-snug">Pilih Sendiri</h3>
              <p className="text-[11px] text-ink-secondary leading-relaxed">
                Jelajahi 8 jalur komunikasi dan tentukan tantanganmu sendiri.
              </p>
            </div>

            <div className="flex items-center gap-1 text-ink-secondary font-semibold text-xs group-hover:text-action transition-colors">
              <span>Jelajahi</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
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
