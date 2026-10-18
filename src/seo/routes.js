// ════════════════════════════════════════════════════════════════════
//  SEO ROUTE REGISTRY
//
//  Pehle poori site par EKHI title/description thi — Google ke liye
//  20 pages = 20 copies of the same page. Ab har page ka apna hai.
//
//  Har entry:
//    path      URL (bina bhasha ke — bhasha prefix alag se lagta hai)
//    key       translations.js ka label key (22 bhasha me translated)
//    descKey   description ka key
//    priority  0–1 sitemap me
//    changefreq  Google ko kitni baar dekhna chahiye
//    noindex   true = search me mat daalo
// ════════════════════════════════════════════════════════════════════

export const BRAND = "Ganesha Suyog Astrology";
export const BRAND_NATIVE = "GANESHA SUYOG ASTROLOGY";
export const SITE_URL = "https://ganeshanumrologisty.web.app";

export const ROUTES = [
  {
    path: "/",
    key: "nav_home",
    descKey: "seo_desc_home",
    priority: 1.0,
    changefreq: "daily",
    // lastmod: Google ko batata hai page kab sach me badla. Har build
    // par aaj ka date daalne se "ye baar bhara hai" ka jhootha signal
    // jaata hai, isliye har page ka apna date hai.
    lastmod: "2026-10-18",
  },
  {
    path: "/kundli",
    key: "nav_kundli_page",
    descKey: "seo_desc_kundli",
    priority: 0.95,
    changefreq: "weekly",
    lastmod: "2026-10-18",
  },
  {
    path: "/panchang",
    key: "nav_panchang",
    descKey: "seo_desc_panchang",
    priority: 0.9,
    changefreq: "daily",
    lastmod: "2026-10-18",
  },
  {
    path: "/rashifal",
    key: "nav_rashifal",
    descKey: "seo_desc_rashifal",
    priority: 0.9,
    changefreq: "daily",
    lastmod: "2026-10-18",
  },
  {
    path: "/loshu",
    key: "nav_loshu",
    descKey: "seo_desc_loshu",
    priority: 0.85,
    changefreq: "weekly",
    lastmod: "2026-10-18",
  },
  {
    path: "/calculator",
    key: "nav_calculator",
    descKey: "seo_desc_calculator",
    priority: 0.85,
    changefreq: "monthly",
    lastmod: "2026-10-18",
  },
  {
    path: "/charts",
    key: "nav_charts",
    descKey: "seo_desc_charts",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: "2026-10-18",
  },
  {
    path: "/forecast",
    key: "nav_varshphal",
    descKey: "seo_desc_forecast",
    priority: 0.8,
    changefreq: "weekly",
    lastmod: "2026-10-18",
  },
  {
    path: "/calendar",
    key: "nav_calendar",
    descKey: "seo_desc_calendar",
    priority: 0.8,
    changefreq: "daily",
    lastmod: "2026-10-18",
  },
  {
    path: "/muhurat",
    key: "nav_muhurat",
    descKey: "seo_desc_muhurat",
    priority: 0.85,
    changefreq: "daily",
    lastmod: "2026-10-18",
  },
  {
    path: "/reports",
    key: "nav_reports",
    descKey: "seo_desc_reports",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: "2026-10-18",
  },
  {
    path: "/gochar",
    key: "nav_gochar",
    descKey: "seo_desc_gochar",
    priority: 0.75,
    changefreq: "weekly",
    lastmod: "2026-10-18",
  },
  {
    path: "/daily",
    key: "nav_daily",
    descKey: "seo_desc_daily",
    priority: 0.75,
    changefreq: "daily",
    lastmod: "2026-10-18",
  },
  {
    path: "/match",
    key: "nav_match",
    descKey: "seo_desc_match",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: "2026-10-18",
  },
  {
    path: "/remedies",
    key: "nav_remedies",
    descKey: "seo_desc_remedies",
    priority: 0.75,
    changefreq: "monthly",
    lastmod: "2026-10-18",
  },
  {
    path: "/shani",
    key: "nav_shani_title",
    descKey: "seo_desc_shani",
    priority: 0.7,
    changefreq: "weekly",
    lastmod: "2026-10-18",
  },
  {
    path: "/experts",
    key: "nav_experts",
    descKey: "seo_desc_experts",
    priority: 0.7,
    changefreq: "weekly",
    lastmod: "2026-10-18",
  },
  {
    path: "/about",
    key: "nav_about",
    descKey: "seo_desc_about",
    priority: 0.5,
    changefreq: "monthly",
    lastmod: "2026-10-18",
  },
  {
    path: "/contact",
    key: "nav_contact",
    descKey: "seo_desc_contact",
    priority: 0.5,
    changefreq: "monthly",
    lastmod: "2026-10-18",
  },
  {
    path: "/blog",
    key: "nav_blog",
    descKey: "seo_desc_blog",
    priority: 0.6,
    changefreq: "weekly",
    lastmod: "2026-10-18",
  },

  // ── login: index hona chahiye (users yahin se aate hain) ──
  {
    path: "/login",
    key: "nav_login",
    descKey: "seo_desc_login",
    priority: 0.6,
    changefreq: "monthly",
    lastmod: "2026-10-18",
  },

  // ── inhe index NAHI karna ──
  { path: "/admin", key: "nav_admin", noindex: true, priority: 0, changefreq: "never" },
  { path: "/dashboard", key: "nav_dashboard", noindex: true, priority: 0, changefreq: "never" },
  { path: "/gallery", key: "nav_gallery", noindex: true, priority: 0, changefreq: "never" },
  { path: "/chat", key: "nav_chat", noindex: true, priority: 0, changefreq: "never" },
];

