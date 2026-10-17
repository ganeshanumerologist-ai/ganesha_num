// Panchang extras — suryodaya, suyast, amrit-kaal, sthanik samay, samvatsara.
// astro.js me planetary math hai; yahan wo aur aage badhate hain.

import { rev, jdFromDateStr, moonTropical, sunTropical, rashiIndex, nakshatraOf } from "./astro.js";

const RAD = Math.PI / 180;

// ---------- Suryodaya / Suyast ----------
// NOAA solar position algorithm. Error ~1-2 minute.
export function sunTimes(dateStr, lat = 28.6139, lon = 77.2090) {
  const jd = jdFromDateStr(dateStr, 12); // local noon approx (jdFromDateStr already IST-aware)
  const T = (jd - 2451545) / 36525;

  const L0 = rev(280.46646 + 36000.76983 * T);
  const M = rev(357.52911 + 35999.05029 * T);
  const C =
    (1.914602 - 0.004817 * T) * Math.sin(M * RAD) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * RAD) +
    0.000289 * Math.sin(3 * M * RAD);
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = rev(trueLong - 0.00569 - 0.00478 * Math.sin(omega * RAD));

  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * RAD);
  const decl = Math.asin(Math.sin(eps * RAD) * Math.sin(lambda * RAD)) / RAD;

  const y = Math.tan((eps / 2) * RAD) ** 2;
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const eqTime =
    (4 * RAD) *
    (y * Math.sin(2 * L0 * RAD) -
      2 * e * Math.sin(M * RAD) +
      4 * e * y * Math.sin(M * RAD) * Math.cos(2 * L0 * RAD) -
      0.5 * y * y * Math.sin(4 * L0 * RAD) -
      1.25 * e * e * Math.sin(2 * M * RAD));

  const zenith = 90.833;
  const latR = lat * RAD;
  const declR = decl * RAD;
  const cosH =
    (Math.cos(zenith * RAD) - Math.sin(latR) * Math.sin(declR)) /
    (Math.cos(latR) * Math.cos(declR));

  if (cosH > 1) return { sunrise: null, sunset: null, polar: "night", decl, eqTime };
  if (cosH < -1) return { sunrise: null, sunset: null, polar: "day", decl, eqTime };

  const H = Math.acos(cosH) / RAD;

  // Minutes from UTC midnight. +330 = IST (UTC+5:30)
  const solarNoon = 720 - 4 * lon - eqTime + 330;
  const sunriseMin = solarNoon - 4 * H;
  const sunsetMin = solarNoon + 4 * H;

  return {
    sunrise: sunriseMin,
    sunset: sunsetMin,
    solarNoon,
    decl,
    eqTime,
    dayLength: sunsetMin - sunriseMin,
  };
}

