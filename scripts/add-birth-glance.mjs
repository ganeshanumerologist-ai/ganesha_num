// Janm ki jhalak — ek hi jagah: rashi, nakshatra, gana, vara, tithi,
// paksha, yoga, karana, rashi-lord, navamsa.
// User ne kaha: "kundali pe se uski rashi, naksatra, gan, var etc. ka
// pura chart aata h o abhibhi nhi dikh raha he" — ye sab sirf neeche
// scroll karne par milte the. Ab upar hi dikhenge.
import fs from "node:fs";

const F = "src/utils/kundliFull.js";
let s = fs.readFileSync(F, "utf8");

if (s.includes("export function ganaOf")) {
  console.log("ganaOf pehle se hai");
  process.exit(0);
}

// ── 1. gana table + helper ──
const GANA_CODE = `
// ════════════════════════════════════════════════════════════════════
//  GANA — Dev / Manushya / Rakshas
//  Nakshatra ke hisaab se. Ye astro engine me nahi tha, isliye yahan
//  add kiya. Standard table: Deva 12, Manushya 6, Rakshasa 9 = 27.
// ════════════════════════════════════════════════════════════════════
const GANA_BY_NAK = [
  "Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva", "Deva",
  "Rakshasa", "Rakshasa", "Manushya", "Deva", "Deva", "Rakshasa", "Deva", "Rakshasa",
  "Deva", "Rakshasa", "Rakshasa", "Manushya", "Deva", "Deva", "Rakshasa", "Rakshasa",
  "Manushya", "Deva", "Deva",
];

/** Nakshatra index (0=Ashwini) se gana. */
export function ganaOf(nakIndex) {
  return GANA_BY_NAK[nakIndex] ?? "—";
}

/**
 * Janm ki jhalak — jo upar, seedha result ke niche dikhti hai.
 * values raw (English/Sanskrit) hain; rendering bhasha karegi.
 */
export function birthGlance(lagnaIdx, lons, nak, tithi, yoga, karana, wd, lagKnown) {
  const moonIdx = rashiIndex(lons.Moon);
  const sunIdx = rashiIndex(lons.Sun);
  return {
    lagna: lagKnown ? RASHIS[lagnaIdx] : null,
    lagnaLord: lagKnown ? RASHI_LORD[RASHIS[lagnaIdx]] : null,
    lagnaKnown: lagKnown,

    sunRashi: RASHIS[sunIdx],
    moonRashi: RASHIS[moonIdx],

    nakshatra: nak.name,
    nakshatraIndex: nak.index,
    nakPada: nak.pada,
    gana: ganaOf(nak.index),
    nadi: NADI_BY_NAK[nak.index],
    rashiLord: RASHI_LORD[RASHIS[moonIdx]],
    moonDegree: Math.floor(rev(lons.Moon) % 30) + "\u00b0" + String(Math.floor((rev(lons.Moon) % 1) * 60)).padStart(2, "0") + "\u2032",

    vara: VAAR_NAMES[wd],
    varaLord: VAAR_LORD[wd],

    tithi: tithi.name,
    tithiNum: tithi.n,
    paksha: tithi.paksha,
    yoga,
    karana,
  };
}

const VAAR_NAMES = ["Ravivaar", "Somvaar", "Mangalvaar", "Budhvaar", "Guruvaar", "Shukravaar", "Shanivaar"];
// Nadi: Adya (A), Madhya (M), Antya (T) — 3-cycle, har nakshatra par
const NADI_BY_NAK = [
  "Adya", "Madhya", "Antya", "Adya", "Madhya", "Antya", "Adya", "Madhya", "Antya",
  "Adya", "Madhya", "Antya", "Adya", "Madhya", "Antya", "Adya", "Madhya", "Antya",
  "Adya", "Madhya", "Antya", "Adya", "Madhya", "Antya", "Adya", "Madhya", "Antya",
];
`;

// helper kahan daalna hai — vimshottari se pehle
const ANCHOR = "// ════════════════════════════════════════════════════════════════════\n// 1. VIMSHOTTARI DASHA";
if (s.includes(ANCHOR)) {
  s = s.replace(ANCHOR, GANA_CODE + "\n" + ANCHOR);
} else {
  // fallback: shodashvarga se pehle
  s = s.replace("// ════════════════════════════════════════════════════════════════════\n// 2. SHODASHVARGA", GANA_CODE + "\n// ════════════════════════════════════════════════════════════════════\n// 2. SHODASHVARGA");
}

// ── 2. main output me jodo ──
const OUT_OLD = "    // 1. varshpal: kaun sa saal — ab saaf\n    varshpal: varshpalScope(birthdate),";
const OUT_NEW = `    // 0. JANM KI JHALAK — rashi, nakshatra, gana, vara. Ye upar
    //    result ke niche dikhti hai; pehle sirf neeche scroll karne
    //    par milti thi, isliye user ko lagta tha chart hi nahi hai.
    glance: birthGlance(lagIdx, lons, nak, tithi, yoga, karana, wd, lagLon !== null),

    // 1. varshpal: kaun sa saal — ab saaf
    varshpal: varshpalScope(birthdate),`;

if (s.includes(OUT_OLD)) {
  s = s.replace(OUT_OLD, OUT_NEW);
} else {
  console.log("!! output anchor nahi mila");
}

fs.writeFileSync(F, s, "utf8");
console.log("kundliFull.js me ganaOf + birthGlance add");