// ════════════════════════════════════════════════════════════════════
//  BLOG POSTS
//
//  6 article hain — yahi wo queries hain jin par log actually search
//  karte hain ("mulank 1 ke upay", "bhagyank 8 dhan", "naam se bhagyank
//  sudhrega"). Feature pages par to koi search nahi — blog par aata hai.
//
//  Inhe registry me daalne se inhe apne aap mil jaate hain:
//  sitemap entry, prerendered HTML, JSON-LD, canonical, hreflang.
//  Pehle ye sirf `/blog` page tak hi index ho pa rahe the.
// ════════════════════════════════════════════════════════════════════
const BLOG_SLUGS = [
  ["mulank-1-upay", 0.7, "monthly"],
  ["bhagyank-8-dhan", 0.7, "monthly"],
  ["shaadi-milan-ank", 0.7, "monthly"],
  ["mobile-number-upay", 0.65, "monthly"],
  ["personal-year-cycle", 0.65, "monthly"],
  ["naam-spelling-upay", 0.65, "monthly"],
  // ── doosri batch (blog2.js) ──
  ["ashay-rup-kya-hai", 0.7, "monthly"],
  ["lo-shu-grid-kaise-banaye", 0.75, "monthly"],
  ["navamsa-16-varga", 0.7, "monthly"],
  ["gemstone-kab-pehne", 0.7, "monthly"],
  ["panchang-tithi-kya-hai", 0.7, "monthly"],
  ["dasha-kya-hai-9-graha", 0.7, "monthly"],
];

export const BLOG_ROUTES = BLOG_SLUGS.map(([slug, priority, changefreq]) => ({
  path: `/blog/${slug}`,
  // blog post ka title uske data file me hai, translations me nahi —
  // isliye `key` blog slug hi rakha hai aur prerender/Seo isse
  // POSTS se dhoondhega.
  key: `blog_${slug.replace(/-/g, "_")}`,
  descKey: `seo_desc_blog_${slug.replace(/-/g, "_")}`,
  priority,
  changefreq,
  lastmod: "2026-10-18",
  isBlog: true,
  slug,
}));

export const INDEXABLE = ROUTES.filter((r) => !r.noindex);
export const NOINDEX = ROUTES.filter((r) => r.noindex);

/** Blog ke saath — sitemap + prerender yahi use karte hain */
export const ALL_INDEXABLE = [...INDEXABLE, ...BLOG_ROUTES];