export function fmtMin(m) {
  if (m == null || Number.isNaN(m)) return "—";
  const t = ((m % 1440) + 1440) % 1440;
  const totalMin = Math.round(t);
  const hh = Math.floor(totalMin / 60) % 24;
  const mm = totalMin % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export const fmtTime = fmtMin;

// ---------- Samvatsara ----------
const SAMVAT_NAMES = [
  "Prabhava", "Vibhava", "Shukla", "Pramoda", "Prajotpatti", "Angirasa",
  "Srimukha", "Bhava", "Yuva", "Dhata", "Ishvara", "Bahudhanya",
  "Pramathi", "Vikrama", "Vrisha", "Chitrabhanu", "Svabhanu", "Tarana",
  "Parthiva", "Vyaya", "Sarvajit", "Sarvadhari", "Virodhi", "Vikriti",
  "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
  "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava", "Shubhakrit",
  "Shobhakrit", "Krodhi", "Vishvavasu", "Parabhava", "Plavanga",
  "Kilaka", "Saumya", "Sadharana", "Virodhikrit", "Paridhavi", "Pramadiya",
  "Ananda", "Rakshasa", "Nala", "Pingala", "Kalayukti", "Siddharthi",
  "Raudra", "Durmati", "Dundubhi", "Rudhirodgari", "Raktakshi", "Krodhana",
  "Akshaya",
];

export const SAMVATSARA = SAMVAT_NAMES;

// Shaka 1902 = Prabhava
export function shakaSamvat(year) {
  return 78 + (year - 1900);
}

export function samvatsaraName(year) {
  return SAMVAT_NAMES[((year - 1902) % 60 + 60) % 60];
}

export function vikramSamvat(dateStr) {
  const [y, m] = dateStr.split("-").map(Number);
  return m >= 4 ? y + 57 : y + 56;
}

// ---------- Tithi / Nakshatra ----------
export function moonSidereal(jd) {
  const T = (jd - 2451545) / 36525;
  const aya = 23.853 + (2000 + (jd - 2451545) / 365.25 - 2000) * 0.01397;
  void T;
  return rev(moonTropical(jd) - aya);
}

export function tithiAt(dateStr, hourIST) {
  const jd = jdFromDateStr(dateStr, hourIST);
  const elong = rev(moonTropical(jd) - sunTropical(jd));
  const n = Math.floor(elong / 12) + 1;
  const paksha = n <= 15 ? "Shukla" : "Krishna";
  const index = (n - 1) % 15;
  return { n, paksha, index, elong };
}

export function nakshatraAt(dateStr, hourIST) {
  const jd = jdFromDateStr(dateStr, hourIST);
  return nakshatraOf(moonSidereal(jd));
}

// ---------- Amrit Kaal ----------
// Ashtami tithi + Chandra janma-nakshatra me + lagna se 8ve bhava me.
// Amrit Kaal = us nakshatra ka aadha (≈27 min).
export function amritKaal(dateStr, janmaNakshatraIdx, lagnaSign) {
  if (janmaNakshatraIdx == null) return { exists: false };
  const amritMin = (24 * 60) / 27 / 2;

  for (let h = 0; h < 24; h += 0.0833) {
    const t = tithiAt(dateStr, h);
    if (t.index !== 7) continue;

    const nak = nakshatraAt(dateStr, h);
    if (nak.index !== janmaNakshatraIdx) continue;

    if (lagnaSign != null) {
      const jd = jdFromDateStr(dateStr, h);
      const moonSign = rashiIndex(moonSidereal(jd));
      const bhava = ((moonSign - lagnaSign) % 12 + 12) % 12;
      if (bhava !== 7) continue;
    }

    const from = h * 60;
    return {
      exists: true,
      from,
      to: Math.min(from + amritMin, 1440),
      nakshatra: nak,
      tithi: t,
    };
  }
  return { exists: false };
}

// ---------- Sthanik Samay ----------
const STHANIK = {
  0: ["Abhijit", "Rikta/Godhuli", "Kaal", "Labh (Punya)"],
  1: ["Labh (Punya)", "Abhijit", "Rikta/Godhuli", "Kaal"],
  2: ["Kaal", "Labh (Punya)", "Abhijit", "Rikta/Godhuli"],
  3: ["Rikta/Godhuli", "Kaal", "Labh (Punya)", "Abhijit"],
  4: ["Abhijit", "Rikta/Godhuli", "Kaal", "Labh (Punya)"],
  5: ["Labh (Punya)", "Abhijit", "Rikta/Godhuli", "Kaal"],
  6: ["Kaal", "Labh (Punya)", "Abhijit", "Rikta/Godhuli"],
};

export function sthanikSamay(weekday) {
  return STHANIK[weekday] || STHANIK[0];
}

// ---------- Griha Pravesh ----------
export const GRIHA_RULES = {
  tithi: "Krishna Paksha (Amanta)",
  yoga: ["Chitra", "Swathi", "Shubha", "Abhijit", "Vriddhi"],
  vaar: ["Monday", "Wednesday", "Thursday"],
  nakshatra: ["Rohini", "Mrigashira", "Shravana", "Revati", "Uttara Phalguni", "Uttara Ashadha", "Uttara Bhadrapada"],
};

// Rohini(4), Mrigashira(5), Punarvasu(7), Pushya(8), Magha(10), Uttara Phalguni(12),
// Hasta(13), Swati(15), Shravana(22), Uttara Bhadrapada(25), Revati(26),
// Uttara Ashadha(21), Abhijit(0)
const GRIHA_NAK = new Set([0, 4, 5, 7, 8, 10, 12, 13, 15, 21, 22, 25, 26]);

export function grihaPravishTime(tithi, weekday, nakIdx) {
  const tithiOk = tithi.paksha === "Krishna";
  const nakOk = GRIHA_NAK.has(nakIdx);
  const vaarOk = [1, 3, 4].includes(weekday);
  return { ok: tithiOk && nakOk && vaarOk, tithiOk, nakOk, vaarOk };
}

// ---------- Vivah ----------
export function vivahMuhur(tithi, weekday, nakIdx, panchak, bhadra) {
  const rikta = [4, 9, 14];
  const vaarVarjit = [2, 6];
  const tithiOk = tithi.paksha === "Shukla" && !rikta.includes(tithi.n);
  const vaarOk = !vaarVarjit.includes(weekday);
  const nakOk = ![4, 9, 14, 15, 20, 24].includes(nakIdx);
  return {
    ok: tithiOk && vaarOk && nakOk && !panchak && !bhadra,
    tithiOk, vaarOk, nakOk, panchakOk: !panchak, bhadraOk: !bhadra,
  };
}

// ============================================================
//  SHEHAR-DEPENDENT (CITY-AWARE) TIMES
//
//  Ye pehle Delhi ke hisaab se static likhe gaye the. Ab inka hisaab
//  suryodaya/suryast se aata hai, isliye Nagpur, Mumbai, Chennai,
//  Guwahati — har jagah apna time dikhega.
//
//  IST poore desh me ek hi hai, isliye Amrit Kaal / Sthanik / Rahu Kaal
//  jaise tithi-based times me shehar ka koi farq nahi — wahi sahi hain.
// ============================================================

/**
 * Ek muhurta = din ka 1/15 hissa.
 * @param {number} sunrise  suryodaya (minutes, midnight se)
 * @param {number} dayLength din ki lambai (minutes)
 * @returns {{muhurta:number, from:number, to:number}}
 */
export function muhurtaParts(sunrise, dayLength) {
  const m = dayLength / 15;
  return { muhurta: m, from: sunrise, to: sunrise + dayLength };
}

/**
 * Abhijit Muhurat — din ke 15 muhurton me se 8va.
 * Shehar badalne par ye badal bhi hai (Delhi ~15:24, Mumbai ~15:46).
 */
export function abhijitWindow(sunrise, dayLength) {
  const m = dayLength / 15;
  // 15 muhurton ki list ka 8va (index 7) — beech se 3.5 muhurta
  const from = sunrise + m * 7.5;
  const to = from + m;
  return { from, to, muhurta: m };
}

/**
 * Godhuli Kaal — suryast se 1 ghanta 28 minute PEHLE se suryast tak.
 * (Bhadra kaal ka ek hissa; shehar ke saath badalta hai.)
 */
export function godhuliWindow(sunset) {
  const span = 60 + 28;              // 1:28
  return { from: Math.max(0, sunset - span), to: sunset };
}

/**
 * Bhadra Kaal — suryast ke baad se aadhi raat tak.
 * Din me Bhadra nahi hota, isliye raat ka hissa hi.
 */
export function bhadraWindow(sunset) {
  return { from: sunset, to: 1440 };
}

/**
 * 24 Hora — suryodaya se shuru, har ek 1 ghanta.
 * @param {number} sunrise suryodaya (minutes)
 * @returns {Array<{from:number,to:number,hour:number}>} hour = 0..23 (pratham hora)
 */
export function horaFromSunrise(sunrise) {
  return Array.from({ length: 24 }, (_, i) => ({
    from: sunrise + i * 60,
    to: sunrise + (i + 1) * 60,
    hour: i,
  }));
}

/**
 * Choghadiya — suryodaya se suryast tak, 8 barabar hisse.
 * (Pehle 6:00–18:00 fixed tha — jo Delhi jaisa hi tha.)
 * @returns {Array<{from:number,to:number,index:number}>} index = 0..7 (pratham choghadiya)
 */
export function choghadiyaFromSunrise(sunrise, sunset) {
  const step = (sunset - sunrise) / 8;
  return Array.from({ length: 8 }, (_, i) => ({
    from: sunrise + step * i,
    to: sunrise + step * (i + 1),
    index: i,
  }));
}

/**
 * Raat ki hora — suryast ke baad. Choghadiya/Bhadra yahin se hataate hain.
 */
export function nightHoursFromSunset(sunset) {
  const left = 1440 - sunset;
  return Math.max(0, Math.floor(left / 60));
}

export default {
  sunTimes, fmtMin, shakaSamvat, samvatsaraName, vikramSamvat,
  tithiAt, nakshatraAt, amritKaal, sthanikSamay, grihaPravishTime, vivahMuhur,
  muhurtaParts, abhijitWindow, godhuliWindow, bhadraWindow,
  horaFromSunrise, choghadiyaFromSunrise, nightHoursFromSunset,
  SAMVATSARA, GRIHA_RULES,
};


// ════════════════════════════════════════════════════════════════════
//  RAHU KAAL / YAMAGANDA / GULIKA — SHEHAR KE HISAAB SE
//
//  User ne kaha: "Delhi ka kya kaam, sabhi jagah ka alag alag hota hai."
//  Pehle ye fixed IST strings the (RAHUKAAL["0"] = "16:30 - 18:00"),
//  to Nagpur aur Chennai me bhi wahi time dikhta tha — galat.
//
//  Niyam: din ko 8 chhote bhag me baanto (Ravivaar=0… Shanivaar=6).
//  Har shehar me inme se ek bhag Rahu Kaal, ek Yamaganda, ek Gulika.
//  Pehla bhag us shehar ki SURYODAY se shuru hota hai — 6:00 se nahi.
// ════════════════════════════════════════════════════════════════════

// Ravivaar=0 … Shanivaar=6 → kis bhag par kaunsa kaal
const KAAL_SEG = {
  0: { rahu: 7, yama: 4, guli: 5 },
  1: { rahu: 1, yama: 2, guli: 3 },
  2: { rahu: 5, yama: 6, guli: 4 },
  3: { rahu: 6, yama: 0, guli: 2 },
  4: { rahu: 4, yama: 5, guli: 0 },
  5: { rahu: 3, yama: 1, guli: 6 },
  6: { rahu: 2, yama: 3, guli: 1 },
};

/**
 * Rahu Kaal / Yamaganda / Gulika ki windows, shehar ke hisaab se.
 * @param sunrise  minutes from midnight (local)
 * @param sunset   minutes from midnight
 * @param weekday  0 = Ravivaar … 6 = Shanivaar
 * @returns { rahu:{from,to,text}, yamaganda:{...}, gulika:{...} }
 */
export function kaalWindows(sunrise, sunset, weekday) {
  const day = sunset - sunrise;
  const seg = day / 8;
  const at = (i) => [sunrise + seg * i, sunrise + seg * (i + 1)];
  const pick = (key) => {
    const [from, to] = at(KAAL_SEG[weekday][key]);
    return { from, to, text: `${fmtMin(from)} – ${fmtMin(to)}` };
  };
  return { rahu: pick("rahu"), yamaganda: pick("yama"), gulika: pick("guli") };
}

/** Sirf ek: Rahu Kaal ka text. */
export function rahuKaalWindow(sunrise, sunset, weekday) {
  return kaalWindows(sunrise, sunset, weekday).rahu;
}
