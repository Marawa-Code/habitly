"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("[SW] Terdaftar:", reg.scope);
      })
      .catch((err) => {
        console.warn("[SW] Gagal daftar:", err);
      });
  }, []);

  return null;
}