// ════════════════════════════════════════════════════════════════════
//  URL <-> bhasha
//
//  Pehle bhasha sirf localStorage me thi — matlab Google har page par
//  sirf ENGLISH dekhta tha. 22 bhasha ka SEO tab hi banta hai jab har
//  bhasha ka apna URL ho:
//
//      /kundli      → English
//      /hi/kundli   → हिन्दी
//      /ta/kundli   → தமிழ்
//
//  Firebase ka `**` → `/index.html` rewrite already har path par
//  index.html deta hai, isliye koi hosting change nahi chahiye.
// ════════════════════════════════════════════════════════════════════

export function routeFor(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return (
    ROUTES.find((r) => r.path === clean) ||
    // blog post bhi — pehle sirf ROUTES me dhoondha tha. Isi wajah se
    // har blog page par HOME ka title aa raha tha aur breadcrumb
    // "Home > Home" dikha raha tha.
    BLOG_ROUTES.find((r) => r.path === clean) ||
    ROUTES[0]
  );
}

/** `/` + `/hi` → `/hi` ; `/kundli` + `hi` → `/hi/kundli` */
export function langPath(path, lang) {
  if (!lang || lang === "en") return path;
  const base = path === "/" ? "" : path;
  return `/${lang}${base}`;
}

export function fullUrl(path, lang) {
  return SITE_URL + langPath(path, lang);
}

/** `/hi/kundli` → `hi`. Agar pehla segment bhasha nahi hai to `en`. */
export function langFromPath(pathname) {
  const seg = (pathname || "/").split("/").filter(Boolean)[0];
  if (seg && LANG_CODES.includes(seg)) return seg;
  return "en";
}

/** `/hi/kundli` → `/kundli` (bhasha prefix hata do, asli page path) */
export function pageFromPath(pathname) {
  const segs = (pathname || "/").split("/").filter(Boolean);
  if (segs.length && LANG_CODES.includes(segs[0])) segs.shift();
  const p = "/" + segs.join("/");
  return p.replace(/\/+$/, "") || "/";
}

/** Kya ye path bhasha prefix se shuru ho raha hai? */
export function hasLangPrefix(pathname) {
  const seg = (pathname || "/").split("/").filter(Boolean)[0];
  return Boolean(seg && LANG_CODES.includes(seg));
}

// ── chhoti bhasha ka parivaar ──
//
// Ye 9 bhasha ka apna content nahi hai — unka text inke parivaar wale
// bhasha se aata hai (registry.js ka latChain yahi karta hai).
//
//   ne, mai, doi, brx, sa  →  hi
//   ks, sd                 →  ur
//   sat, mni               →  bn
//
// Isliye inke page ka <link rel="canonical"> parivaar wale URL par
// jaata hai. Warna Google inhe alag-alag content samajhta hai jabki
// byte-for-byte same hain — aur chhoti bhasha ki ranking kharab ho
// jaati hai.
export const FAMILY = {
  ne: "hi", mai: "hi", doi: "hi", brx: "hi", sa: "hi",
  ks: "ur", sd: "ur",
  sat: "bn",
  mni: "bn",
};

/** Jis bhasha ka apna SEO content nahi, uska parivaar. */
export function canonicalLang(lang) {
  return FAMILY[lang] || lang;
}

/** Chhoti bhasha — sitemap me nahi, canonical parivaar par. */
export function isMergedLang(lang) {
  return Boolean(FAMILY[lang]);
}

// 22 bhasha ke codes — registry se manually, taaki ye module
// circular import na bane (registry -> i18n, i18n -> seo).
const LANG_CODES = [
  "en", "hi", "mr", "bn", "ta", "te", "gu", "ur", "kn", "or", "ml", "pa", "as",
  "mai", "sat", "ks", "ne", "sd", "doi", "mni", "brx", "sa",
];

export { LANG_CODES };

// BCP-47 — hreflang aur <html lang> dono ke liye
export const HREFLANG = {
  en: "en", hi: "hi-IN", mr: "mr-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN",
  gu: "gu-IN", ur: "ur-PK", kn: "kn-IN", or: "or-IN", ml: "ml-IN", pa: "pa-IN",
  as: "as-IN", mai: "mai-IN", sat: "sat-IN", ks: "ks", ne: "ne", sd: "sd",
  doi: "doi", mni: "mni", brx: "brx", sa: "sa",
};

/** Urdu/Kashmiri/Sindhi RTL me padhte hain */
export const RTL = new Set(["ur", "ks", "sd"]);
