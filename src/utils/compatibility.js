import { lifePathNumber, destinyNumber, soulUrgeNumber } from "../utils/numerology.js";

// Kis ank ki kisse banti hai (saral milan-niyam)
const FRIENDLY = {
  1: [1, 3, 5, 9],
  2: [2, 6, 9],
  3: [1, 3, 5, 7],
  4: [4, 8],
  5: [1, 3, 5, 9],
  6: [2, 6, 9],
  7: [3, 5, 7],
  8: [4, 8],
  9: [1, 2, 5, 6, 9],
  11: [11, 22, 2, 6],
  22: [22, 4, 8],
  33: [33, 6, 9],
};

function pairScore(a, b) {
  if (a == null || b == null) return null;
  if (a === b) return { score: 92, key: "same", note: "Samaan ank — turant samajh, thodi takraar bhi." };
  if ((FRIENDLY[a] || []).includes(b)) return { score: 84, key: "friend", note: "Mitra ank — swabhavik taal-mel." };
  if ((FRIENDLY[b] || []).includes(a)) return { score: 84, key: "friend", note: "Mitra ank — swabhavik taal-mel." };
  return { score: 58, key: "hard", note: "Chunauti wala jod — samjhaute se chalega." };
}

export function personNumbers({ name, birthdate }) {
  return {
    lifePath: lifePathNumber(birthdate),
    destiny: destinyNumber(name),
    soulUrge: soulUrgeNumber(name),
  };
}

export function matchScore(a, b) {
  const pairs = [
    { key: "lifePath", label: "Life Path Milan", ...pairScore(a.lifePath, b.lifePath), a: a.lifePath, b: b.lifePath },
    { key: "destiny", label: "Destiny Milan", ...pairScore(a.destiny, b.destiny), a: a.destiny, b: b.destiny },
    { key: "soulUrge", label: "Soul Urge Milan", ...pairScore(a.soulUrge, b.soulUrge), a: a.soulUrge, b: b.soulUrge },
  ].filter((p) => p.score != null);

  if (!pairs.length) return null;
  const total = Math.round(pairs.reduce((s, p) => s + p.score, 0) / pairs.length);

  let verdict, advice;
  if (total >= 85) {
    verdict = "Uttam Milan";
    advice = "Bahut sundar jod! Rishte me bharosa aur aakarshan dono rahenge. Phir bhi chhoti baaton me ego na aane dein.";
  } else if (total >= 70) {
    verdict = "Achha Milan";
    advice = "Jod achha hai. Ek-dusre ki khubi ko jagah do, kami ko sudharne ka mauka do — rishta majboot hoga.";
  } else if (total >= 55) {
    verdict = "Madhyam Milan";
    advice = "Mehnat wala rishta hai. Baat-cheet khuli rakho, faisle milkar lo. Kisi expert se ek session le lena behtar rahega.";
  } else {
    verdict = "Kathin Milan";
    advice = "Ank aapas me takra rahe hain. Shaadi/partnership se pehle expert se poori kundli-milan salah zaroor lein.";
  }
  return { total, verdict, advice, pairs };
}

export default { personNumbers, matchScore };
