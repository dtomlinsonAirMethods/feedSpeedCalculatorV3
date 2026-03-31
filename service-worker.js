const CACHE_NAME = "feedSpeedCalculator-v3";

const FILES_TO_CACHE = [
  "/",
  "/feedSpeed.html",
  "/converter.html",
  "/manifest.json",
  "/styles/style.css",
  "/styles/converter.css",
  "/js/script.js",
  "/js/app.js",
  "/data/material.json",
  "/data/machines.json",
  "/data/thread.json",
  "/data/ipt.json",
  "/data/ipr.json",
  "/img/icon-192.png",
  "/img/icon-512.png",
  "/img/favicon.ico"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Skip cross-origin (CDN fonts etc.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (event.request.method === "GET" && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === "navigate") return caches.match("/feedSpeed.html");
      });
    })
  );
});
