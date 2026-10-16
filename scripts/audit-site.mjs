// Poori website audit:
//  1. Har page par koi runtime crash to nahi (React error)
//  2. Har bhasha par page ka text usi script me hai ya nahi
//  3. Missing translation keys
//  4. Hinglish / English leak (hi/mr blocks)
// node scripts/audit-site.mjs

import { readFileSync, readdirSync } from "node:fs";

const PAGES = readdirSync("src/pages").filter((f) => f.endsWith(".jsx")).sort();
const I18N = readdirSync("src/i18n").filter((f) => f.endsWith(".js")).sort();

const SCRIPT = {
  hi: [[0x0900, 0x097F]], mr: [[0x0900, 0x097F]], ne: [[0x0900, 0x097F]],
  mai: [[0x0900, 0x097F]], doi: [[0x0900, 0x097F]], brx: [[0x0900, 0x097F]], sa: [[0x0900, 0x097F]],
  bn: [[0x0980, 0x09FF]], as: [[0x0980, 0x09FF]],
  te: [[0x0C00, 0x0C7F]], kn: [[0x0C80, 0x0CFF]], ta: [[0x0B80, 0x0BFF]],
  or: [[0x0B00, 0x0B7F]], ml: [[0x0D00, 0x0D7F]], gu: [[0x0A80, 0x0AFF]],
  ur: [[0x0600, 0x06FF]], ks: [[0x0600, 0x06FF]], sd: [[0x0600, 0x06FF]],
  sat: [[0x0980, 0x09FF]], mni: [[0x0900, 0x097F]],
};
const MAIN = ["en", "hi", "mr", "bn", "te", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as"];
const ALL = ["en", "hi", "mr", "bn", "te", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as",
  "mai", "sat", "ks", "ne", "sd", "doi", "mni", "brx", "sa"];

const inScript = (cp, ranges) => ranges.some(([a, b]) => cp >= a && cp <= b);

// JSX me user-visible text pakdo: >text< aur {"..."} string literals
function jsxText(src) {
  const out = [];
  // 1) >Text< between tags
  const re1 = />([^<>{}\n][^<>{}]*[A-Za-z\u0900-\u0DFF\u0600-\u06FF][^<>{}]*)</g;
  let m;
  while ((m = re1.exec(src)) !== null) {
    const t = m[1].trim();
    if (t.length > 2) out.push({ v: t, i: m.index });
  }
  // 2) {"..."} inside JSX
  const re2 = /\{\s*"([^"]{4,})"\s*\}/g;
  while ((m = re2.exec(src)) !== null) out.push({ v: m[1], i: m.index });
  // 3) ternary strings lang === "xx" ? "..."
  const re3 = /lang === "(hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as)"\s*\?\s*"([^"]{4,})"/g;
  while ((m = re3.exec(src)) !== null) out.push({ v: m[2], i: m.index });
  return out;
}

// Line number lookup
const lineOf = (src, idx) => src.slice(0, idx).split("\n").length;

let problems = 0;
const rows = [];

// ---------- PART 1: inline ternaries / hardcoded per-language text ----------
console.log("=== 1. Per-language inline text check ===\n");
for (const f of PAGES) {
  const src = readFileSync("src/pages/" + f, "utf8");
  const hits = [];
  // ternary per language
  const reT = /lang === "(hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as)"\s*\?\s*"([^"]{6,})"/g;
  let m;
  while ((m = reT.exec(src)) !== null) {
    hits.push({ lang: m[1], v: m[2], line: lineOf(src, m.index) });
  }
  if (hits.length) {
    problems += hits.length;
    console.log(`[${f}]`);
    for (const h of hits) console.log(`   L${h.line} [${h.lang}] ${h.v.slice(0, 70)}`);
  }
}

