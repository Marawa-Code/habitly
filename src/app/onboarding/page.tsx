"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { saveUser } from "@/lib/storage";

export default function OnboardingPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [nickname, setNickname] = useState("");

  function handleMulai() {
    if (!agreed) return;
    saveUser({
      id: crypto.randomUUID(),
      nickname: nickname.trim() || "Kamu",
      joinedAt: new Date().toISOString(),
      consentedAt: new Date().toISOString(),
    });
    router.push("/quiz");
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-sm w-full flex flex-col items-center gap-8">

        {/* Logo & Tagline */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-mint-tint flex items-center justify-center shadow-soft">
            <span className="text-action font-bold text-3xl tracking-tight">H</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-ink tracking-tight">Habitly</h1>
            <p className="mt-2 text-base text-ink-secondary leading-relaxed">
              Latih rasa percaya dirimu berkomunikasi,<br />
              satu langkah kecil setiap hari.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-sky-light-tint rounded-card px-5 py-4 flex gap-3 w-full">
          <Shield
            size={20}
            className="text-info-text shrink-0 mt-0.5"
            strokeWidth={1.75}
          />
          <p className="text-sm text-info-text leading-relaxed">
            Habitly adalah <strong>alat bantu latihan</strong>, bukan pengganti
            psikolog atau tenaga profesional. Jika kamu butuh bantuan lebih,
            bicarakan dengan orang dewasa yang kamu percaya.
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
          <p className="mt-1.5 text-xs text-ink-faint">
            Dikosongkan juga tidak apa-apa — kami akan menyapamu sebagai &quot;Kamu&quot;.
          </p>
        </div>

        {/* Persetujuan */}
        <label className="flex items-start gap-3 cursor-pointer w-full">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-5 h-5 shrink-0 accent-action cursor-pointer"
          />
          <span className="text-sm text-ink-secondary leading-relaxed">
            Saya memahami bahwa Habitly bukan terapi dan setuju data latihan
            saya disimpan hanya di perangkat ini.
          </span>
        </label>

        {/* Tombol */}
        <div className="flex flex-col gap-3 w-full">
          <Button fullWidth disabled={!agreed} onClick={handleMulai}>
            Mulai Kuis Penilaian Diri
          </Button>
          <p className="text-xs text-ink-faint text-center">
            Data tersimpan di perangkat ini dan tidak dibagikan.
          </p>
        </div>

      </div>
    </div>
  );
}
