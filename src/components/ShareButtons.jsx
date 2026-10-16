import React, { useState } from "react";
import { shareLinks } from "../config/social.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

// Har result/blog par lagao: <ShareButtons title="..." text="..." />
export default function ShareButtons({ title, text }) {
  const { S } = useLanguage();
  const [copied, setCopied] = useState("");
  const url = typeof window !== "undefined" ? window.location.href : "";
  const msg = text || title || S.share_default_msg;

  const copy = async (label) => {
    try {
      await navigator.clipboard.writeText(`${msg} ${url}`);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied(S.share_copy_fail);
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
      <h3>{title || S.share_title} 📣</h3>
      <p style={{ fontSize: ".85rem" }}>{S.share_sub}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {shareLinks({ url, text: msg }).map((s) => (
          <a key={s.key} className="btn secondary" style={{ padding: "8px 14px", fontSize: ".85rem" }} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
        <button className="btn secondary" style={{ padding: "8px 14px", fontSize: ".85rem" }} onClick={() => copy("Link")}>
          {copied === "Link" ? S.share_copied : S.share_copy_link}
        </button>
        <button className="btn secondary" style={{ padding: "8px 14px", fontSize: ".85rem" }} onClick={() => copy("Caption")}>
          {copied === "Caption" ? S.share_copied : S.share_copy_caption}
        </button>
        {navigator.share && (
          <button className="btn" style={{ padding: "8px 14px", fontSize: ".85rem" }} onClick={nativeShare}>
            {S.share_phone}
          </button>
        )}
      </div>
      <p style={{ fontSize: ".75rem", marginTop: 10 }}>
        {S.share_note}
      </p>
    </div>
  );
}
