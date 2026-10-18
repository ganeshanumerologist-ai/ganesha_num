import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// ── Service worker ────────────────────────────────────────────────
// Mobile par browser purana index.html cache me rakh leta tha, jiski
// wajah se purana bundle chalta tha (num galat dikhte the). SW HTML par
// network-first hai, isliye ab har visit par naya code milega.
// Assets cache-first hain (unka naam hash hai, isliye badalna = naya).
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // naya SW turant active ho — purana page band karke reload
        reg.addEventListener("updatefound", () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener("statechange", () => {
            if (sw.state === "installed" && navigator.serviceWorker.controller) {
              sw.postMessage("skip-waiting");
              location.reload();
            }
          });
        });
      })
      .catch(() => { /* ignore */ });
  });
}

// ════════════════════════════════════════════════════════════════════
//  STALE-CACHE SELF-HEAL
//
//  User ne report kiya: "mobile pe jo aa raha hai wo DARK wala purana
//  version aa raha hai" — jabki server par naya (cream) code tha.
//
//  Ye un devices ke liye hai jahan:
//    • service worker purana chal raha hai aur activate nahi hua
//    • ya browser ne HTML cache me rakh liya hai
//
//  Har load par `version.json` (no-store) se current build id padhte
//  hain. Agar wo localStorage wale se alag hai, to:
//    1. saare caches delete
//    2. SW ko "purge-all" message
//    3. ek baar reload
//
//  Isse user ko "clear cache / hard refresh" karne ki zaroorat hi
//  nahi padti — khud theek ho jaata hai.
// ════════════════════════════════════════════════════════════════════
(async function selfHeal() {
  if (!import.meta.env.PROD) return;
  const KEY = "nv-build";
  const GUARD = "nv-build-checked";

  // ek hi baar per session me check — har render par nahi
  if (sessionStorage.getItem(GUARD) === "1") return;
  sessionStorage.setItem(GUARD, "1");

  try {
    const res = await fetch("/version.json", { cache: "no-store" });
    if (!res.ok) return;
    const { build } = await res.json();
    if (!build) return;

    const seen = localStorage.getItem(KEY);
    if (seen === build) return;      // sab theek hai

    // pehli baar (naya user) — bas record kar do
    if (!seen) {
      localStorage.setItem(KEY, build);
      return;
    }

    // build badla → purana cache saaf karo
    localStorage.setItem(KEY, build);

    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }

    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage("purge-all");
      navigator.serviceWorker.getRegistration().then((r) => r && r.update && r.update());
    }

    sessionStorage.removeItem(GUARD);   // reload ke baad dobara check ho sake
    location.reload();
  } catch {
    /* offline — koi kaam nahi */
  }
})();
