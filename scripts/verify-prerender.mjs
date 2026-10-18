// Prerendered HTML verify — har URL ka apna meta hona chahiye
import fs from "node:fs";

let pass = 0, fail = 0;
const ok = (m) => { pass++; };
const no = (m) => { fail++; console.log("  FAIL " + m); };
const chk = (c, m) => (c ? ok(m) : no(m));

const read = (p) => fs.readFileSync("dist/" + p, "utf8");
const g = (html, re) => { const m = html.match(re); return m ? m[1].replace(/\s+/g, " ").trim() : null; };

console.log("═══ PRERENDERED HEADERS ═══");
const CASES = [
  ["hi/kundli/index.html", null, "hi-IN", "/hi/kundli"],
  ["ta/panchang/index.html", null, "ta-IN", "/ta/panchang"],
  ["mr/loshu/index.html", null, "mr-IN", "/mr/loshu"],
  ["bn/rashifal/index.html", null, "bn-IN", "/bn/rashifal"],
  ["ur/about/index.html", null, "ur-PK", "/ur/about"],
  ["kn/calculator/index.html", null, "kn-IN", "/kn/calculator"],
  ["sat/kundli/index.html", null, "sat-IN", "/bn/kundli"],
  ["ne/loshu/index.html", null, "ne", "/hi/loshu"],
  ["as/panchang/index.html", null, "as-IN", "/as/panchang"],
  ["kundli/index.html", null, "en", "/kundli"],
  ["login/index.html", null, "en", "/login"],
];

for (const [file, mustInclude, lang, canon] of CASES) {
  const html = read(file);
  const title = g(html, /<title>([^<]*)<\/title>/);
  const desc = g(html, /<meta name="description" content="([^"]*)"/);
  const hl = g(html, /<link rel="canonical" href="([^"]*)"/);
  const htmlLang = g(html, /<html lang="([^"]*)"/);
  const hreflangs = (html.match(/rel="alternate"/g) || []).length;
  const ldOk = /"@type":"FAQPage"/.test(html) || /"@type":"WebApplication"/.test(html);
  const h1 = /<h1[^>]*>/.test(html);
  const scriptRef = g(html, /<script type="module" src="([^"]*)"/);
  const cssRef = g(html, /<link rel="stylesheet" href="([^"]*)"/);

  const base = "https://ganeshanumrologisty.web.app";
  const canonPath = hl ? hl.replace(base, "") : null;

  chk(title && title.length > 3, `${file} — title "${(title || "").slice(0, 40)}"`);
  chk(desc && desc.length > 40, `${file} — description ${(desc || "").length} chars`);
  chk(canonPath === canon, `${file} — canonical ${canonPath} (chahiye tha ${canon})`);
  chk(htmlLang === lang, `${file} — html lang ${htmlLang} (chahiye tha ${lang})`);
  chk(hreflangs === 23, `${file} — ${hreflangs} hreflang (chahiye 23)`);
  chk(ldOk, `${file} — JSON-LD`);
  chk(h1, `${file} — <h1> present`);
  chk(scriptRef && scriptRef.startsWith("/assets/"), `${file} — bundle link`);
  chk(cssRef && cssRef.startsWith("/assets/"), `${file} — css link`);

  // Script purity: bhasha ka text usi script me hona chahiye.
  // (Title/description ki value hi check ho rahi hai.)
  const SCRIPT = {
    hi: [0x0900, 0x097f], mr: [0x0900, 0x097f], bn: [0x0980, 0x09ff],
    ta: [0x0b80, 0x0bff], te: [0x0c00, 0x0c7f], gu: [0x0a80, 0x0aff],
    ur: [0x0600, 0x06ff], kn: [0x0c80, 0x0cff], or: [0x0b00, 0x0b7f],
    ml: [0x0d00, 0x0d7f], pa: [0x0a00, 0x0a7f], as: [0x0980, 0x09ff],
  };
  const langCode = lang.split("-")[0];
  const range = SCRIPT[langCode];
  if (range && desc) {
    let okScript = true;
    for (const ch of desc) {
      const cp = ch.codePointAt(0);
      if (cp < 0x80) continue;
      if (cp >= 0x0964 && cp <= 0x0965) continue;   // danda
      if (cp >= 0x060c && cp <= 0x061f) continue;   // arabic punctuation
      if (cp >= 0x2013 && cp <= 0x2026) continue;   // dash/ellipsis
      if (cp >= range[0] && cp <= range[1]) continue;
      okScript = false;
      break;
    }
    chk(okScript, `${file} — apni script me text (${langCode})`);
  }
}

