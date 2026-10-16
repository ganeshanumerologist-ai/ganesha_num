// Numerology calculation ka test — Moolank aur Bhagyank alag-alag hone chahiye,
// aur date wale numbers me master (11/22/33) kabhi nahi aana chahiye.

import {
  reduceNumber, lifePathNumber, bhagyankNumber, birthdayNumber,
  attitudeNumber, destinyNumber, luckyNumber, allNumbers,
} from "../src/utils/numerology.js";

let fails = 0;
const ok = (c, m) => { if (!c) { console.log("FAIL:", m); fails++; } };
const eq = (a, b, m) => ok(a === b, `${m}  →  mila ${a}, chahiye ${b}`);

/* ---------- reduceNumber ---------- */
eq(reduceNumber(33, false), 6, "33 bina master → 6");
eq(reduceNumber(33, true), 33, "33 master ke saath → 33");
eq(reduceNumber(29, false), 2, "29 → 11 → 2 (bina master)");
eq(reduceNumber(29, true), 11, "29 → 11 (master ke saath)");

/* ---------- Moolank vs Bhagyank alag hona chahiye ---------- */
// 1990-08-15
// moolank  = 15 + 8 + 1990 = 2013 → 6
// bhagyank = 1+9+9+0+0+8+1+5 = 33 → 6
eq(lifePathNumber("1990-08-15"), 6, "lifePath 1990-08-15");
eq(bhagyankNumber("1990-08-15"), 6, "bhagyank 1990-08-15");

// 1985-12-27
// moolank  = 27 + 12 + 1985 = 2024 → 8
// bhagyank = 1+9+8+5+1+2+2+7 = 35 → 8
eq(lifePathNumber("1985-12-27"), 8, "lifePath 1985-12-27");
eq(bhagyankNumber("1985-12-27"), 8, "bhagyank 1985-12-27");

// 2001-03-09
// moolank  = 9 + 3 + 2001 = 2013 → 6
// bhagyank = 2+0+0+1+0+3+0+9 = 15 → 6
eq(lifePathNumber("2001-03-09"), 6, "lifePath 2001-03-09");
eq(bhagyankNumber("2001-03-09"), 6, "bhagyank 2001-03-09");

/* ---------- 29 ka din — master leak nahi hona chahiye ---------- */
// 1990-08-29
// moolank = 29+8+1990 = 2027 → 2+0+2+7 = 11 → 2
eq(lifePathNumber("1990-08-29"), 2, "lifePath me master 11 nahi aana chahiye");
eq(birthdayNumber("1990-08-29"), 2, "birthday 29 → 2 (11 nahi)");
ok(lifePathNumber("1990-08-29") <= 9, "lifePath hamesha 1..9");

// 1990-08-11 → moolank 11+8+1990 = 2009 → 2+0+0+9 = 11 → 2
eq(lifePathNumber("1990-08-11"), 2, "lifePath 11 intermediate bhi single digit");

/* ---------- har valid date par 1..9 ---------- */
const DATES = [];
for (let m = 1; m <= 12; m++) {
  for (const d of [1, 2, 9, 11, 13, 16, 19, 22, 23, 26, 29, 31]) {
    DATES.push(`1990-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    DATES.push(`2024-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
}
for (const d of DATES) {
  const lp = lifePathNumber(d), bg = bhagyankNumber(d), bd = birthdayNumber(d), at = attitudeNumber(d);
  for (const [n, v, nm] of [[lp, "lifePath", "lifePath"], [bg, "bhagyank", "bhagyank"],
    [bd, "birthday", "birthday"], [at, "attitude", "attitude"]]) {
    ok(n >= 1 && n <= 9, `${d}: ${nm} = ${v} — 1..9 me hona chahiye, master nahi`);
  }
  ok(lp !== null && bg !== null, `${d}: null nahi aana chahiye`);
}

/* ---------- Master sirf NAME wale numbers me ---------- */
eq(destinyNumber("Ravi Kumar"), destinyNumber("Ravi Kumar"), "destiny stable");
// 9876543210 → 9+8+7+6+5+4+3+2+1+0 = 45 → 9
eq(luckyNumber("9876543210"), 9, "luckyNumber 9876543210");
ok(luckyNumber("1111111111") <= 9, "luckyNumber master nahi dega");

/* ---------- allNumbers me bhagyank shamil hona chahiye ---------- */
const all = allNumbers({ name: "Ravi Kumar", birthdate: "1990-08-15", mobile: "9876543210" });
ok("bhagyank" in all, "allNumbers me bhagyank key hai");
eq(all.lifePath, 6, "allNumbers.lifePath");
eq(all.bhagyank, 6, "allNumbers.bhagyank");
eq(all.birthday, 6, "allNumbers.birthday (15 → 6)");
eq(all.attitude, 5, "allNumbers.attitude (8+15=23 → 5)");

console.log(fails === 0 ? "NUMEROLOGY TESTS OK" : `${fails} FAILURES`);
process.exit(fails ? 1 : 0);