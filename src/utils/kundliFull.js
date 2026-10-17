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
  saptamshaSign, tithiOf, yogaOf, karanaOf, grahaSthiti,
} from "./astro.js";

import { ashtakavarga, AV_GRAHAS } from "./ashtakavarga.js";
import { rIdx } from "./rashiHelper.js";

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
    else if (g === "Rahu") lons.Rahu = (() => { const t = jd; const n = (t + 248.5 / 365.25) % 1; return rev(n * 360 - aya); })();
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

  // ashtakavarga
  const positions = Object.fromEntries(AV_ONLY.map((g) => [g, lons[g]]));
  const av = lagLon !== null || time
    ? ashtakavarga(positions, RASHIS[lagIdx])
    : ashtakavarga(positions, RASHIS[moonIdx]);

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
    shadbala: shadbala(lagIdx, lons, lagLon),
    ashtakavarga: av,
    ratna, mantra: PLANET_MANTRA,
    gochar,
    ...extra,
  };
}

export default kundliFull;