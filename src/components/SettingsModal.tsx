"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  User as UserIcon,
  Check,
  Shield,
  Download,
  RotateCcw,
  Clock,
  ExternalLink,
  Info,
  AlertTriangle,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loadState, saveState, clearState } from "@/lib/storage";
import { getStoredTheme, applyTheme, type Theme } from "@/lib/theme";
import type { User } from "@/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserUpdated?: (user: User) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
}: SettingsModalProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const [reminderTime, setReminderTime] = useState<string>("pagi");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Inisialisasi data saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setNickname(currentUser?.nickname || "");
      setSaveSuccess(false);
      setShowResetConfirm(false);
      setTheme(getStoredTheme());

      // Load preferensi waktu pengingat dari localStorage jika ada
      try {
        const savedReminder = localStorage.getItem("habitly_reminder_time");
        if (savedReminder) setReminderTime(savedReminder);
      } catch {
        // no-op
      }
    }
  }, [isOpen, currentUser]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll saat modal aktif
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Format tanggal bergabung
  const joinDate = currentUser?.joinedAt
    ? new Date(currentUser.joinedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Hari ini";

  function handleSaveNickname(e: React.FormEvent) {
    e.preventDefault();
    const clean = nickname.trim();
    if (!clean) return;

    const state = loadState();
    const updatedUser: User = {
      ...(state.user || {
        id: crypto.randomUUID(),
        joinedAt: new Date().toISOString(),
        consentedAt: new Date().toISOString(),
      }),
      nickname: clean,
    };

    saveState({ user: updatedUser });
    if (onUserUpdated) onUserUpdated(updatedUser);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  function handleSelectTheme(newTheme: Theme) {
    setTheme(newTheme);
    applyTheme(newTheme);
  }

  function handleSelectReminder(time: string) {
    setReminderTime(time);
    try {
      localStorage.setItem("habitly_reminder_time", time);
    } catch {
      // no-op
    }
  }

  function handleExportData() {
    try {
      const state = loadState();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `habitly_progres_${currentUser?.nickname || "backup"}_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch {
      alert("Gagal mengekspor data.");
    }
  }

  function handleResetData() {
    clearState();
    onClose();
    router.replace("/onboarding");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative bg-surface rounded-container border border-hairline shadow-soft w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden z-10">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-hairline flex items-center justify-between bg-canvas/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-mint-tint border border-mint/40 text-action flex items-center justify-center font-bold text-sm">
              {currentUser?.nickname ? currentUser.nickname.charAt(0).toUpperCase() : "H"}
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-lg font-bold text-ink leading-tight">
                Pengaturan Akun
              </h2>
              <p className="text-xs text-ink-secondary">
                Kelola profil, preferensi, dan data pribadimu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-canvas transition-colors focus:outline-none focus:ring-2 focus:ring-action"
            aria-label="Tutup jendela pengaturan"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Section 1: Profil Pengguna */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserIcon size={16} className="text-action" />
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                Profil Pengguna
              </h3>
            </div>

            <form onSubmit={handleSaveNickname} className="space-y-3 bg-canvas/60 p-4 rounded-card border border-hairline">
              <Input
                label="Nama Panggilan"
                hint="Nama ini digunakan untuk menyapamu di beranda dan jurnal."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={24}
                required
              />

              <div className="flex items-center justify-between pt-1">
                {saveSuccess ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-action bg-mint-tint px-2.5 py-1 rounded-full">
                    <Check size={14} /> Berhasil disimpan!
                  </span>
                ) : (
                  <span className="text-[11px] text-ink-faint">
                    Bergabung sejak: {joinDate}
                  </span>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="min-h-[38px] text-xs px-4"
                  disabled={!nickname.trim() || nickname.trim() === currentUser?.nickname}
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>

          {/* Section 2: Mode Tampilan (Dark Mode) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Moon size={16} className="text-action" />
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                Mode Tampilan
              </h3>
            </div>
            <p className="text-xs text-ink-secondary">
              Pilih mode visual yang paling nyaman untuk matamu:
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "light", title: "Terang", desc: "Segar & lapang", Icon: Sun },
                { id: "dark", title: "Gelap", desc: "Teduh di mata", Icon: Moon },
                { id: "system", title: "Sistem", desc: "Ikuti perangkat", Icon: Monitor },
              ].map(({ id, title, desc, Icon }) => {
                const selected = theme === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelectTheme(id as Theme)}
                    className={`p-3 rounded-card text-left border transition-all cursor-pointer ${
                      selected
                        ? "bg-mint-tint/50 border-action text-action shadow-xs"
                        : "bg-surface border-hairline text-ink-secondary hover:border-action/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon size={16} className={selected ? "text-action" : "text-ink-secondary"} />
                      {selected && <Check size={14} className="text-action" />}
                    </div>
                    <span className="text-xs font-bold text-ink block">{title}</span>
                    <p className="text-[10px] text-ink-faint mt-0.5">{desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Preferensi Waktu Pengingat */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-action" />
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                Waktu Pengingat Latihan
              </h3>
            </div>
            <p className="text-xs text-ink-secondary">
              Pilih waktu paling nyaman untuk menyelesaikan misi kecil komunikasi harianmu:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: "pagi", title: "Pagi Hari", time: "07.00 - 09.00", desc: "Niat awal hari" },
                { id: "siang", title: "Siang Hari", time: "12.00 - 14.00", desc: "Sela istirahat" },
                { id: "sore", title: "Sore/Malam", time: "18.00 - 20.00", desc: "Refleksi & jurnal" },
              ].map((opt) => {
                const selected = reminderTime === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectReminder(opt.id)}
                    className={`p-3 rounded-card text-left border transition-all ${
                      selected
                        ? "bg-mint-tint/50 border-action text-action shadow-xs"
                        : "bg-surface border-hairline text-ink-secondary hover:border-action/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-ink">{opt.title}</span>
                      {selected && <Check size={14} className="text-action" />}
                    </div>
                    <p className="text-[11px] font-medium text-action">{opt.time}</p>
                    <p className="text-[10px] text-ink-faint mt-0.5">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Privasi & Kelola Data */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-action" />
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                Privasi & Kelola Data
              </h3>
            </div>

            <div className="bg-sky-light-tint/50 border border-sky-light rounded-card p-4 space-y-2">
              <div className="flex items-start gap-2.5">
                <Shield size={18} className="text-info-text shrink-0 mt-0.5" />
                <div className="text-xs text-info-text leading-relaxed">
                  <strong className="font-semibold">Privat & Tersimpan di Perangkat:</strong> Seluruh
                  jawaban kuis, jurnal refleksi, dan progres tantangan tersimpan 100% secara lokal di
                  browser ini. Tidak dikirim atau dibagikan ke pihak mana pun.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-hairline hover:border-action text-ink text-xs font-semibold rounded-card transition-colors flex-1"
              >
                <Download size={14} className="text-action" />
                Cadangkan Data (JSON)
              </button>

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-hairline hover:bg-canvas text-ink-secondary text-xs font-semibold rounded-card transition-colors flex-1"
              >
                <RotateCcw size={14} className="text-ink-secondary" />
                Mulai Ulang Progres
              </button>
            </div>

            {/* Konfirmasi Reset */}
            {showResetConfirm && (
              <div className="p-4 rounded-card border border-hairline bg-canvas space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={18} className="text-ink shrink-0 mt-0.5" />
                  <p className="text-xs text-ink leading-relaxed">
                    Yakin ingin mereset seluruh data? Semua riwayat misi, jurnal refleksi, dan lencana
                    yang telah kamu dapatkan akan dihapus dan kamu akan kembali ke langkah pendaftaran awal.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 text-xs text-ink-secondary hover:text-ink font-semibold rounded-full"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="px-3.5 py-1.5 text-xs bg-ink text-surface hover:bg-ink/90 font-semibold rounded-full transition-colors"
                  >
                    Ya, Reset Data
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Bantuan & Info Aplikasi */}
          <div className="pt-2 border-t border-hairline space-y-3">
            <div className="flex items-center justify-between text-xs text-ink-secondary">
              <span className="flex items-center gap-1.5">
                <Info size={14} className="text-action" />
                Habitly v1.0.0 (FIRETECH 2026)
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/help");
                }}
                className="text-action font-semibold hover:underline flex items-center gap-1"
              >
                Pusat Bantuan & Hotline
                <ExternalLink size={12} />
              </button>
            </div>
            <p className="text-[11px] text-ink-faint leading-relaxed">
              Habitly adalah sarana latihan mandiri untuk membangun kebiasaan komunikasi remaja.
              Bukan alat diagnosis medis atau pengganti konseling psikologis profesional.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-canvas/60 border-t border-hairline flex items-center justify-end">
          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            className="min-h-[40px] text-sm px-6"
          >
            Selesai
          </Button>
        </div>

      </div>
    </div>
  );
}

