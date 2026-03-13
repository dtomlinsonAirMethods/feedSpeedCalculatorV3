const CACHE_NAME = "feedSpeedCalculator-v2";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/styles/style.css",
  "/js/script.js",
  "/data/material.json",
  "/data/machines.json",
  "/data/thread.json",
  "/data/ipt.json",
  "/data/ipr.json",
  "/img/icon-192.png",
  "/img/icon-512.png",
  "/img/favicon.ico"
];

// INSTALL
self.addEventListener("install", (event) => {
  console.log("📦 Installing Service Worker...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker Activated");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🗑 Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          // Only cache successful GET requests
          if (
            event.request.method === "GET" &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Optional: fallback to index for SPA
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});