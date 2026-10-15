// Ashtakavarga (अष्टकवर्ग) — Vedic-paramparayuk bindu-ginti (Parashara paddhati).
//
// Core niyam:
//   Kundli ke 8 bhava (ghar) 1 se 8 tak hote hain. Lagna se count hote hain.
//   Har graha har bhava me EK bindu deta hai — sirf do halat me:
//     (a) jab wo graha us bhava me STHIT ho (khud us bhava me baithe ho)
//     (b) jab wo graha us bhava par DRISTI (nazar) rakh raha ho
//
// Har graha ki 7ve drishti hoti hai. Kuch graha aur bhi dekhte hain:
//   Mangal   -> 4ve aur 8ve drishti
//   Guru     -> 5ve aur 9ve drishti
//   Shani    -> 3ve aur 10ve drishti
//   Rahu     -> Shani jaisa 3ve + Guru jaisa 5ve
//   Surya/Chandra/Budh/Shukra -> sirf 7ve drishti
//
// Bindu apne aap se: har bhava ka apna ek graha hota hai (lagna lord),
// is liye lagna bhava ko har graha "bindu" deta hai.

import { rashiIndex } from "./astro.js";

// Ashtakavarga me ye 8 graha bindu dete hain (Ketu nahi)
export const AV_GRAHAS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu"];

// Graha kitne aage ki drishti rakhta hai (7ve sabke liye).
// Note: Ashtakavarga me sirf 1st se 8th bhava count hote hain. Guru ka 9va
// aur Shani ka 10va drishti 9th/10th bhava par padta hai — jo count me nahi
// aata. Is liye unhe yahan nahi rakhte (rapta nahi), warna galat bindu jodenge.
const DRISHTI = {
  Sun: [7],
  Moon: [7],
  Mars: [4, 7, 8],
  Mercury: [7],
  Jupiter: [5, 7],
  Venus: [7],
  Saturn: [3, 7],
  Rahu: [3, 5, 7],
};

// Har graha ka apna rashi (swasthans)
export const OWN_SIGN = {
  Sun: 0,      // Mesha
  Mars: 0,     // Mesha
  Moon: 3,     // Karka
  Mercury: 2,  // Mithuna
  Jupiter: 8,  // Dhanu
  Venus: 5,    // Tula
  Saturn: 9,   // Makara
  Rahu: 10,    // Kumbha
  Ketu: 7,     // Vrishchika
};

/**
 * Poora Ashtakavarga nikaale.
 *
 * @param positions  { Sun: <sidereal lon>, Moon: ..., } — degree wale
 * @param lagnaSign  lagna ka rashi index (0..11). Na ho to Moon rashi use karo.
 * @returns {
 *   house:     [8] — har bhava ke total bindu
 *   graha:     { Sun: n, ... } — har graha ka total (uska "Baakut")
 *   detail:    { bhava: { 1..8: [graha names] } }
 *   total:     overall bindu
 * }
 */
export function ashtakavarga(positions, lagnaSign) {
  const lag = Number.isInteger(lagnaSign) ? lagnaSign : rashiIndex(positions.Moon ?? 0);

  // 8 bhavon ke rashi
  const bhavaSign = [];
  for (let k = 0; k < 8; k++) bhavaSign.push((lag + k) % 12);

  const house = new Array(8).fill(0);
  const graha = {};
  const detail = {};

  for (let k = 0; k < 8; k++) detail[k + 1] = [];

  for (const g of AV_GRAHAS) {
    const lon = positions[g];
    if (lon == null || Number.isNaN(lon)) continue;
    const sign = rashiIndex(lon);

    // 1) Wo graha apne ghar (swasthans) me hai? Khud us bhava ko bindu
    if (sign === OWN_SIGN[g]) {
      const idx = bhavaSign.indexOf(sign);
      if (idx >= 0) {
        house[idx] += 1;
        detail[idx + 1].push(g);
      }
    }

    // 2) Drishti — har drishti-gharon par bindu
    for (const d of DRISHTI[g]) {
      const target = (sign + d) % 12;
      const idx = bhavaSign.indexOf(target);
      if (idx >= 0 && detail[idx + 1].indexOf(g) === -1) {
        house[idx] += 1;
        detail[idx + 1].push(g);
      }
    }

    // Graha ka apna total — 8 bhavon me jitne bindu usne diye
    graha[g] = detail1Count(detail, g);
  }

  const total = house.reduce((a, b) => a + b, 0);
  return { house, graha, detail, total, lagna: lag };
}

function detail1Count(detail, g) {
  let n = 0;
  for (const k of Object.keys(detail)) {
    if (detail[k].indexOf(g) >= 0) n += 1;
  }
  return n;
}

// Shani ki Baakut — Sade Sati ki shanti ka sabse bada hissa yahi hai.
// Shani kisi kundli me 8 bhavon me se sirf 3 bindu de sakta hai (1ve, 3ve, 7ve
// bhava se apne ghar ki taraf), is liye uska total chhota rehta hai.
export function shaniBaakut(av) {
  return (av.graha && av.graha.Saturn) || 0;
}

// Ashtakavarga se 0-100 ka "Shani Shanti Score".
// Zyaada bindu = Shani ki shanti zyaada (Sade Sati aaram se guzrega).
// Calibration: Shani 3 me se 0 = sabse krur, 3 = saral. Baaki bhavon ka
// yog bhi hisaab me lete hain is liye range thodi aur khuli hai.
export function shaniShantiScore(av) {
  const saturn = (av.graha && av.graha.Saturn) || 0;
  const houseTotals = av.house;
  // Har bhava me shani ko kitne bindu mil rahe hain
  const saturnBindus = houseTotals.reduce((acc, v, k) => {
    const has = (av.detail[k + 1] || []).indexOf("Saturn") >= 0;
    return acc + (has ? v : 0);
  }, 0);

  // Shani apne 3 me se jitna badha woh + uske bhavon ka average yog
  const saturnPart = (saturn / 3) * 60;
  const yogaPart = Math.min(saturnBindus / 12, 1) * 40;
  return Math.round(Math.min(100, saturnPart + yogaPart));
}

// Shani Sade Sati: Shani chandna-rasi se kitna door.
// rel 11 = 12ve (pehla charan), 0 = khud ki rashi (peak), 1 = 2ve (antim charan)
export function sadeSatiPhase(saturnSign, moonSign) {
  const rel = ((saturnSign - moonSign) % 12 + 12) % 12;
  if (rel === 11) return { active: true, phase: "first", rel };
  if (rel === 0) return { active: true, phase: "peak", rel };
  if (rel === 1) return { active: true, phase: "last", rel };
  if (rel === 3 || rel === 7) return { active: false, phase: "dhaiya", rel };
  return { active: false, phase: "none", rel };
}

// Shani ki Shanti ke upay-gharon ko batao (jo bhavon me Shani ne bindu diye)
export function shaniHelpfulBhavas(av) {
  const out = [];
  for (let k = 1; k <= 8; k++) {
    if ((av.detail[k] || []).indexOf("Saturn") >= 0) out.push(k);
  }
  return out;
}

export default ashtakavarga;