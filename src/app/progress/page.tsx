"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  CheckCircle,
  Star,
  BookOpen,
  TrendingUp,
  Footprints,
  PenLine,
  Award,
  Lock,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "@/components/ui/Card";
import BadgeCard from "@/components/ui/BadgeCard";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import { loadState, saveState } from "@/lib/storage";
import { calculateStreak, countActiveDays } from "@/lib/streak";
import { badges } from "@/lib/badges";
import { seedDemoData } from "@/lib/seed";
import type { AppState } from "@/types";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Footprints,
  Flame,
  Star,
  TrendingUp,
  BookOpen,
  PenLine,
  CheckCircle,
  Award,
};

const PATH_LABELS: Record<string, string> = {
  "percaya-diri": "Percaya Diri",
  "bicara-kelas": "Bicara di Kelas",
  "kerja-kelompok": "Kerja Kelompok",
};

const PATHS = [
  { id: "percaya-diri", name: "Percaya Diri Berkomunikasi" },
  { id: "bicara-kelas", name: "Bicara di Kelas" },
  { id: "kerja-kelompok", name: "Kerja Kelompok" },
];

const TASKS_PER_LEVEL = 5;

export default function ProgressPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [streak, setStreak] = useState(0);
  const [activeDays, setActiveDays] = useState(0);

  useEffect(() => {
    const s = loadState();
    if (!s.user) { router.replace("/onboarding"); return; }
    setState(s);
    setStreak(calculateStreak(s.dailyTasks));
    setActiveDays(countActiveDays(s.dailyTasks));
  }, [router]);

  function handleLoadDemo() {
    seedDemoData();
    const s = loadState();
    setState(s);
    setStreak(calculateStreak(s.dailyTasks));
    setActiveDays(countActiveDays(s.dailyTasks));
  }

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-ink-secondary text-sm">Memuat…</p>
      </div>
    );
  }

  const totalDone = state.dailyTasks.filter(
    (t) => t.status === "done" || t.status === "swapped"
  ).length;

  // Progres ke tingkat berikutnya
  const doneAtCurrentLevel = totalDone % TASKS_PER_LEVEL;
  const levelProgress = Math.round((doneAtCurrentLevel / TASKS_PER_LEVEL) * 100);
  const nextLevel = Math.min(state.currentLevel + 1, 5);
  const isMaxLevel = state.currentLevel >= 5;

  // Data grafik tren skor kuis
  const chartData = state.quizResults.map((r, i) => ({
    label: `Kuis ${i + 1}`,
    skor: r.total,
    tanggal: new Date(r.takenAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    }),
  }));

  const pathLabel = state.currentPathId
    ? (PATH_LABELS[state.currentPathId] ?? state.currentPathId)
    : "-";

  const earnedCount = state.earnedBadgeIds.length;

  return (
    <div className="flex flex-col gap-6">

      {/* Judul */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Perjalananmu</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Setiap langkah kecil itu berarti, {state.user?.nickname}.
        </p>
      </div>

      {/* Grid statistik */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak */}
        <Card>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Flame size={16} strokeWidth={1.75} className="text-action" />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Streak
              </span>
            </div>
            <p className="text-3xl font-bold text-ink mt-1">{streak}</p>
            <p className="text-xs text-ink-secondary">hari berturut-turut</p>
          </div>
        </Card>

        {/* Tugas selesai */}
        <Card>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={16} strokeWidth={1.75} className="text-action" />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Tugas
              </span>
            </div>
            <p className="text-3xl font-bold text-ink mt-1">{totalDone}</p>
            <p className="text-xs text-ink-secondary">tugas selesai</p>
          </div>
        </Card>

        {/* Tingkat */}
        <Card>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Star size={16} strokeWidth={1.75} className="text-action" />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Tingkat
              </span>
            </div>
            <p className="text-3xl font-bold text-ink mt-1">{state.currentLevel}</p>
            <p className="text-xs text-ink-secondary">dari 5 tingkat</p>
          </div>
        </Card>

        {/* Jurnal */}
        <Card>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <BookOpen size={16} strokeWidth={1.75} className="text-action" />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Jurnal
              </span>
            </div>
            <p className="text-3xl font-bold text-ink mt-1">{state.journalEntries.length}</p>
            <p className="text-xs text-ink-secondary">entri refleksi</p>
          </div>
        </Card>
      </div>

      {/* Progres ke tingkat berikutnya */}
      <Card>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">
              {isMaxLevel ? "Tingkat Tertinggi 🎉" : `Menuju Tingkat ${nextLevel}`}
            </p>
            <span className="text-xs font-semibold text-action bg-mint-tint px-2.5 py-0.5 rounded-full">
              {pathLabel}
            </span>
          </div>

          {isMaxLevel ? (
            <p className="text-sm text-ink-secondary">
              Kamu sudah mencapai tingkat tertinggi. Luar biasa!
            </p>
          ) : (
            <>
              <ProgressBar
                value={levelProgress}
                label={`${doneAtCurrentLevel} dari ${TASKS_PER_LEVEL} tugas`}
              />
              <p className="text-xs text-ink-faint">
                Selesaikan {TASKS_PER_LEVEL - doneAtCurrentLevel} tugas lagi untuk naik ke Tingkat {nextLevel}.
              </p>
            </>
          )}
        </div>
      </Card>

      {/* Ganti Jalur (F-09) */}
      <Card>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <RefreshCw size={15} strokeWidth={1.75} className="text-ink-faint" />
            <p className="text-sm font-semibold text-ink">Jalur Latihan</p>
          </div>
          <p className="text-xs text-ink-faint -mt-1">
            Pilih jalur yang paling sesuai kondisimu sekarang.
          </p>
          <div className="flex flex-col gap-2">
            {PATHS.map((p) => {
              const isActive = state.currentPathId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    if (isActive) return;
                    saveState({ currentPathId: p.id, currentLevel: 1 });
                    const s = loadState();
                    setState(s);
                    setStreak(calculateStreak(s.dailyTasks));
                    setActiveDays(countActiveDays(s.dailyTasks));
                  }}
                  className={[
                    "w-full text-left px-4 py-3 rounded-card border text-sm transition-colors",
                    isActive
                      ? "bg-mint-tint border-transparent text-action font-semibold"
                      : "bg-canvas border-hairline text-ink-secondary hover:border-action hover:text-ink",
                  ].join(" ")}
                >
                  <span className="font-medium">{p.name}</span>
                  {isActive && (
                    <span className="ml-2 text-xs font-normal text-ink-faint">(aktif)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Grafik tren skor kuis */}
      <Card>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">Tren Skor Kuis</p>
            <p className="text-xs text-ink-faint mt-0.5">
              Skor lebih rendah berarti hambatan terasa lebih ringan.
            </p>
          </div>

          {chartData.length >= 2 ? (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 4, right: 8, left: -28, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#DDE7E4" vertical={false} />
                    <XAxis
                      dataKey="tanggal"
                      tick={{ fontSize: 11, fill: "#8A9895" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 18]}
                      ticks={[0, 6, 12, 18]}
                      tick={{ fontSize: 11, fill: "#8A9895" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#FFFFFF",
                        border: "1px solid #DDE7E4",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "#1E2B2A",
                      }}
                      formatter={(value) => [`${value} / 18`, "Skor"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="skor"
                      stroke="#5BB5E0"
                      strokeWidth={2.5}
                      dot={{ fill: "#5BB5E0", r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#2F7A5C", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-ink-faint">
                {chartData.length} kuis diambil · {activeDays} hari aktif total
              </p>
            </>
          ) : (
            <div className="flex flex-col gap-2 py-3">
              <p className="text-sm text-ink-secondary">
                Ambil kuis minimal 2 kali untuk melihat grafik tren.
              </p>
              <p className="text-xs text-ink-faint">
                Kuis bisa diulang kapan saja dari halaman Hasil.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Lencana */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">Lencana</p>
          <p className="text-xs text-ink-faint mt-0.5">
            {earnedCount} dari {badges.length} lencana diperoleh.
          </p>
        </div>
        <div className="bg-surface border border-hairline rounded-card px-5 py-5">
          <div className="flex flex-wrap gap-5">
            {badges.map((badge) => {
              const Icon = ICON_MAP[badge.icon] ?? Star;
              const earned = state.earnedBadgeIds.includes(badge.id);
              return (
                <BadgeCard
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  Icon={Icon}
                  earned={earned}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Riwayat Refleksi (F-16) */}
      {state.journalEntries.length > 0 && (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">Riwayat Refleksi</p>
            <p className="text-xs text-ink-faint mt-0.5">
              {state.journalEntries.length} catatan tersimpan · hanya terlihat olehmu.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[...state.journalEntries].reverse().slice(0, 5).map((entry) => (
              <Card key={entry.id}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Lock size={12} className="text-ink-faint" strokeWidth={1.75} />
                    <p className="text-xs text-ink-faint">
                      {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                  {entry.answers
                    .filter((a: string) => a.trim())
                    .slice(0, 2)
                    .map((answer: string, i: number) => (
                      <p key={i} className="text-sm text-ink-secondary leading-relaxed line-clamp-2">
                        &ldquo;{answer}&rdquo;
                      </p>
                    ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tombol demo — hapus setelah presentasi */}
      <div className="flex flex-col gap-2 pt-2 border-t border-hairline">
        <p className="text-xs text-ink-faint">Mode Demo (presentasi)</p>
        <Button variant="secondary" onClick={handleLoadDemo}>
          Muat Data Demo
        </Button>
      </div>

    </div>
  );
}
