"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  PenLine,
  X,
  Send,
  Flame,
  CheckCircle,
  MoreHorizontal,
  Flag,
  Trash2,
  ShieldAlert,
  Shield,
  Check,
} from "lucide-react";
import { Textarea } from "@/components/ui/Input";
import { loadState } from "@/lib/storage";
import { calculateStreak } from "@/lib/streak";
import type { AppState } from "@/types";

// ---- Types ----
interface CommunityPost {
  id: string;
  authorName: string;
  avatarColorIndex: number;
  timeAgo: string;
  status: "selesai" | "streak";
  streakDays?: number;
  challengeTag: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isOwn?: boolean;
  createdAt: number;
}

interface CommentItem {
  id: string;
  authorName: string;
  avatarColorIndex: number;
  timeAgo: string;
  content: string;
}

const SEED_COMMENTS: Record<string, CommentItem[]> = {
  p1: [
    {
      id: "c1",
      authorName: "Bima K.",
      avatarColorIndex: 1,
      timeAgo: "1 jam lalu",
      content:
        "Keren banget Rania! Aku juga lagi di hari ke-4, teknik 5-4-3-2-1 beneran ampuh bikin tenang pas gugup 👍",
    },
    {
      id: "c2",
      authorName: "Siti Zahra",
      avatarColorIndex: 4,
      timeAgo: "45 menit lalu",
      content:
        "Sama! Kemarin pas mau maju presentasi kelompok deg-degan banget, pas coba fokus sekeliling langsung jauh lebih tenang.",
    },
    {
      id: "c3",
      authorName: "Fajar P.",
      avatarColorIndex: 2,
      timeAgo: "30 menit lalu",
      content: "Mantap kak! Semangat terus buat lanjutin tantangan berikutnya 🔥",
    },
    {
      id: "c4",
      authorName: "Dika M.",
      avatarColorIndex: 0,
      timeAgo: "15 menit lalu",
      content:
        "Inspiratif banget ceritanya. Bikin aku makin termotivasi buat gak gampang overthinking.",
    },
  ],
};

type Tab = "terbaru" | "trending" | "selesai";

// ---- Data dummy realistis ----
const SEED_POSTS: CommunityPost[] = [
  {
    id: "p1",
    authorName: "Rania A.",
    avatarColorIndex: 3,
    timeAgo: "2 jam lalu",
    status: "selesai",
    challengeTag: "Stop Overthinking",
    content:
      "Hari ke-7 selesai! Teknik 5-4-3-2-1 beneran ngebantu banget waktu panik tiba-tiba. Otak jadi lebih tenang dan tidur makin nyenyak 🙌",
    likeCount: 48,
    commentCount: 4,
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "p2",
    authorName: "Dimas R.",
    avatarColorIndex: 2,
    timeAgo: "5 jam lalu",
    status: "streak",
    streakDays: 6,
    challengeTag: "Belajar Mengobrol",
    content:
      "Hari ini aku nyapa barista kafe dan malah ngobrol 10 menit tentang kopi. Dulu gak kebayang bisa kayak gini 😄 Terima kasih tantangan ini!",
    likeCount: 93,
    commentCount: 27,
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
  },
  {
    id: "p3",
    authorName: "Sella M.",
    avatarColorIndex: 4,
    timeAgo: "Kemarin",
    status: "streak",
    streakDays: 7,
    challengeTag: "Bilang Tidak",
    content:
      "Untuk pertama kalinya, aku nolak ajakan yang bikin aku tidak nyaman. Deg-degan banget tapi akhirnya bisa! Rasanya lega sekali.",
    likeCount: 71,
    commentCount: 18,
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
  },
  {
    id: "p4",
    authorName: "Kevin T.",
    avatarColorIndex: 1,
    timeAgo: "Kemarin",
    status: "selesai",
    challengeTag: "Angkat Tangan di Kelas",
    content:
      "Akhirnya berani angkat tangan dan jawab pertanyaan guru. Suara agak gemetar tapi guru bilang jawabanku benar. Senang banget!",
    likeCount: 56,
    commentCount: 9,
    createdAt: Date.now() - 26 * 60 * 60 * 1000,
  },
  {
    id: "p5",
    authorName: "Aira N.",
    avatarColorIndex: 0,
    timeAgo: "2 hari lalu",
    status: "selesai",
    challengeTag: "Minta Bantuan",
    content:
      "Minta tolong teman untuk jelaskan pelajaran yang ketinggalan. Ternyata teman-teman senang bantu, aku yang terlalu takut duluan 🙂",
    likeCount: 44,
    commentCount: 7,
    createdAt: Date.now() - 48 * 60 * 60 * 1000,
  },
  {
    id: "p6",
    authorName: "Bagas F.",
    avatarColorIndex: 2,
    timeAgo: "3 hari lalu",
    status: "streak",
    streakDays: 3,
    challengeTag: "Mulai Percakapan",
    content:
      "Ngurangin scroll medsos dan mulai sapa tetangga tiap pagi. Kecil tapi rasanya beda banget! Jadi lebih bersemangat setiap hari.",
    likeCount: 32,
    commentCount: 5,
    createdAt: Date.now() - 72 * 60 * 60 * 1000,
  },
];

