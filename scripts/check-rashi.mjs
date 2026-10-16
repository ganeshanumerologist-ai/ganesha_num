// Rashi content ka verification:
//   1. har bhasha me rashi[12] / varshik[12] / daily[12] hain?
//   2. field keys + order English se match karte hain?
//   3. non-English bhasha me koi Latin letter to nahi reh gaya (Hinglish check)
//   4. chhoti bhasha (ne/doi/mai/sa/ks/sd) ko English to nahi mil raha?
//
// node scripts/check-rashi.mjs
import EN from "../src/data/rashi/en.js";
import { rashiTX, rashiLang, dailyTX } from "../src/data/rashi_i18n.js";
import { varshikLang } from "../src/data/varshik_detail.js";

const LANGS = ["en", "hi", "mr", "bn", "te", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as"];
const SMALL = ["ne", "doi", "mai", "brx", "sa", "ks", "sd", "mni", "sat"];

const SCRIPT = {
  hi: [[0x0900, 0x097F]], mr: [[0x0900, 0x097F]], ne: [[0x0900, 0x097F]],
  mai: [[0x0900, 0x097F]], doi: [[0x0900, 0x097F]], brx: [[0x0900, 0x097F]], sa: [[0x0900, 0x097F]],
  bn: [[0x0980, 0x09FF]], as: [[0x0980, 0x09FF]], sat: [[0x0980, 0x09FF]],
  te: [[0x0C00, 0x0C7F]], kn: [[0x0C80, 0x0CFF]],
  ta: [[0x0B80, 0x0BFF]],
  or: [[0x0B00, 0x0B7F]],
  ml: [[0x0D00, 0x0D7F]],
  gu: [[0x0A80, 0x0AFF]],
  ur: [[0x0600, 0x06FF]], ks: [[0x0600, 0x06FF]], sd: [[0x0600, 0x06FF]],
  pa: [[0x0A00, 0x0A7F]],  // Gurmukhi
};
const inScript = (cp, rs) => rs.some(([a, b]) => cp >= a && cp <= b);

// Bangla danda (০৯৬৪) aur Urdu full-stop (۔ ۢ۹۳ے۔) bhi "wrong block" me aate hain
// par ye valid punctuation hain — inhe galti se letter na ginna.
const PUNCT = new Set([0x0964, 0x093e, 0x092f, 0x0965, 0x0970, 0x0966, 0x0967, 0x0968, 0x0969]);
const isIndicLetter = (cp) =>
  !PUNCT.has(cp) &&
  ((cp >= 0x0900 && cp <= 0x0DFF) || (cp >= 0x0600 && cp <= 0x06FF));

const keyList = (obj) => Object.keys(obj).join(",");
const EN_RASHI_KEYS = EN.rashi.map(keyList);
const EN_VAR_KEYS = EN.varshik.map(keyList);

let problems = 0;
const say = (ok, msg) => { if (!ok) problems++; console.log(`${ok ? "[OK  ]" : "[FAIL]"} ${msg}`); };

for (const L of LANGS) {
  const D = rashiTX(L);
  const n1 = D.rashi?.length, n2 = D.varshik?.length, n3 = D.daily?.length;
  const countsOk = n1 === 12 && n2 === 12 && n3 === 12;
  say(countsOk, `${L} counts rashi=${n1} varshik=${n2} daily=${n3}`);

  if (!countsOk) continue;

  // field keys
  const keysOk =
    D.rashi.every((o, i) => keyList(o) === EN_RASHI_KEYS[i]) &&
    D.varshik.every((o, i) => keyList(o) === EN_VAR_KEYS[i]);
  say(keysOk, `${L} field keys match en.js`);

  // script purity
  if (L !== "en") {
    const rs = SCRIPT[L];
    const vals = [...D.rashi.flatMap(Object.values), ...D.varshik.flatMap(Object.values), ...D.daily];
    const latin = vals.filter((v) => /[A-Za-z]/.test(v));
    say(latin.length === 0, `${L} zero Latin letters${latin.length ? " -> " + latin.slice(0, 3).join(" | ") : ""}`);
    if (!rs) { say(false, `${L} has no script range in checker`); continue; }
    const wrong = [];
    for (const v of vals) {
      let indic = 0, good = 0;
      for (const ch of v) {
        const cp = ch.codePointAt(0);
        if (isIndicLetter(cp)) {
          indic++;
          if (inScript(cp, rs)) good++;
        }
      }
      if (indic === 0) continue;            // pure number/symbol — skip
      if (good / indic < 0.95) {
        const bad = [...v].filter((ch) => {
          const cp = ch.codePointAt(0);
          return isIndicLetter(cp) && !inScript(cp, rs);
        }).map((ch) => `U+${ch.codePointAt(0).toString(16).toUpperCase()}`);
        wrong.push(`${v.slice(0, 20)} [${[...new Set(bad)].join(",")}]`);
      }
    }
    say(wrong.length === 0, `${L} script purity${wrong.length ? " -> " + wrong.slice(0, 2).join(" | ") : ""}`);
  }
}

console.log("");
for (const L of SMALL) {
  const t = rashiTX(L).rashi[0]?.traits || "";
  const isEn = t === EN.rashi[0]?.traits;
  say(!isEn, `${L} (small lang) rashi[0] translated, not English`);
}

console.log("");
say(typeof rashiLang === "function" && typeof varshikLang === "function", "rashiLang / varshikLang exported");
say(dailyTX("hi").length === 12, "dailyTX(hi) has 12 lines");
console.log(`\nSample  [hi] Mesha traits: ${rashiTX("hi").rashi[0].traits}`);
console.log(`Sample  [ta] Meena day:    ${rashiTX("ta").rashi[11].day}`);
console.log(`Sample  [ur] Dhanu daily:  ${dailyTX("ur")[8]}`);
console.log(`\nTOTAL PROBLEMS: ${problems}`);