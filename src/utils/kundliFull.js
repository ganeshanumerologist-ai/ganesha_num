// ════════════════════════════════════════════════════════════════════
//  पूरी कुंडली — ek hi jagah sab hisse
//
//  User ne kaha: "kundali me hi kundali ka pure chart aane chahiye —
//  dasha-mahadasha-antardasha, phaladesh, KP, shodashvarga, lal kitab,
//  varshphal, lagna, navamsha, graha sthiti, chalit table, janm vivran,
//  panchang, ashtakavarga, karakamsha, gochar, shadbala, prastar
//  ashtakavarga, bhavamadhya, para drishti, maitri chakra, avakanda
//  chakra, shubh-ashubh ... ye sab ekhi heading ke niche."
//
//  Ye module SARI calculation ek jagah karta hai; rendering alag
//  component me hai. Reports.jsx me jo dasha/varga logic tha, wahi
//  yahan bhi hai — dono jagah dobara likhne ke bajaye, yahan ek jagah.
// ════════════════════════════════════════════════════════════════════

import {
  jdFromDateStr, lahiriAyanamsa, rev, sunTropical, moonTropical, planetTropical,
  nakshatraOf, rashiOf, rashiIndex, RASHIS, isRetrograde, lagnaSidereal,
  navamshaSign, dashamshaSign, dwadasamshaSign, horaSign, drekkanaSign,
  saptamshaSign, tithiOf, yogaOf, karanaOf, grahaSthiti, rahuTropical,
} from "./astro.js";

import { ashtakavarga, AV_GRAHAS } from "./ashtakavarga.js";
import { rIdx } from "./rashiHelper.js";
import { sunTimes } from "./panchang.js";

import {
  DASHA_SEQ, NAK_LORD, RASHI_LORD, EXALT, OWN, RATNA, PLANET_MANTRA,
  LALKITAB_UPAY,
} from "../data/jyotish.js";

import CITIES from "../data/cities.js";

export const GRAHAS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
export const AV_ONLY = AV_GRAHAS;           // Ashtakavarga me Ketu nahi

// Ravivaar=0 … Shanivaar=6
export const VAAR_LORD = ["Surya", "Chandra", "Mangal", "Budh", "Guru", "Shukra", "Shani"];

// RATNA / kai tables SANSKRIT naam rakhti hain (Surya, Chandra…) jabki astro
// engine English deta hai (Sun, Moon…). Ye bridge map unhe jodta hai —
// bina iske RATNA["Sun"] undefined aa raha tha.
export const SANSKRIT = {
  Sun: "Surya", Moon: "Chandra", Mars: "Mangal", Mercury: "Budh",
  Jupiter: "Guru", Venus: "Shukra", Saturn: "Shani", Rahu: "Rahu", Ketu: "Ketu",
};

// ---------------------------------------------------------------
// chhote helpers
// ---------------------------------------------------------------
// ── Ye pehle sirf poore saal leta tha ─────────────────────────────
//   addYears(d, 0.83) → new Date(2021 + 0.83, ...) → JS fractional
//   year ko TRUNCATE kar deta hai → koi advance hi nahi hota tha,
//   isliye antar-dasha ki dates galat aa rahi thi.
//   Ab mahine me gina jaata hai, to 0.83 saal ≈ 10 mahine ban jaata hai.
function addYears(date, years) {
  const d = new Date(date.getTime());
  const months = Math.round(years * 12 * 100) / 100;
  const y = d.getFullYear() + Math.floor(months / 12);
  const m = d.getMonth() + (months % 12);
  const day = d.getDate();
  const out = new Date(y, Math.floor(m), day);
  // month overflow (31 Jan + 1 month) ko sambhal lo
  if (out.getDate() !== day) out.setDate(0);
  return out;
}

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const deg = (lon) => `${Math.floor(rev(lon) % 30)}°${String(Math.floor((rev(lon) % 1) * 60)).padStart(2, "0")}'`;

/** Bhav (house) = planet se lagna tak ki sankhya. 1-12 */
export function bhav(lagnaIdx, planetIdx) {
  return ((planetIdx - lagnaIdx + 12) % 12) + 1;
}


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
    moonDegree: Math.floor(rev(lons.Moon) % 30) + "°" + String(Math.floor((rev(lons.Moon) % 1) * 60)).padStart(2, "0") + "′",

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

// ════════════════════════════════════════════════════════════════════
// 1. VIMSHOTTARI DASHA — mahadasha / antardasha
// ════════════════════════════════════════════════════════════════════
export function vimshottari(birthdate, nak) {
  const lord = NAK_LORD[nak.name];
  const startIdx = DASHA_SEQ.findIndex((d) => d.lord === lord);
  if (startIdx < 0) return null;

  const balance = (1 - nak.frac) * DASHA_SEQ[startIdx].years;
  const [by, bm, bd] = birthdate.split("-").map(Number);
  let cursor = new Date(by, bm - 1, bd);

  const periods = [
    { lord, years: balance, start: new Date(cursor), end: addYears(cursor, balance), bal: true },
  ];
  cursor = addYears(cursor, balance);
  for (let i = 1; i <= 8; i++) {
    const d = DASHA_SEQ[(startIdx + i) % 9];
    periods.push({ lord: d.lord, years: d.years, start: new Date(cursor), end: addYears(cursor, d.years) });
    cursor = addYears(cursor, d.years);
  }

  const now = new Date();
  const cur = periods.find((p) => now >= p.start && now < p.end) || periods[0];
  const ci = DASHA_SEQ.findIndex((d) => d.lord === cur.lord);

  let c2 = new Date(cur.start);
  const ads = [];
  for (let i = 0; i < 9; i++) {
    const sub = DASHA_SEQ[(ci + i) % 9];
    const yrs = (cur.years * sub.years) / 120;
    ads.push({ lord: sub.lord, start: new Date(c2), end: addYears(c2, yrs) });
    c2 = addYears(c2, yrs);
  }
  const curAD = ads.find((a) => now >= a.start && now < a.end) || ads[0];

  return { periods, cur, curAD, ads };
}

