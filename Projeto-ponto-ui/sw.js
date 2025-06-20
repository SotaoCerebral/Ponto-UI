const CACHE_NAME = "ponto-cache-v2";
const urlsToCache = [
  "admin.html",
  "index.html",
  "cadastro.html",
  "ponto.html",
  "css/styles.css",
  "js/api.js",
  "js/theme.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
