// ════════════════════════════════════════════════════════════════════
//  PRERENDER — har URL ka apna static HTML
//
//  Problem: ye SPA hai. Crawler jo JS nahi chalata (WhatsApp, Facebook,
//  Twitterbot, Baidu, kai Bing crawlers) ko `curl /hi/kundli` par wahi
//  generic English title/description milta jo `/` par hai. 462 URL,
//  ek hi meta = Google ke liye 462 duplicate page.
//
//  Isliye build ke baad har (page × bhasha) ke liye ek static
//  `dist/hi/kundli/index.html` likha jata hai jisme:
//      • usi bhasha ka <title> aur description
//      • canonical + 22 hreflang + x-default
//      • Open Graph + Twitter card
//      • JSON-LD (Organization / WebSite / WebApplication / Breadcrumb)
//      • crawler ke liye <h1> + content (JS load hone se pehle)
//
//  Content React khud render karta hai — prerender sirf HEAD + ek
//  content block likhta hai, app ko chhedta nahi.
// ════════════════════════════════════════════════════════════════════
import fs from "node:fs";
import path from "node:path";
import {
  ALL_INDEXABLE, SITE_URL, HREFLANG, LANG_CODES, BRAND, BRAND_NATIVE,
  canonicalLang, isMergedLang, langPath,
} from "../src/seo/routes.js";
import { SEO_DESC } from "../src/seo/seoDesc.js";
import { translations } from "../src/i18n/translations.js";
import { POSTS } from "../src/data/blog.js";

// ── blog post ka asli title/excerpt (translations me nahi hai,
//    data file me hai) ──
const POST_BY_SLUG = Object.fromEntries(POSTS.map((p) => [p.id, p]));
const KEY2SLUG = Object.fromEntries(
  Object.entries(POST_BY_SLUG).map(([slug]) => [slug.replace(/-/g, "_"), slug])
);

const DIST = "dist";
const TEMPLATE = fs.readFileSync(`${DIST}/index.html`, "utf8");

// ── ENTRY CHUNK ──
//
// ⚠️ Pehle `readdirSync().find(f => f.endsWith(".js"))` se entry
// nikaali thi — jo ALPHABETICALLY pehli .js file thi. Code splitting
// ke baad wo `Admin-*.js` (16 KB, sirf Admin page ka export) hai.
// Prerendered pages usi ko load kar rahe the — matlab React boot hi
// nahi hota tha. Meta static tha (SEO chalta tha), par app khaali.
//
// Sahi tarika: Vite ke apne index.html se entry padho (template
// overwrite hone se PEhle). Wahi single source of truth hai.
const ENTRY_MATCH = TEMPLATE.match(
  /<script[^>]*type="module"[^>]*src="\/assets\/([^"]+\.js)"/
);
const BUNDLE = ENTRY_MATCH
  ? ENTRY_MATCH[1]
  : fs.readdirSync(path.join(DIST, "assets")).find((f) => /^index-.*\.js$/.test(f));

if (!BUNDLE) { console.error("entry chunk nahi mila"); process.exit(1); }
if (!/^index-/.test(BUNDLE)) {
  console.error(`WARNING: entry "${BUNDLE}" index-* nahi hai — verify karo`);
}

const CSS_MATCH = TEMPLATE.match(
  /<link[^>]*rel="stylesheet"[^>]*href="\/assets\/([^"]+\.css)"/
);
const CSS = CSS_MATCH ? CSS_MATCH[1] : null;

// modulepreload — entry ke saath jo chunks turant chahiye
const PRELOADS = [
  ...TEMPLATE.matchAll(
    /<link[^>]*rel="modulepreload"[^>]*href="\/assets\/([^"]+\.js)"/g
  ),
].map((m) => m[1]);

const PRELOAD_LINKS = PRELOADS.length
  ? "\n" + PRELOADS.map((p) => `    <link rel="modulepreload" href="/assets/${p}" />`).join("\n") + "\n"
  : "";

