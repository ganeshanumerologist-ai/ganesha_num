// Chhoti bhashayein (ne, doi, sa, brx, ks, sd, sat, mni) chunne par
// website ka text badhta hi hai ya nahi — ye node me check karo.
// Browser me localStorage set karna reliable nahi, isliye seedha
// resolver/logic test karte hain.
import { langChain, normalizeLang, LANGUAGES } from "../src/i18n/registry.js";
import { translations } from "../src/i18n/translations.js";
import { siteTX } from "../src/i18n/siteTx.js";

// LanguageContext ka t() — bilkul wahi logic
const t = (lang, key) => {
  for (const code of langChain(lang)) {
    const v = translations[code]?.[key];
    if (typeof v === "string" && v) return v;
  }
  return key;
};

const ALL = LANGUAGES.map((l) => l.code);

console.log("=== normalizeLang har registry code par ===");
for (const c of ALL) {
  const n = normalizeLang(c);
  console.log(`  ${c.padEnd(4)} -> ${String(n).padEnd(4)} ${n === c ? "" : "*** BADH GAYA ***"}`);
}

console.log("\n=== Chhoti bhasha kahan gir rahi hai? ===");
console.log("(chain[1] = jis bhasha ka content milega)\n");
const rows = [];
for (const c of ALL) {
  const chain = langChain(c);
  const chain2 = chain[1];
  const own = translations[c] ? "APNI" : (translations[chain2] ? chain2 : "?");
  const sample = t(c, "nav_phaladesh");
  rows.push(
    `  ${c.padEnd(4)} apni-dict=${(translations[c] ? "HAI " : "NAHI")} ` +
    `chain=[${chain.join(",")}] gir-rahi=${own.padEnd(4)} ` +
    `nav_phaladesh="${sample}"`,
  );
}
console.log(rows.join("\n"));

console.log("\n=== Kya website ka text sach me badal raha hai? ===");
// Har bhasha ka ek unique-ish string lo aur compare karo
const probe = "nav_calculator";
const seen = new Map();
for (const c of ALL) seen.set(t(c, probe), (seen.get(t(c, probe)) || []).concat(c));
console.log(`  probe key: ${probe} = "${t("en", probe)}"`);
console.log(`  ${seen.size} alag value(s) mili ${ALL.length} bhashaon me:\n`);
for (const [val, langs] of seen) {
  console.log(`    ${langs.join(", ").padEnd(28)} -> "${val}"`);
}

console.log("\n=== siteTX bhi wahi problem? ===");
for (const c of ["ne", "sa", "brx", "ks", "sd", "sat", "mni"]) {
  console.log(`  ${c.padEnd(4)} siteTX(lang).nav_home = "${String(siteTX(c).nav_home).slice(0, 40)}"`);
}