// OnPace service worker — instant cached loads, offline support, and an
// "update ready" signal to open pages when a newer index.html is fetched.
const SHELL = "onpace-shell-v2";
const RUNTIME = "onpace-runtime-v1";
const SHELL_FILES = ["./", "./index.html", "./icon.png", "./vendor/react.production.min.js", "./vendor/react-dom.production.min.js", "./vendor/zxing.min.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Re-fetch index.html past every cache layer; if it changed, store it and tell
// open pages so they can show the update banner.
async function refreshIndex() {
  try {
    const cache = await caches.open(SHELL);
    const fresh = await fetch("./index.html", { cache: "no-cache" });
    if (!fresh.ok) return;
    const freshText = await fresh.clone().text();
    const cached = await cache.match("./index.html");
    const cachedText = cached ? await cached.text() : "";
    if (freshText !== cachedText) {
      await cache.put("./index.html", fresh.clone());
      await cache.put("./", fresh);
      const clients = await self.clients.matchAll();
      clients.forEach((cl) => cl.postMessage({ type: "update-ready" }));
    }
  } catch (err) { /* offline — serve cached */ }
}

async function cacheFirst(request) {
  const hit = await caches.match(request, { ignoreSearch: false });
  if (hit) return hit;
  const resp = await fetch(request);
  if (resp.ok || resp.type === "opaque") {
    const c = await caches.open(RUNTIME);
    c.put(request, resp.clone());
  }
  return resp;
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  if (url.origin === self.location.origin) {
    // the app shell: serve cached instantly, revalidate in the background
    if (e.request.mode === "navigate" || url.pathname.endsWith("/index.html")) {
      e.respondWith((async () => {
        const cached = await caches.match("./index.html");
        if (cached) {
          e.waitUntil(refreshIndex());
          return cached;
        }
        const resp = await fetch(e.request);
        const c = await caches.open(SHELL);
        c.put("./index.html", resp.clone());
        return resp;
      })());
      return;
    }
    e.respondWith(cacheFirst(e.request));
    return;
  }

  // fonts (and any leftover CDN scripts) are immutable — cache-first
  if (["fonts.googleapis.com", "fonts.gstatic.com", "unpkg.com"].includes(url.hostname)) {
    e.respondWith(cacheFirst(e.request));
  }
  // everything else (Anthropic API, Strava) goes straight to the network
});
