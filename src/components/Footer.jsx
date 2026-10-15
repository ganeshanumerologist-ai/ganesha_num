import React, { useEffect, useState } from "react";
import { SOCIAL_DEFAULTS, SOCIAL_META } from "../config/social.js";
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";

const ICONS = {
  facebook: "f",
  instagram: "◉",
  youtube: "▶",
  x: "✕",
  linkedin: "in",
  tiktok: "♪",
};

export default function Footer() {
  const [social, setSocial] = useState(SOCIAL_DEFAULTS);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "social"));
        if (snap.exists()) setSocial({ ...SOCIAL_DEFAULTS, ...snap.data() });
      } catch { /* defaults */ }
    })();
  }, []);

  const active = SOCIAL_META.filter((m) => social[m.key]);

  return (
    <footer className="footer">
      {active.length > 0 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          {active.map((m) => (
            <a
              key={m.key}
              href={social[m.key]}
              target="_blank"
              rel="noreferrer"
              title={m.label}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: ".9rem", color: m.color,
              }}
            >
              {ICONS[m.key]}
            </a>
          ))}
        </div>
      )}
      <p>© {new Date().getFullYear()} Numerology VIP · Unlock your destiny with the power of numbers.</p>
      <p style={{ marginTop: 6 }}>Powered by React + Firebase (Hosting & Storage)</p>
    </footer>
  );
}
