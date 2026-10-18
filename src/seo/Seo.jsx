// ════════════════════════════════════════════════════════════════════
//  <Seo /> — har route par title/description/OG/hreflang/JSON-LD
//
//  Pehle index.html me EK static title tha jo poori site par same
//  rehta tha. Ab har page apna meta banati hai, bhasha ke hisaab se.
//
//  22 bhasha hain, isliye hreflang zaroori hai — warna Google samajhta
//  hi nahi ki kaunsi bhasha kis page par hai aur sab versions ek dusre
//  ki copy samajh leta hai.
// ════════════════════════════════════════════════════════════════════
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { langChain } from "../i18n/registry.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { translations } from "../i18n/translations.js";
import { smallLang } from "../i18n/smallTX.js";
import { SEO_DESC } from "./seoDesc.js";
import { ALL_POSTS } from "../data/blog.js";
import {
  BRAND, BRAND_NATIVE, SITE_URL, LANG_CODES, HREFLANG, RTL,
  canonicalLang, isMergedLang,
  routeFor, langFromPath, pageFromPath, langPath, fullUrl,
} from "./routes.js";

// blog post ka title/excerpt — translations me nahi, data file me hai.
// Isi ke liye seoDesc.js ki zaroorat nahi padti blog par.
const POST_BY_SLUG = Object.fromEntries(ALL_POSTS.map((p) => [p.id, p]));

/**
 * Meta tag banao ya update karo.
 *
 * ⚠️ Naya element banane par pehchaan wala attribute (name / property)
 *    ZAROORI set karna padta hai — warna `<meta content="...">` ban jaata
 *    hai jo browser me count hi nahi hota. Isi wajah se pehle
 *    `meta[name="robots"]` hamesha null aa raha tha.
 *
 * @param {string} selector  jaise 'meta[name="description"]'
 * @param {string} attr      hamesha "content"
 * @param {string} value
 */