// ════════════════════════════════════════════════════════════════════
// 2. SHODASHVARGA — 16 varg (D1 se D60)
//    astro.js me D2/D3/D7/D9/D10/D12 ready hai. Baaki generic
//    varg formula se nikalte hain (parashara paksha).
// ════════════════════════════════════════════════════════════════════
const VARGAS = [
  { d: "D1", n: "Rashi", f: (l) => rashiIndex(l) },
  { d: "D2", n: "Hora", f: horaSign },
  { d: "D3", n: "Drekkana", f: drekkanaSign },
  { d: "D4", n: "Chaturthamsa", f: (l) => Math.floor((((rev(l) % 15) / 15) * 4)) % 12 },
  { d: "D7", n: "Saptamsa", f: saptamshaSign },
  { d: "D9", n: "Navamsa", f: navamshaSign },
  { d: "D10", n: "Dashamsa", f: dashamshaSign },
  { d: "D12", n: "Dwadasamsa", f: dwadasamshaSign },
  { d: "D16", n: "Shodasamsa (Kalamsa)", f: (l) => Math.floor((((rev(l) % 20) / 20) * 16)) % 12 },
  { d: "D20", n: "Vimsamsa", f: (l) => Math.floor((((rev(l) % 20) / 20) * 20)) % 12 },
  { d: "D24", n: "Chaturvimsamsa (Siddhamsa)", f: (l) => (Math.floor(rev(l) / 30) % 4) * 3 + (rashiIndex(l) % 3) },
  { d: "D27", n: "Bhamsa/Nakshatramsa", f: (l) => Math.floor((((rev(l) % 13.3333) / 13.3333) * 27)) % 27 },
  { d: "D30", n: "Trimsamsa", f: trimsamsa },
  { d: "D40", n: "Khavedamsa", f: (l) => Math.floor((((rev(l) % 3.3333) / 3.3333) * 40)) % 12 },
  { d: "D45", n: " Akshvedamsa", f: (l) => Math.floor((((rev(l) % 3.3333) / 3.3333) * 45)) % 12 },
  { d: "D60", n: "Shashtiamsa", f: (l) => Math.floor((((rev(l) % 2.0) / 2.0) * 60)) % 60 },
];

function trimsamsa(lon) {
  const r = rashiIndex(lon);
  const inRashi = rev(lon) % 30;
  // 5-5-3-7 pattern; odd rashi = Mars, even = Saturn
  if (inRashi < 5) return r;
  if (inRashi < 10) return (r + 4) % 12;
  if (inRashi < 18) return (r + 8) % 12;
  return (r + 11) % 12;
}

/** Har planet ka poora 16-varg table.
 *  Dhyan do: horaSign/naumashaSign/… NAAM return karti hain (string),
 *  index nahi — isliye rIdx() se index me badla ja raha hai. */
export function shodashvarga(lons) {
  const rows = [];
  for (const [name, lon] of Object.entries(lons)) {
    const row = { planet: name, cells: {} };
    for (const v of VARGAS) {
      const raw = v.f(lon);
      const i = typeof raw === "number" ? raw : rIdx(raw);
      // D60 (Shashtiamsa) 60 bhag ka hota hai — 5 bhag = 1 rashi,
      // isliye use seedha rashi me map karo, warna "38" dikhta hai
      const mapped = v.d === "D60" ? Math.floor(i / 5) : i;
      row.cells[v.d] = {
        idx: mapped, name: v.n,
        text: mapped >= 0 && mapped < 12 ? RASHIS[mapped] : "-",
      };
    }
    rows.push(row);
  }
  return { rows, vargas: VARGAS };
}

// ════════════════════════════════════════════════════════════════════
// 3. CHALIT TABLE — divisional chart ka bhav-gadd (house lord)
// ════════════════════════════════════════════════════════════════════
export function chalitTable(lagnaIdx, lons) {
  const rows = [];
  for (const [name, lon] of Object.entries(lons)) {
    const idx = rashiIndex(lon);
    rows.push({
      planet: name,
      rashi: RASHIS[idx],
      bhav: bhav(lagnaIdx, idx),
      // bhav ka swami = us ghar me jo rashi hai uska lord
      bhavLord: RASHI_LORD[RASHIS[idx]] || "-",
    });
  }
  return rows;
}

// ════════════════════════════════════════════════════════════════════
// 4. PARA DRISTI — special aspects (guru 1-5-7-9, shani 3-7-10-12,
//    mangal 4-7-8, rahu-ketu 7)
// ════════════════════════════════════════════════════════════════════
const SPECIAL = {
  Jupiter: [1, 5, 7, 9],
  Saturn: [3, 7, 10, 12],
  Mars: [4, 7, 8],
  Rahu: [7],
  Ketu: [7],
};

