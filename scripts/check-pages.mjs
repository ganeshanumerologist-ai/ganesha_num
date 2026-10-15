// Har page ke TX me bhasha-coverage aur script-purity check karo.
// node scripts/check-pages.mjs
import { readFileSync, readdirSync } from "node:fs";

const SCRIPT_RANGES = {
  bengali: [0x0980, 0x09FF],
  devanagari: [0x0900, 0x097F],
  telugu: [0x0C00, 0x0C7F],
  tamil: [0x0B80, 0x0BFF],
  gujarati: [0x0A80, 0x0AFF],
  arabic: [0x0600, 0x06FF, 0x0750, 0x077F],
  kannada: [0x0C80, 0x0CFF],
  oriya: [0x0B00, 0x0B7F],
  malayalam: [0x0D00, 0x0D7F],
  gurmukhi: [0x0A00, 0x0A7F],
};
const EXPECT = {
  bn: "bengali", te: "telugu", ta: "tamil", gu: "gujarati", ur: "arabic",
  kn: "kannada", or: "oriya", ml: "malayalam", pa: "gurmukhi", as: "bengali",
  hi: "devanagari", mr: "devanagari",
};

const inScript = (ch, script) => {
  for (let i = 0; i < SCRIPT_RANGES[script].length; i += 2) {
    const c = ch.codePointAt(0);
    if (c >= SCRIPT_RANGES[script][i] && c <= SCRIPT_RANGES[script][i + 1]) return true;
  }
  return false;
};

// Ek page ke andar ke har "  <lang>: {" block ka text nikaalo
function extractBlocks(src) {
  const out = {};
  const re = /^\s{2,4}(en|hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as)\s*:\s*\{/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const lang = m[1];
    let i = re.lastIndex - 1, depth = 0;
    for (; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") { depth--; if (depth === 0) break; }
    }
    (out[lang] = out[lang] || []).push(src.slice(re.lastIndex - 1, i + 1));
  }
  return out;
}

const files = readdirSync("src/pages").filter((f) => f.endsWith(".jsx"));
let totalProblems = 0;

// Key names hata do — sirf VALUES check karne hain (user ko dikhta hai wahi)
function valuesOnly(block) {
  return block.replace(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*/g, ""); // "key:" hatao
}

console.log("=== Page TX coverage ===\n");
for (const f of files) {
  const src = readFileSync("src/pages/" + f, "utf8");
  const blocks = extractBlocks(src);
  const langs = Object.keys(blocks).sort();
  if (langs.length < 2) continue;
  const has = ["en", "hi", "mr", "bn", "te", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as"];
  const present = has.filter((l) => blocks[l]);
  const missing = has.filter((l) => !blocks[l]);
  const status = present.length === 13 ? "OK " : "TODO";
  console.log(`[${status}] ${f.padEnd(18)} ${present.length}/13 bhasha`);

  // Script purity check — sirf values
  for (const l of present) {
    if (l === "en" || !EXPECT[l]) continue;
    const text = valuesOnly(blocks[l].join(" "));
    const latin = (text.match(/[A-Za-z]{4,}/g) || [])
      .filter((w) => !/Rudraksha|Yantra|Firebase|Blue|Sapphire|Reports|Dashboard|Admin/.test(w));
    const nonLatin = [...text].filter((ch) => /[\u0900-\u0DFF\u0600-\u06FF]/.test(ch)).length;
    const scriptHits = [...text].filter((ch) => inScript(ch, EXPECT[l])).length;
    const purity = nonLatin ? (scriptHits / nonLatin) * 100 : 0;
    if (latin.length > 1 || purity < 99) {
      totalProblems++;
      console.log(`   ! ${l}: latin=${latin.slice(0, 5).join(",")} purity=${purity.toFixed(0)}%`);
    }
  }
  if (missing.length) console.log(`   missing: ${missing.join(", ")}`);
}
console.log(`\nProblems: ${totalProblems}`);