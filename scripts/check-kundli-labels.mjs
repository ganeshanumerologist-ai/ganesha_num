// Kundli.jsx ke naye labels — wahi tarika jo website par chalta hai (langChain fallback)
import { langChain } from "../src/i18n/registry.js";
import { translations } from "../src/i18n/translations.js";
import pgT from "../src/i18n/jyotish_b.js";
import { siteTX } from "../src/i18n/siteTx.js";

const LANGS = ["hi", "en", "mr", "bn", "ta", "te", "gu", "kn", "ml", "pa", "ur", "sa",
  "mni", "ne", "mai", "doi", "brx", "ks", "sd", "sat"];

// Website ka t() — ulta loop (last se pehle) taki English jeet na sake
const t = (lang, key) => {
  for (const code of langChain(lang)) {
    const v = translations[code]?.[key];
    if (typeof v === "string" && v) return v;
  }
  return key;
};

let bad = 0;
const rows = [];
for (const l of LANGS) {
  const lifepath = pgT(l)?.pg_lifepath;
  const birthday = t(l, "lb_birthday");
  const attitude = t(l, "lb_attitude");
  const city = siteTX(l)?.city_search;
  const reports = t(l, "nav_reports");

  const missing = [];
  if (!lifepath?.trim()) missing.push("pg_lifepath");
  if (!birthday?.trim() || birthday === "lb_birthday") missing.push("lb_birthday");
  if (!attitude?.trim() || attitude === "lb_attitude") missing.push("lb_attitude");
  if (!city?.trim()) missing.push("city_search");
  if (!reports?.trim() || reports === "nav_reports") missing.push("nav_reports");

  if (missing.length) { bad++; rows.push(`  [MISSING] ${l.padEnd(4)} ${missing.join(", ")}`); }
  else rows.push(`  ${l.padEnd(4)} ${String(lifepath).padEnd(12)} | ${String(birthday).padEnd(16)} | ${String(attitude)}`);
}
console.log(rows.join("\n"));

// Extra: koi bhi label English me girna nahi chahiye 13 main bhasha me
console.log("\n── English leak check (13 main bhasha) ──");
const MAIN = ["hi", "en", "mr", "bn", "ta", "te", "gu", "kn", "ml", "pa", "ur", "sa"];
let leak = 0;
for (const l of MAIN) {
  if (l === "en") continue;
  for (const [k, v] of [["lb_birthday", t(l, "lb_birthday")], ["lb_attitude", t(l, "lb_attitude")],
    ["pg_lifepath", pgT(l)?.pg_lifepath], ["city_search", siteTX(l)?.city_search]]) {
    if (/^[A-Za-z][A-Za-z\s,'.()/-]*$/.test(String(v))) {
      leak++; console.log(`  [LEAK] ${l} ${k} = "${v}"`);
    }
  }
}
console.log(leak ? `  ${leak} leak` : "  koi English leak nahi ✅");

console.log(bad || leak ? `\n${bad + leak} problem` : "\nSAARE 20 BHAASHA KE LABELS READY ✅");
process.exit(bad || leak ? 1 : 0);