export function paraDristi(lagnaIdx, lons) {
  const out = [];
  for (const [name, lon] of Object.entries(lons)) {
    const list = SPECIAL[name];
    if (!list) continue;
    const from = rashiIndex(lon);
    out.push({
      planet: name,
      bhavs: list.map((n) => n + (bhav(lagnaIdx, from) - 1)),
      houses: list.map((n) => (from + n - 1) % 12),
    });
  }
  return out;
}

// ════════════════════════════════════════════════════════════════════
// 5. MAITRI CHAKRA — grahon ka rishta (mitra / shatru / neutral)
// ════════════════════════════════════════════════════════════════════
// Maitri: do grah "mitra" jab (a) ek doosre ke uchch/sign me ho,
// ya (b) dono ek hi mitr grah ke rashi me baithe hon.
// Asli niyam chara pada hai — rashi-lord ke saath nukhane wala jod.
const FRIENDS_OF = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mars"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
  Rahu: ["Mercury", "Saturn"],
  Ketu: ["Mercury", "Saturn"],
};

export function maitriChakra(lons) {
  const rows = [];
  for (const a of GRAHAS) {
    for (const b of GRAHAS) {
      if (a === b) continue;
      const ia = rashiIndex(lons[a]);
      const ib = rashiIndex(lons[b]);
      const exA = EXALT[a] ? RASHIS.indexOf(EXALT[a][0]) : -1;
      const exB = EXALT[b] ? RASHIS.indexOf(EXALT[b][0]) : -1;

      let rel;
      if (ib === exA || ia === exB) rel = "friend";                 // uchch sthan
      else if ((FRIENDS_OF[a] || []).includes(b)) rel = "friend";   // nishtha grah
      else if ((FRIENDS_OF[b] || []).includes(a)) rel = "friend";
      else rel = "enemy";
      rows.push({ a, b, rel });
    }
  }
  return rows;
}

// ════════════════════════════════════════════════════════════════════
// 6. AVAKANDA CHAKRA — chandra se 8 bhag
// ════════════════════════════════════════════════════════════════════
export function avakanda(moonLon, lagnaIdx) {
  // Avakanda chakra: chandra se 8 bhag, har bhag ek grah.
// Graha ka lord us bhav ke rashi ka lord ho to MITTA (friend), warna SHATRU.
  const order = ["Budh", "Guru", "Mangal", "Chandra", "Surya", "Budh", "Ketu", "Shukra"];
  const ENG = { Budh: "Mercury", Guru: "Jupiter", Mangal: "Mars", Chandra: "Moon", Surya: "Sun", Ketu: "Ketu", Shukra: "Venus" };
  const mIdx = rashiIndex(moonLon);
  const cells = order.map((lord, i) => {
    const house = (i + 3) % 12 + 1;                          // 4th bhag se shuru
    // Bhava CHANDRA se gin-te hain (lagna se nahi) — yahi asli niyam hai
    const signInHouse = (mIdx + house - 1) % 12;
    const lordSign = RASHI_LORD[RASHIS[signInHouse]];
    return { lord, eng: ENG[lord], bhav: house, lordSign, friends: lord === lordSign };
  });
  return { start: RASHIS[mIdx], cells };
}

// ════════════════════════════════════════════════════════════════════
// 7. SHADBALA — chhah-fold strength (shochet, achal, ashubh,
//    drik, shadbala, drik-bal). Yahan proportion ke roop me.
// ════════════════════════════════════════════════════════════════════
export function shadbala(lagnaIdx, lons, lagnaLon) {
  const rows = [];
  for (const [name, lon] of Object.entries(lons)) {
    const idx = rashiIndex(lon);
    const house = bhav(lagnaIdx, idx);

    // shochet — exaltation uthta hai, debilitation neeche
    const exSign = EXALT[name]?.[0];
    let sho;
    if (exSign) {
      const exIdx = RASHIS.indexOf(exSign);
      // deva (exalt) par max, daiva (debil) par min
      const exDist = Math.abs(idx - exIdx);
      const deDist = Math.abs(idx - (exIdx + 6) % 12);
      const nearEx = exDist === 0 ? 1 : exDist === 1 ? 0.75 : exDist <= 3 ? 0.45 : 0.2;
      const nearDe = deDist === 0 ? 0.15 : deDist <= 1 ? 0.3 : 0.5;
      sho = Math.max(nearEx, nearDe);
    } else {
      sho = 0.5;
    }

    // achal — kendra/trikona sthan
    const achal = house === 1 || house === 4 || house === 7 || house === 10 ? 1
      : house === 5 || house === 9 ? 0.75 : 0.35;

    // ashubh — dusre grah se nazar
    let views = 0;
    for (const [o, olon] of Object.entries(lons)) {
      if (o === name) continue;
      const dist = angularDistance(idx, rashiIndex(olon));
      if (dist <= 30 || (dist >= 60 && dist <= 90) || dist >= 150) views++;
    }
    const ashubh = clamp01(views / 8);

    // drik — dusre ne isko dekha
    let drishti = 0;
    for (const [o, olon] of Object.entries(lons)) {
      if (o === name) continue;
      const special = SPECIAL[o] || [];
      const oi = rashiIndex(olon);
      const houses = [
        (oi + 6) % 12,           // 7th
        ...special.map((n) => (oi + n - 1) % 12),
      ];
      if (houses.includes(idx)) drishti++;
    }
    const drik = clamp01(drishti / 6);

    const total = sho + achal + (1 - ashubh) + (1 - drik) + sho + drik; // 6 hisse
    rows.push({
      planet: name, house, rashi: RASHIS[idx],
      shochet: +sho.toFixed(2), achal, ashubh: +ashubh.toFixed(2),
      drik: +drik.toFixed(2), total: +(total / 6).toFixed(2),
    });
  }
  return rows.sort((a, b) => b.total - a.total);
}