console.log(`entry: /assets/${BUNDLE}`);
console.log(`css:   ${CSS ? "/assets/" + CSS : "(nahi)"}`);
console.log(`preload: ${PRELOADS.length} chunk\n`);

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** bhasha ka page-label (translations.js) */
function label(lang, key) {
  // blog post — title data file me hai
  const slug = KEY2SLUG[key.replace(/^blog_/, "")];
  if (slug && POST_BY_SLUG[slug]) return POST_BY_SLUG[slug].title;

  const d = translations[lang];
  const v = d && d[key];
  if (typeof v === "string" && v) return v;
  return translations.en[key] || "";
}

/** description: blog ka excerpt → seoDesc → fallback */
function desc(lang, descKey, lbl) {
  const slug = KEY2SLUG[descKey.replace(/^seo_desc_blog_/, "")];
  if (slug && POST_BY_SLUG[slug]) {
    const ex = POST_BY_SLUG[slug].excerpt;
    if (ex) return `${ex} — ${BRAND}`;
  }

  const canon = canonicalLang(lang);
  const own = SEO_DESC[canon]?.[descKey];
  if (own) return own;
  return SEO_DESC.en?.[descKey] || `${lbl} — ${BRAND}`;
}

/** faq sirf English home par */
const FAQ = [
  ["Is Ganesha Suyog Astrology free?",
   "Yes. Every service here is free with no paid tier: numerology calculator, Moolank, Bhagyank, Life Path, full kundli with 16 vargas, dasha and antar dasha, Lal Kitab remedies, gemstone recommendation, rashifal, panchang, muhurat, Lo Shu grid, kundli milan, Varshphal and Shani Sade Sati analysis."],
  ["Which languages are supported?",
   "22 Indian languages: English, Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Santali, Kashmiri, Nepali, Sindhi, Dogri, Manipuri, Bodo and Sanskrit. Each page renders in its own script."],
  ["Is my birth data private?",
   "Yes. Birth details are saved per account on your own device and are never shown to another user. Logging out clears your saved profile completely."],
  ["How do I get my free kundli?",
   "Create a free account, open the Kundli page and enter your date of birth, birth time and birth city. You get lagna, navamsa, all 16 divisional vargas, ashtakavarga, dasha, antar dasha, phaladesh, Lal Kitab upay, gemstone advice and shubh-ashubh muhurat for your city."],
  ["Why are Rahu Kaal and muhurat times different for me?",
   "Because these timings are computed from the sunrise and sunset of your birth city, not a fixed national clock. Delhi, Mumbai and Kolkata each get their own Rahu Kaal window, Yamaganda and Abhijit muhurat."],
];

function jsonLd(lang, page, lbl, description, url) {
  const hl = HREFLANG[lang] || lang;
  const graph = [
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND,
      legalName: BRAND_NATIVE, url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg`, width: 512, height: 512 },
      description: "Free numerology, kundli, rashifal and panchang in 22 Indian languages." },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: BRAND,
      inLanguage: hl, publisher: { "@id": `${SITE_URL}/#organization` } },
    { "@type": "WebApplication", "@id": `${url}#app`, name: lbl, url,
      applicationCategory: "LifestyleApplication", operatingSystem: "Any",
      inLanguage: hl, isAccessibleForFree: true, description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" } },
  ];

  if (page !== "/") {
    graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: lbl, item: url },
      ] });
  }
  if (page === "/" && lang === "en") {
    graph.push({ "@type": "FAQPage", "@id": `${SITE_URL}/#faq`, inLanguage: "en",
      mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q,
        acceptedAnswer: { "@type": "Answer", text: a } })) });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/** robots meta — noindex pages prerender nahi karte */
function robotsOf(page) {
  const noindex = ["/admin", "/dashboard", "/gallery", "/chat"].includes(page);
  return noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
}

