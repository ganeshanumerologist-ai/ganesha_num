// Numerology calculation utilities

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export function charValue(ch) {
  const code = ch.toUpperCase().charCodeAt(0) - 64;
  if (code < 1 || code > 26) return 0;
  return ((code - 1) % 9) + 1;
}

export function onlyLetters(str) {
  return (str || "").replace(/[^a-zA-Z]/g, "");
}

export function reduceNumber(n, allowMaster = true) {
  let v = n;
  const masters = new Set([11, 22, 33]);
  while (v > 9 && !(allowMaster && masters.has(v))) {
    v = String(v)
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  }
  return v;
}

/* ------------------------------------------------------------------
   DO number alag-alag hain, dono ko mix mat kijiye:

   Moolank / Life Path  =  din + mah + saal  → hamesha 1..9
   Bhagyank / Destiny   =  POORI janm-tithi ke
                           har digit ka jod  → hamesha 1..9

   Pehle yahan bug tha: lifePathNumber poori date ka jod le raha tha
   (yaani wahi Bhagyank) AUR master number (11/22/33) ko bhi chhod
   deta tha. Isliye Kundli page par "Bhagyank" galat dikha raha tha.

   Master numbers (11, 22, 33) sirf NAAM wale numbers me chalti hain —
   Destiny, Soul Urge, Personality. Date wale kabhi nahi.
   ------------------------------------------------------------------ */

const parts = (birthdate) => {
  const p = String(birthdate || "").split("-");
  if (p.length < 3) return null;
  const d = Number(p[2]), m = Number(p[1]), y = Number(p[0]);
  if (!d || !m || !y) return null;
  // mahina 1..12 aur din 1..31 hone chahiye
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  if (y < 1800 || y > 2200) return null;
  return { d, m, y };
};

/** Moolank / Life Path — din + mahina + saal. Hamesha 1..9. */
export function lifePathNumber(birthdate) {
  const p = parts(birthdate);
  if (!p) return null;
  return reduceNumber(p.d + p.m + p.y, false);
}

/** Bhagyank / Destiny Number — poori janm-tithi ke har digit ka jod. Hamesha 1..9. */
export function bhagyankNumber(birthdate) {
  // Date valid nahi hai (khaali / 0000-00-00 / sirf text) to null.
  // Warna 0 return ho jata tha jo ek "number" nahi hai.
  const p = parts(birthdate);
  if (!p) return null;
  const digits = String(birthdate).replace(/\D/g, "");
  const sum = digits.split("").reduce((a, b) => a + Number(b), 0);
  return reduceNumber(sum, false) || null;
}

export function birthdayNumber(birthdate) {
  const d = (birthdate || "").split("-")[2];
  if (!d) return null;
  // Date wale number me master nahi aata (29 → 11 → 2, sirf 2)
  return reduceNumber(Number(d), false);
}

export function attitudeNumber(birthdate) {
  const p = parts(birthdate);
  if (!p) return null;
  return reduceNumber(p.m + p.d, false);
}

export function destinyNumber(name) {
  const letters = onlyLetters(name);
  if (!letters) return null;
  const sum = letters.split("").reduce((a, b) => a + charValue(b), 0);
  return reduceNumber(sum, true);
}

export function soulUrgeNumber(name) {
  const letters = onlyLetters(name).split("").filter((c) => VOWELS.has(c.toUpperCase()));
  if (!letters.length) return null;
  const sum = letters.reduce((a, b) => a + charValue(b), 0);
  return reduceNumber(sum, true);
}

export function personalityNumber(name) {
  const letters = onlyLetters(name).split("").filter((c) => !VOWELS.has(c.toUpperCase()));
  if (!letters.length) return null;
  const sum = letters.reduce((a, b) => a + charValue(b), 0);
  return reduceNumber(sum, true);
}

export function nameNumber(name) {
  return destinyNumber(name);
}

// Mobile / vehicle / lucky number — single digit (master nahi)
export function luckyNumber(value) {
  const digits = (value || "").replace(/\D/g, "");
  if (!digits) return null;
  const sum = digits.split("").reduce((a, b) => a + Number(b), 0);
  return reduceNumber(sum, false);
}

export function allNumbers({ name, birthdate, mobile }) {
  return {
    lifePath: lifePathNumber(birthdate),
    bhagyank: bhagyankNumber(birthdate),
    birthday: birthdayNumber(birthdate),
    attitude: attitudeNumber(birthdate),
    destiny: destinyNumber(name),
    soulUrge: soulUrgeNumber(name),
    personality: personalityNumber(name),
    lucky: mobile ? luckyNumber(mobile) : null,
  };
}

export default {
  reduceNumber,
  lifePathNumber,
  bhagyankNumber,
  birthdayNumber,
  attitudeNumber,
  destinyNumber,
  soulUrgeNumber,
  personalityNumber,
  luckyNumber,
  allNumbers,
};
