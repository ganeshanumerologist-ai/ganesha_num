import React, { useState } from "react";
import { shareLinks } from "../config/social.js";

// Har result/blog par lagao: <ShareButtons title="..." text="..." />
export default function ShareButtons({ title, text }) {
  const [copied, setCopied] = useState("");
  const url = typeof window !== "undefined" ? window.location.href : "";
  const msg = text || title || "Numerology VIP dekho!";

  const copy = async (label) => {
    try {
      await navigator.clipboard.writeText(`${msg} ${url}`);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("Copy fail");
    }
  };

  const nativeShare = async () => {
    if (!navigator.share) { copy("Link"); return; }
    try {
      await navigator.share({ title, text: msg, url });
    } catch { /* user cancelled */ }
  };

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3>{title || "Share karein"} 📣</h3>
      <p style={{ fontSize: ".85rem" }}>Facebook, X, LinkedIn, WhatsApp, Telegram par ek tap me share karo.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {shareLinks({ url, text: msg }).map((s) => (
          <a key={s.key} className="btn secondary" style={{ padding: "8px 14px", fontSize: ".85rem" }} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
        <button className="btn secondary" style={{ padding: "8px 14px", fontSize: ".85rem" }} onClick={() => copy("Link")}>
          {copied === "Link" ? "Copied!" : "Copy Link"}
        </button>
        <button className="btn secondary" style={{ padding: "8px 14px", fontSize: ".85rem" }} onClick={() => copy("Caption")}>
          {copied === "Caption" ? "Copied!" : "Copy Caption (Insta/TikTok)"}
        </button>
        {navigator.share && (
          <button className="btn" style={{ padding: "8px 14px", fontSize: ".85rem" }} onClick={nativeShare}>
            Phone Share
          </button>
        )}
      </div>
      <p style={{ fontSize: ".75rem", marginTop: 10 }}>
        Note: Instagram/TikTok/YouTube website se seedha post nahi karne dete — Caption copy karke wahan paste karo, ya neeche Follow buttons se profile jodo.
      </p>
    </div>
  );
}
