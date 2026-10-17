import { translations } from "../src/i18n/translations.js";
import { langChain } from "../src/i18n/registry.js";
import { SMALL_LANGS } from "../src/i18n/smallTX.js";

const tt = (lang, key) => {
  for (const code of langChain(lang)) {
    const v = translations[code]?.[key];
    if (typeof v === "string" && v) return v;
  }
  return key;
};

for (const lang of SMALL_LANGS) {
  const same = [];
  for (const k of Object.keys(translations.en)) {
    const en = translations.en[k];
    if (!/[A-Za-z]{3,}/.test(String(en))) continue;
    if (tt(lang, k) === en) same.push(`${k}="${String(en).slice(0, 34)}"`);
  }
  console.log(`\n[${lang}] ${same.length} key English value ke barabar:`);
  for (const s of same) console.log("   " + s);
}