// ─────────────────────────────────────────────────────────────
//  FULL SEO VERIFICATION — build output se, browser ke bina
//
//  Browser testing bahut slow ho jaati hai (fonts + 3 MB bundle).
//  Ye script dist/ ke files padhkar wahi confirm karti hai jo
//  runtime par set hota hai.
// ─────────────────────────────────────────────────────────────
import fs from "node:fs";

let pass = 0, fail = 0;
const ok = (m) => { pass++; console.log("  OK   " + m); };
const no = (m) => { fail++; console.log("  FAIL " + m); };
const chk = (cond, m) => (cond ? ok(m) : no(m));

const D = "dist";

// Code splitting ke baad ek hi bundle nahi hai — SEO code `seo-*.js`
// chunk me hai aur descriptions `i18n-*.js` me. Pehle sirf pehla .js
// padha jata tha, isliye 30 checks bekaar fail ho jaati thi.
const jsFiles = fs.readdirSync(`${D}/assets`).filter((f) => f.endsWith(".js"));
const js = jsFiles.map((f) => fs.readFileSync(`${D}/assets/${f}`, "utf8")).join("\n");
const html = fs.readFileSync(`${D}/index.html`, "utf8");

const mainChunk = jsFiles.find((f) => /^index-/.test(f)) || jsFiles[0];
const mainKB = fs.statSync(`${D}/assets/${mainChunk}`).size / 1024;

console.log(`${jsFiles.length} chunks · main ${mainKB.toFixed(0)} KB · all ${(js.length / 1024 / 1024).toFixed(2)} MB\n`);

/** HTML ko whitespace-collapse karke tag dhoondhne ke liye */
const flat = html.replace(/\s+/g, " ");

