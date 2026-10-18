// ════════════════════════════════════════════════════════════════════
//  SITEMAP GENERATOR
//
//  21 page × 23 bhasha = 483 URL. Har URL ke saath 23 hreflang
//  alternate bhi — isse Google ko pata chal jaata hai ki ye 23
//  ek hi page ki 23 bhasha hain, 23 alag site nahi.
//
//  Chhoti bhasha (ne, doi, mai, brx, sa, ks, sd, sat, mni) ka content
//  apne parivaar wale bhasha se aata hai. Unhe alag URL dena galat
//  hoga — Google duplicate samajhega. Isliye unke canonical parivaar
//  wale bhasha par set kiya gaya hai.
// ════════════════════════════════════════════════════════════════════
import { ALL_INDEXABLE, SITE_URL, HREFLANG, LANG_CODES } from "../src/seo/routes.js";

// ── canonical bhasha: chhoti bhasha apne parivaar par khidki hai ──
// (registry.js ka langChain yahi karata hai)
const FAMILY = {
  ne: "hi", mai: "hi", doi: "hi", brx: "hi", sa: "hi",
  ks: "ur", sd: "ur",
  sat: "bn",
  mni: "bn",
};
// NOTE: `as` (Assamese) yahan jaan-boojh kar NAHI hai — uska apna
// seoDesc.js block likha gaya hai, isliye use apna alag URL milta hai.
// Pehle `as: "bn"` tha jisse uska apna SEO description bekaar ho raha tha.

// jis bhasha ka apna SEO description likha hai — sirf wahi index hogi
const HAS_OWN_DESC = new Set([
  "en", "hi", "mr", "bn", "ta", "te", "gu", "ur", "kn", "or", "ml", "pa", "as",
]);

const today = new Date().toISOString().slice(0, 10);

/**
 * Wo bhasha jinhe apna alag URL milna chahiye — sirf wahi jin ka
 * apna SEO description LIKHA HUA hai.
 *
 * ⚠️ Pehle yahan `HAS_OWN_DESC.has(FAMILY[c] || c)` tha, jisse chhoti
 * bhasha (ne→hi, sat→bn) bhi pass ho gayi thi aur unke URL sitemap me
 * aa jaate the — jabki unka apna content hai hi nahi. Google unhe
 * duplicate samajhta. Ab sirf khud ka description rakhta hai.
 */
function indexableLangs() {
  return LANG_CODES.filter((c) => HAS_OWN_DESC.has(c));
}

const xmlEsc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// ── 1. <urlset> ──
const urls = [];

// URL banao: English `/kundli`, baaki `/hi/kundli`
const urlOf = (route, code) =>
  SITE_URL + (code === "en" ? route.path : `/${code}${route.path === "/" ? "" : route.path}`);

for (const route of ALL_INDEXABLE) {
  for (const c of indexableLangs()) {
    const loc = urlOf(route, c);

    // Sirf apna hreflang + x-default. Baaki 21 alternates har page ke
    // <head> me already jaate hain (Seo.jsx). Yahan poori list likhne se
    // file 2.4 MB ho gayi thi — Google ke 50 MB limit se neeche hai par
    // har baar download karna bekaar hai, aur hreflang HTML me hona
    // hi kaafi hai (dono jagah dena zaroori nahi).
    // lastmod: page ka apna date, na ki build ka. Google isse
    // "kab sach me badla" padhta hai — har build par aaj ka date daalne
    // se crawl budget bekaar chala jaata hai.
    const lastmod = route.lastmod || today;

    urls.push(
      `  <url>\n` +
        `    <loc>${xmlEsc(loc)}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${route.changefreq}</changefreq>\n` +
        `    <priority>${route.priority.toFixed(2)}</priority>\n` +
        `    <xhtml:link rel="alternate" hreflang="${HREFLANG[c] || c}" href="${xmlEsc(loc)}"/>\n` +
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEsc(urlOf(route, "en"))}"/>\n` +
        `  </url>`
    );
  }
}

// chhoti bhasha sitemap me nahi — unka content parivaar wale page par hai
const skipped = LANG_CODES.filter((c) => FAMILY[c]).length;

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<!--\n` +
  `  ${urls.length} URL · ${ALL_INDEXABLE.length} page × ${indexableLangs().length} bhasha\n` +
  `  ${skipped} chhoti bhasha apne parivaar wale page par merge\n` +
  `  Generated ${today}\n` +
  `-->\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
  `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  urls.join("\n") +
  `\n</urlset>\n`;

// ⚠️ File se likho, stdout se nahi.
//
// PowerShell ka `node scripts\gen-sitemap.mjs > public\sitemap.xml`
// UTF-16LE bana deta hai — phir file me har character ke beech NUL
// aa jaata hai aur Google ke parser + hamare verify script dono
// use 0-URL wala khaali samajhte hain.
//
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] || "public/sitemap.xml";
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, xml, "utf8");

console.log(
  `${OUT}  ${(Buffer.byteLength(xml, "utf8") / 1024).toFixed(0)} KB  ${urls.length} URL  ` +
    `${ALL_INDEXABLE.length} page × ${indexableLangs().length} bhasha`
);
console.log(`${skipped} chhoti bhasha apne parivaar wale page par merge hui`);