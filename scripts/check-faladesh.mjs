// Home page ka "phaladesh" spelling — Hindi vs Marathi vs baaki bhasha
import { translations } from "../src/i18n/translations.js";
import { langChain } from "../src/i18n/registry.js";

const LANGS = ["hi", "en", "mr", "bn", "ta", "te", "gu", "kn", "ml", "pa", "ur", "sa"];

console.log("=== langChain ===");
for (const l of LANGS) console.log("  " + l.padEnd(4), JSON.stringify(langChain(l)));

console.log("\n=== translations me 'faladesh' wale shabd ===");
for (const l of LANGS) {
  const d = translations[l] || {};
  const hits = Object.entries(d).filter(([, v]) =>
    typeof v === "string" && /फल|फळ/.test(v));
  if (hits.length) {
    for (const [k, v] of hits) {
      console.log(`  ${l.padEnd(4)} ${k.padEnd(16)} ${v.slice(0, 60)}`);
    }
  }
}

console.log("\n=== jaanch: 'फळ' (Devanagari LETTER LA, U+0933) kahan galti se aa raha hai? ===");
const LA = "फळ";     // फ + ळ
for (const l of LANGS) {
  const d = translations[l] || {};
  const n = Object.values(d).filter((v) => typeof v === "string" && v.includes(LA)).length;
  if (n) console.log(`  ${l.padEnd(4)} ${n} value(s) me 'फळ' hai`);
}

console.log("\n=== saare shabd jisme ळ (U+0933) hai — har bhasha me ===");
for (const l of LANGS) {
  const d = translations[l] || {};
  const hits = Object.entries(d).filter(([, v]) => typeof v === "string" && /ळ/.test(v));
  console.log(`  ${l.padEnd(4)} ${hits.length} value(s)` + (hits.length ? ": " + hits.slice(0, 6).map(([k, v]) => `${k}="${v.slice(0, 34)}"`).join(" | ") : ""));
}