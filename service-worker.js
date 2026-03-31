const CACHE_NAME = "feedSpeedCalculator-v4";
const BASE = "/feedSpeedCalculatorV3";

const FILES_TO_CACHE = [
  BASE + "/",
  BASE + "/index.html",
  BASE + "/feedSpeed.html",
  BASE + "/converter.html",
  BASE + "/manifest.json",
  BASE + "/styles/style.css",
  BASE + "/styles/converter.css",
  BASE + "/js/script.js",
  BASE + "/js/app.js",
  BASE + "/data/material.json",
  BASE + "/data/machines.json",
  BASE + "/data/thread.json",
  BASE + "/data/ipt.json",
  BASE + "/data/ipr.json",
  BASE + "/img/icon-192.png",
  BASE + "/img/icon-512.png",
  BASE + "/img/favicon.ico"
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
        if (event.request.mode === "navigate") {
          return caches.match(BASE + "/feedSpeed.html");
        }
      });
    })
  );
});