function angularDistance(a, b) {
  const d = Math.abs(a - b) * 30;
  return d > 180 ? 360 - d : d;
}
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// ════════════════════════════════════════════════════════════════════
// 8. KARAKAMSHA / SWAPHALA / BHAVAMADHYA
// ════════════════════════════════════════════════════════════════════
export function extraCharts(lons, lagnaIdx) {
  const moonLon = lons.Moon;
  // navamshaSign NAAM deta hai, index nahi — rIdx se badlo
  const karakamsha = rIdx(navamshaSign(moonLon));
  // Swaphala = 24th varg (chaturvimsamsa se alag, 24 bhag me se)
  const swaphala = Math.floor((rev(moonLon) / 360) * 24) % 12;
  // Chandrabala (bhava-madhya) — chandra se lagna ka antar
  const moonIdx = rashiIndex(moonLon);
  const bhavMadhya = ((lagnaIdx - moonIdx + 12) % 12) + 1;
  const drekkana = drekkanaSign(moonLon);
  return {
    karakamsha,
    karakamshaName: RASHIS[karakamsha] ?? "-",
    swaphala,
    swaphalaName: RASHIS[swaphala] ?? "-",
    bhavMadhya,
    drekkana,
  };
}

// ════════════════════════════════════════════════════════════════════
// 9. MAIN — poora hissa ek saath
// ════════════════════════════════════════════════════════════════════
export function kundliFull({ name, birthdate, time, place, gender }) {
  if (!birthdate) return null;

  const jd = jdFromDateStr(birthdate, 12);
  const aya = lahiriAyanamsa(jd);

  // graha ki sidereal longitudes
  const lons = {};
  for (const g of GRAHAS) {
    if (g === "Sun") lons.Sun = rev(sunTropical(jd) - aya);
    else if (g === "Moon") lons.Moon = rev(moonTropical(jd) - aya);
    // ── RAHU ──────────────────────────────────────────────────────
    // PEHLE YAHAN YE THA:
    //   const n = (jd + 248.5 / 365.25) % 1;  return rev(n * 360 - aya);
    // Wo BILKUL GALAT tha. JD ka fractional part roz ~0.0027 badhta
    // hai, isliye `n * 360` roz ~0.985° chalti thi — jabki asli Rahu to
    // mahine me sirf ~1.6° (yani 19.3°/saal, piche ki taraf) chalta hai.
    // Matlab Rahu ki rashi galat, isliye uska BHAV (house) galat, aur
    // poora Lal Kitab upay — bhavfal, rogi, daan, puja, mantra, samay —
    // sab galat ho jata tha.
    //
    // Ab wahi SAHI formula jo astro.js me pehle se tha (mean node):
    //   Ω = 125.04452° − 1934.136261° × T      (T = julian centuries)
    else if (g === "Rahu") lons.Rahu = rev(rahuTropical(jd) - aya);
    // Ketu hamesha Rahu se thik 180° door hota hai
    else if (g === "Ketu") lons.Ketu = rev(lons.Rahu + 180);
    else lons[g] = rev(planetTropical(g, jd) - aya);
  }

  // lagna
  let lagIdx = null, lagLon = null;
  if (time) {
    const c = CITIES.find((x) => x[0] === place);
    if (c) { try { lagLon = lagnaSidereal(birthdate, time, c[1], c[2]); lagIdx = rashiIndex(lagLon); } catch { /* */ } }
  }
  const moonLon = lons.Moon;
  const moonIdx = rashiIndex(moonLon);
  if (lagIdx === null) lagIdx = moonIdx;               // time na ho to chandra

  // panchang (janm ke din ka)
  const sunT = sunTropical(jd);
  const moonT = moonTropical(jd);
  const nak = nakshatraOf(moonLon);
  const tithi = tithiOf(sunT, moonT);
  const yoga = yogaOf(sunT, moonT);
  const karana = karanaOf(sunT, moonT);
  const wd = new Date(birthdate + "T12:00:00").getDay();

  // graha sthan
  const grahas = GRAHAS.map((g) => ({
    key: g,
    lon: lons[g],
    deg: deg(lons[g]),
    rashi: RASHIS[rashiIndex(lons[g])],
    rashiIdx: rashiIndex(lons[g]),
    nak: nakshatraOf(lons[g]),
    bhav: bhav(lagIdx, rashiIndex(lons[g])),
    lord: RASHI_LORD[RASHIS[rashiIndex(lons[g])]],
    // Ketu ka apna orbital table nahi hai (Rahu ka hi chhaya hai),
    // isliye uski vikalita stha Rahu jaisi hi hoti hai.
    retro: g === "Ketu" ? isRetrograde("Rahu", jd) : isRetrograde(g, jd),
  }));

  // Navamsha lagna (D9)
  const d9Lag = rIdx(navamshaSign(lagLon ?? moonLon));

  // dasha
  const dasha = vimshottari(birthdate, nak);

  // shadbala ek baar nikaal kar baaki hisse bhi use karein
  const shad = shadbala(lagIdx, lons, lagLon);

  // ashtakavarga
  const positions = Object.fromEntries(AV_ONLY.map((g) => [g, lons[g]]));
  const av = lagLon !== null || time
    ? ashtakavarga(positions, RASHIS[lagIdx])
    : ashtakavarga(positions, RASHIS[moonIdx]);

  // suryoday/suryast — sheher ke hisaab se. Shubh-ashubh ke times
  // inhi se nikalte hain, isliye yahan (component me nahi) chahiye.
  let sun = null;
  try {
    const c = time ? CITIES.find((x) => x[0] === place) : null;
    if (c) sun = sunTimes(birthdate, c[1], c[2]);
  } catch { /* sheher ya time nahi diya — times nahi dikhenge */ }

  // ratna + mantra (RATNA Sanskrit naam me hai — SANSKRIT map se jodo)
  const ratna = {};
  for (const g of GRAHAS) ratna[g] = { planet: g, ...(RATNA[SANSKRIT[g]] || {}) };

  // gochar (aaj ke grah)
  const gToday = grahaSthiti(todayISO());
  const gochar = GRAHAS.map((g) => ({
    key: g,
    nowRashi: gToday[g]?.rashi || "-",
    nowIdx: gToday[g]?.rashiIdx ?? null,
    janmRashi: RASHIS[rashiIndex(lons[g])],
    same: gToday[g]?.rashiIdx === rashiIndex(lons[g]),
  }));

  const extra = extraCharts(lons, lagIdx);

  return {
    name, birthdate, time, place, gender,
    jd, aya,
    lagIdx, lagLon, lagna: RASHIS[lagIdx], d9Lag, d9Lagna: RASHIS[d9Lag],
    lagnaKnown: lagLon !== null,
    lons, grahas,
    moonRashi: RASHIS[moonIdx], moonIdx, moonNak: nak,
    sunRashi: RASHIS[rashiIndex(lons.Sun)],
    panchang: { tithi, nak, yoga, karana, vaar: wd, vaarLord: VAAR_LORD[wd] },
    dasha,
    shodashvarga: shodashvarga(lons),
    chalit: chalitTable(lagIdx, lons),
    paraDristi: paraDristi(lagIdx, lons),
    maitri: maitriChakra(lons),
    avakanda: avakanda(moonLon, lagIdx),
    shadbala: shad,
    ashtakavarga: av,
    ratna, mantra: PLANET_MANTRA,
    gochar,

    // ── Naye hisse (user ki 4 shikayaton ka hal) ──
    // 1. varshphal: kaun sa saal — ab saaf
    // 0. JANM KI JHALAK - rashi, nakshatra, gana, vara. Ye upar
    //    result ke niche dikhti hai; pehle sirf neeche scroll karne
    //    par milti thi, isliye user ko laga chart hi nahi hai.
    glance: birthGlance(lagIdx, lons, nak, tithi, yoga, karana, wd, lagLon !== null),

    varshphal: varshphalScope(birthdate),

    // 2. lal kitab: puri upay-list, ghar ke hisaab se
    lalKitab: lalKitabFull(lagIdx, lons, shad, dasha?.cur?.lord),

    // 3. ratna: SAHI kaunsa peena hai + kyun
    gemAdvice: gemAdvice(lagIdx, lons, av, shad),

    // 4. shubh-ashubh: ASLI clock times (suryoday se nikle)
    ...(sun
      ? { shubhAshubh: shubhAshubh(sun.sunrise, sun.sunset) }
      : {}),

    ...extra,
  };
}

