"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Halaman detail tugas — saat ini redirect ke beranda.
 * Dikembangkan lebih lanjut jika ada waktu (F-16: riwayat tugas).
 */
export default function TaskDetailPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-ink-secondary text-sm">Memuat…</p>
    </div>
  );
}