// ── uniqueness: har URL ka title alag hona chahiye ──
//
// ⚠️ Exception: related languages ka label naturally same hota hai.
//    hi/mr dono Devanagari, bn/as dono Bengali — unke beech duplicate
//    title SAHI hai, galti nahi. Sirf unhi ke beech ignore karte hain.
console.log("\n═══ TITLE UNIQUENESS ═══");
const SAME_SCRIPT = new Set(["hi", "mr", "bn", "as"]);
const seen = new Map();   // title -> Set(lang)
let dup = 0, n = 0;
for (const page of ["kundli", "panchang", "loshu", "reports"]) {
  for (const lang of ["en", "hi", "mr", "bn", "ta", "te", "gu", "ur", "kn", "or", "ml", "pa", "as"]) {
    const f = lang === "en" ? `dist/${page}/index.html` : `dist/${lang}/${page}/index.html`;
    const t = g(fs.readFileSync(f, "utf8"), /<title>([^<]*)<\/title>/);
    n++;
    if (!seen.has(t)) seen.set(t, new Set());
    const owners = seen.get(t);
    if (owners.size && ![...owners].some((o) => SAME_SCRIPT.has(o) && SAME_SCRIPT.has(lang))) {
      dup++;
      no(`duplicate title "${t}" — ${[...owners].join(",")} vs ${lang} (${page})`);
    }
    owners.add(lang);
  }
}
chk(dup === 0, `${n} title — ${dup} galti-wali duplicate (parivaar wale chhod kar)`);

// ── English fallback leakage in small languages ──
console.log("\n═══ CHHOTI BASHAA = PARIVAAR WALA TEXT ═══");
for (const [small, fam] of [["sat", "bn"], ["ne", "hi"], ["ks", "ur"], ["mni", "bn"]]) {
  const h = read(`${small}/kundli/index.html`);
  const d = g(h, /<meta name="description" content="([^"]*)"/);
  const famD = g(read(`${fam}/kundli/index.html`), /<meta name="description" content="([^"]*)"/);
  chk(d === famD, `/${small}/kundli ka text /${fam} ke barabar hai (parivaar)`);
}

// ── noindex pages prerender nahi hue ──
console.log("\n═══ NOINDEX PAGES ═══");
for (const p of ["admin", "dashboard", "gallery", "chat"]) {
  chk(!fs.existsSync(`dist/${p}/index.html`), `/${p} prerender nahi hua`);
}

// ── 10. ENTRY CHUNK — React boot hona zaroori hai ──
//
// Ek aakhri baar ye bug tha: prerender ne `readdirSync().find(.js)`
// se entry nikaali, jo code splitting ke baad `Admin-*.js` (16 KB)
// tha. Meta static raha (SEO chalta raha) par React boot hi nahi
// hua tha — poori app khaali.
//
// Ab: har prerendered page ka script src WAHI hona chahiye jo Vite
// ne apne build me diya, aur wo file actually maujood honi chahiye.
console.log("\n═══ ENTRY CHUNK (React boot) ═══");
{
  const assets = fs.readdirSync("dist/assets").filter((f) => f.endsWith(".js"));
  const sample = [
    "index.html", "hi/index.html", "ta/panchang/index.html",
    "blog/mulank-1-upay/index.html", "kn/loshu/index.html",
  ];
  const seen = new Set();
  for (const f of sample) {
    const p = "dist/" + f;
    if (!fs.existsSync(p)) { no(`missing: ${f}`); continue; }
    const html = fs.readFileSync(p, "utf8");
    const m = /<script[^>]*type="module"[^>]*src="\/assets\/([^"]+\.js)"/.exec(html);
    if (!m) { no(`${f} — module script nahi`); continue; }
    seen.add(m[1]);
    if (!fs.existsSync(`dist/assets/${m[1]}`)) {
      no(`${f} — entry "${m[1]}" dist/assets me NAHI hai`);
    }
    if (!/^index-/.test(m[1])) {
      no(`${f} — entry "${m[1]}" index-* nahi hai (galat chunk?)`);
    }
    const css = /<link[^>]*rel="stylesheet"[^>]*href="\/assets\/([^"]+\.css)"/.exec(html);
    if (!css) no(`${f} — CSS link nahi`);
    else if (!fs.existsSync(`dist/assets/${css[1]}`)) no(`${f} — CSS "${css[1]}" missing`);
  }
  if (seen.size === 1) ok(`sab page same entry (${[...seen][0]})`);
  else no(`page alag entry use kar rahe: ${[...seen].join(", ")}`);

  // modulepreload bhi hona chahiye (Vite isse deta hai)
  const rootHtml = fs.readFileSync("dist/index.html", "utf8");
  const preloads = (rootHtml.match(/modulepreload/g) || []).length;
  chk(preloads > 0, `modulepreload hints ${preloads}`);
}

console.log(`\n${"═".repeat(40)}\n${pass} pass, ${fail} fail`);
console.log(fail === 0 ? "\nPRERENDER SAHI HAI ✅" : "\n❌ problem");
process.exit(fail ? 1 : 0);
console.log(fail === 0 ? "\nPRERENDER SAHI HAI ✅" : "\n❌ problem");
process.exit(fail ? 1 : 0);