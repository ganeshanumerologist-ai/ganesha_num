// Kundli page ka poora data-flow test — 22 bhasha me.
// Check karta hai ki:
//   1. har bhasha me saare 8 numbers nikalti hain
//   2. varshpal ka data usi bhasha me hai (English par nahi gira)
//   3. koi bhi value Latin script me nahi gayi (native script rule)
//   4. Personal Year 1..9 me hai
import { allNumbers, reduceNumber } from "../src/utils/numerology.js";
import { yearMeaning, yearDetail, ycat, ycatSource } from "../src/data/varshphal_i18n.js";
import { getMeaning } from "../src/data/meanings_all.js";
import { personalYear } from "../src/data/forecast.js";
import { LANGUAGES } from "../src/i18n/registry.js";

const DOB = "1972-02-18";
const NAME = "Ganesha";

// ── 1. numbers ka hisaab ──────────────────────────────────────────
const nums = allNumbers({ name: NAME, birthdate: DOB });
const day = Number(DOB.split("-")[2]);
const moolank = reduceNumber(day, false);
const py = personalYear(DOB, 2026);

console.log(`DOB ${DOB} · naam "${NAME}"`);
console.log(`  moolank    = ${moolank}    (18 → 9)`);
console.log(`  bhagyank   = ${nums.bhagyank}   (1+9+7+2+0+2+1+8 = 30 → 3)`);
console.log(`  lifePath   = ${nums.lifePath}   (18+2+1972 = 1992 → 21 → 3)`);
console.log(`  birthday   = ${nums.birthday}`);
console.log(`  attitude   = ${nums.attitude}  (2+18 = 20 → 2)`);
console.log(`  naamank    = ${nums.destiny}`);
console.log(`  soulUrge   = ${nums.soulUrge}`);
console.log(`  personality= ${nums.personality}`);
console.log(`  personalYr = ${py}   (18+2+2026 = 2046 → 12 → 3)`);

let fails = 0;
const bad = (m) => { fails++; console.log("  ✗ " + m); };
if (moolank !== 9) bad("moolank 9 hona chahiye");
if (nums.bhagyank !== 3) bad("bhagyank 3 hona chahiye");
if (nums.lifePath !== 3) bad("lifePath 3 hona chahiye");
if (py !== 3) bad("personalYear 3 hona chahiye");
for (const [k, v] of Object.entries({ moolank, ...nums })) {
  if (v == null) continue;
  if (v < 1 || v > 9) bad(`${k} = ${v} — 1..9 hona chahiye`);
}

// ── 2. har bhasha me rendering ─────────────────────────────────────
console.log("\n─── 22 bhasha ───");
const rows = [];
for (const { code, native } of LANGUAGES) {
  const src = ycatSource(code);
  const ym = yearMeaning(py, code);
  const yd = yearDetail(py, code);
  const c = ycat(code);

  // is bhasha me jo dikhega wo sab text
  const text = [ym.t, ym.d, ym.c, ym.love, ym.h, ym.col, ym.adv,
    yd.edu, yd.mar, yd.share, yd.biz, yd.rep,
    c.edu, c.mar, c.share, c.biz, c.rep, c.health, c.color, c.adv]
    .map(String);

  const empty = text.filter((s) => !s.trim()).length;
  const latin = text.filter((s) => code === "en" ? false : /[A-Za-z]{2,}/.test(s));

  // meaning labels bhi usi bhasha me hone chahiye
  const meanings = [moolank, nums.bhagyank, nums.lifePath, nums.birthday,
    nums.attitude, nums.destiny].filter((n) => n != null);
  const noMeaning = meanings.filter((n) => !getMeaning(n, code)?.title);

  let flag = "OK";
  if (empty) { flag = `EMPTY(${empty})`; fails++; }
  if (latin.length) { flag = `LATIN: "${latin[0].slice(0, 28)}"`; fails++; }
  if (noMeaning.length) { flag = `NO-MEANING(${noMeaning})`; fails++; }
  if (code !== "en" && src === "en") { flag = "FELL BACK TO ENGLISH"; fails++; }

  rows.push(`  ${code.padEnd(4)} ${String(native).padEnd(12)} ← ${String(src).padEnd(4)} ${flag}`);
}
console.log(rows.join("\n"));

// ── 3. koi bhi chhoti bhasha English par giri to nahi ──────────────
console.log("\n─── fallback audit ───");
const fell = LANGUAGES.filter((l) => l.code !== "en" && ycatSource(l.code) === "en");
console.log(fell.length
  ? `  ✗ ${fell.map((f) => f.code).join(", ")} English par gir gayi`
  : "  koi bhi bhasha English par nahi giri ✅");
if (fell.length) fails += fell.length;

console.log(fails ? `\n${fails} PROBLEM` : "\nKUNDLI POORA SAHI ✅");
process.exit(fails ? 1 : 0);