// ===================================================================
//  NUMEROLOGY FULL AUDIT
//  Har number jo website par dikhta hai, uska hisaab alag-alag
//  tarike se dobara nikaal kar compare karte hain.
//
//  DEFINITIONS (Indian / Vedic numerology):
//
//   Moolank (Mool / Psychic)  = reduceNumber(DIN ka akela)
//                               Example 15 -> 1+5 = 6
//
//   Life Path (Jivan Path)    = reduceNumber(din + mahina + saal)
//                               Example 18+02+1972 = 1992 -> 21 -> 3
//
//   Bhagyank (Destiny)        = reduceNumber(PURI date ke HAR digit ka jod)
//                               Example 1+9+7+2+0+2+1+8 = 30 -> 3
//                               ZERO bhi jod me gina jata hai.
//
//   Ye TEENO number hamesha 1..9 hone chahiye.
//   Master number (11/22/33) sirf NAAM wale numbers me chalta hai —
//   date wale me KABHI nahi.
// ===================================================================

import {
  reduceNumber, lifePathNumber, bhagyankNumber, birthdayNumber,
  attitudeNumber, destinyNumber, soulUrgeNumber, personalityNumber,
  luckyNumber, allNumbers, charValue, onlyLetters,
} from "../src/utils/numerology.js";

let fails = 0;
const bad = [];
const ok = (c, m) => { if (!c) { fails++; bad.push(m); } };
const eq = (a, b, m) => ok(a === b, `${m}  →  mila "${a}", chahiye "${b}"`);

/* ------------------------------------------------------------------ */
/* 0. reduceNumber khud theek hai?                                     */
/* ------------------------------------------------------------------ */
console.log("── reduceNumber ──");
eq(reduceNumber(3, false), 3, "3 → 3");
eq(reduceNumber(9, false), 9, "9 → 9");
eq(reduceNumber(10, false), 1, "10 → 1");
eq(reduceNumber(11, false), 2, "11 → 2 (date me master nahi)");
eq(reduceNumber(22, false), 4, "22 → 4 (date me master nahi)");
eq(reduceNumber(30, false), 3, "30 → 3");
eq(reduceNumber(33, false), 6, "33 → 6 (date me master nahi)");
eq(reduceNumber(39, false), 3, "39 → 12 → 3");
eq(reduceNumber(0, false), 0, "0 → 0");

/* ------------------------------------------------------------------ */
/* 1. INDEPENDENT reference implementation                            */
/*    Ye app ke code se alag hai — isliye galti pakde me pakadegi.     */
/* ------------------------------------------------------------------ */
function refMoolank(dob) {
  const d = Number(dob.slice(8, 10));
  let v = d;
  while (v > 9) v = String(v).split("").reduce((a, b) => a + Number(b), 0);
  return v;
}
function refLifePath(dob) {
  const d = Number(dob.slice(8, 10));
  const m = Number(dob.slice(5, 7));
  const y = Number(dob.slice(0, 4));
  let v = d + m + y;
  while (v > 9) v = String(v).split("").reduce((a, b) => a + Number(b), 0);
  return v;
}
function refBhagyank(dob) {
  // har digit, ZERO samet — ye user ka maanga hua definition hai
  let v = 0;
  for (const ch of dob) if (ch >= "0" && ch <= "9") v += Number(ch);
  while (v > 9) v = String(v).split("").reduce((a, b) => a + Number(b), 0);
  return v;
}
function refBirthday(dob) { return refMoolank(dob); }
function refAttitude(dob) {
  const d = Number(dob.slice(8, 10));
  const m = Number(dob.slice(5, 7));
  let v = m + d;
  while (v > 9) v = String(v).split("").reduce((a, b) => a + Number(b), 0);
  return v;
}

/* ------------------------------------------------------------------ */
/* 2. BAHUT SAARE DIN — har ek par 5 checks                           */
/* ------------------------------------------------------------------ */
console.log("── 900+ dates cross-check ──");

let tested = 0;
const YEARS = [1900, 1930, 1950, 1965, 1970, 1972, 1975, 1980, 1985, 1990,
  1995, 1999, 2000, 2001, 2005, 2010, 2015, 2020, 2024];