function renderHead({ lang, page, route, lbl, description, url }) {
  const hl = HREFLANG[lang] || lang;
  const merged = isMergedLang(lang);
  const ogImage = `${SITE_URL}/og-image.png`;
  const htmlLang = hl;
  const dir = ["ur", "ks", "sd"].includes(lang) ? "rtl" : "ltr";
  const title = `${lbl} | ${BRAND}`;

  const hreflangs = LANG_CODES.map((c) => {
    const target = page === "/" ? "" : page;
    const p = c === "en" ? target : `/${c}${target}`;
    return `    <link rel="alternate" hreflang="${HREFLANG[c] || c}" href="${esc(SITE_URL + p)}" />`;
  }).join("\n");

  const ld = jsonLd(lang, page, lbl, description, url);

  return `  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#fdf6ee" />
    <meta name="color-scheme" content="light" />

    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="${robotsOf(page)}" />
    <link rel="canonical" href="${esc(url)}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(BRAND_NATIVE)}" />
    <meta property="og:locale" content="${hl.replace("-", "_")}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(BRAND_NATIVE)} - ${esc(lbl)}" />
    <meta property="og:image:type" content="image/png" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    <meta name="twitter:image:alt" content="${esc(BRAND_NATIVE)} - ${esc(lbl)}" />

${hreflangs}
    <link rel="alternate" hreflang="x-default" href="${esc(SITE_URL + page)}" />

    <script type="application/ld+json">${JSON.stringify(ld)}</script>

    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/logo.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>`;
}

function renderBody({ lang, page, lbl, description }) {
  const dir = ["ur", "ks", "sd"].includes(lang) ? ' dir="rtl"' : "";
  const heading =
    page === "/"
      ? BRAND_NATIVE
      : `${lbl} — ${BRAND}`;

  // ── Internal links ──
  // Footer.jsx me bhi yehi list hai (React ke liye), par crawler jo JS
  // nahi chalata sirf prerendered HTML dekhta hai. Wahan koi link nahi
  // tha to Google inhe "orphan" samajhta tha.
  const linkList = ALL_INDEXABLE
    .filter((r) => r.path !== page)
    .map((r) => {
      const l2 = label(lang, r.key) || r.path;
      return `<a href="${esc(langPath(r.path, lang))}">${esc(l2)}</a>`;
    })
    .join("\n          ");

  return `    <div id="root">
      <div style="padding:40px 20px;font-family:system-ui,sans-serif;color:#2b141c;background:#fdf6ee;min-height:100vh"${dir}>
        <h1 style="color:#7a4d00;margin:0 0 12px;font-size:2rem">${esc(heading)}</h1>
        <p style="color:#6a4351;max-width:640px;line-height:1.7;margin:0 0 20px">${esc(description)}</p>
        <nav aria-label="pages">
          ${linkList}
        </nav>
      </div>
    </div>`;
}

// ── generate ──
let written = 0, merged = 0;

for (const route of ALL_INDEXABLE) {
  for (const lang of LANG_CODES) {
    const lbl = label(lang, route.key) || label("en", route.key) || route.path;
    const description = desc(lang, route.descKey, lbl);
    const canonLang = canonicalLang(lang);
    const url = SITE_URL + langPath(route.path, canonLang);

    // Sab page ka body hum khud likhte hain — isme crawler content +
    // poora internal link list hota hai. Vite ka original body use
    // karne se link list nahi milti thi, aur baaki 26 page "orphan"
    // ban rahe the (koi inbound link hi nahi).
    const body =
      "  <body>\n" +
      renderBody({ lang, page: route.path, lbl, description }) +
      PRELOAD_LINKS +
      (CSS ? `    <link rel="stylesheet" href="/assets/${CSS}" />\n` : "") +
      `    <script type="module" src="/assets/${BUNDLE}"></script>\n` +
      "  </body>\n";

    const html =
      "<!DOCTYPE html>\n" +
      `<html lang="${HREFLANG[lang] || lang}"${["ur","ks","sd"].includes(lang) ? ' dir="rtl"' : ""}>\n` +
      renderHead({ lang, page: route.path, route, lbl, description, url }) +
      "\n" + body + "</html>\n";

    const outDir = path.join(DIST, lang === "en" ? route.path : langPath(route.path, lang));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
    written++;
    if (isMergedLang(lang)) merged++;
  }
}

console.log(`prerender: ${written} file likhe`);
console.log(`  ${merged} chhoti bhasha → canonical parivaar wale URL par`);
console.log(`  ${ALL_INDEXABLE.length} page × ${LANG_CODES.length} bhasha`);