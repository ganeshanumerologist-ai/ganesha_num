// Har bhasha ke liye har key resolve hoti hai ya nahi — ye check karo.
// node scripts/check-i18n.mjs
import { translations } from "../src/i18n/translations.js";
import { LANGUAGES, langChain } from "../src/i18n/registry.js";
import { getMeaning } from "../src/data/meanings_all.js";
import { NUMBER_MEANINGS } from "../src/data/meanings.js";

const EN = translations.en;
const keys = Object.keys(EN);
let problems = 0;

console.log("=== UI text check ===");
for (const { code, name } of LANGUAGES) {
  const missing = [];
  for (const k of keys) {
    let found = false;
    for (const c of langChain(code)) {
      const v = translations[c] && translations[c][k];
      if (typeof v === "string" && v) { found = true; break; }
    }
    if (!found) missing.push(k);
  }
  // English me to sab key hona chahiye
  if (missing.length) { problems++; console.log(`  ✗ ${name} (${code}): ${missing.join(", ")}`); }
  else console.log(`  ✓ ${name} (${code})`);
}

console.log("\n=== Script check (English text leak in non-English) ===");
for (const { code, name } of LANGUAGES) {
  if (code === "en") continue;
  const dict = translations[code] || {};
  const own = Object.keys(dict).filter((k) => dict[k] !== EN[k]);
  const chain = langChain(code).slice(1); // en hata do
  console.log(`  ${name} (${code}): ${own.length}/${keys.length} apni bhasha me, chain: ${chain.join(" > ")}`);
}

console.log("\n=== Number meanings check ===");
const nums = Object.keys(NUMBER_MEANINGS).map(Number);
for (const { code, name } of LANGUAGES) {
  const en = [];
  for (const n of nums) {
    const m = getMeaning(n, code);
    const base = getMeaning(n, "en");
    if (m.desc === base.desc) en.push(n);
    if (!m.strengths) en.push(`str-${n}`);
  }
  if (en.length) { problems++; console.log(`  ! ${name} (${code}) English me rehne wale: ${en.join(", ")}`); }
  else console.log(`  ✓ ${name} (${code})`);
}

console.log(`\nProblems: ${problems}`);