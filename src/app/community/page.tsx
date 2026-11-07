"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Users, Sparkles, Send, Lock } from "lucide-react";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";
import { loadState } from "@/lib/storage";
import { calculateStreak } from "@/lib/streak";
import type { AppState } from "@/types";

// ----- Kartu dukungan terpilih (preset, tanpa teks bebas) -----
const SUPPORT_MESSAGES = [
  {
    id: "s1",
    text: "Kamu tidak sendirian. Banyak dari kita merasakan hal yang sama.",
    icon: "🤝",
  },
  {
    id: "s2",
    text: "Langkah kecil tetap langkah maju. Terus pelan-pelan ya!",
    icon: "✨",
  },
  {
    id: "s3",
    text: "Berani mencoba itu sudah luar biasa, apapun hasilnya.",
    icon: "💪",
  },
  {
    id: "s4",
    text: "Hari ini mungkin berat, tapi kamu sudah sampai sejauh ini.",
    icon: "🌱",
  },
  {
    id: "s5",
    text: "Istirahat itu bukan menyerah. Besok ada kesempatan baru.",
    icon: "🌤",
  },
];

// Pencapaian yang bisa dibagikan secara anonim
const ACHIEVEMENT_TEMPLATES = [
  (streak: number) =>
    streak >= 1 ? `Seseorang baru saja berlatih selama ${streak} hari berturut-turut.` : null,
  (totalDone: number) =>
    totalDone >= 1 ? `Seseorang baru saja menyelesaikan ${totalDone} tantangan komunikasi.` : null,
  (level: number) =>
    level >= 2 ? `Seseorang baru saja naik ke Tingkat ${level} jalur komunikasi.` : null,
];

// Feed anonim yang disimulasi lokal
interface FeedItem {
  id: string;
  type: "support" | "achievement";
  text: string;
  sentAt: string; // relatif, mis. "2 menit lalu"
  supportCount: number;
}

const MOCK_FEED: FeedItem[] = [
  {
    id: "f1",
    type: "achievement",
    text: "Seseorang baru saja berlatih selama 7 hari berturut-turut.",
    sentAt: "5 menit lalu",
    supportCount: 12,
  },
  {
    id: "f2",
    type: "support",
    text: "Langkah kecil tetap langkah maju. Terus pelan-pelan ya!",
    sentAt: "12 menit lalu",
    supportCount: 8,
  },
  {
    id: "f3",
    type: "achievement",
    text: "Seseorang baru saja menyelesaikan 5 tantangan komunikasi.",
    sentAt: "23 menit lalu",
    supportCount: 6,
  },
  {
    id: "f4",
    type: "support",
    text: "Kamu tidak sendirian. Banyak dari kita merasakan hal yang sama.",
    sentAt: "1 jam lalu",
    supportCount: 21,
  },
  {
    id: "f5",
    type: "achievement",
    text: "Seseorang baru saja naik ke Tingkat 3 jalur komunikasi.",
    sentAt: "2 jam lalu",
    supportCount: 15,
  },
];

// Storage key untuk support yang sudah dikirim hari ini
const COMMUNITY_KEY = "habitly_community";

interface CommunityState {
  sentSupportIds: string[];
  sentAchievement: boolean;
  likedFeedIds: string[];
  feedItems: FeedItem[];
}

function loadCommunityState(): CommunityState {
  if (typeof window === "undefined")
    return { sentSupportIds: [], sentAchievement: false, likedFeedIds: [], feedItems: MOCK_FEED };
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    if (!raw) return { sentSupportIds: [], sentAchievement: false, likedFeedIds: [], feedItems: MOCK_FEED };
    return { sentSupportIds: [], sentAchievement: false, likedFeedIds: [], feedItems: MOCK_FEED, ...JSON.parse(raw) };
  } catch {
    return { sentSupportIds: [], sentAchievement: false, likedFeedIds: [], feedItems: MOCK_FEED };
  }
}

function saveCommunityState(cs: CommunityState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(cs));
  } catch {
    // ignore
  }
}

