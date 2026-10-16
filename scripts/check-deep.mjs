// rashiDeep + loshu + loshuX ka verification.
//
// Check karta hai:
//   1. har file me required keys ka poora parivaar hai
//   2. har array ki length en.js se exactly barabar hai
//   3. kisi bhi string value me Latin letter nahi hai (yog keys ko chhod kar)
//   4. script purity — har bhasha me dusri script ka character nahi
//   5. chhoti bhasha (nepali, dogri …) English par nahi girti

import { langChain } from "../src/i18n/registry.js";
import { rashiDeepTX, DEEP_TOPICS } from "../src/data/rashiDeepTX.js";
import { loshuTX, loshuUpay } from "../src/data/loshuTX.js";
import { loshuXTX } from "../src/data/loshuXTX.js";
import { detectYogs } from "../src/utils/loshuYog.js";

const LANGS = ["hi", "mr", "bn", "te", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as"];
const SMALL = ["mai", "sat", "ks", "ne", "sd", "doi", "mni", "brx", "sa"];

// Ek bhasha ko kis range ka Latin-free text chahiye.
const SCRIPTS = {
  hi: /[\u0900-\u097F]/, mr: /[\u0900-\u097F]/, ne: /[\u0900-\u097F]/,
  doi: /[\u0900-\u097F]/, mai: /[\u0900-\u097F]/, brx: /[\u0900-\u097F]/, sa: /[\u0900-\u097F]/,
  bn: /[\u0980-\u09FF]/, as: /[\u0980-\u09FF]/,
  te: /[\u0C00-\u0C7F]/,
  ta: /[\u0B80-\u0BFF]/,
  gu: /[\u0A80-\u0AFF]/,
  ur: /[\u0600-\u06FF\u0750-\u077F]/, ks: /[\u0600-\u06FF]/, sd: /[\u0600-\u06FF]/,
  kn: /[\u0C80-\u0CFF]/,
  ml: /[\u0D00-\u0D7F]/,
  pa: /[\u0A00-\u0A7F]/,
  or: /[\u0B00-\u0B7F]/,
  en: /[A-Za-z]/,
};

// Is bhasha me BANNED ranges (apne alawa koi bhi Indic/Arabic range).
const BANNED = {
  hi: [/\u0980-\u09FF/, /\u0C00-\u0C7F/, /\u0B80-\u0BFF/, /\u0A80-\u0AFF/, /\u0C80-\u0CFF/, /\u0D00-\u0D7F/, /\u0A00-\u0A7F/, /\u0B00-\u0B7F/, /\u0600-\u06FF/, /\u1CD0-\u1CFF/],
  mr: [/\u0980-\u09FF/, /\u0C00-\u0C7F/, /\u0B80-\u0BFF/, /\u0A80-\u0AFF/, /\u0C80-\u0CFF/, /\u0D00-\u0D7F/, /\u0A00-\u0A7F/, /\u0B00-\u0B7F/, /\u0600-\u06FF/],
  bn: [/\u0900-\u097F/, /\u0C00-\u0C7F/, /\u0B80-\u0BFF/, /\u0A80-\u0AFF/, /\u0C80-\u0CFF/, /\u0D00-\u0D7F/, /\u0A00-\u0A7F/, /\u0B00-\u0B7F/, /\u0600-\u06FF/],
  as: [/\u0900-\u097F/, /\u0C00-\u0C7F/, /\u0B80-\u0BFF/, /\u0A80-\u0AFF/, /\u0C80-\u0CFF/, /\u0D00-\u0D7F/, /\u0A00-\u0A7F/, /\u0B00-\u0B7F/, /\u0600-\u06FF/],
  te: [/\u0900-\u097F/, /\u0980-\u09FF/, /\u0B80-\u0BFF/, /\u0A80-\u0AFF/, /\u0C80-\u0CFF/, /\u0D00-\u0D7F/, /\u0A00-\u0A7F/, /\u0B00-\u0B7F/, /\u0600-\u06FF/],
  ta: [/\u0900-\u097F/, /\u0980-\u09FF/, /\u0C00-\u0C7F/, /\u0A80-\u0AFF/, /\u0C80-\u0CFF/, /\u0D00-\u0D7F/, /\u0A00-\u0A7F/, /\u0B00-\u0B7F/, /\u0600-\u06FF/],
  gu: [/\u0900-\u097F/, /\u0980-\u09FF/, /\u0C00-\u0C7F/, /\u0B80-\u0BFF/, /\u0C80-\u0CFF/, /\u0D00-\u0D7F/, /\u0A00-\u0A7F/, /\u0B00-\u0B7F/, /\u0600-\u06FF/],
  ur: [/\u0900-\u097F/, /\u0980-\u09FF/, /\u0C00-\u0C7F/, /\u0B80-\u0BFF/, /\u0A80-\u0AFF/, /\u0C80-\u0CFF/, /\u0D00-\u0D7F/, /\u0A00-\u0A7F/, /\u0B00-\u0B7F/],
  kn: [/\u0900-\u097F/, /\u0980-\u09FF/, /\u0C00-\u0C7F/, /\u0B80-\u0BFF/, /\u0A80-\u0AFF/, /\u0D00-\u0D7F/, /\u0A00-\u0A7F/, /\u0B00-\u0B7F/, /\u0600-\u06FF/],
  ml: [/\u0900-\u097F/, /\u0980-\u09FF/, /\u0C00-\u0C7F/, /\u0B80-\u0BFF/, /\u0A80-\u0AFF/, /\u0C80-\u0CFF/, /\u0A00-\u0A7F/, /\u0B00-\u0B7F/, /\u0600-\u06FF/],
  pa: [/\u0900-\u097F/, /\u0980-\u09FF/, /\u0C00-\u0C7F/, /\u0B80-\u0BFF/, /\u0A80-\u0AFF/, /\u0C80-\u0CFF/, /\u0D00-\u0D7F/, /\u0B00-\u0B7F/, /\u0600-\u06FF/],
  or: [/\u0900-\u097F/, /\u0980-\u09FF/, /\u0C00-\u0C7F/, /\u0B80-\u0BFF/, /\u0A80-\u0AFF/, /\u0C80-\u0CFF/, /\u0D00-\u0D7F/, /\u0A00-\u0A7F/, /\u0600-\u06FF/],
};

const YOG_KEYS = [
  "1-5-6", "1-6", "1-9", "5-9", "3-5", "3-9", "1-3", "1-2", "2-7", "5-7",
  "1-4-7", "1-8", "2-9", "4-7", "6-9", "1-7", "2-4", "5-8", "3-6", "7-9",
  "1-4", "3-8",
];

const problems = [];
const add = (lang, feature, msg) => problems.push(`[${feature}/${lang}] ${msg}`);

function scanString(lang, feature, where, str) {
  if (typeof str !== "string" || !str.trim()) {
    add(lang, feature, `${where}: khaali ya non-string value`);
    return;
  }
  if (lang !== "en") {
    const latin = str.match(/[A-Za-z]{2,}/g);
    if (latin) add(lang, feature, `${where}: Latin text "${latin.slice(0, 3).join(", ")}"`);
  }
  // Danda (U+0964) aur uske friends har Indic script me chalte hain —
  // Unicode me ye Devanagari block me baithe hain. Inhe hata kar check karo.
  const clean = str.replace(/[\u0964\u0965\u0966\u0967\u0968\u0969]/g, "");
  const need = SCRIPTS[lang];
  if (need && !need.test(clean)) {
    add(lang, feature, `${where}: apni script me koi character nahi — "${str.slice(0, 40)}"`);
  }
  for (const re of BANNED[lang] || []) {
    if (re.test(clean)) {
      add(lang, feature, `${where}: dusri script leak — "${str.slice(0, 40)}"`);
      break;
    }
  }
}

// ===================== 1. rashiDeep =====================
const deepRef = rashiDeepTX("en");
for (const lang of LANGS) {
  const d = rashiDeepTX(lang);
  for (const t of DEEP_TOPICS) {
    const arr = d[t];
    if (!Array.isArray(arr)) { add(lang, "rashiDeep", `topic "${t}" missing`); continue; }
    if (arr.length !== deepRef[t].length) {
      add(lang, "rashiDeep", `topic "${t}" me ${arr.length} lines, chahiye ${deepRef[t].length}`);
    }
    arr.forEach((s, i) => scanString(lang, "rashiDeep", `${t}[${i}]`, s));
  }
}

// ===================== 2. loshu =====================
const loshuRef = loshuTX("en");
for (const lang of LANGS) {
  const t = loshuTX(lang);
  // yogs
  const got = Object.keys(t.yogs || {});
  const miss = YOG_KEYS.filter((k) => !got.includes(k));
  const extra = got.filter((k) => !YOG_KEYS.includes(k));
  if (miss.length) add(lang, "loshu", `yogs missing keys: ${miss.join(", ")}`);
  if (extra.length) add(lang, "loshu", `yogs extra keys: ${extra.join(", ")}`);
  for (const k of YOG_KEYS) {
    const y = t.yogs[k];
    if (!y) continue;
    if (!y.name || !y.desc) { add(lang, "loshu", `yog "${k}" me name ya desc missing`); continue; }
    scanString(lang, "loshu", `yogs["${k}"].name`, y.name);
    scanString(lang, "loshu", `yogs["${k}"].desc`, y.desc);
  }
  // doList / dontList
  for (const key of ["doList", "dontList"]) {
    const m = t[key] || {};
    for (let n = 1; n <= 9; n++) {
      const arr = m[n];
      if (!Array.isArray(arr)) { add(lang, "loshu", `${key}[${n}] missing`); continue; }
      const want = loshuRef[key][n].length;
      if (arr.length !== want) add(lang, "loshu", `${key}[${n}] me ${arr.length} items, chahiye ${want}`);
      arr.forEach((s, i) => scanString(lang, "loshu", `${key}[${n}][${i}]`, s));
    }
  }
  // gem
  for (let n = 1; n <= 9; n++) {
    if (!t.gem || !t.gem[n]) { add(lang, "loshu", `gem[${n}] missing`); continue; }
    scanString(lang, "loshu", `gem[${n}]`, t.gem[n]);
  }
  // headers
  for (const h of ["yearGood", "yearCaution", "yearOverall", "monthsGood", "monthsAvoid",
    "missingHead", "strongHead", "yearHead", "yogHead", "gemHead"]) {
    if (!t[h]) { add(lang, "loshu", `header "${h}" missing`); continue; }
    scanString(lang, "loshu", h, t[h]);
  }
}

// ===================== 3. loshuX =====================
const xRef = loshuXTX("en");
for (const lang of LANGS) {
  const x = loshuXTX(lang);
  for (const lv of ["high", "mid", "low"]) {
    const arr = x.bazaar && x.bazaar[lv];
    if (!Array.isArray(arr)) { add(lang, "loshuX", `bazaar.${lv} missing`); continue; }
    if (arr.length !== xRef.bazaar[lv].length) {
      add(lang, "loshuX", `bazaar.${lv} me ${arr.length} items, chahiye ${xRef.bazaar[lv].length}`);
    }
    arr.forEach((s, i) => scanString(lang, "loshuX", `bazaar.${lv}[${i}]`, s));
  }
  if (!Array.isArray(x.property)) add(lang, "loshuX", "property missing ya array nahi");
  else {
    if (x.property.length !== xRef.property.length) {
      add(lang, "loshuX", `property me ${x.property.length} items, chahiye ${xRef.property.length}`);
    }
    x.property.forEach((s, i) => scanString(lang, "loshuX", `property[${i}]`, s));
  }
  for (const k of ["career", "money", "health", "relation", "social"]) {
    if (!x.year || !x.year[k]) { add(lang, "loshuX", `year.${k} missing`); continue; }
    scanString(lang, "loshuX", `year.${k}`, x.year[k]);
  }
}

// ===================== 4. Chhoti bhasha English par nahi girti =====================
// Ek synthetic grid jo 12/12 yog trigger karta hai.
const FULL_GRID = { 1: 2, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1 };
const yogaList = detectYogs(FULL_GRID);
if (yogaList.length !== YOG_KEYS.length) {
  add("engine", "loshuYog", `FULL_GRID par ${yogaList.length} yog mile, chahiye ${YOG_KEYS.length}`);
}
for (const k of yogaList) {
  if (!YOG_KEYS.includes(k.key)) add("engine", "loshuYog", `unknown yog key "${k.key}"`);
}

for (const lang of SMALL) {
  const chain = langChain(lang);
  const family = chain[1];
  const t = loshuTX(lang);
  const bad = YOG_KEYS.find((k) => {
    const a = t.yogs[k].name, b = loshuTX("en").yogs[k].name;
    return a === b && family !== "en";
  });
  if (bad) add(lang, "loshu", `chhoti bhasha English par girti rahi (yog ${bad})`);

  const dt = rashiDeepTX(lang);
  const famLang = chain.includes("hi") ? "hi" : chain.includes("bn") ? "bn" : chain.includes("ur") ? "ur" : "hi";
  const dBad = DEEP_TOPICS.find((t2) => dt[t2][0] === rashiDeepTX(famLang)[t2][0] && dt[t2][0] === rashiDeepTX("en")[t2][0]);
  if (dBad) add(lang, "rashiDeep", `chhoti bhasha English par girti rahi (${dBad})`);
}

// ===================== Report =====================
const byLang = {};
for (const p of problems) {
  const m = p.match(/^\[([^\/]+)\/([^\]]+)\]/);
  const key = m ? `${m[2]}` : "other";
  byLang[key] = (byLang[key] || 0) + 1;
}

if (problems.length === 0) {
  console.log("TOTAL PROBLEMS: 0");
} else {
  for (const p of problems) console.log(p);
  console.log("\nBY LANGUAGE:", JSON.stringify(byLang));
  console.log("TOTAL PROBLEMS:", problems.length);
}