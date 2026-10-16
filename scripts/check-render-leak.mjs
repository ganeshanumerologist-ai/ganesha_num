// Rashifal + Loshu ke data ko har bhasha me render karke dekhna.
// Ye script node me chalti hai (browser nahi) — sirf text resolve karke
// ASCII Latin leak dhoondti hai.
import { rashiDeepTX, DEEP_TOPICS } from "../src/data/rashiDeepTX.js";
import { loshuTX, loshuYog, loshuUpay } from "../src/data/loshuTX.js";
import { loshuXTX } from "../src/data/loshuXTX.js";
import { siteTX } from "../src/i18n/siteTx.js";
import { paraTX } from "../src/i18n/paraTx.js";
import { pgT } from "../src/i18n/jyotish_b.js";
import { rashiLang } from "../src/data/rashi_i18n.js";
import { varshikLang } from "../src/data/varshik_detail.js";
import { RASHI_DATA } from "../src/data/jyotish.js";
import { rashiName, grahaName } from "../src/i18n/charts.js";
import { detectYogs } from "../src/utils/loshuYog.js";
import { LANGUAGES } from "../src/i18n/registry.js";

// Poora grid → saare yog + har missing number ka content
const FULL = { 1: 2, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1 };
const YOGS = detectYogs(FULL);
const MISSING = [1, 2, 3];

function renderPage(lang) {
  const S = siteTX(lang);
  const P = pgT(lang);
  const PR = paraTX(lang);
  const T = loshuTX(lang);
  const T2 = loshuXTX(lang);
  const D = rashiDeepTX(lang);
  const out = [];

  // ---- Rashifal: har rashi, har period, har topic ----
  for (let ri = 0; ri < RASHI_DATA.length; ri++) {
    const base = RASHI_DATA[ri];
    const r = rashiLang(ri, lang, base);
    const v = varshikLang(ri, lang);
    out.push(S.rashifal_title, S.rashifal_pick, rashiName(base.name, lang), grahaName(base.lord, lang));
    // Sirf wo fields jo page actually render karta hai.
    // `name` aur `lord` page par rashiName/grahaName se jaate hain,
    // `dates` kahin use nahi hota — isliye unhe chhod rahe hain.
    for (const k of ["traits", "prem", "arthik", "career", "varshik", "luckyColor", "mantra", "day"]) {
      out.push(String(r[k]));
    }
    for (const k of Object.keys(v)) out.push(String(v[k]));
    for (const t of DEEP_TOPICS) out.push(...(D[t] || []));
  }

  // ---- Rashifal ka UI text ----
  out.push(P.pg_dainik, P.pg_saptahik, P.pg_masik, P.pg_varshik,
    P.pg_career, P.pg_prem, P.pg_luckynum, P.pg_luckycolor, P.pg_day, P.pg_mantra,
    P.pg_upay, PR.padhai, PR.vivah, PR.arogya, PR.dhan, PR.share, PR.vyapar, PR.samman);
  for (const k of ["rf_shubh", "rf_ashubh", "rf_shubh_dates", "rf_ashubh_dates",
    "rf_lucky_nums", "rf_avoid_nums", "rf_birth_ask"]) out.push(S[k]);

  // ---- Loshu ka poora text ----
  for (const y of YOGS) { const t = loshuYog(y.key, lang); out.push(t.name, t.desc); }
  for (const n of MISSING) { const u = loshuUpay(n, lang); out.push(u.gem, ...u.do, ...u.dont); }
  for (const k of Object.keys(T)) if (typeof T[k] === "string") out.push(T[k]);
  for (const lv of ["high", "mid", "low"]) out.push(...(T2.bazaar[lv] || []));
  out.push(...T2.property);
  for (const k of Object.keys(T2.year)) out.push(T2.year[k]);
  for (const k of ["lo_tag_raj", "lo_tag_dhan", "lo_tag_property", "lo_tag_bazaar",
    "lo_tag_vyapar", "lo_tag_labh", "lo_do_head", "lo_dont_head", "lo_bazaar_head",
    "lo_property_head", "lo_year_head", "lo_grid_head", "lo_level_high", "lo_level_mid",
    "lo_level_low", "lo_repeat_note", "lo_py_head"]) out.push(S[k]);
  for (const k of ["pg_grid", "pg_lucky", "pg_moolank", "pg_bhagyank", "pg_kua", "pg_namank", "pg_missing", "pg_luckynum"]) out.push(P[k]);

  return out.filter((x) => typeof x === "string" && x.trim());
}

// Woh words jo app me khud hain (brand, city, AI, platform …) — inhe ginti nahi karte
const ALLOWED = [
  "numerology", "vip", "facebook", "twitter", "linkedin", "whatsapp", "telegram",
  "instagram", "tiktok", "youtube", "google", "firebase", "react", "free", "pro",
  "login", "logout", "admin", "dashboard", "home", "kundli", "panchang", "calendar",
  "loshu", "shani", "mangal", "budh", "guru", "surya", "chandra", "shukra", "ketu",
  "rahu", "shastri", "guru", "vinay", "kapil", "yamal", "dharam", "vikram", "shalivahan",
  "mumbai", "delhi", "kolkata", "chennai", "bangalore", "pune", "ahmedabad", "jaipur",
  "lucknow", "hyderabad", "noida", "indore", "nagpur", "surat", "bhopal", "patna",
];

const LATIN = /[A-Za-z]{3,}/g;
let total = 0;

for (const l of LANGUAGES) {
  if (l.code === "en") continue;
  const pieces = renderPage(l.code);
  const bad = [];
  for (const s of pieces) {
    const m = s.match(LATIN);
    if (!m) continue;
    for (const w of m) {
      const low = w.toLowerCase();
      if (ALLOWED.includes(low)) continue;
      bad.push(`${w}  <<  "${s.slice(0, 70)}"`);
    }
  }
  if (bad.length) {
    total += bad.length;
    console.log(`\n=== ${l.code} (${l.native}) — ${bad.length} Latin leak(s) ===`);
    for (const b of bad.slice(0, 12)) console.log("   " + b);
    if (bad.length > 12) console.log(`   ...aur ${bad.length - 12}`);
  }
}

console.log(total === 0 ? "\nRENDER CHECK: 0 Latin leak in 21 non-English languages" : `\nRENDER CHECK: ${total} leaks`);
process.exit(total ? 1 : 0);