// Warna avatar — pakai Tailwind token + extended colors
const AVATAR_COLORS = [
  "bg-mint-tint text-action",
  "bg-sky-light-tint text-info-text",
  "bg-orange-100 text-orange-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
];

// ---- Storage komunitas ----
const COMMUNITY_KEY = "habitly_community_v2";
const COMMENTS_KEY = "habitly_community_comments_v1";
const REPORTED_KEY = "habitly_community_reported_v1";

const REPORT_REASONS = [
  { id: "bullying", label: "Perundungan, menghina, atau kata-kata kasar" },
  { id: "crisis", label: "Konten membahayakan diri / butuh bantuan krisis" },
  { id: "privacy", label: "Menyebarkan nomor / data pribadi tanpa izin" },
  { id: "spam", label: "Spam, penipuan, atau iklan tidak pantas" },
  { id: "other", label: "Alasan lainnya" },
];

function loadReportedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REPORTED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReportedIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REPORTED_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

interface CommunityStorage {
  userPosts: CommunityPost[];
  likedIds: string[];
}

function loadCS(): CommunityStorage {
  if (typeof window === "undefined") return { userPosts: [], likedIds: [] };
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    if (!raw) return { userPosts: [], likedIds: [] };
    return JSON.parse(raw) as CommunityStorage;
  } catch {
    return { userPosts: [], likedIds: [] };
  }
}

function saveCS(cs: CommunityStorage): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(cs));
  } catch {
    // ignore
  }
}

function loadComments(): Record<string, CommentItem[]> {
  if (typeof window === "undefined") return SEED_COMMENTS;
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    if (!raw) return SEED_COMMENTS;
    const parsed = JSON.parse(raw);
    return { ...SEED_COMMENTS, ...parsed };
  } catch {
    return SEED_COMMENTS;
  }
}