export default function CommunityPage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState | null>(null);
  const [cs, setCs] = useState<CommunityState | null>(null);
  const [justSent, setJustSent] = useState<string | null>(null); // id pesan yang baru dikirim

  useEffect(() => {
    const s = loadState();
    if (!s.user) { router.replace("/onboarding"); return; }
    setAppState(s);
    setCs(loadCommunityState());
  }, [router]);

  if (!appState || !cs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-ink-secondary text-sm">Memuat…</p>
      </div>
    );
  }

  const streak = calculateStreak(appState.dailyTasks);
  const totalDone = appState.dailyTasks.filter(
    (t) => t.status === "done" || t.status === "swapped"
  ).length;
  const level = appState.currentLevel;

  // Cari pencapaian yang layak dibagikan
  const achievementText =
    streak >= 1
      ? ACHIEVEMENT_TEMPLATES[0](streak)
      : totalDone >= 1
      ? ACHIEVEMENT_TEMPLATES[1](totalDone)
      : level >= 2
      ? ACHIEVEMENT_TEMPLATES[2](level)
      : null;

  function handleSendSupport(msg: (typeof SUPPORT_MESSAGES)[0]) {
    if (!cs) return;
    const newItem: FeedItem = {
      id: `user-s-${Date.now()}`,
      type: "support",
      text: msg.text,
      sentAt: "Baru saja",
      supportCount: 0,
    };
    const updated: CommunityState = {
      ...cs,
      sentSupportIds: [...cs.sentSupportIds, msg.id],
      feedItems: [newItem, ...cs.feedItems],
    };
    saveCommunityState(updated);
    setCs(updated);
    setJustSent(msg.id);
    setTimeout(() => setJustSent(null), 2500);
  }

  function handleShareAchievement() {
    if (!cs || !achievementText) return;
    const newItem: FeedItem = {
      id: `user-a-${Date.now()}`,
      type: "achievement",
      text: achievementText,
      sentAt: "Baru saja",
      supportCount: 0,
    };
    const updated: CommunityState = {
      ...cs,
      sentAchievement: true,
      feedItems: [newItem, ...cs.feedItems],
    };
    saveCommunityState(updated);
    setCs(updated);
    setJustSent("achievement");
    setTimeout(() => setJustSent(null), 2500);
  }

  function handleLikeFeed(itemId: string) {
    if (!cs) return;
    const alreadyLiked = cs.likedFeedIds.includes(itemId);
    const updatedFeed = cs.feedItems.map((f) => {
      if (f.id !== itemId) return f;
      return { ...f, supportCount: alreadyLiked ? Math.max(0, f.supportCount - 1) : f.supportCount + 1 };
    });
    const updated: CommunityState = {
      ...cs,
      likedFeedIds: alreadyLiked
        ? cs.likedFeedIds.filter((id) => id !== itemId)
        : [...cs.likedFeedIds, itemId],
      feedItems: updatedFeed,
    };
    saveCommunityState(updated);
    setCs(updated);
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Judul */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Komunitas</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Saling menyemangati secara anonim. Tanpa nama, tanpa peringkat.
        </p>
      </div>

      {/* Banner anonim */}
      <div className="bg-sky-light-tint rounded-card px-5 py-4 flex gap-3 items-start">
        <Lock size={18} strokeWidth={1.75} className="text-info-text shrink-0 mt-0.5" />
        <p className="text-sm text-info-text leading-relaxed">
          Semua aktivitas di sini <strong>anonim dan tanpa peringkat</strong>.
          Tidak ada yang tahu siapa kamu — hanya semangat yang dibagikan.
        </p>
      </div>

      {/* Kirim dukungan */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Heart size={16} strokeWidth={1.75} className="text-action" />
          <p className="text-sm font-semibold text-ink">Kirim semangat</p>
        </div>
        <p className="text-xs text-ink-faint -mt-1">
          Pilih satu pesan di bawah untuk dikirim ke feed anonim.
        </p>
        <div className="flex flex-col gap-2">
          {SUPPORT_MESSAGES.map((msg) => {
            const alreadySent = cs.sentSupportIds.includes(msg.id);
            const isSending = justSent === msg.id;
            return (
              <button
                key={msg.id}
                disabled={alreadySent}
                onClick={() => handleSendSupport(msg)}
                className={`flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-card border transition-all min-h-[52px] ${
                  isSending
                    ? "border-action bg-mint-tint"
                    : alreadySent
                    ? "border-hairline bg-canvas cursor-not-allowed"
                    : "border-hairline bg-surface hover:border-action/40 hover:bg-mint-tint/30"
                }`}
              >
                <span className="text-lg shrink-0" aria-hidden="true">
                  {msg.icon}
                </span>
                <span
                  className={`text-sm flex-1 leading-snug ${
                    alreadySent ? "text-ink-faint" : "text-ink-secondary"
                  }`}
                >
                  {msg.text}
                </span>
                {isSending ? (
                  <Chip variant="mint" className="shrink-0 text-xs py-0.5 px-2">
                    Terkirim ✓
                  </Chip>
                ) : alreadySent ? (
                  <span className="text-xs text-ink-faint shrink-0">Sudah dikirim</span>
                ) : (
                  <Send
                    size={15}
                    strokeWidth={1.75}
                    className="text-action shrink-0 opacity-50"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bagikan pencapaian */}
      {achievementText && (
        <Card accent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} strokeWidth={1.75} className="text-action" />
              <p className="text-sm font-semibold text-ink">Bagikan pencapaianmu</p>
            </div>
            <p className="text-sm text-ink-secondary leading-relaxed bg-canvas rounded-input px-3 py-2.5 border border-hairline">
              {achievementText}
            </p>
            <p className="text-xs text-ink-faint">
              Dibagikan secara anonim — tanpa nama atau identitasmu.
            </p>
            {cs.sentAchievement ? (
              <Chip variant="mint" className="self-start">
                Sudah dibagikan ✓
              </Chip>
            ) : (
              <Button
                variant={justSent === "achievement" ? "secondary" : "primary"}
                onClick={handleShareAchievement}
                className="self-start"
              >
                {justSent === "achievement" ? "Terkirim! ✓" : "Bagikan secara anonim"}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Feed anonim */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Users size={16} strokeWidth={1.75} className="text-action" />
          <p className="text-sm font-semibold text-ink">Dari komunitas</p>
        </div>
        <div className="flex flex-col gap-2">
          {cs.feedItems.slice(0, 8).map((item) => {
            const liked = cs.likedFeedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`bg-surface border border-hairline rounded-card px-4 py-3.5 flex flex-col gap-2.5 ${
                  item.sentAt === "Baru saja" ? "border-action/30 bg-mint-tint/20" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Ikon tipe */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === "achievement" ? "bg-mint-tint" : "bg-sky-light-tint"
                    }`}
                  >
                    {item.type === "achievement" ? (
                      <Sparkles
                        size={14}
                        strokeWidth={1.75}
                        className="text-action"
                      />
                    ) : (
                      <Heart
                        size={14}
                        strokeWidth={1.75}
                        className="text-info-text"
                      />
                    )}
                  </div>
                  <p className="text-sm text-ink leading-snug flex-1">{item.text}</p>
                </div>

                {/* Footer: waktu + tombol dukung */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-faint">{item.sentAt}</span>
                  <button
                    onClick={() => handleLikeFeed(item.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors min-h-[32px] ${
                      liked
                        ? "bg-mint-tint text-action"
                        : "bg-canvas border border-hairline text-ink-secondary hover:border-action/40 hover:text-action"
                    }`}
                    aria-label={liked ? "Batalkan dukungan" : "Beri dukungan"}
                  >
                    <Heart
                      size={12}
                      strokeWidth={2}
                      className={liked ? "fill-action text-action" : ""}
                    />
                    {item.supportCount > 0 && (
                      <span>{item.supportCount}</span>
                    )}
                    {!liked && <span>Dukung</span>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer bawah */}
      <div className="flex gap-2 items-start text-xs text-ink-faint pb-2">
        <Lock size={12} strokeWidth={1.75} className="shrink-0 mt-0.5" />
        <span>
          Tidak ada identitas yang dikumpulkan. Semua pesan bersifat anonim dan
          dipilih dari daftar preset. Tidak ada teks bebas.
        </span>
      </div>

    </div>
  );
}