// ---------- PART 2: dictionary coverage ----------
console.log("\n=== 2. Dictionary coverage (per page) ===\n");
for (const f of PAGES) {
  const src = readFileSync("src/pages/" + f, "utf8");
  const found = new Set();
  const re = /^\s{2,6}(en|hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as)\s*:\s*(mk\(|\{|[A-Z])/gm;
  let m;
  while ((m = re.exec(src)) !== null) found.add(m[1]);
  if (found.size < 2) continue;
  const missing = MAIN.filter((l) => !found.has(l));
  const status = missing.length === 0 ? "OK  " : "TODO";
  if (missing.length) problems++;
  console.log(`[${status}] ${f.padEnd(18)} ${found.size}/13${missing.length ? "  missing: " + missing.join(",") : ""}`);
}

// ---------- PART 3: i18n files coverage ----------
console.log("\n=== 3. i18n file coverage ===\n");
for (const f of I18N) {
  const src = readFileSync("src/i18n/" + f, "utf8");
  const found = new Set();
  const re = /^\s{2,4}(en|hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as)\s*:\s*(mk\(|\{|[A-Z])/gm;
  let m;
  while ((m = re.exec(src)) !== null) found.add(m[1]);
  if (found.size < 2) continue;
  const missing = MAIN.filter((l) => !found.has(l));
  if (missing.length) { problems++; console.log(`[TODO] ${f.padEnd(22)} missing: ${missing.join(",")}`); }
  else console.log(`[OK  ] ${f.padEnd(22)} 13/13`);
}

// ---------- PART 4: script purity of dictionary blocks ----------
console.log("\n=== 4. Script purity (non-English blocks) ===\n");
function extractBlocks(src) {
  const out = {};
  const re = /^\s{2,6}(en|hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as)\s*:\s*\{/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const lang = m[1];
    let depth = 0, i = m.index + m[0].length - 1;
    for (; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") { depth--; if (depth === 0) break; }
    }
    (out[lang] = out[lang] || []).push(src.slice(m.index + m[0].length - 1, i + 1));
  }
  return out;
}

for (const dir of ["src/pages", "src/i18n"]) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".jsx") || f.endsWith(".js"));
  for (const f of files) {
    const src = readFileSync(`${dir}/${f}`, "utf8");
    const blocks = extractBlocks(src);
    for (const lang of MAIN) {
      if (lang === "en" || !blocks[lang] || !SCRIPT[lang]) continue;
      const text = blocks[lang].join(" ").replace(/\b[a-zA-Z_$][\w$]*\s*:/g, "");
      let indic = 0, inRange = 0;
      for (const ch of text) {
        const cp = ch.codePointAt(0);
        if (cp >= 0x0900 && cp <= 0x0DFF || cp >= 0x0600 && cp <= 0x06FF) {
          indic++;
          if (inScript(cp, SCRIPT[lang])) inRange++;
        }
      }
      if (indic === 0) continue;
      const purity = (inRange / indic) * 100;
      if (purity < 95) {
        problems++;
        console.log(`  ! ${dir}/${f} [${lang}] purity ${purity.toFixed(0)}%`);
      }
    }
  }
}

// ---------- PART 5: hardcoded English text in JSX (no i18n at all) ----------
console.log("\n=== 5. Hardcoded English in JSX (candidates for translation) ===\n");
const ALLOW_WORDS = new Set([
  "Type", "Enter", "Select", "Send", "Submit", "Search", "Upload", "Delete", "Loading",
  "Error", "OK", "Yes", "No", "Cancel", "Close", "Next", "Prev", "Copy", "Copied", "Save",
  "Lucky", "M", "B", "Akshay", "Sankranti", "Build", "View", "Views", "Total", "Print",
  "PDF", "WhatsApp", "Email", "Password", "Admin", "Punya", "Kaal", "Labh", "Rikta",
  "Moon", "Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
  "Sukla", "Krishna", "Purnima", "Amavasya", "Pradosh", "Sankashti", "Vikram", "Shaka",
  "Panchang", "Rashifal", "Lagna", "Mangal", "Budh", "Guru", "Shukra", "Chandra",
  "Surya", "Bhagyank", "Moolank", "Kua", "Nakshatra", "Tithi", "Yoga", "Karana",
  "Hora", "Vivah", "Abhijit", "Godhuli", "Yamaganda", "Gulika", "Bhadra", "Panchak",
  "Dhan", "Upay", "Daily", "Weekly", "Monthly", "Yearly", "Home", "About", "Contact",
  "Login", "Logout", "Rating", "Traditional", "Remedies", "Calendar", "Charts", "Charts",
  "System", "Graph", "Grid", "Rashi", "Lagna", "Dasha", "Lal", "Kitab", "Rudraksha",
  "Gemstone", "Nakshatra", "Char", "Pada", "Paksha", "Moola", "Ashwini", "Revati",
]);
const IGNORE_TAG = /(className|key|type|value|href|src|alt|style|var\(|import|from|export|return|const|function|useState|useEffect|=>|\{|\}|\(|\)|\/\/|\/\*)/;

for (const f of PAGES) {
  const src = readFileSync("src/pages/" + f, "utf8");
  const texts = jsxText(src);
  const eng = [];
  for (const t of texts) {
    const v = t.v.trim();
    if (v.length < 4) continue;
    if (IGNORE_TAG.test(v)) continue;
    if (ALLOW_WORDS.has(v)) continue;
    if (/[\u0900-\u0DFF\u0600-\u06FF]/.test(v)) continue;  // already translated
    if (!/[A-Za-z]/.test(v)) continue;
    eng.push({ v, line: lineOf(src, t.i) });
  }
  if (eng.length) {
    problems += eng.length;
    console.log(`[${f}] ${eng.length} English`);
    for (const e of eng.slice(0, 8)) console.log(`   L${e.line}: ${e.v.slice(0, 64)}`);
    if (eng.length > 8) console.log(`   ... +${eng.length - 8} more`);
  }
}

console.log(`\n=== TOTAL PROBLEMS: ${problems} ===`);
void rows; void ALL;