// ════════════════════════════════════════════════════════════════════
//  RATNA — sirf stone/metal/day ki list nahi, SAHI RATNA ka FAISLA.
//
//  User ne kaha: "gemstone sare grah ke bata diye konsa phena chahiye
//  o bataya hi nahi, recommendation honi chahiye."
//
//  Classical niyam:
//   • Zyada se zyada 3-5 hi — har graha ka gem nahi peena.
//   • Pehle wahi jiska adhaara (ashtakavarga/shadbala) kam ho.
//   • Devta ( benefic ) pehle, rakshasa (malefic) baad me.
//   • Guru/Chandra/Venus shubh graha; Shani/Rahu/Ketu/Mars akru.
//     Nodes ke gem (Gomed/Moti) kabhi nahi peene chahiye — tada-lagna
//     shastra me nirsett hain. Ye saaf bolna zaroori hai.
//   • Nikla (debil) graha ka gem tabhi, jab use upakarna hi ho —
//     warna gem peene se graha aur ghabra jata hai.
//   • 6th/8th/12th me graha ka gem (Shani bhava 6/8, Rahu 8, Ketu 12)
//     shubh nahi maana jaata.
// ════════════════════════════════════════════════════════════════════

// Kaancha-grah — jinhe ratna peene ki salah NAHI jaati
export const GEM_AVOID = { Rahu: "Gomed", Ketu: "Moti", Mars: "Red Coral" };

// Shubh / akru
export const GEM_NATURE = {
  Sun: "shubh", Moon: "shubh", Jupiter: "shubh", Venus: "shubh",
  Mercury: "mixed", Mars: "akru", Saturn: "akru", Rahu: "akru", Ketu: "akru",
};

// Yantra/gem se judne wale bhav — inke gem "bhaag se nahi" rehte
const GEM_BAD_HOUSES = { Saturn: [6, 8, 12], Rahu: [6, 8, 12], Ketu: [6, 8, 12], Mars: [6, 7, 12] };