function setMeta(selector, attr, value) {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const key = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (key) el.setAttribute(key[1], key[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel, hreflang, href) {
  let el = document.head.querySelector(`link[rel="${rel}"][hreflang="${hreflang}"]`);
  if (!href) { if (el) el.remove(); return; }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** key se translated string — wahi chain jo t() use karta hai */
function tr(lang, key, route) {
  if (!key) return "";
  // blog post ka title uske data file me hai, translations me nahi
  if (route && route.isBlog && route.slug) {
    const post = POST_BY_SLUG[route.slug];
    if (post) return post.title;
  }
  const d = translations[lang];
  const v = d && d[key];
  if (typeof v === "string" && v) return v;
  // smallLang(lang) poora dict deta hai, key nahi — isliye [key] lagana zaroori
  const s = smallLang(lang);
  const sv = s && s[key];
  if (typeof sv === "string" && sv) return sv;
  return "";
}

/**
 * Meta description 3 jagah se a sakti hai, is order me:
 *   1. seoDesc.js  — 13 bhasha, 21 page, hand-written (best quality)
 *   2. smallTX.js  — chhoti bhasha (ne, doi, mai …) apne parivaar se
 *   3. khaali      — Google khud page ka content chun leta hai
 *
 * Chhoti bhasha ko English dena mana hai — wahan apna parivaar
 * (ne→hi, sat→bn, as→bn) fallback karega, jo native script hai.
 */
function descFor(lang, route, label) {
  // blog post — excerpt sabse achha description hai
  if (route.isBlog && route.slug) {
    const post = POST_BY_SLUG[route.slug];
    if (post && post.excerpt) return post.excerpt;
  }

  const direct = SEO_DESC[lang]?.[route.descKey];
  if (direct) return direct;

  // chhoti bhasha: apna dict, phir langChain ka parivaar
  for (const code of langChain(lang)) {
    const d = SEO_DESC[code];
    if (d && d[route.descKey]) return d[route.descKey];
    const s = smallLang(code);
    if (s && typeof s[route.descKey] === "string" && s[route.descKey]) {
      return s[route.descKey];
    }
  }

  // koi desc key nahi (noindex page) to generic
  return `${label} - ${BRAND}`;
}

export { langFromPath, pageFromPath };
export default function Seo() {
  const loc = useLocation();

  // Bhasha LanguageContext se lo, URL se nahi.
  //
  // URL se lete to ek race hota: user ka localStorage me `hi` hai aur
  // woh `/` kholta hai — LanguageProvider URL me `/hi` likhta hai,
  // par Seo ko `/` hi dikhta hai aur English meta de deta hai jabki
  // screen par Hindi hai. Context hamesha final bhasha batata hai.
  const { lang } = useLanguage();

  // Page URL se — bhasha prefix hata do
  const path = pageFromPath(loc.pathname);
  const route = routeFor(path);

  useEffect(() => {
    const label = tr(lang, route.key, route) || tr("en", route.key, route) || route.path;
    const desc = descFor(lang, route, label);

    const title = `${label} | ${BRAND}`;

    // Chhoti bhasha (ne, doi, sat …) ka apna content nahi hai — uska
    // canonical parivaar wale URL par jaata hai, warna Google unhe
    // duplicate maan kar ignore kar deta hai.
    const canonLang = canonicalLang(lang);
    const merged = isMergedLang(lang);
    const url = fullUrl(path, canonLang);
    const ogImage = `${SITE_URL}/og-image.png`;

    document.title = title;

    // ── standard meta ──
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[name="robots"]', "content",
      route.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // ── Open Graph ──
    setMeta('meta[property="og:site_name"]', "content", BRAND_NATIVE);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:locale"]', "content", (HREFLANG[lang] || lang).replace("-", "_"));
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", ogImage);
    setMeta('meta[property="og:image:width"]', "content", "1200");
    setMeta('meta[property="og:image:height"]', "content", "630");
    setMeta('meta[property="og:image:alt"]', "content", `${BRAND_NATIVE} - ${label}`);
    // Kuch WhatsApp/Facebook versions image:type prefer karti hain
    setMeta('meta[property="og:image:type"]', "content", "image/png");

    // ── Twitter ──
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[name="twitter:image"]', "content", ogImage);
    setMeta('meta[name="twitter:image:alt"]', "content", `${BRAND_NATIVE} - ${label}`);

    // ── canonical ──
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // ── <html lang> + direction ──
    document.documentElement.setAttribute("lang", HREFLANG[lang] || lang);
    document.documentElement.setAttribute("dir", RTL.has(lang) ? "rtl" : "ltr");

    // ── hreflang: 22 bhasha + x-default ──
    // Chhoti bhasha ka alternate bhi parivaar wale URL par point karta
    // hai, warna Google unhe "no return tag" maan leta hai.
    for (const code of LANG_CODES) {
      setLink("alternate", HREFLANG[code] || code, fullUrl(path, canonicalLang(code)));
    }
    setLink("alternate", "x-default", fullUrl(path, "en"));

    void merged;

    // ── JSON-LD structured data ──
    const jsonld = buildJsonLd(lang, path, route, label, desc, url);
    let ld = document.head.querySelector('script[type="application/ld+json"][data-seo]');
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.setAttribute("data-seo", "1");
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(jsonld);
  }, [lang, path]);

  return null;
}

export { BRAND, BRAND_NATIVE, SITE_URL };

// ─────────────────────────────────────────────────────────────
function buildJsonLd(lang, path, route, label, desc, url) {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND,
      legalName: BRAND_NATIVE,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg`, width: 512, height: 512 },
      description: "Free numerology, kundli, rashifal and panchang in 22 Indian languages.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND,
      inLanguage: HREFLANG[lang] || lang,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}${langPath(path, lang)}#app`,
      name: label,
      url,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      inLanguage: HREFLANG[lang] || lang,
      isAccessibleForFree: true,
      description: desc,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
  ];

  // ── breadcrumb — sirf non-home pages par ──
  if (path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: label, item: url },
      ],
    });
  }

  // ── FAQ ──
  // Sirf English home page par. Baaki bhasha me English FAQ daalne se
  // Google us page ka content language English samajhta hai aur us bhasha
  // ka ranking kharab karta hai — isliye wahan FAQPage nahi daalte.
  if (path === "/" && lang === "en") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      inLanguage: "en",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Ganesha Suyog Astrology free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Every service here is free to use with no paid tier: numerology calculator, Moolank, Bhagyank, Life Path, full kundli with 16 vargas, dasha and antar dasha, Lal Kitab remedies, gemstone recommendation, rashifal, panchang, muhurat, Lo Shu grid, kundli milan, Varshphal and Shani Sade Sati analysis.",
          },
        },
        {
          "@type": "Question",
          name: "Which languages are supported?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "22 Indian languages: English, Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Santali, Kashmiri, Nepali, Sindhi, Dogri, Manipuri, Bodo and Sanskrit. Each page renders in its own script, so a Tamil user sees Tamil and not romanised Hindi.",
          },
        },
        {
          "@type": "Question",
          name: "Is my birth data private?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Birth details are saved per account on your own device and are never shown to another user. Logging out clears your saved profile completely.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get my free kundli?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Create a free account, then open the Kundli page and enter your date of birth, birth time and birth city. You get lagna, navamsa, all 16 divisional vargas, ashtakavarga, dasha and antar dasha, phaladesh, Lal Kitab upay, gemstone advice and shubh-ashubh muhurat for your city.",
          },
        },
        {
          "@type": "Question",
          name: "Why are Rahu Kaal and muhurat times different for me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Because these timings are computed from the sunrise and sunset of your birth city, not from a fixed national clock. Delhi, Mumbai and Kolkata each get their own Rahu Kaal window, Yamaganda and Abhijit muhurat.",
          },
        },
      ],
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export { INDEXABLE } from "./routes.js";
