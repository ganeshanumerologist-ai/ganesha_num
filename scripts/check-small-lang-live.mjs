// Asli test: kya user language badalne par WEBSITE KA TEXT badalta hai?
//
// Pehle: ne/mai/doi/brx/sa par pura UI Hindi dikhta tha (Hindi = "kuch nahi badla"),
//        ks/sd par Urdu, sat par Bengali.
// Ab: har bhasha ka apna dict hona chahiye, aur Hindi se alag dikhna chahiye.
import { translations } from "../src/i18n/translations.js";
import { siteTX } from "../src/i18n/siteTx.js";
import kundliT from "../src/i18n/kundli.js";
import pgMod from "../src/i18n/jyotish_b.js";
import { LANGUAGES } from "../src/i18n/registry.js";
import { SMALL_LANGS, smallLang } from "../src/i18n/smallTX.js";

const pgT = pgMod;
const HI_FAMILY = ["ne", "mai", "doi", "brx", "sa", "mni"];
const UR_FAMILY = ["ks", "sd"];
const BN_FAMILY = ["sat"];

const t = (lang, key) => {
  // LanguageContext ka t()
  const { langChain } = { langChain: null };
  return translations[lang]?.[key];
};

let fails = 0;
const bad = (m) => { fails++; console.log("  [FAIL] " + m); };

console.log("=== 1. kya har chhoti bhasha par website ka text HINDI/URDU/BENGALI se alag hai? ===");
console.log("(pehle yahi problem thi — bhasha chunne par 'kuch nahi badla' lagta tha)\n");

// t() LanguageContext ka hai; wahi langChain logic yahan replicate karte hain
import { langChain } from "../src/i18n/registry.js";
const tt = (lang, key) => {
  for (const code of langChain(lang)) {
    const v = translations[code]?.[key];
    if (typeof v === "string" && v) return v;
  }
  return key;
};

const PROBES = ["nav_home", "nav_calculator", "nav_panchang", "calc_title", "login_title", "hero_cta"];

for (const lang of SMALL_LANGS) {
  const wasSameAs = HI_FAMILY.includes(lang) ? "hi"
    : UR_FAMILY.includes(lang) ? "ur"
      : BN_FAMILY.includes(lang) ? "bn" : null;

  const rows = PROBES.map((p) => ({ p, mine: tt(lang, p), was: wasSameAs ? tt(wasSameAs, p) : null }));

  // Asli galti: value ENGLISH me chala gaya.
  const english = rows.filter((r) => r.mine === translations.en[r.p]);
  // Info: parivaar ki bhasha se kitna alag. 100% hona zaroori NAHI —
  // "पंचांग" Dogri aur Hindi dono me wahi hai (Sanskrit se aaya shabd),
  // wahan alag hona galat hota.
  const sameAsFamily = rows.filter((r) => r.was !== null && r.mine === r.was).length;

  const status = english.length
    ? `${english.length} probe ENGLISH par ❌`
    : sameAsFamily === PROBES.length
      ? "sab parivaar jaisa (galat?) ❌"
      : `apni bhasha me ✅${sameAsFamily ? `  (${sameAsFamily}/${PROBES.length} par shabd shared)` : ""}`;

  console.log(`  ${lang.padEnd(4)} ${status}`);
  for (const r of rows.slice(0, 3)) {
    console.log(`        ${r.p.padEnd(15)} "${r.mine.slice(0, 34)}"`);
  }
  if (english.length) bad(`${lang}: ${english.map((r) => r.p).join(", ")} ab bhi English hai`);
}

console.log("\n=== 2. chaaron module us bhasha ka apna dict de rahe hain? ===");
for (const lang of SMALL_LANGS) {
  const mine = smallLang(lang);
  const site = siteTX(lang);
  const kund = kundliT(lang);
  const pg = pgT(lang);
  const siteOwn = site.nav_panchang === mine?.site?.nav_panchang;
  const kundOwn = kund.k_title === mine?.kundli?.k_title;
  const pgOwn = pg.pg_lagna === mine?.pg?.pg_lagna;
  const trOwn = translations[lang]?.nav_home === mine?.translations?.nav_home;

  const ok = siteOwn && kundOwn && pgOwn && trOwn;
  console.log(`  ${lang.padEnd(4)} translations:${trOwn ? "OK" : "✗"} site:${siteOwn ? "OK" : "✗"} kundli:${kundOwn ? "OK" : "✗"} pg:${pgOwn ? "OK" : "✗"}`);
  if (!ok) bad(`${lang}: koi module apna dict nahi de raha`);
}

console.log("\n=== 3. koi bhasha English par gir to nahi gayi? ===");
// Ye English me rehna SAHI hai — brand, technical ya proper noun
const KEEP_EN = new Set([
  "app_name", "footer_powered", "nav_chat", "chat_title",
  "nav_grid", "nav_loshu", "pg_grid",
  "pg_varga", "pg_lalkitab",
  "calc_ex_name", "calc_ex_mob",
  "admin_step1", "admin_step2", "admin_step3",
  "share_sub", "share_note", "share_default_msg",
]);
for (const lang of LANGUAGES.map((l) => l.code)) {
  if (lang === "en") continue;
  const leaks = [];
  for (const k of Object.keys(translations.en)) {
    if (KEEP_EN.has(k)) continue;
    const en = translations.en[k];
    if (!/[A-Za-z]{3,}/.test(String(en))) continue;
    if (tt(lang, k) === en) leaks.push(k);
  }
  const isSmall = SMALL_LANGS.includes(lang);
  if (leaks.length) {
    console.log(`  ${lang.padEnd(4)} ${leaks.length} leak: ${leaks.slice(0, 6).join(", ")}`);
    if (isSmall) bad(`${lang}: ${leaks.length} English value — ${leaks.slice(0, 5).join(", ")}`);
  } else {
    console.log(`  ${lang.padEnd(4)} 0 English leak ✅`);
  }
}

console.log("\n=== 4. bhasha ke apne native name dikhna chahiye (UI hint) ===");
for (const lang of SMALL_LANGS) {
  const d = smallLang(lang);
  console.log(`  ${lang.padEnd(4)} nav_home="${d.translations.nav_home}"  nav_panchang="${d.site.nav_panchang}"`);
}

console.log(fails ? `\n${fails} PROBLEM` : "\nWEBSITE KA TEXT HAR CHHOTI BHASHA ME BADALTA HAI ✅");
process.exit(fails ? 1 : 0);