// Nikla graha? phir gem se usse aur ghabra hoga
function isDebilitated(name, lon) {
  const d = EXALT[name];
  if (!d || !d[1]) return false;
  return RASHIS[rashiIndex(lon)] === d[1];
}

/**
 * Ratna faisla. Returns har graha ke liye:
 *   status : "pehli choice" | "optional" | "sirf zarurat" | "mat peeno"
 *   reason : kyun
 *   score  : ranking (bada = pehle)
 */
export function gemAdvice(lagnaIdx, lons, av, shad) {
  const avG = av?.graha || {};
  const bal = Object.fromEntries(shad.map((s) => [s.planet, s.total]));
  const rows = [];

  for (const name of GRAHAS) {
    const lon = lons[name];
    if (lon === undefined) continue;
    const idx = rashiIndex(lon);
    const house = bhav(lagnaIdx, idx);
    const pts = avG[name] ?? 0;
    const str = bal[name] ?? 0.5;
    const nature = GEM_NATURE[name];
    const debil = isDebilitated(name, lon);
    const badHouse = (GEM_BAD_HOUSES[name] || []).includes(house);
    const rasi = RATNA[SANSKRIT[name]] || {};

    let status, reason, score = 0;
    let whyCode = "weak";   // rendering time par bhasha me badlega

    if (name === "Rahu" || name === "Ketu") {
      status = "mat";
      reason = "chhaya graha — shastra me inhe peene ki salah nahi";
      whyCode = "node";
      score = -100;
    } else if (name === "Mars" && pts === 0 && house >= 6) {
      status = "mat";
      reason = "akru + kam adhaara + dursthan — labh nahi, dosh badhega";
      whyCode = "akru";
      score = -90;
    } else if (debil) {
      // Nikla graha: gem se aur ghabra. Sirf tab jab uska kaam hi na kre.
      status = "optional";
      reason = "nikla hua hai — gem se usse aur dikkat; upakarna behtar hai";
      whyCode = "debil";
      score = 10 + pts;
    } else if (badHouse) {
      status = "mat";
      reason = `${house}va bhav me hai — rashtrari/rog/bhrishti ka bhav`;
      whyCode = "badHouse";
      score = -50;
    } else {
      // Asli ranking: adhaara + shubhness + trikona/10th me hona.
      // NOTE: ashtakavarga.graha ka range 0-4 hai (8 bhavon me se KITNE me
      // bindu diya), 0-8 nahi — pehle 5 ka rakh diya tha, isliye koi bhi
      // graha "pehli choice" hi nahi hua tha.
      score = pts * 4 + str * 12;
      if (nature === "shubh") score += 14;
      if (nature === "akru") score -= 10;
      if ([1, 4, 7, 10].includes(house)) score += 12;   // kendra-trikona
      if (house === 5 || house === 9) score += 6;
      if (house === 2 || house === 11) score += 3;      // dhana bhava
      if (pts >= 3) {
        status = "pehli";
        reason = `acha adhaara (${pts}/8) + ${house}va bhav — sabse zyada faida`;
        whyCode = "best";
      } else if (pts === 2) {
        status = "pehli";
        reason = `theek adhaara (${pts}/8) + ${house}va bhav — peena laabhdaay`;
        whyCode = "good";
      } else {
        status = "optional";
        reason = `kam adhaara (${pts}/8) — zaroorat nahi, mann ki marzi`;
        whyCode = "weak";
      }
    }

    rows.push({
      planet: name,
      house,
      rashi: RASHIS[idx],
      stone: rasi.stone || "—",
      metal: rasi.metal || "—",
      day: rasi.day || "—",
      finger: rasi.finger || "—",
      nature,
      points: pts,
      strength: +str.toFixed(2),
      debilitated: debil,
      status,
      reason,
      // rendering ke liye: kaunsa translation key + uske parameters
      whyCode,
      whyArgs: { p: pts, h: house },
      score,
    });
  }

  rows.sort((a, b) => b.score - a.score);

  // Sirf top 3 hi "pehli choice" — baaki optional.
  // Classical niyam: 3 se zyada gem ek saath nahi.
  let promoted = 0;
  for (const r of rows) {
    if (r.status === "pehli") {
      promoted++;
      if (promoted > 3) {
        r.status = "optional";
        r.reason += " (saath me 3 se zyada mat)";
        r.extraNote = "maxThree";
      }
    }
  }

  // Par ek clear JAWAAB hona chahiye. Agar koi bhi "pehli choice" nahi
  // bacha (sab ya to kam adhaara ya dursthan), to sabse upar wale
  // yogya graha ko chun kar use pehli choice bana dete hain —
  // warna user ko sirf "optional / optional / optional" dikhta aur
  // sawaal hi reh jaata.
  if (rows.length && !rows.some((r) => r.status === "pehli")) {
    const top = rows.find((r) => r.status === "optional");
    if (top) {
      top.status = "pehli";
      top.reason = `sabse yogya — ${top.reason}`;
      top.whyCode = "fallback";
    }
  }

  return rows;
}

// ════════════════════════════════════════════════════════════════════
//  LAL KITAB — pura upay, ghar ke hisaab se
//
//  User ne kaha: "lal kitab ke upay khali hain, use pura karo."
//  Pehle sirf ek line ka upay tha. Ab har graha ke liye:
//   • ghar + uska bhav-phal (kya nashee banega)
//   • rogi/lakshan (kya takleef ho sakti hai)
//   • upay: daan, puja, mantra, seva
//   • kab: kitne baje
// ════════════════════════════════════════════════════════════════════

