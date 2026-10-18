// ════════════════════════════════════════════════════════════════════
//  BREADCRUMB — screen par dikhta hai
//
//  JSON-LD breadcrumb pehle se tha, par sirf machine ke liye. Google
//  visible breadcrumb ko bhi internal-link signal maanta hai, aur
//  user ko pata chalta hai ki woh kahan-kahan se aaya hai.
//
//  Baaki: har breadcrumb item ek <a> hai — matlab ye har page ko
//  2-3 internal link deta hai automatically. Isse "orphan" pages
//  (jinke koi inbound link nahi tha) bhi mil jaate hain.
// ════════════════════════════════════════════════════════════════════
import React from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { langPath, routeFor, pageFromPath } from "../seo/routes.js";
import { ALL_POSTS } from "../data/blog.js";

const POST_BY_SLUG = Object.fromEntries(ALL_POSTS.map((p) => [p.id, p]));

// ── Non-feature pages jo breadcrumb me dikhne chahiye ──
// (feature pages ka apna page-header hota hai, wahan breadcrumb redundant lagta hai)
const PLAIN_PAGES = new Set(["/", "/about", "/contact", "/blog", "/login"]);

export default function Breadcrumb() {
  const loc = useLocation();
  const { t, lang } = useLanguage();

  const page = pageFromPath(loc.pathname);
  if (PLAIN_PAGES.has(page)) return null;

  const route = routeFor(page);

  // blog post ka title uske data file me hai — translations me nahi.
  // Isi liye pehle "Home > Home" dikh raha tha.
  const label =
    (route.isBlog && route.slug && POST_BY_SLUG[route.slug]?.title) ||
    t(route.key) ||
    t("nav_home");
  const home = t("nav_home");

  return (
    <nav className="nv-crumb" aria-label="Breadcrumb">
      <ol>
        <li>
          <a href={langPath("/", lang)}>{home}</a>
        </li>
        <li aria-current="page">{label}</li>
      </ol>
    </nav>
  );
}