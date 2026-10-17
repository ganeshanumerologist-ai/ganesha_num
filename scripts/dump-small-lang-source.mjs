// 9 chhoti bhashon ke liye English source dump karo — taaki har
// translator ko ek hi jagah se poora source mile (guess nahi karna pade).
import fs from "node:fs";
import { translations } from "../src/i18n/translations.js";
import { siteTX } from "../src/i18n/siteTx.js";
import kundliT from "../src/i18n/kundli.js";
import pgMod from "../src/i18n/jyotish_b.js";

const pgT = pgMod;

const out = {
  translations: translations.en,
  site: siteTX("en"),
  kundli: kundliT("en"),
  pg: pgT("en"),
};

fs.writeFileSync("scripts/small-lang-source.json", JSON.stringify(out, null, 2), "utf8");

const n = (o) => Object.keys(o).length;
console.log("scripts/small-lang-source.json likha");
console.log("  translations :", n(out.translations), "keys");
console.log("  site         :", n(out.site), "keys");
console.log("  kundli       :", n(out.kundli), "keys");
console.log("  pg           :", n(out.pg), "keys");
console.log("  TOTAL        :", n(out.translations) + n(out.site) + n(out.kundli) + n(out.pg), "keys");
console.log("");
console.log("sample translations keys:", Object.keys(out.translations).slice(0, 12).join(", "));
console.log("sample site keys        :", Object.keys(out.site).slice(0, 12).join(", "));

// nested structures bhi dekh lo (koi object value to nahi?)
const nested = [];
for (const [grp, d] of Object.entries(out)) {
  for (const [k, v] of Object.entries(d)) {
    if (v && typeof v === "object") nested.push(`${grp}.${k} = ${JSON.stringify(v).slice(0, 60)}`);
  }
}
console.log("\nnested values:", nested.length ? nested.join("\n  ") : "koi nahi (sab flat string)");