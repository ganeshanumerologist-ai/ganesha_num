// SEO descriptions me koi corrupt char ya English leak to nahi?
import { SEO_DESC } from "../src/seo/seoDesc.js";
import { ROUTES } from "../src/seo/routes.js";
import { LANGUAGES } from "../src/i18n/registry.js";
import fs from "node:fs";

const SCRIPT = {
  en: null,
  hi: [0x0900, 0x097f], mr: [0x0900, 0x097f], ne: [0x0900, 0x097f],
  doi: [0x0900, 0x097f], mai: [0x0900, 0x097f], brx: [0x0900, 0x097f],
  sa: [0x0900, 0x097f],
  bn: [0x0980, 0x09ff], as: [0x0980, 0x09ff],
  ta: [0x0b80, 0x0bff], te: [0x0c00, 0x0c7f], kn: [0x0c80, 0x0cff],
  or: [0x0b00, 0x0b7f], ml: [0x0d00, 0x0d7f], pa: [0x0a00, 0x0a7f],
  gu: [0x0a80, 0x0aff], ur: [0x0600, 0x06ff], ks: [0x0600, 0x06ff],
  sd: [0x0600, 0x06ff], sat: [0x1c50, 0x1c7f], mni: [0xa800, 0xa82f],
};

const ALLOWED = [
  [0x0964, 0x0965], [0x060c, 0x060c], [0x061b, 0x061f], [0x200c, 0x200f],
  [0x2013, 0x2014], [0x2018, 0x201f], [0x2026, 0x2026], [0x00b7, 0x00b7],
];
const inR = (cp, r) => cp >= r[0] && cp <= r[1];

let fails = 0;
const lines = [];

// ── 1. key coverage ──
lines.push("══════ KEY COVERAGE ══════\n");
const NEED = ROUTES.map((r) => r.descKey);
for (const [lang, dict] of Object.entries(SEO_DESC)) {
  const missing = NEED.filter((k) => !dict[k]);
  lines.push(`  ${lang.padEnd(4)} ${Object.keys(dict).length} keys  ${missing.length ? "MISSING: " + missing.join(",") : "✅"}`);
  if (missing.length) fails += missing.length;
}

// ── 2. corrupt char check ──
lines.push("\n══════ CORRUPT CHAR ══════\n");
let corrupt = 0;
for (const [lang, dict] of Object.entries(SEO_DESC)) {
  for (const [k, v] of Object.entries(dict)) {
    if (/[\uFFFD]/.test(v) || /[\u00C2\u00C3]/.test(v)) {
      lines.push(`  [FAIL] ${lang}.${k}  corrupt: ${v.slice(0, 40)}`);
      corrupt++; fails++;
    }
  }
}
if (!corrupt) lines.push("  koi corrupt char nahi ✅");

// ── 3. script purity ──
lines.push("\n══════ SCRIPT PURITY ══════\n");
for (const [lang, dict] of Object.entries(SEO_DESC)) {
  const range = SCRIPT[lang];
  if (!range) continue;
  const bad = [];
  for (const [k, v] of Object.entries(dict)) {
    // placeholder {p}/{h} hatao pehle
    const s = v.replace(/\{[a-z]\}/g, "");
    for (const ch of s) {
      const cp = ch.codePointAt(0);
      if (cp < 0x80) continue;
      if (inR(cp, range)) continue;
      if (ALLOWED.some((r) => inR(cp, r))) continue;
      bad.push(`${k}: "${ch}" U+${cp.toString(16).toUpperCase()}`);
      break;
    }
  }
  if (bad.length) {
    lines.push(`  [FAIL] ${lang} — ${bad.length}`);
    for (const b of bad.slice(0, 4)) lines.push("     " + b);
    fails += bad.length;
  } else {
    lines.push(`  [ OK ] ${lang.padEnd(4)} ${Object.keys(dict).length} values apni script me`);
  }
}

// ── 4. length (Google 155-160 chars truncate karta hai) ──
lines.push("\n══════ LENGTH ══════\n");
for (const lang of ["en", "hi", "mr", "bn", "ta", "te", "gu", "ur", "kn", "or", "ml", "pa", "as"]) {
  const d = SEO_DESC[lang];
  if (!d) continue;
  const short = NEED.filter((k) => d[k] && d[k].length < 70);
  const long = NEED.filter((k) => d[k] && d[k].length > 200);
  const avg = Math.round(NEED.reduce((a, k) => a + (d[k]?.length || 0), 0) / NEED.length);
  lines.push(`  ${lang.padEnd(4)} avg ${String(avg).padStart(3)} chars  ${short.length ? "short: " + short.length : ""} ${long.length ? "long: " + long.join(",") : ""}`);
}

// ── 5. chhoti bhasha ka fallback ──
lines.push("\n══════ CHHOTI BASHAA (fallback chain) ══════\n");
const CHHOTI = ["ne", "doi", "mai", "brx", "sa", "ks", "sd", "sat", "mni"];
for (const c of CHHOTI) {
  lines.push(`  ${c.padEnd(4)} apni file nahi → langChain parivaar par giregi (English nahi)`);
}

lines.push(fails ? `\n${fails} problem ❌` : "\nSEO DESCRIPTIONS SAHI HAIN ✅");

fs.writeFileSync("scripts/_seo-desc-check.txt", lines.join("\n"), "utf8");
console.log(lines.join("\n"));
process.exit(fails ? 1 : 0);