for (const y of YEARS) {
  for (let m = 1; m <= 12; m++) {
    const lastDay = new Date(y, m, 0).getDate();
    for (let d = 1; d <= lastDay; d++) {
      const dob = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      tested++;

      const moolank = reduceNumber(d, false);
      eq(moolank, refMoolank(dob), `${dob} Moolank`);

      eq(lifePathNumber(dob), refLifePath(dob), `${dob} Life Path`);

      eq(bhagyankNumber(dob), refBhagyank(dob), `${dob} Bhagyank`);

      eq(birthdayNumber(dob), refBirthday(dob), `${dob} Birthday`);

      eq(attitudeNumber(dob), refAttitude(dob), `${dob} Attitude`);

      // koi bhi date wala number 1..9 me hona chahiye
      for (const [v, nm] of [
        [moolank, "Moolank"], [lifePathNumber(dob), "LifePath"],
        [bhagyankNumber(dob), "Bhagyank"], [birthdayNumber(dob), "Birthday"],
        [attitudeNumber(dob), "Attitude"],
      ]) {
        ok(v >= 1 && v <= 9, `${dob}: ${nm} = ${v} — 1..9 hona chahiye (master leak)`);
      }
    }
  }
}
console.log(`   ${tested} dates check hue`);

/* ------------------------------------------------------------------ */
/* 3. USER KA EXACT EXAMPLE                                            */
/* ------------------------------------------------------------------ */
console.log("── user ka example: 18-02-1972 ──");
const EX = "1972-02-18";
eq(bhagyankNumber(EX), 3, "1972-02-18 Bhagyank (1+9+7+2+0+2+1+8 = 30 → 3)");
eq(refBhagyank(EX), 3, "reference implementation bhi 3 deta hai");
eq(reduceNumber(Number(EX.split("").reduce((a, c) => a + (/\d/.test(c) ? Number(c) : 0), 0)), false), 3, "manual jod = 3");
eq(reduceNumber(18, false), 9, "1972-02-18 Moolank (18 → 9)");
eq(lifePathNumber(EX), 3, "1972-02-18 Life Path (18+2+1972 = 1992 → 21 → 3)");

/* ------------------------------------------------------------------ */
/* 4. ZERO ka kya hota hai — bhagyank me count hona chahiye            */
/* ------------------------------------------------------------------ */
console.log("── zero counting ──");
// 2001-03-09 → 2+0+0+1+0+3+0+9 = 15 → 6
eq(bhagyankNumber("2001-03-09"), 6, "2001-03-09 me zero gina gaya: 15 → 6");
// agar zero na ginte: 2+1+3+9 = 15 → 6 (same) — doosra example chuno
// 1990-08-15 → 1+9+9+0+0+8+1+5 = 33 → 6 ; bina zero: 1+9+9+8+1+5 = 33 → 6 (same)
// 2000-01-01 → 2+0+0+0+0+1+0+1 = 4 ; bina zero: 2+1+1 = 4 (same)
eq(bhagyankNumber("2000-01-01"), 4, "2000-01-01 Bhagyank = 4");
// 1990-09-09 → 1+9+9+0+0+9+0+9 = 37 → 1 ; bina zero: 1+9+9+9+9 = 37 → 1
eq(bhagyankNumber("1990-09-09"), 1, "1990-09-09 Bhagyank = 1");
// 2005-05-05 → 2+0+0+5+0+5+0+5 = 17 → 8 ; bina zero: 2+5+5+5 = 17 → 8
eq(bhagyankNumber("2005-05-05"), 8, "2005-05-05 Bhagyank = 8");

/* ------------------------------------------------------------------ */
/* 5. Moolank aur Life Path alag ho sakte hain — check karein         */
/* ------------------------------------------------------------------ */
console.log("── alag numbers bhi sahi ──");
// 1985-12-27: moolank 27 → 9 ; lifePath 27+12+1985 = 2024 → 8 ; bhagyank 35 → 8
eq(reduceNumber(27, false), 9, "1985-12-27 Moolank = 9");
eq(lifePathNumber("1985-12-27"), 8, "1985-12-27 Life Path = 8");
eq(bhagyankNumber("1985-12-27"), 8, "1985-12-27 Bhagyank = 8");
// 1990-08-29: moolank 29 → 2 (11 NAHI)
eq(reduceNumber(29, false), 2, "1990-08-29 Moolank = 2, 11 nahi");
eq(lifePathNumber("1990-08-29"), 2, "1990-08-29 Life Path = 2");
eq(bhagyankNumber("1990-08-29"), 2, "1990-08-29 Bhagyank = 2 (38 → 11 → 2)");