const LK_DAAN = {
  Sun: "गुड़ या गुड़-मिश्री चढ़ाएँ", Moon: "चावल या सफ़ेद वस्तु दान करें",
  Mars: "लोहे की वस्तु, लाल चपड़ा, मसाला दान करें",
  Mercury: "पीतल/काँसे का सिक्का, मूँग दलिया चढ़ाएँ",
  Jupiter: "पीला वस्त्र, चना दाल, केले चढ़ाएँ",
  Venus: "सफ़ेद वस्त्र, चावल, मिठाई, कपूर दान करें",
  Saturn: "काले तेल का दीपक, सरसों, काले कपड़े चढ़ाएँ",
  Rahu: "काले तिल, सरसों का तेल, सात दिन दाल दान करें",
  Ketu: "गाय को हरा चारा, कुत्ते को रोटी खिलाएँ",
};

const LK_PUJA = {
  Sun: "सूर्य की आरती प्रातःकाल करें, गाय को जल दें",
  Moon: "चंद्रमा की आरती संध्या को करें, चावल जल में डालें",
  Mars: "मंगलवार को मंगल देव का ध्यान, लाल मसाले जलाएँ",
  Jupiter: "गुरुवार को पीले वस्त्र पहनें, विद्या दान करें",
  Venus: "शुक्रवार को सफ़ेद वस्त्र, चमेल की सेवा करें",
  Saturn: "शनिवार को पीपल की जल से सींचें, काले तिल दान करें",
  Rahu: "शनिवार को सात दिन काले तिल दान करें",
  Ketu: "मंगलवार को कुत्ते को रोटी, गाय को चारा खिलाएँ",
};

const LK_ROGI = {
  Sun: "पिता की बीमारी, गर्मी से तकलीफ, सर से दर्द",
  Moon: "माता की सेहत, पेट व छाती की समस्या, मानसिक तनाव",
  Mars: "मिर्ग, रक्त की समस्या, हाथ-पैर में चोट, झगड़ा",
  Mercury: "साखी, पेट की गड़बड़ी, बुद्धि की कमी, चोरी",
  Jupiter: "पिता की मौत का भय, गुरु की निर्वाणा, अध्ययन में रुकावट",
  Venus: "काम-क्रोध में कमी, दाँत की समस्या, गुदा की बीमारी",
  Saturn: "कब्ज, कमजोरी, डर, पैरों की समस्या, पिता की बेचैनी",
  Rahu: "झूठ, पागलपन, भ्रम, गुप्त रोग, शोष",
  Ketu: "गरीबी, तप, अपराध भय, संधि/हड्डी का दर्द",
};

const LK_TIME = {
  1: "प्रातः 6–9", 2: "प्रातः 9–12", 3: "दोपहर 12–15", 4: "दोपहर 3–6",
  5: "संध्या 6–7", 6: "रात्रि 7–10", 7: "रात्रि 10–12", 8: "रात्रि 12–2",
  9: "प्रातः 3–6", 10: "सुबह 6–9", 11: "सुबह 9–12", 12: "दोपहर 12–3",
};

const LK_MANTRA = {
  Sun: "ओं सूर्याय नमः", Moon: "ओं चन्द्राय नमः", Mars: "ओं मंगलाय नमः",
  Mercury: "ओं बुधाय नमः", Jupiter: "ओं गुरवे नमः", Venus: "ओं शुक्राय नमः",
  Saturn: "ओं शनैश्चराय नमः", Rahu: "ओं राहवे नमः", Ketu: "ओं केतवे नमः",
};

const LK_BHAV_FAL = {
  1: "स्वयं की उन्नति, इज्जत का मामला",
  2: "रोज़मर्रा की चीज़ों पर खर्च, मतलब व घर की बातें",
  3: "भाई-बहन और मोहल्ले की लड़ाई, छोटी यात्रा व नुकसान",
  4: "घर-गाड़ी में उलझन, जमीन या छोटे भाई का मुकदमा",
  5: "बेटे की चिंता, संतान सुख, पढ़ाई में रुकावट",
  6: "बीमारी, कर्ज़, छोटी दुश्कन, सरकारी काम में परेशानी",
  7: "सौदा-पत्थर का झगड़ा, ससुराल का तनाव, दूर का सफ़र",
  8: "अचानक नुकसान, रहस्य उजागर, डरावनी घटना",
  9: "भाग्य में उतार-चढ़ाव, पिता की सेहत, निजी शर्तें",
  10: "काम-धन्धा और पद, बड़ों से फ़ायदा",
  11: "आमिरक्षा की बात, बड़ा भाई, अचानक लाभ",
  12: "खर्च, नींद न आना, अंधेरा, किसी से लड़ाई",
};

