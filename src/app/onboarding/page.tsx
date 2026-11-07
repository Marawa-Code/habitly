"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Sparkles, Compass, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { saveUser } from "@/lib/storage";

export default function OnboardingPage() {
  const router = useRouter();
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
    if (tujuan === "quiz") {
      router.push("/quiz");
    } else {
      router.push("/tantangan");
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 py-10">
      <div className="max-w-sm w-full flex flex-col items-center gap-7">

        {/* Logo & Tagline */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-mint-tint flex items-center justify-center shadow-soft">
            <span className="text-action font-bold text-2xl tracking-tight">H</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-ink tracking-tight">Habitly</h1>
            <p className="mt-1 text-sm text-ink-secondary leading-relaxed">
              Latih rasa percaya dirimu berkomunikasi,<br />
              satu langkah kecil setiap hari.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-sky-light-tint rounded-card px-4 py-3.5 flex gap-3 w-full border border-hairline/80">
          <Shield
            size={18}
            className="text-info-text shrink-0 mt-0.5"
            strokeWidth={1.75}
          />
          <p className="text-xs text-info-text leading-relaxed">
            Habitly adalah <strong>alat bantu latihan</strong>, bukan terapi atau diagnosis medis. Seluruh data tersimpan privat di perangkatmu.
          </p>
        </div>

        {/* Input nama panggilan (opsional) */}
        <div className="w-full">
          <Input
            label="Nama panggilanmu (opsional)"
            placeholder="misal: Rani"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={32}
          />
          <p className="mt-1 text-[11px] text-ink-faint">
            Dikosongkan juga boleh — kami akan menyapamu sebagai &quot;Kamu&quot;.
          </p>
        </div>

        {/* Persetujuan */}
        <label className="flex items-start gap-3 cursor-pointer w-full bg-surface border border-hairline rounded-card p-3 shadow-soft">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 shrink-0 accent-action cursor-pointer"
          />
          <span className="text-xs text-ink-secondary leading-relaxed">
            Saya memahami bahwa Habitly adalah alat bantu latihan kebiasaan (bukan terapi medis) dan menyetujui penyimpanan data lokal.
          </span>
        </label>

        {/* Pilihan Cara Memulai */}
        <div className="flex flex-col gap-3 w-full">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-faint text-center">
            Pilih Cara Memulai
          </p>

          {/* Opsi 1: Hasil Pertanyaan (Kuis Rekomendasi) */}
          <div
            className={`border rounded-card p-4 transition-all flex flex-col gap-3 ${
              agreed
                ? "bg-surface border-action/30 shadow-soft"
                : "bg-canvas border-hairline/60 opacity-60"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint-tint flex items-center justify-center text-action shrink-0">
                <Sparkles size={20} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-ink">Lewat Hasil Pertanyaan</h2>
                  <span className="text-[10px] font-semibold bg-mint-tint text-action px-2 py-0.5 rounded-full">
                    Rekomendasi
                  </span>
                </div>
                <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                  Jawab 8 pertanyaan singkat untuk memetakan kebutuhanmu dan mendapat rekomendasi tantangan paling tepat.
                </p>
              </div>
            </div>

            <Button
              fullWidth
              disabled={!agreed}
              onClick={() => handleMulai("quiz")}
              className="py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <span>Mulai Lewat Kuis Pertanyaan</span>
              <ArrowRight size={14} />
            </Button>
          </div>

          {/* Opsi 2: Pilih Tantangan Sendiri */}
          <div
            className={`border rounded-card p-4 transition-all flex flex-col gap-3 ${
              agreed
                ? "bg-surface border-hairline hover:border-action/30 shadow-soft"
                : "bg-canvas border-hairline/60 opacity-60"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-light-tint flex items-center justify-center text-info-text shrink-0">
                <Compass size={20} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-ink">Pilih Tantangan Sendiri</h2>
                <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                  Langsung jelajahi katalog 8 tantangan komunikasi dan pilih sendiri langkah awal yang ingin kamu ambil.
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              fullWidth
              disabled={!agreed}
              onClick={() => handleMulai("tantangan")}
              className="py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <span>Pilih Tantangan Sendiri</span>
              <ArrowRight size={14} />
            </Button>
          </div>

          {!agreed && (
            <p className="text-[11px] text-ink-faint text-center mt-0.5">
              Centang persetujuan di atas untuk memilih salah satu cara memulai.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
