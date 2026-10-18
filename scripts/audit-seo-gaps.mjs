// ════════════════════════════════════════════════════════════════════
//  SEO GAP AUDIT v2 — jo abhi bhi missing hai
// ════════════════════════════════════════════════════════════════════
import fs from "node:fs";

const gap = [];
const add = (area, issue, why, fix) => gap.push({ area, issue, why, fix });

const D = "dist";
const jsFiles = fs.readdirSync(`${D}/assets`).filter((f) => f.endsWith(".js"));
const mainChunk = jsFiles.find((f) => /^index-/.test(f)) || jsFiles[0];
const mainKB = fs.statSync(`${D}/assets/${mainChunk}`).size / 1024;
const js = jsFiles.map((f) => fs.readFileSync(`${D}/assets/${f}`, "utf8")).join("\n");
const html = fs.readFileSync(`${D}/index.html`, "utf8");

// ── 1. BUNDLE ──
if (mainKB > 300) {
  add("Speed", `Main chunk ${(mainKB / 1024).toFixed(2)} MB`,
    "Ye har page par download hota hai — mobile par LCP (largest contentful paint) isi se banti hai.",
    "Aur lazy karo");
}
if (jsFiles.length < 10) {
  add("Speed", `Sirf ${jsFiles.length} chunk`, "Code splitting kam hai.", "React.lazy per route");
}
// bade vendor chunks
const heavy = jsFiles
  .map((f) => ({ f, kb: fs.statSync(`${D}/assets/${f}`).size / 1024 }))
  .filter((x) => x.kb > 250)
  .sort((a, b) => b.kb - a.kb);
if (heavy.length) {
  add("Speed", "Har page par ye bade chunks: " +
      heavy.map((h) => `${h.f} (${h.kb.toFixed(0)} KB)`).join(", "),
    "Firebase 509 KB + i18n 434 KB = har visit par ~1 MB sirf data ke liye.",
    "Firebase ko sirf tab load karo jab token ho; i18n ko per-language dynamic import karo");
}

// ── 2. BLOG ──
// posts do files me hain (blog.js + blog2.js) — dono count karo
const blogSrc =
  fs.readFileSync("src/data/blog.js", "utf8") +
  fs.readFileSync("src/data/blog2.js", "utf8");
const postCount = (blogSrc.match(/^\s+id: `/gm) || []).length;
const secCount = (blogSrc.match(/^\s+h: `/gm) || []).length;
const faqCount = (blogSrc.match(/^\s{4,6}\[`/gm) || []).length;
if (postCount < 12) {
  add("Content", `Sirf ${postCount} blog post`,
    "SEO ka asli traffic blog se aata hai. Kam se kam 12 rakhein.",
    `Aur ${12 - postCount} likho`);
}
if (secCount < postCount * 3) {
  add("Content", "Posts me h2 sections kam hain",
    "Google article structure (h2/h3) se samajhta hai ki ye long-form content hai.",
    "Har post me 3-4 h2 section");
}

// ── 3. 404 noindex ──
const appSrc = fs.readFileSync("src/App.jsx", "utf8");
if (!/data-404/.test(appSrc)) {
  add("Index", "404 par noindex nahi", "Soft-404 se ranking dilute hoti hai.", "meta robots inject karo");
}

// ── 4. Social tags ──
for (const [tag, why] of [
  ['property="og:image:type"', "Kuch WhatsApp/Facebook versions prefer karti hain"],
  ['name="twitter:image:alt"', "Screen reader + Twitter accessibility"],
]) {
  if (!html.includes(tag)) add("Social", `${tag} missing`, why, "index.html + prerender.mjs me add karo");
}

// ── 5. Breadcrumb visible ──
if (!fs.existsSync("src/components/Breadcrumb.jsx")) {
  add("UX/SEO", "Breadcrumb sirf JSON-LD me", "User ko pata nahi chalta kahan hai.", "Breadcrumb component");
}

// ── 6. Footer internal links ──
const footer = fs.readFileSync("src/components/Footer.jsx", "utf8");
const footerLinks = (footer.match(/\["\//g) || []).length;
if (footerLinks < 15) {
  add("Internal link", `Footer me sirf ${footerLinks} link`,
    "Footer se har page ko inbound link milta hai. Kam link = orphan page.",
    "Footer sitemap banao");
}

// ── 7. Orphan pages (prerendered HTML me) ──
const routes = ["kundli","panchang","rashifal","loshu","calculator","charts","forecast",
  "calendar","muhurat","reports","gochar","daily","match","remedies","shani","experts",
  "about","contact","blog","login"];
const homeHtml = fs.readFileSync(`${D}/index.html`, "utf8");
let orphans = [];
for (const p of routes) {
  const f = `${D}/${p}/index.html`;
  if (!fs.existsSync(f)) continue;
  const inbound = homeHtml.includes(`href="/${p}"`) ||
    fs.existsSync(`${D}/${p}/index.html`) === false;
  // root se link
  const rootHas = homeHtml.includes(`href="/${p}"`);
  if (!rootHas) orphans.push(p);
}
if (orphans.length) {
  add("Internal link", `Root page se link nahi mila: ${orphans.join(", ")}`,
    "Prerendered root HTML me in pages ka koi link nahi.",
    "Prerender body me full link list daalo");
}

// ── 8. Sitemap lastmod ──
const sm = fs.readFileSync(`${D}/sitemap.xml`, "utf8");
const lms = [...new Set([...sm.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1]))];
if (lms.length === 1) {
  add("Index", "sitemap me sab lastmod ek hi",
    "Google lastmod se samajhta hai page kab badla.",
    "Har page ka apna lastmod");
}

// ── 9. Blog posts sitemap me? ──
for (const slug of ["mulank-1-upay", "bhagyank-8-dhan"]) {
  if (!sm.includes(`/blog/${slug}`)) {
    add("Content", `Blog post sitemap me nahi: /blog/${slug}`,
      "Blog ka traffic sitemap se aata hai.",
      "BLOG_ROUTES registry me daalo");
  }
}

// ── 10. Prerendered content depth ──
const kundliHtml = fs.readFileSync(`${D}/kundli/index.html`, "utf8");
const kundliWords = kundliHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
if (kundliWords < 60) {
  add("Content", `/kundli ka prerendered content ${kundliWords} words hai`,
    "Thin content = ranking nahi.",
    "Page ke baare me 3-4 paragraph likho");
}

// ── OUTPUT ──
console.log(`main chunk ${(mainKB / 1024).toFixed(2)} MB · ${jsFiles.length} chunks`);
console.log(`blog: ${postCount} posts · ${secCount} sections · ${faqCount} qa pairs`);
console.log(`footer links: ${footerLinks}\n`);

if (!gap.length) { console.log("Koi gap nahi mila ✅"); process.exit(0); }
const byArea = {};
for (const g of gap) (byArea[g.area] ||= []).push(g);
let n = 1;
for (const [area, list] of Object.entries(byArea)) {
  console.log(`═══ ${area} (${list.length}) ═══`);
  for (const g of list) {
    console.log(`\n${n++}. ${g.issue}`);
    console.log(`   kyun: ${g.why}`);
    console.log(`   fix : ${g.fix}`);
  }
}
console.log(`\n${"═".repeat(50)}\n${gap.length} gap bacha`);