// SW v5 — HTML ko CACHE karna hi nahi.
//
// Kyun v5:
// v3 me navigation network-first tha (offline par cache se purana HTML).
// v4 me bhi cache rakha gaya tha. User ke phone par DARK page phir bhi
// aa raha hai — matlab browser/SW purane HTML tak pahunch raha hai.
//
// Ab: navigation par CACHE LIKHNA HI NAHI. Purana HTML kahin se serve
// hi nahi hoga, to dark wala page dobara nahi aa sakta. Offline par
// bhi saaf message (purana page nahi).
const CACHE = "gs-astro-v5";
const PREFIX = "gs-astro-";

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "skip-waiting") self.skipWaiting();
  if (e.data === "purge-all") {
    e.waitUntil(caches.keys().then((k) => Promise.all(k.map((x) => caches.delete(x)))));
  }
});

const OFFLINE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Offline</title>
<style>body{font-family:system-ui;background:#fdf6ee;color:#2b141c;display:grid;
place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px}
h1{color:#7a4d00}p{color:#6a4351}</style></head>
<body><div><h1>Offline</h1>
<p>Aap internet se jude nahi hain.</p>
<p>Jaise hi connection aayega, naya page apne aap khul jaayega.</p>
</div></body></html>`;

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // ── 1. version.json: hamesha network ──
  // Isko main.jsx padhta hai. Agar SW ise cache kar de to self-heal
  // kabhi trigger hi nahi hoga.
  if (url.pathname === "/version.json") {
    event.respondWith(
      fetch(req, { cache: "no-store" }).catch(() =>
        new Response('{"build":"offline"}', { headers: { "Content-Type": "application/json" } })
      )
    );
    return;
  }

  // ── 2. HTML / navigation ──
  //    CACHE ME KABHI LIKHNA NAHI. Yahi ek rule purane dark page ko
  //    dobara serve hone se rokta hai.
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(
      fetch(req, { cache: "no-store" }).catch(
        () => new Response(OFFLINE, {
          status: 503,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        })
      )
    );
    return;
  }

  // ── 3. Hashed assets: cache-first (safe — naam badla = naya file) ──
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          })
      )
    );
    return;
  }

  // ── 4. Baaki: network, phir cache ──
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req))
  );
});