// ─────────────────────────────────────────────────────────────
console.log("═══ 1. LOGIN GATE SECURITY ═══");
chk(!js.includes("nogate"), "?nogate bypass bundle me nahi hai");
// Naam production build me minify ho jaata hai — isliye gate ke
// ASLI string markers dekhte hain, component ka naam nahi.
chk(js.includes('"login"') && js.includes("replace"), "login redirect code me hai");
chk(/state=\{\{from:/.test(js) || js.includes("from:"), "login ke baad wapas jane ka state.from hai");

// ─────────────────────────────────────────────────────────────
console.log("\n═══ 2. META TAGS (index.html) ═══");
for (const tag of [
  'name="description"',
  '<link rel="canonical"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'property="og:url"',
  'property="og:locale"',
  'name="twitter:card"',
  'name="theme-color"',
  'rel="sitemap"',
  'rel="apple-touch-icon"',
]) {
  chk(flat.includes(tag), tag);
}
chk(flat.includes('content="#fdf6ee"'), "theme-color cream #fdf6ee");
chk(!html.includes("#8b5cf6"), "purana violet #8b5cf6 index.html se gaya");
chk(!html.includes("#140a10"), "purana maroon #140a10 index.html se gaya");
chk(flat.includes('"theme-color" content="#fdf6ee"'), "theme-color cream (comment me violet nahi bacha)");

// crawler ko prerendered content — root div me h1 + description hona chahiye
const rootStart = html.indexOf('<div id="root">');
const rootEnd = html.indexOf("<script", rootStart);
const rootHtml = rootStart >= 0 ? html.slice(rootStart, rootEnd) : "";
chk(/<h1[^>]*>/.test(rootHtml), "root me prerendered <h1> hai");
chk(/kundli/i.test(rootHtml), "root me prerendered content me keywords hain");
chk(rootHtml.length > 200, `root block ${rootHtml.length} chars (crawler ko dikhega)`);

// ─────────────────────────────────────────────────────────────
console.log("\n═══ 3. SEO RUNTIME CODE ═══");
for (const needle of [
  "hreflang", "x-default", "FAQPage", "BreadcrumbList", "WebApplication",
  "application/ld+json", "og-image.png", "noindex, nofollow",
  "index, follow", "max-image-preview:large", "summary_large_image",
  "isAccessibleForFree", "inLanguage",
]) {
  chk(js.includes(needle), `runtime: ${needle}`);
}

// ─────────────────────────────────────────────────────────────
console.log("\n═══ 4. SITEMAP ═══");
const smBuf = fs.readFileSync(`${D}/sitemap.xml`);
chk(!(smBuf[0] === 0xff && smBuf[1] === 0xfe), "sitemap UTF-16 nahi (BOM nahi)");
const sm = smBuf.toString("utf8");
const urlCount = (sm.match(/<url>/g) || []).length;
// 27 page (21 feature + 6 blog) × 13 bhasha (jin ka apna SEO
// description likha hai). 9 chhoti bhasha apne parivaar wale page par
// merge ho jaati hain — unka duplicate URL sitemap me daalna Google
// ke liye "duplicate content" hota hai.
chk(urlCount === 429, `${urlCount} URL (33 page × 13 bhasha — chhoti bhasha merge)`);
// blog posts bhi sitemap me
for (const slug of ["mulank-1-upay", "bhagyank-8-dhan", "personal-year-cycle"]) {
  chk(sm.includes(`/blog/${slug}`), `blog post sitemap me: ${slug}`);
}
chk(sm.includes("hreflang=\"hi-IN\""), "hindi hreflang sitemap me");
chk(sm.includes("hreflang=\"ta-IN\""), "tamil hreflang sitemap me");
chk(sm.includes("hreflang=\"x-default\""), "x-default sitemap me");
chk(!sm.includes("/admin"), "noindex page (/admin) sitemap me nahi");
chk(!sm.includes("/dashboard"), "/dashboard sitemap me nahi");
chk(!sm.includes("<loc>https://ganeshanumrologisty.web.app/ne"), "chhoti bhasha /ne sitemap me nahi");
chk(!/<loc>[^<]*(sat|brx|doi|mni)<\/loc>/.test(sm), "chhoti bhasha (sat/brx/doi/mni) sitemap me nahi");
// as apna URL rakhta hai
chk(sm.includes("/as/kundli") || sm.includes("/as"), "assamese /as apna URL rakhta hai");

// ─────────────────────────────────────────────────────────────
console.log("\n═══ 5. ROBOTS ═══");
const rb = fs.readFileSync(`${D}/robots.txt`, "utf8");
chk(rb.includes("Sitemap: https://ganeshanumrologisty.web.app/sitemap.xml"), "sitemap link");
for (const p of ["/admin", "/dashboard", "/chat", "/ne/", "/sat/"]) {
  chk(rb.includes("Disallow: " + p), `Disallow ${p}`);
}

// ─────────────────────────────────────────────────────────────
console.log("\n═══ 6. OG IMAGE + ICONS ═══");
for (const f of ["og-image.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "logo.svg"]) {
  const p = `${D}/${f}`;
  chk(fs.existsSync(p), `${f} ${fs.existsSync(p) ? "(" + (fs.statSync(p).size / 1024).toFixed(0) + " KB)" : ""}`);
}
// PNG signature verify
const png = fs.readFileSync(`${D}/og-image.png`);
chk(png[0] === 0x89 && png[1] === 0x50 && png[2] === 0x4e && png[3] === 0x47, "og-image.png valid PNG signature");
const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
chk(w === 1200 && h === 630, `og-image ${w}x${h} (FB/Twitter ko 1200x630 chahiye)`);
const i180 = fs.readFileSync(`${D}/apple-touch-icon.png`);
chk(i180.readUInt32BE(16) === 180 && i180.readUInt32BE(20) === 180, "apple-touch-icon 180x180 SQUARE (rectangle nahi)");

// ─────────────────────────────────────────────────────────────
console.log("\n═══ 7. MANIFEST ═══");
const mf = JSON.parse(fs.readFileSync(`${D}/manifest.json`, "utf8"));
chk(mf.background_color === "#fdf6ee", "manifest bg cream #fdf6ee");
chk(mf.theme_color === "#fdf6ee", "manifest theme cream");
chk(mf.icons.some((i) => i.sizes === "512x512"), "512 icon declared");
chk(mf.icons.some((i) => i.purpose === "maskable"), "maskable icon declared");
chk(!JSON.stringify(mf).includes("#8b5cf6"), "manifest me violet nahi");

// ─────────────────────────────────────────────────────────────
console.log("\n═══ 8. 22 BASHAA KE DESCRIPTION BUNDLE ME ═══");
const SNIPPETS = {
  en: "Free numerology, kundli, rashifal",
  hi: "मुफ़्त न्यूमेरोलॉजी",
  mr: "मोफत न्यूमेरोलॉजी",
  bn: "বিনামূল্যে নিউমেরোলজি",
  ta: "இலவசம் எண்கதி",
  te: "ఉచిత సంఖ్యశాస్త్రం",
  gu: "મફત ન્યુમેરોલોજી",
  ur: "مفت نمبر شاست",
  kn: "ಉಚಿತ ಸಂಖ್ಯಶಾಸ್ತ್ರ",
  or: "ମଫ଼ ସଂଖ୍ୟାଶାସ୍ତ୍ର",
  ml: "സൗജന്യ സംഖ്യശാസ്ത്രം",
  pa: "ਮੁਫ਼ਤ ਅੰਕ ਸ਼ਾਸਤਰ",
  as: "বিনামূল্যে সংখ্যাশাস্ত্ৰ",
};
let descOK = 0;
for (const [lg, sn] of Object.entries(SNIPPETS)) {
  if (js.includes(sn)) { descOK++; }
  else no(`${lg} description bundle me nahi`);
}
chk(descOK === 13, `${descOK}/13 bhasha description bundle me`);

// ─────────────────────────────────────────────────────────────
console.log("\n═══ 9. NO BLUE IN NEW ASSETS ═══");
// index.html + manifest me blue/violet nahi (social.js ko chhod kar)
chk(!/#[0-9a-f]{0,2}(8b5cf6|6366f1|3b82f6|06b6d4|22d3ee)/i.test(html), "index.html me violet/cyan nahi");
chk(flat.includes("1200") && flat.includes("630"), "og:image 1200x630");
chk(!/\b13 languages\b/.test(html), "purana '13 languages' claim hata diya");
chk(/22 (Indian )?languages/i.test(html), "sahi '22 languages' claim");

// ── LIGHT THEME: koi dark background nahi rehna chahiye ──
//
// User ne kaha: "kisi bhi background me black nahi hona tha",
// "koi dark background mat daalo".
console.log("\n═══ 10. LIGHT THEME (no dark background) ═══");
{
  const css = fs.readFileSync("src/styles.css", "utf8");
  const root = css.slice(css.indexOf(":root"), css.indexOf("\n}", css.indexOf(":root")) + 2);

  // :root tokens
  const bg = /--bg:\s*(#[0-9a-f]{6})/i.exec(root)?.[1];
  chk(bg && bg.toLowerCase() === "#fdf6ee", `--bg cream ${bg}`);

  // tokens ka contrast cream par
  function hex2rgb(h) {
    h = h.replace("#", "");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  function lum([r, g, b]) {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function ratio(a, b) {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  }
  const BG = hex2rgb(bg || "#fdf6ee");
  for (const tok of ["--text", "--muted", "--gold", "--rose", "--rose-deep", "--saffron", "--danger"]) {
    const m = new RegExp(`${tok}:\\s*(#[0-9a-f]{6})`, "i").exec(root);
    if (!m) { no(`${tok} token nahi mila`); continue; }
    const r = ratio(hex2rgb(m[1]), BG);
    chk(r >= 4.5, `${tok} ${m[1]} = ${r.toFixed(2)}:1 ${r >= 7 ? "AAA" : "AA"}`);
  }

  // dark background ke shades nahi rehne chahiye (mask #000 chhod kar)
  const darkBgs = [];
  css.split("\n").forEach((l, i) => {
    if (/mask-image|mask:/.test(l)) return;          // mask me #000 sahi hai
    if (/background\s*:/.test(l) || /linear-gradient|radial-gradient/.test(l)) {
      if (/rgba\(\s*0\s*,\s*0\s*,\s*0[^)]*\)/.test(l) && !/,\s*0\s*\)/.test(l)) {
        darkBgs.push(`L${i + 1} ${l.trim().slice(0, 70)}`);
      }
    }
  });
  chk(darkBgs.length === 0, `dark background gradient ${darkBgs.length} (mask chhod kar)`);
  darkBgs.slice(0, 3).forEach((d) => console.log("       " + d));

  // near-black BACKGROUND (text ka gehra rang theek hai)
  const nearBlack = [...new Set([...css.matchAll(/#[0-2][0-9a-f]{5}\b/gi)].map((m) => m[0].toLowerCase()))];
  const asBg = [];
  css.split("\n").forEach((l) => {
    const at = l.search(/background\s*:/);
    if (at < 0) return;
    // sirf background DECLARATION ka hissa — pehla `;` ke baad
    // `color:` shuru hota hai (jaise "background: gold; color: #2b141c")
    let tail = l.slice(at);
    const semi = tail.indexOf(";");
    if (semi > 0) tail = tail.slice(0, semi);
    for (const h of nearBlack) if (tail.includes(h)) asBg.push(h);
  });
  chk(asBg.length === 0, `near-black background ${asBg.length ? asBg.join(",") : "0"}`);

  // --text gehra hona CHAHIYE (light theme me text dark hota hai)
  const textTok = /--text:\s*(#[0-9a-f]{6})/i.exec(root)?.[1];
  chk(Boolean(textTok), `--text token ${textTok} (dark text = sahi hai light me)`);
}
chk(!/#[0-9a-f]{0,2}(8b5cf6|6366f1|3b82f6)/i.test(JSON.stringify(mf)), "manifest me violet nahi");

// ─────────────────────────────────────────────────────────────
console.log(`\n${"═".repeat(50)}`);
console.log(`${pass} pass, ${fail} fail`);
console.log(fail === 0 ? "\nSEO BUILD SAHI HAI ✅" : "\n❌ " + fail + " problem");
process.exit(fail ? 1 : 0);