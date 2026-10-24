// Kleine service worker: maakt de app installeerbaar en laat het scherm laden bij slechte verbinding.
const CACHE = "lotje-v4";
const SHELL = ["/", "/index.html", "/style.css?v=3", "/app.js?v=4", "/config.js?v=2", "/vendor-supabase.js", "/icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
// Eerst het netwerk (altijd de nieuwste versie), cache alleen als je offline bent.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("/index.html")))
  );
});