/** Har graha ka poora lal kitab upay. */
export function lalKitabFull(lagnaIdx, lons, shad, dashaLord) {
  const bal = Object.fromEntries(shad.map((s) => [s.planet, s.total]));
  return GRAHAS.filter((n) => lons[n] !== undefined).map((name) => {
    const idx = rashiIndex(lons[name]);
    const house = bhav(lagnaIdx, idx);
    const weak = (bal[name] ?? 0.5) < 0.45;
    return {
      planet: name,
      house,
      rashi: RASHIS[idx],
      bhavFal: LK_BHAV_FAL[house],
      rogi: LK_ROGI[name],
      daan: LK_DAAN[name],
      puja: LK_PUJA[name],
      mantra: LK_MANTRA[name],
      mantraCount: 108,          // 108 ya 1107 sankhya
      time: LK_TIME[house],
      weak,
      // chalू dasha me hai to upay sabse pehle karo
      priority: dashaLord === name ? "sabse pehle" : weak ? "zor se" : "normal",
      baseUpay: LALKITAB_UPAY[name] || "",
    };
  }).sort((a, b) => {
    const rank = { "sabse pehle": 0, "zor se": 1, normal: 2 };
    return rank[a.priority] - rank[b.priority];
  });
}

// ════════════════════════════════════════════════════════════════════
//  SHUBH / ASHUBH — ASLI SAMAY, naam nahi
//
//  User ne kaha: "baki kisika time diya hi nhi" — sirf muhurat ke naam
//  the. Ab har ek ka clock time hai, aur woh SURYODAY-SE nikla hai
//  (fixed IST nahi), to sheher ke hisaab se sahi hota hai.
// ════════════════════════════════════════════════════════════════════

const hm = (m) => {
  const t = Math.round(m);
  const h = Math.floor(t / 60), mm = ((t % 60) + 60) % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

export function shubhAshubh(sunrise, sunset) {
  const day = sunset - sunrise;
  const half = day / 2;

  // ── SHUBH ──
  const shubh = [
    { name: "Abhijit Muhurat", from: sunrise + day * (11 / 48), to: sunrise + day * (12 / 48) },
    { name: "Brahma Muhurt", from: sunrise + day * (9 / 60), to: sunrise + day * (10 / 60) },
    { name: "Vijay Muhurt", from: sunrise + day * (27 / 60), to: sunrise + day * (28 / 60) },
    { name: "Godhuli (sundown)", from: sunset - day * (24 / 60), to: sunset - day * (13 / 60) },
    { name: "Amrit Kaal (first)", from: sunrise + day * (5 / 60), to: sunrise + day * (9 / 60) },
  ].map((x) => ({ ...x, text: `${hm(x.from)} – ${hm(x.to)}` }));

  // ── ASHUBH ──
  // Rahu Kaal/Yamaganda/Gulika: 8 bhag, day ko 8 me baant kar uska
  // kuch hissa. Ye IST me diye jaate hain, par asal me sunrise se
  // nikalte hain — isliye sheher badalne par time bhi badalta hai.
  const vaar = new Date().getDay();     // 0=Ravivaar
  const seg = day / 8;
  const seq = {
    0: { rahu: 7, yama: 4, guli: 5 },   // Ravivaar
    1: { rahu: 1, yama: 2, guli: 3 },   // Somvaar
    2: { rahu: 5, yama: 6, guli: 4 },   // Mangalvaar
    3: { rahu: 6, yama: 0, guli: 2 },   // Budhvaar
    4: { rahu: 4, yama: 5, guli: 0 },   // Guruvaar
    5: { rahu: 3, yama: 1, guli: 6 },   // Shukravaar
    6: { rahu: 2, yama: 3, guli: 1 },   // Shanivaar
  }[vaar];

  const at = (i) => [sunrise + seg * i, sunrise + seg * (i + 1)];
  const [ra, rb] = at(seq.rahu);
  const [ya, yb] = at(seq.yama);
  const [ga, gb] = at(seq.guli);

  // Bhadra: sunset ke baad raat ka pehla hissa
  const night = 12 * 60;
  const bhadraFrom = sunset + night * (1 / 15);
  const bhadraTo = sunset + night * (7 / 60);

  const ashubh = [
    { name: "Rahu Kaal", from: ra, to: rb },
    { name: "Yamaganda", from: ya, to: yb },
    { name: "Gulika Kaal", from: ga, to: gb },
    { name: "Bhadra (Vivaha nahi)", from: bhadraFrom, to: bhadraTo },
    { name: "Panchak (5 tithi)", from: sunrise, to: sunset, note: "agni dosh" },
  ].map((x) => ({ ...x, text: x.note ? `${hm(x.from)} – ${hm(x.to)}  ·  ${x.note}` : `${hm(x.from)} – ${hm(x.to)}` }));

  return { shubh, ashubh, sunrise: hm(sunrise), sunset: hm(sunset) };
}

// ════════════════════════════════════════════════════════════════════
//  VARSHPHAL — konse SAAL ka? Ye saaf dikhana hai.
// ════════════════════════════════════════════════════════════════════

/**
 * Varshphal ka scope: niji saal (personal year 1-9) + saamne wala
 * saal + poori 9 ki list. Bina "kaun sa saal" bataye chart
 * adhura lagta hai — yahi user ki shikayat thi.
 */
export function varshphalScope(dob, now = new Date()) {
  const py = personalYearOf(dob, now.getFullYear());
  const cal = now.getFullYear();
  return {
    calendarYear: cal,
    personalYear: py,
    // niji saal = janm ke mahine+din aur saal se nikla hua sankhya
    scopeText: `${cal} · niji saal ${py}`,
    running: true,
  };
}

// personal year = (birth month + birth day + current year) → 1..9
function personalYearOf(dob, year) {
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const [, m, d] = dob.split("-").map(Number);
  const sum = m + d + year;
  let v = sum % 9;
  if (v === 0) v = 9;
  // year khatam hone par agli niji saal shuru hoti hai (Gana-akshaya)
  return v;
}

export default kundliFull;