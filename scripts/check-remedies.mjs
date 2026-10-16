// Remedies data verification: counts, planet-key parity, mantra parity, script purity.
// node scripts/check-remedies.mjs
import { remTX } from "../src/data/remediesTX.js";

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

const EN = remTX("en");
for (const L of LANGS) {
  const R = remTX(L);
  say(R.rudraksha.length === 15, `${L} rudraksha=${R.rudraksha.length}/15`);
  say(R.jadi.length === 9, `${L} jadi=${R.jadi.length}/9`);
  say(R.yantra.length === 9, `${L} yantra=${R.yantra.length}/9`);

  const key = (S, f) => S.map(f).join("|");
  say(key(R.rudraksha, (x) => x.planet) === key(EN.rudraksha, (x) => x.planet), `${L} rudraksha planet keys match en`);
  say(key(R.jadi, (x) => x.planet) === key(EN.jadi, (x) => x.planet), `${L} jadi planet keys match en`);
  say(key(R.yantra, (x) => x.planet) === key(EN.yantra, (x) => x.planet), `${L} yantra planet keys match en`);
  say(key(R.rudraksha, (x) => x.mantra) === key(EN.rudraksha, (x) => x.mantra), `${L} mantras byte-identical to en`);

  if (L === "en") continue;
  const vals = [
    ...R.rudraksha.flatMap((x) => [x.m, x.devta, x.fayda]),
    ...R.jadi.flatMap((x) => [x.herb, x.upyog, x.dharan]),
    ...R.yantra.flatMap((x) => [x.yantra, x.fayda, x.sthapana]),
  ];
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

console.log(`\nSample [hi] 1st rudraksha: ${remTX("hi").rudraksha[0].m} | ${remTX("hi").rudraksha[0].fayda}`);
console.log(`Sample [ta] 1st herb: ${remTX("ta").jadi[0].herb} | ${remTX("ta").jadi[0].upyog}`);
console.log(`Sample [ne] (falls back to hi): ${remTX("ne").rudraksha[0].fayda}`);
console.log(`\nTOTAL PROBLEMS: ${problems}`);