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

  useEffect(() => {
    const s = loadState();
    if (!s.user) { router.replace("/onboarding"); return; }
    setAppState(s);

    const loaded = loadCS();
    setCs(loaded);
    setCommentsMap(loadComments());

    // Inisialisasi hitungan like dari seed + post user
    const counts: Record<string, number> = {};
    SEED_POSTS.forEach((p) => { counts[p.id] = p.likeCount; });
    loaded.userPosts.forEach((p) => { counts[p.id] = p.likeCount; });
    setLikeCounts(counts);
  }, [router]);

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
                  "bg-surface border rounded-card px-4 py-4 flex flex-col gap-3",
                  post.isOwn
                    ? "border-action/30"
                    : "border-hairline",
                ].join(" ")}
              >
                {/* Post header */}
                <div className="flex items-start gap-3">
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

                  {/* Bagikan (dekoratif) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(
                          `"${post.content}" - ${post.authorName} di Habitly`
                        );
                        alert("Tautan cerita berhasil disalin!");
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

    </div>
  );
}
