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
