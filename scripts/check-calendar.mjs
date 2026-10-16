// Calendar data verification: counts, date parity, script purity.
// node scripts/check-calendar.mjs
import { calTX } from "../src/data/calendarTX.js";

const LANGS = ["en", "hi", "mr", "bn", "te", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as"];
const SCRIPT = {
  hi: [0x0900, 0x097F], mr: [0x0900, 0x097F], ne: [0x0900, 0x097F], sa: [0x0900, 0x097F],
  bn: [0x0980, 0x09FF], as: [0x0980, 0x09FF],
  te: [0x0C00, 0x0C7F], kn: [0x0C80, 0x0CFF], ta: [0x0B80, 0x0BFF],
  or: [0x0B00, 0x0B7F], ml: [0x0D00, 0x0D7F], gu: [0x0A80, 0x0AFF], pa: [0x0A00, 0x0A7F],
  ur: [0x0600, 0x06FF],
};
const PUNCT = new Set([0x0964, 0x093e, 0x092f, 0x0965]);
const isIndic = (cp) => !PUNCT.has(cp) && ((cp >= 0x0900 && cp <= 0x0DFF) || (cp >= 0x0600 && cp <= 0x06FF));

let problems = 0;
const say = (ok, msg) => { if (!ok) problems++; console.log(`${ok ? "[OK  ]" : "[FAIL]"} ${msg}`); };

const EN = calTX("en");
for (const L of LANGS) {
  const C = calTX(L);
  say(C.months.length === 12, `${L} months=${C.months.length}/12`);
  say(C.festivals.length === 22, `${L} festivals=${C.festivals.length}/22`);
  say(Object.keys(C.guide).length === 12, `${L} guide entries=${Object.keys(C.guide).length}/12`);

  const dates = C.festivals.map((f) => `${f.month}/${f.day}`).join("|");
  say(dates === EN.festivals.map((f) => `${f.month}/${f.day}`).join("|"), `${L} festival dates match en.js`);
  say(C.festivals.every((f) => typeof f.month === "number" && typeof f.day === "number"), `${L} month/day stay numeric`);

  if (L === "en") continue;
  const vals = [...C.months, ...C.festivals.flatMap((f) => [f.name, f.note]), ...Object.values(C.guide)];
  const latin = vals.filter((v) => /[A-Za-z]/.test(v));
  say(latin.length === 0, `${L} zero Latin${latin.length ? " -> " + latin.slice(0, 3).join(" | ") : ""}`);

  const [a, b] = SCRIPT[L];
  const wrong = [];
  for (const v of vals) {
    let indic = 0, good = 0;
    for (const ch of v) {
      const cp = ch.codePointAt(0);
      if (isIndic(cp)) { indic++; if (cp >= a && cp <= b) good++; }
    }
    if (indic > 0 && good / indic < 0.95) wrong.push(v.slice(0, 20));
  }
  say(wrong.length === 0, `${L} script purity${wrong.length ? " -> " + wrong.slice(0, 2).join(" | ") : ""}`);
}

console.log(`\nSample [hi] months: ${calTX("hi").months.slice(0, 4).join(", ")}`);
console.log(`Sample [ta] Oct festival: ${calTX("ta").festivals.find((f) => f.month === 10 && f.day === 20)?.name}`);
console.log(`Sample [ur] guide 11: ${calTX("ur").guide[11]}`);
console.log(`Sample [ne] (falls back to hi): ${calTX("ne").months[0]}`);
console.log(`\nTOTAL PROBLEMS: ${problems}`);