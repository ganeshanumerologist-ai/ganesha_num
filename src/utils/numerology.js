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

export function lifePathNumber(birthdate) {
  // birthdate: YYYY-MM-DD
  const digits = (birthdate || "").replace(/\D/g, "");
  if (!digits) return null;
  const sum = digits.split("").reduce((a, b) => a + Number(b), 0);
  return reduceNumber(sum, true);
}

export function birthdayNumber(birthdate) {
  const d = (birthdate || "").split("-")[2];
  if (!d) return null;
  return reduceNumber(Number(d), true);
}

export function attitudeNumber(birthdate) {
  if (!birthdate) return null;
  const parts = birthdate.split("-");
  if (parts.length < 3) return null;
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  return reduceNumber(month + day, true);
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

// Mobile / vehicle / lucky number
export function luckyNumber(value) {
  const digits = (value || "").replace(/\D/g, "");
  if (!digits) return null;
  const sum = digits.split("").reduce((a, b) => a + Number(b), 0);
  return reduceNumber(sum, true);
}

export function allNumbers({ name, birthdate, mobile }) {
  return {
    lifePath: lifePathNumber(birthdate),
    birthday: birthdayNumber(birthdate),
    attitude: attitudeNumber(birthdate),
    destiny: destinyNumber(name),
    soulUrge: soulUrgeNumber(name),
    personality: personalityNumber(name),
    lucky: mobile ? luckyNumber(mobile) : null,
  };
}

export default {
  lifePathNumber,
  birthdayNumber,
  attitudeNumber,
  destinyNumber,
  soulUrgeNumber,
  personalityNumber,
  luckyNumber,
  allNumbers,
};
