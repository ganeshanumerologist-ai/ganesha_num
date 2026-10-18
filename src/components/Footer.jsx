import React, { useEffect, useState } from "react";
import { SOCIAL_DEFAULTS, SOCIAL_META } from "../config/social.js";
import { needFirebase } from "../firebaseLazy.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { langPath } from "../seo/routes.js";

const ICONS = {
  facebook: "f",
  instagram: "◉",
  youtube: "▶",
  x: "✕",
  linkedin: "in",
  tiktok: "♪",
};

// ─────────────────────────────────────────────────────────────
//  FOOTER SITEMAP
//
//  Footer me pehle sirf social icons thay — ek bhi internal link nahi.
//  Isi wajah se 8 page (match, remedies, shani, experts, about,
//  contact, blog, login) ka koi inbound link nahi tha. Google unhe
//  "orphan" samajhta hai — bahut kam crawl hota.
//
//  Har link bhasha prefix ke saath jaata hai, isliye footer par click
//  karne par bhasha nahi badalti.
// ─────────────────────────────────────────────────────────────
const FOOTER_LINKS = [
  {
    title: "app_name",
    items: [
      ["/kundli", "nav_kundli_page"],
      ["/panchang", "nav_panchang"],
      ["/rashifal", "nav_rashifal"],
      ["/muhurat", "nav_muhurat"],
    ],
  },
  {
    title: "nav_calculator",
    items: [
      ["/calculator", "nav_calculator"],
      ["/loshu", "nav_loshu"],
      ["/charts", "nav_charts"],
      ["/calendar", "nav_calendar"],
      ["/forecast", "nav_varshphal"],
      ["/reports", "nav_reports"],
    ],
  },
  {
    title: "nav_jyotish",
    items: [
      ["/match", "nav_match"],
      ["/remedies", "nav_remedies"],
      ["/shani", "nav_shani_title"],
      ["/gochar", "nav_gochar"],
      ["/daily", "nav_daily"],
    ],
  },
  {
    title: "nav_about",
    items: [
      ["/experts", "nav_experts"],
      ["/blog", "nav_blog"],
      ["/about", "nav_about"],
      ["/contact", "nav_contact"],
      ["/login", "nav_login"],
    ],
  },
];

export default function Footer() {
  const { t, lang } = useLanguage();
  const [social, setSocial] = useState(SOCIAL_DEFAULTS);

  useEffect(() => {
    let dead = false;
    // Dynamic import — pehle static tha, isliye Firebase har page ke
    // pehle load me chala jaata tha
    (async () => {
      try {
        const F = await needFirebase();
        const snap = await F.getDoc(F.doc(F.db, "settings", "social"));
        if (!dead && snap.exists()) setSocial({ ...SOCIAL_DEFAULTS, ...snap.data() });
      } catch { /* defaults */ }
    })();
    return () => { dead = true; };
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
      {/* ── Footer sitemap ──
           har page ko yahan se 1 inbound link mil gaya */}
      <nav className="nv-footer-map" aria-label={t("nav_grid")}>
        {FOOTER_LINKS.map((col) => (
          <div key={col.title} className="nv-footer-col">
            <h3>{t(col.title)}</h3>
            <ul>
              {col.items.map(([path, key]) => (
                <li key={path}>
                  <a href={langPath(path, lang)}>{t(key)}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <p>© {new Date().getFullYear()} {t("app_name")} · {t("footer_tagline")}</p>
      <p style={{ marginTop: 6 }}>{t("footer_powered")}</p>
    </footer>
  );
}
