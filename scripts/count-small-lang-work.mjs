// Chhoti bhashaon ke liye kitna content chahiye — ye count karo.
import { translations } from "../src/i18n/translations.js";
import { siteTX } from "../src/i18n/siteTx.js";
import kundliT from "../src/i18n/kundli.js";
import { pgT } from "../src/i18n/jyotish_b.js";
import { LANGUAGES, langChain } from "../src/i18n/registry.js";

// Woh bhashayein jinme apni dict NAHI hai (fallback pe gir rahi hain)
const SMALL = LANGUAGES
  .map((l) => l.code)
  .filter((c) => {
    const chain = langChain(c);
    return chain[1] && chain[1] !== "en" && chain[0] !== c;
  });

console.log("=== chhoti bhashayein (fallback pe hain) ===");
for (const c of SMALL) console.log(`  ${c.padEnd(4)} -> ${langChain(c)[1]}`);

const sets = [
  ["translations.js", Object.keys(translations.en).length],
  ["siteTx.js", Object.keys(siteTX("en")).length],
  ["kundli.js", Object.keys(kundliT("en")).length],
  ["jyotish_b.js", Object.keys(pgT("en")).length],
];

console.log("\n=== har module me kitne keys ===");
let total = 0;
for (const [n, c] of sets) {
  console.log(`  ${n.padEnd(18)} ${c}`);
  total += c;
}
console.log(`  ${"TOTAL".padEnd(18)} ${total}`);

const perLang = total;
console.log(`\n${SMALL.length} chhoti bhasha × ${perLang} keys = ${SMALL.length * perLang} strings`);

// Nav sirf kaise kitna hai — sabse zyada dikhne wala hissa
const navKeys = Object.keys(translations.en).filter((k) => k.startsWith("nav_"));
console.log(`\nnav_* keys: ${navKeys.length}  (ye har page par navbar me dikhte hain)`);

// UI words jo har page par lagte hain
const uiKeys = Object.keys(translations.en).filter((k) =>
  /_(name|dob|mobile|gender|male|female|other|submit|back|next|save|copy|share|search|choose|loading|error|required|optional)$/.test(k));
console.log(`common form/UI keys: ${uiKeys.length}`);

console.log(`\nsirf nav + form/UI = ${navKeys.length + uiKeys.length} keys`);
console.log(`  → ${SMALL.length} × ${navKeys.length + uiKeys.length} = ${SMALL.length * (navKeys.length + uiKeys.length)} strings (kam se kam)`);