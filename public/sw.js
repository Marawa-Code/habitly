// Service Worker Habitly — cache-first untuk aset statis
// Alur P0 tetap jalan saat koneksi tidak stabil

const CACHE_NAME = "habitly-v1";

// Aset yang di-cache saat install (app shell)
const PRECACHE_URLS = [
  "/",
  "/progress",
  "/community",
  "/help",
  "/manifest.json",
];

// Install: pre-cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first untuk navigasi, cache-first untuk aset statis
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Hanya handle same-origin
  if (url.origin !== location.origin) return;

  // Aset statis (_next/static): cache-first
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached ?? fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
      )
    );
    return;
  }

  // Navigasi (HTML): network-first, fallback ke cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then((c) => c ?? caches.match("/")))
    );
    return;
  }
});

