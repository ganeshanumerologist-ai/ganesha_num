// names.js ki har SAM (samvatsara) array exactly 60 entries honi chahiye —
// ek typo bhi saare index shift kar degi.
// node scripts/check-sam.mjs
import { readFileSync } from "node:fs";
import { samvatsaraNameI18n } from "../src/i18n/names.js";

const src = readFileSync("src/i18n/names.js", "utf8");
const LANGS = ["en", "hi", "mr", "bn", "te", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as"];

// "Samvatsara ke naam" block ke andar sirf wahi arrays dekhein
const start = src.indexOf("const SAM = {");
const end = src.indexOf("export function samvatsaraIndex");
const chunk = src.slice(start, end);

let bad = 0;
for (const L of LANGS) {
  const i = chunk.indexOf(`\n  ${L}: [`);
  if (i < 0) { console.log(`[MISSING] ${L}`); bad++; continue; }
  const arrStart = chunk.indexOf("[", i);
  const arrEnd = chunk.indexOf("]", arrStart);
  const body = chunk.slice(arrStart + 1, arrEnd);
  const n = body.split(",").filter((s) => s.trim().startsWith('"')).length;
  if (n !== 60) { console.log(`[BAD] ${L} has ${n} entries (expected 60)`); bad++; }
}
console.log(`Samvatsara array check: ${bad === 0 ? "OK — sab 13 bhasha 60/60" : bad + " problem"}`);
console.log(`2026 -> ${samvatsaraNameI18n(2026, "en")} / ${samvatsaraNameI18n(2026, "hi")}`);