function saveComments(map: Record<string, CommentItem[]>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export default function CommunityPage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState | null>(null);
  const [cs, setCs] = useState<CommunityStorage>({ userPosts: [], likedIds: [] });
  const [tab, setTab] = useState<Tab>("terbaru");
  const [search, setSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [draft, setDraft] = useState("");
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>(SEED_COMMENTS);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [reportedPostIds, setReportedPostIds] = useState<string[]>([]);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [reportTargetPost, setReportTargetPost] = useState<CommunityPost | null>(null);
  const [reportReason, setReportReason] = useState<string>("bullying");
  const [reportDetails, setReportDetails] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const s = loadState();
    if (!s.user) { router.replace("/onboarding"); return; }
    setAppState(s);

    const loaded = loadCS();
    setCs(loaded);
    setCommentsMap(loadComments());
    setReportedPostIds(loadReportedIds());

    // Inisialisasi hitungan like dari seed + post user
    const counts: Record<string, number> = {};
    SEED_POSTS.forEach((p) => { counts[p.id] = p.likeCount; });
    loaded.userPosts.forEach((p) => { counts[p.id] = p.likeCount; });
    setLikeCounts(counts);
  }, [router]);

  // Tutup menu opsi titik 3 saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (activeMenuPostId && !(e.target as HTMLElement).closest(".post-menu-container")) {
        setActiveMenuPostId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuPostId]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }

  function handleDeleteOwnPost(postId: string) {
    setActiveMenuPostId(null);
    const updatedUserPosts = cs.userPosts.filter((p) => p.id !== postId);
    const updatedCS: CommunityStorage = {
      ...cs,
      userPosts: updatedUserPosts,
    };
    setCs(updatedCS);
    saveCS(updatedCS);
    showToast("Ceritamu berhasil dihapus dari komunitas.");
  }

  function handleSubmitReport() {
    if (!reportTargetPost) return;
    const targetId = reportTargetPost.id;
    const updated = [...reportedPostIds, targetId];
    setReportedPostIds(updated);
    saveReportedIds(updated);
    setReportTargetPost(null);
    setReportDetails("");
    showToast("Laporan terkirim. Postingan telah disembunyikan dari linimasamu.");
  }

  function handleUndoReport(postId: string) {
    const updated = reportedPostIds.filter((id) => id !== postId);
    setReportedPostIds(updated);
    saveReportedIds(updated);
    showToast("Laporan dibatalkan. Postingan ditampilkan kembali.");
  }

  // Gabungkan post user dan seed
  const allPosts = useMemo(
    () => [...cs.userPosts, ...SEED_POSTS],
    [cs.userPosts]
  );

  // Filter dan sort berdasarkan tab & pencarian
  const filtered = useMemo(() => {
    let posts = allPosts;

    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.challengeTag.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q)
      );
    }

    if (tab === "selesai") {
      posts = posts.filter((p) => p.status === "selesai");
    }

    if (tab === "trending") {
      return [...posts].sort(
        (a, b) =>
          (likeCounts[b.id] ?? b.likeCount) -
          (likeCounts[a.id] ?? a.likeCount)
      );
    }

    return [...posts].sort((a, b) => b.createdAt - a.createdAt);
  }, [allPosts, tab, search, likeCounts]);

  function handlePost() {
    if (!draft.trim() || !appState?.user) return;
    const streak = calculateStreak(appState.dailyTasks);
    const newPost: CommunityPost = {
      id: `own-${Date.now()}`,
      authorName: appState.user.nickname,
      avatarColorIndex: 0,
      timeAgo: "Baru saja",
      status: streak >= 1 ? "streak" : "selesai",
      streakDays: streak >= 1 ? streak : undefined,
      challengeTag: "Cerita Hari Ini",
      content: draft.trim(),
      likeCount: 0,
      commentCount: 0,
      isOwn: true,
      createdAt: Date.now(),
    };
    const updated: CommunityStorage = {
      ...cs,
      userPosts: [newPost, ...cs.userPosts],
    };
    saveCS(updated);
    setCs(updated);
    setLikeCounts((prev) => ({ ...prev, [newPost.id]: 0 }));
    setDraft("");
    setShowCompose(false);
  }

  function handleLike(postId: string) {
    const liked = cs.likedIds.includes(postId);
    const delta = liked ? -1 : 1;
    const updatedLikedIds = liked
      ? cs.likedIds.filter((id) => id !== postId)
      : [...cs.likedIds, postId];

    setLikeCounts((prev) => ({
      ...prev,
      [postId]: Math.max(0, (prev[postId] ?? 0) + delta),
    }));
    const updated: CommunityStorage = { ...cs, likedIds: updatedLikedIds };
    saveCS(updated);
    setCs(updated);
  }

  function toggleComments(postId: string) {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }

  function handleAddComment(postId: string) {
    const text = (commentInputs[postId] || "").trim();
    if (!text || !appState?.user) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      authorName: appState.user.nickname,
      avatarColorIndex: 0,
      timeAgo: "Baru saja",
      content: text,
    };

    const currentList = commentsMap[postId] || [];
    const updatedList = [...currentList, newComment];
    const updatedMap = {
      ...commentsMap,
      [postId]: updatedList,
    };

    setCommentsMap(updatedMap);
    saveComments(updatedMap);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  }

  if (!appState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-ink-secondary text-sm">Memuat…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Komunitas</h1>
          <p className="mt-0.5 text-sm text-ink-secondary">
            Cerita nyata dari teman-teman yang sedang berlatih.
          </p>
        </div>
        <button
          onClick={() => setShowCompose((v) => !v)}
          className="flex items-center gap-1.5 bg-action text-white text-sm font-semibold px-4 py-2 rounded-full shadow-soft shrink-0"
        >
          <PenLine size={14} strokeWidth={2} />
          Cerita
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search
          size={15}
          strokeWidth={1.75}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
        />
        <input
          type="text"
          placeholder="Cari cerita atau tantangan…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-hairline rounded-full pl-9 pr-9 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
            aria-label="Hapus pencarian"
          >
            <X size={14} className="text-ink-faint" />
          </button>
        )}
      </div>

      {/* Compose box */}
      {showCompose && (
        <div className="bg-surface border border-action/30 rounded-card px-4 py-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide">
            Bagikan ceritamu
          </p>
          <Textarea
            placeholder="Ceritakan progresmu hari ini…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={() => { setShowCompose(false); setDraft(""); }}
              className="text-sm text-ink-faint"
            >
              Batal
            </button>
            <button
              disabled={!draft.trim()}
              onClick={handlePost}
              className="flex items-center gap-1.5 bg-action text-white text-sm font-semibold px-4 py-2 rounded-full disabled:opacity-40 transition-opacity"
            >
              <Send size={13} strokeWidth={2} />
              Kirim
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-hairline rounded-full p-1">
        {(["terbaru", "trending", "selesai"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "flex-1 py-1.5 text-sm font-semibold rounded-full transition-colors",
              tab === t
                ? "bg-action text-white"
                : "text-ink-secondary hover:text-ink",
            ].join(" ")}
          >
            {t === "terbaru" ? "Terbaru" : t === "trending" ? "Trending" : "Selesai"}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-ink-secondary text-center py-10">
            Belum ada cerita di sini.
          </p>
        ) : (
          filtered.map((post) => {
            if (reportedPostIds.includes(post.id)) {
              return (
                <div
                  key={post.id}
                  className="bg-surface/70 border border-hairline/80 rounded-card p-3.5 flex items-center justify-between gap-3 text-xs shadow-2xs animate-fadeIn"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ShieldAlert size={16} className="text-action shrink-0" />
                    <p className="text-ink-secondary truncate">
                      Cerita dari <strong>{post.authorName}</strong> telah dilaporkan & disembunyikan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUndoReport(post.id)}
                    className="text-action font-semibold hover:underline shrink-0 text-xs cursor-pointer"
                  >
                    Batalkan
                  </button>
                </div>
              );
            }

            const liked = cs.likedIds.includes(post.id);
            const likeCount = likeCounts[post.id] ?? post.likeCount;
            const colorClass =
              AVATAR_COLORS[post.avatarColorIndex % AVATAR_COLORS.length];
            const initials = post.authorName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={post.id}
                className={[
                  "bg-surface border rounded-card px-4 py-4 flex flex-col gap-3 transition-colors",
                  post.isOwn
                    ? "border-action/30"
                    : "border-hairline",
                ].join(" ")}
              >
                {/* Post header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${colorClass}`}
                    >
                      {initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-ink">
                          {post.authorName}
                        </span>
                        <span className="text-xs text-ink-faint">{post.timeAgo}</span>

                        {/* Status badge */}
                        {post.status === "selesai" ? (
                          <span className="flex items-center gap-1 bg-mint-tint text-action text-xs font-semibold px-2 py-0.5 rounded-full">
                            <CheckCircle size={11} strokeWidth={2} />
                            Selesai
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                            <Flame size={11} strokeWidth={2} />
                            Hari {post.streakDays}
                          </span>
                        )}
                      </div>

                      {/* Challenge tag */}
                      <span className="mt-1.5 inline-block bg-sky-light-tint text-info-text text-xs px-2.5 py-0.5 rounded-full">
                        {post.challengeTag}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Titik Tiga (Menu Opsi) */}
                  <div className="relative post-menu-container">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuPostId((prev) => (prev === post.id ? null : post.id))
                      }
                      aria-label="Opsi postingan"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-ink-faint hover:text-ink hover:bg-canvas transition-colors cursor-pointer shrink-0"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {activeMenuPostId === post.id && (
                      <div className="absolute right-0 top-9 w-48 bg-surface border border-hairline rounded-xl shadow-card py-1.5 z-20 flex flex-col animate-fadeIn">
                        {post.isOwn ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteOwnPost(post.id)}
                            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-danger hover:bg-danger/10 transition-colors text-left cursor-pointer"
                          >
                            <Trash2 size={14} />
                            <span>Hapus Cerita Saya</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuPostId(null);
                              setReportTargetPost(post);
                              setReportReason("bullying");
                              setReportDetails("");
                            }}
                            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-danger hover:bg-danger/10 transition-colors text-left cursor-pointer"
                          >
                            <Flag size={14} />
                            <span>Laporkan Postingan</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuPostId(null);
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(
                                `"${post.content}" - ${post.authorName} di Habitly`
                              );
                              showToast("Tautan cerita berhasil disalin ke papan klip! ✨");
                            }
                          }}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs text-ink-secondary hover:text-ink hover:bg-canvas transition-colors text-left cursor-pointer"
                        >
                          <Share2 size={14} />
                          <span>Salin Cerita</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Konten */}
                <p className="text-sm text-ink leading-relaxed">{post.content}</p>

                {/* Aksi */}
                <div className="flex items-center gap-5 pt-2 border-t border-hairline">
                  {/* Like */}
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      liked ? "text-action" : "text-ink-faint hover:text-action"
                    }`}
                    aria-label={liked ? "Batalkan suka" : "Suka"}
                  >
                    <Heart
                      size={16}
                      strokeWidth={1.75}
                      className={liked ? "fill-action" : ""}
                    />
                    {likeCount > 0 && (
                      <span className="text-xs font-medium">{likeCount}</span>
                    )}
                  </button>

                  {/* Komentar */}
                  <button
                    type="button"
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${
                      openComments[post.id]
                        ? "text-action font-semibold"
                        : "text-ink-faint hover:text-action"
                    }`}
                    aria-label={openComments[post.id] ? "Tutup komentar" : "Buka komentar"}
                  >
                    <MessageCircle
                      size={16}
                      strokeWidth={1.75}
                      className={openComments[post.id] ? "text-action fill-mint-tint" : ""}
                    />
                    <span className="text-xs font-medium">
                      {(commentsMap[post.id] || []).length || post.commentCount || 0}
                    </span>
                  </button>

                  {/* Bagikan */}
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(
                          `"${post.content}" - ${post.authorName} di Habitly`
                        );
                        showToast("Tautan cerita berhasil disalin ke papan klip! ✨");
                      }
                    }}
                    className="flex items-center gap-1.5 text-ink-faint hover:text-ink transition-colors ml-auto cursor-pointer"
                  >
                    <Share2 size={16} strokeWidth={1.75} />
                    <span className="text-xs font-medium">Bagikan</span>
                  </button>
                </div>

                {/* Section Komentar Terbuka */}
                {openComments[post.id] && (
                  <div className="flex flex-col gap-3 pt-3 mt-1 border-t border-hairline/80 bg-canvas/50 -mx-4 -mb-4 px-4 py-3.5 rounded-b-card animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink">
                        Komentar Dukungan ({(commentsMap[post.id] || []).length})
                      </span>
                      <span className="text-[10px] text-ink-faint">
                        Komunitas Ramah Remaja
                      </span>
                    </div>

                    {/* Daftar Komentar */}
                    <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {(!commentsMap[post.id] || commentsMap[post.id].length === 0) ? (
                        <p className="text-xs text-ink-faint text-center py-2">
                          Belum ada komentar. Beri dukungan pertama untuk {post.authorName}!
                        </p>
                      ) : (
                        commentsMap[post.id].map((c) => {
                          const cColor =
                            AVATAR_COLORS[c.avatarColorIndex % AVATAR_COLORS.length];
                          const cInitials = c.authorName
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                          return (
                            <div key={c.id} className="flex items-start gap-2.5 text-xs">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px] shadow-2xs ${cColor}`}
                              >
                                {cInitials}
                              </div>
                              <div className="flex-1 bg-surface border border-hairline rounded-[14px] px-3 py-2 shadow-2xs">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-bold text-ink">{c.authorName}</span>
                                  <span className="text-[10px] text-ink-faint">{c.timeAgo}</span>
                                </div>
                                <p className="text-ink-secondary leading-relaxed">{c.content}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Form Tulis Komentar */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddComment(post.id);
                      }}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        type="text"
                        placeholder={`Kirim komentar untuk ${post.authorName}…`}
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        className="flex-1 bg-surface border border-hairline rounded-full px-3.5 py-2 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-action transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!(commentInputs[post.id] || "").trim()}
                        className="w-8 h-8 rounded-full bg-action text-white flex items-center justify-center hover:bg-action-pressed disabled:opacity-40 transition-opacity cursor-pointer shrink-0 shadow-2xs"
                        aria-label="Kirim komentar"
                      >
                        <Send size={13} strokeWidth={2} />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-ink-faint text-center pb-2">
        Ceritamu tersimpan di perangkat ini · Simulasi komunitas lokal
      </p>

      {/* Modal Laporan Postingan */}
      {reportTargetPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface border border-hairline rounded-[24px] p-5 sm:p-6 shadow-card max-w-md w-full flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-danger">
                <ShieldAlert size={20} />
                <h3 className="text-base font-bold text-ink">Laporkan Postingan</h3>
              </div>
              <button
                type="button"
                onClick={() => setReportTargetPost(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-faint hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                aria-label="Tutup modal laporan"
              >
                <X size={16} />
              </button>
            </div>

            {/* Target info */}
            <div className="bg-canvas/60 border border-hairline rounded-xl p-3 text-xs text-ink-secondary leading-relaxed">
              <span className="font-semibold text-ink">Cerita dari {reportTargetPost.authorName}:</span>
              <p className="line-clamp-2 italic text-ink-faint mt-0.5">
                &ldquo;{reportTargetPost.content}&rdquo;
              </p>
            </div>

            {/* Pilihan Alasan */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-ink">
                Mengapa kamu melaporkan postingan ini?
              </label>
              <div className="flex flex-col gap-1.5">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.id}
                    onClick={() => setReportReason(r.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      reportReason === r.id
                        ? "bg-mint-tint border-action text-ink font-semibold"
                        : "bg-surface border-hairline text-ink-secondary hover:border-action/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      checked={reportReason === r.id}
                      onChange={() => setReportReason(r.id)}
                      className="accent-action"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Catatan Opsional */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-secondary">
                Keterangan tambahan (opsional)
              </label>
              <textarea
                rows={2}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Tuliskan jika ada konteks lain..."
                className="w-full bg-surface border border-hairline rounded-xl p-2.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-action transition-colors resize-none"
              />
            </div>

            {/* Safety Notice */}
            <div className="bg-canvas/80 border border-hairline rounded-xl p-3 flex items-start gap-2 text-[11px] text-ink-secondary leading-relaxed">
              <Shield size={14} className="text-action shrink-0 mt-0.5" />
              <span>
                Habitly berkomitmen menjaga ruang aman bagi remaja. Postingan ini akan disembunyikan dan dicatat untuk ditinjau tim pengawas.
              </span>
            </div>

            {/* Aksi */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportTargetPost(null)}
                className="flex-1 py-2.5 rounded-full border border-hairline text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmitReport}
                className="flex-1 py-2.5 rounded-full bg-danger text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-soft cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Flag size={13} />
                <span>Kirim Laporan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifikasi Modern & Estetik */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface/95 backdrop-blur-md border border-hairline/90 px-4 py-3 rounded-2xl shadow-card text-ink text-xs font-semibold animate-fadeIn max-w-[92vw] sm:max-w-md ring-1 ring-action/20">
          <div className="w-7 h-7 rounded-xl bg-mint-tint border border-mint/40 text-action flex items-center justify-center shrink-0 shadow-2xs">
            <Check size={14} strokeWidth={2.5} />
          </div>
          <p className="flex-1 leading-snug">{toastMessage}</p>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-ink-faint hover:text-ink hover:bg-canvas transition-colors cursor-pointer shrink-0"
            aria-label="Tutup notifikasi"
          >
            <X size={13} />
          </button>
        </div>
      )}

    </div>
  );
}