/* ------------------------------------------------------------------ */
/* 6. Master number sirf NAAM me                                     */
/* ------------------------------------------------------------------ */
console.log("── master number kahan kahan ──");

// Invariant: naam wale number SIRF 1..9 ya 11/22/33 ho sakte hain.
const MASTERS = [11, 22, 33];
const NAMES = [
  "Ganesha", "Kumar", "Sharma", "Vijay", "Anita", "Rahul", "Priya",
  "A", "I", "Q", "Z", "Aaaaaaaaaa", "Master", "Number", "Life", "Path",
  "Krishna", "Lakshmi", "Saraswati", "Brahma", "Vishnu", "Mahesh",
];
let masterFound = 0;
for (const n of NAMES) {
  for (const [v, nm] of [
    [destinyNumber(n), "destiny"],
    [soulUrgeNumber(n), "soulUrge"],
    [personalityNumber(n), "personality"],
  ]) {
    if (v === null) continue;
    const allowed = (v >= 1 && v <= 9) || MASTERS.includes(v);
    ok(allowed, `${nm}("${n}") = ${v} — ya 1..9 ya 11/22/33 hona chahiye`);
    if (MASTERS.includes(v)) masterFound++;
  }
}
// charValue ki sanity — A=1 ... I=9, Z=8 (wrap 9 par)
eq(charValue("A"), 1, "A = 1");
eq(charValue("I"), 9, "I = 9");
eq(charValue("J"), 1, "J = 1 (9 ke baad wapas 1)");
eq(charValue("R"), 9, "R = 9");
eq(charValue("S"), 1, "S = 1");

// Pure vowels pe soulUrge, pure consonants pe personality — null hona chahiye
eq(soulUrgeNumber("BCDFG"), null, "sirf consonants → soulUrge null");
eq(personalityNumber("AEIOU"), null, "sirf vowels → personality null");
eq(soulUrgeNumber("AEIOU"), reduceNumber(
  "AEIOU".split("").reduce((a, c) => a + charValue(c), 0), true), "sirf vowels ka soulUrge chalta hai");
eq(personalityNumber("BCDFG"), reduceNumber(
  "BCDFG".split("").reduce((a, c) => a + charValue(c), 0), true), "sirf consonants ka personality chalta hai");

// date wale number me master KABHI nahi — 6940 dates pehle check ho chuke
ok(!MASTERS.includes(bhagyankNumber("1972-02-18")), "bhagyank master nahi");

/* ------------------------------------------------------------------ */
/* 7. allNumbers me sab keys hain                                     */
/* ------------------------------------------------------------------ */
console.log("── allNumbers keys ──");
const a = allNumbers({ name: "Ganesha", birthdate: "1972-02-18", mobile: "9876543210" });
for (const k of ["lifePath", "bhagyank", "birthday", "attitude", "destiny",
  "soulUrge", "personality", "lucky"]) {
  ok(k in a, `allNumbers me "${k}" key missing hai`);
  ok(typeof a[k] === "number" || a[k] === null, `allNumbers.${k} number ya null hona chahiye`);
}
eq(a.bhagyank, 3, "allNumbers.bhagyank 1972-02-18");
eq(a.lifePath, 3, "allNumbers.lifePath 1972-02-18");

/* ------------------------------------------------------------------ */
/* 8. Bad input guard                                                 */
/* ------------------------------------------------------------------ */
console.log("── kharab input se bachaav ──");
for (const bad of ["", null, undefined, "abc", "1990-13-45", "0000-00-00"]) {
  const r = bhagyankNumber(bad);
  ok(r === null || (r >= 1 && r <= 9), `bhagyankNumber("${bad}") = ${r} — null ya 1..9`);
  const l = lifePathNumber(bad);
  ok(l === null || (l >= 1 && l <= 9), `lifePathNumber("${bad}") = ${l} — null ya 1..9`);
}
ok(charValue("A") === 1 && charValue("I") === 9, "charValue A=1 I=9");
eq(charValue(" "), 0, "charValue space = 0");

/* ------------------------------------------------------------------ */
/* REPORT                                                              */
/* ------------------------------------------------------------------ */
if (fails === 0) {
  console.log("\nNUMEROLOGY FULL AUDIT: SAB SAHI ✅");
} else {
  console.log(`\n${fails} PROBLEM:`);
  for (const b of bad.slice(0, 40)) console.log("  - " + b);
  if (bad.length > 40) console.log(`  ...aur ${bad.length - 40}`);
}
process.exit(fails ? 1 : 0);