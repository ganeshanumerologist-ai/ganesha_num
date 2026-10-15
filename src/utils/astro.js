// Vedic astro engine — low-precision planetary math (Schlyter-style).
// Rashi/nakshatra/tithi ke liye paryaapt (~1-2°). Seema-rekha par 1 din ka antar sambhav.
const RAD = Math.PI / 180;

export function rev(x) {
  return x - Math.floor(x / 360) * 360;
}

export function julianDay(y, m, d, hourUTC = 0) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + hourUTC / 24;
}

export function jdFromDateStr(dateStr, hourIST = 12) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return julianDay(y, m, d, hourIST - 5.5);
}

export function lahiriAyanamsa(jd) {
  const year = 2000 + (jd - 2451545) / 365.25;
  return 23.853 + (year - 2000) * 0.01397;
}

export function sunTropical(jd) {
  const T = (jd - 2451545) / 36525;
  const L0 = rev(280.46646 + 36000.76983 * T);
  const M = rev(357.52911 + 35999.05029 * T);
  const C =
    (1.914602 - 0.004817 * T) * Math.sin(M * RAD) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * RAD) +
    0.000289 * Math.sin(3 * M * RAD);
  return rev(L0 + C);
}

// Chandrama (tropical), ~0.3° accuracy
export function moonTropical(jd) {
  const d = jd - 2451543.5;
  const Ms = rev(356.047 + 0.9856002585 * d);
  const Mm = rev(115.3654 + 13.0649929509 * d);
  const Nm = rev(125.1228 - 0.0529538083 * d);
  const w = rev(318.0634 + 0.1643573223 * d);
  const Lm = rev(Nm + w + Mm);
  const Ls = rev(w + 282.9404 + Ms); // approx mean sun
  const D = rev(Lm - Ls);
  const F = rev(Lm - Nm);
  let lon =
    Lm +
    -1.274 * Math.sin((Mm - 2 * D) * RAD) +
    0.658 * Math.sin(2 * D * RAD) -
    0.186 * Math.sin(Ms * RAD) -
    0.059 * Math.sin((2 * Mm - 2 * D) * RAD) -
    0.057 * Math.sin((Mm - 2 * D + Ms) * RAD) +
    0.053 * Math.sin((Mm + 2 * D) * RAD) +
    0.046 * Math.sin((2 * D - Ms) * RAD) +
    0.041 * Math.sin((Mm - Ms) * RAD) -
    0.035 * Math.sin(D * RAD) -
    0.031 * Math.sin((Mm + Ms) * RAD) -
    0.015 * Math.sin((2 * F - 2 * D) * RAD) +
    0.011 * Math.sin((Mm - 4 * D) * RAD);
  return rev(lon);
}

const PLANETS = {
  Mercury: { N: 48.3313, Nc: 3.24587e-5, i: 7.0047, ic: 5e-6, w: 29.1241, wc: 1.01444e-5, a: 0.387098, e: 0.205635, ec: 5.59e-10, M: 168.6562, Mc: 4.0923344368 },
  Venus: { N: 76.6799, Nc: 2.4659e-5, i: 3.3946, ic: 2.75e-6, w: 54.891, wc: 1.38374e-5, a: 0.723330, e: 0.006773, ec: -1.302e-9, M: 48.0052, Mc: 1.6021304744 },
  Mars: { N: 49.5574, Nc: 2.11081e-5, i: 1.8497, ic: -1.78e-8, w: 286.5016, wc: 2.92961e-5, a: 1.523688, e: 0.093405, ec: 2.516e-9, M: 18.6021, Mc: 0.5240207766 },
  Jupiter: { N: 100.4542, Nc: 2.76854e-5, i: 1.303, ic: -1.557e-7, w: 273.8777, wc: 1.64505e-5, a: 5.20256, e: 0.048498, ec: 4.469e-9, M: 19.895, Mc: 0.0830853001 },
  Saturn: { N: 113.6634, Nc: 2.3898e-5, i: 2.4886, ic: -1.081e-7, w: 339.3939, wc: 2.97661e-5, a: 9.55475, e: 0.055546, ec: -9.499e-9, M: 316.967, Mc: 0.0334442282 },
};

function helio(el, d) {
  const N = el.N + el.Nc * d;
  const i = el.i + el.ic * d;
  const w = el.w + el.wc * d;
  const a = el.a;
  const e = el.e + el.ec * d;
  const M = rev(el.M + el.Mc * d);
  let E = M + (e * Math.sin(M * RAD) * (1 + e * Math.cos(M * RAD))) / RAD;
  for (let k = 0; k < 8; k++) {
    E = E - (E - (e / RAD) * Math.sin(E * RAD) - M) / (1 - e * Math.cos(E * RAD));
  }
  const xv = a * (Math.cos(E * RAD) - e);
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E * RAD);
  const v = rev(Math.atan2(yv, xv) / RAD);
  const r = Math.sqrt(xv * xv + yv * yv);
  const xh = r * (Math.cos(N * RAD) * Math.cos((v + w) * RAD) - Math.sin(N * RAD) * Math.sin((v + w) * RAD) * Math.cos(i * RAD));
  const yh = r * (Math.sin(N * RAD) * Math.cos((v + w) * RAD) + Math.cos(N * RAD) * Math.sin((v + w) * RAD) * Math.cos(i * RAD));
  return { xh, yh };
}

export function planetTropical(name, jd) {
  const d = jd - 2451543.5;
  const p = helio(PLANETS[name], d);
  const e = helio({ N: 0, Nc: 0, i: 0, ic: 0, w: 282.9404, wc: 4.70935e-5, a: 1.0, e: 0.016709, ec: -1.151e-9, M: 356.047, Mc: 0.9856002585 }, d);
  const xg = p.xh + e.xh;
  const yg = p.yh + e.yh;
  return rev(Math.atan2(yg, xg) / RAD);
}

export function rahuTropical(jd) {
  const T = (jd - 2451545) / 36525;
  return rev(125.04452 - 1934.136261 * T);
}

export const toSidereal = (trop, jd) => rev(trop - lahiriAyanamsa(jd));

// Lagna (tropical) — janm-samay (IST) + sthan (lat/lon) se
export function ascendantTropical(jdUTC, latDeg, lonDeg) {
  const T = (jdUTC - 2451545) / 36525;
  const gmst = rev(280.46081837 + 360.98564736629 * (jdUTC - 2451545) + 0.000387933 * T * T);
  const lst = rev(gmst + lonDeg);
  const H = lst * RAD;
  const e = 23.4393 * RAD;
  const lat = latDeg * RAD;
  const asc = Math.atan2(Math.cos(H), -(Math.sin(H) * Math.cos(e) + Math.tan(lat) * Math.sin(e))) / RAD;
  return rev(asc);
}

export function lagnaSidereal(dateStr, timeStr, lat, lon) {
  const [hh, mm] = (timeStr || "12:00").split(":").map(Number);
  const [y, m, d] = dateStr.split("-").map(Number);
  const jd = julianDay(y, m, d, hh + mm / 60 - 5.5);
  return rev(ascendantTropical(jd, lat, lon) - lahiriAyanamsa(jd));
}

// Navamsha (D9), Dashamsha (D10), Dwadasamsha (D12) — rashi naam
export function navamshaSign(sidLon) {
  const s = rashiIndex(sidLon);
  const pada = Math.floor((rev(sidLon) % 30) / (30 / 9));
  const base = [0, 3, 6, 9].includes(s) ? 0 : [1, 4, 7, 10].includes(s) ? 8 : 4;
  return RASHIS[(s + base + pada) % 12];
}

export function dashamshaSign(sidLon) {
  const s = rashiIndex(sidLon);
  const pada = Math.floor((rev(sidLon) % 30) / 3);
  const odd = s % 2 === 0;
  return RASHIS[(s + (odd ? pada : 8 - pada) + 24) % 12];
}

export function dwadasamshaSign(sidLon) {
  const s = rashiIndex(sidLon);
  const pada = Math.floor((rev(sidLon) % 30) / 2.5);
  return RASHIS[(s + pada) % 12];
}

export const GRAHA_ABBR = { Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के" };

// Hora (D2): sam rashi — pehla aadha Karka, doosra Simha; visham ulat
export function horaSign(sidLon) {
  const s = rashiIndex(sidLon);
  const half = rev(sidLon) % 30 < 15 ? 0 : 1;
  const odd = s % 2 === 0;
  const idx = odd ? (half === 0 ? 3 : 4) : half === 0 ? 4 : 3;
  return RASHIS[idx];
}

// Drekkana (D3): 0-10° same, 10-20° 5th, 20-30° 9th
export function drekkanaSign(sidLon) {
  const s = rashiIndex(sidLon);
  const pada = Math.floor((rev(sidLon) % 30) / 10);
  return RASHIS[(s + pada * 4) % 12];
}

// Saptamsha (D7): sam se, visham 7ve se
export function saptamshaSign(sidLon) {
  const s = rashiIndex(sidLon);
  const pada = Math.floor((rev(sidLon) % 30) / (30 / 7));
  const odd = s % 2 === 0;
  return RASHIS[(s + (odd ? pada : 6 + pada)) % 12];
}

export function isRetrograde(name, jd) {
  const a = name === "Rahu" ? rahuTropical(jd) : name === "Sun" || name === "Moon" ? null : planetTropical(name, jd);
  if (a === null) return false;
  const b = name === "Rahu" ? rahuTropical(jd + 2) : planetTropical(name, jd + 2);
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

export const RASHIS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
export const rashiOf = (sidLon) => RASHIS[Math.floor(rev(sidLon) / 30) % 12];
export const rashiIndex = (sidLon) => Math.floor(rev(sidLon) / 30) % 12;

export const NAKSHATRAS = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purvashadha", "Uttarashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
export const nakshatraOf = (sidLon) => {
  const s = rev(sidLon);
  const idx = Math.floor(s / (360 / 27)) % 27;
  const pada = Math.floor((s % (360 / 27)) / (360 / 108)) + 1;
  return { index: idx, name: NAKSHATRAS[idx], pada, frac: (s % (360 / 27)) / (360 / 27) };
};

const TITHI_NAMES = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"];
export function tithiOf(sunTrop, moonTrop) {
  const elong = rev(moonTrop - sunTrop);
  const n = Math.floor(elong / 12) + 1; // 1..30
  const paksha = n <= 15 ? "Shukla" : "Krishna";
  return { n, paksha, name: TITHI_NAMES[(n - 1) % 15] };
}

const YOGAS = ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
export const yogaOf = (sunTrop, moonTrop) => YOGAS[Math.floor(rev(sunTrop + moonTrop) / (360 / 27)) % 27];

export function karanaOf(sunTrop, moonTrop) {
  const h = Math.floor(rev(moonTrop - sunTrop) / 6); // 0..59
  if (h < 56) return ["Bav", "Balav", "Kaulav", "Taitil", "Gar", "Vanij", "Vishti"][h % 7];
  return ["Shakuni", "Chatushpada", "Nag", "Kimstughna"][h - 56];
}

const TARA = ["Janma", "Sampat", "Vipat", "Kshema", "Pratyari", "Sadhaka", "Vadha", "Mitra", "Parama Mitra"];
// 2,4,6,8,9 shubh
export function taraBala(birthNakIdx, eventNakIdx) {
  const n = ((eventNakIdx - birthNakIdx) % 9 + 9) % 9 + 1;
  return { n, name: TARA[n - 1], shubh: [2, 4, 6, 8, 9].includes(n) };
}

// Poore din ka panchang (IST dopahar ke grah-sthiti se)
export function panchang(dateStr) {
  const jd = jdFromDateStr(dateStr, 12);
  const sun = sunTropical(jd);
  const moon = moonTropical(jd);
  const aya = lahiriAyanamsa(jd);
  const sunS = rev(sun - aya);
  const moonS = rev(moon - aya);
  const nak = nakshatraOf(moonS);
  return {
    sunTrop: sun, moonTrop: moon,
    suryaRashi: rashiOf(sunS),
    chandraRashi: rashiOf(moonS),
    nakshatra: nak,
    tithi: tithiOf(sun, moon),
    yoga: yogaOf(sun, moon),
    karana: karanaOf(sun, moon),
  };
}

// Kisi tarikh ko grahon ki sthiti (sidereal rashi + vakri)
export function grahaSthiti(dateStr) {
  const jd = jdFromDateStr(dateStr, 12);
  const out = {};
  const names = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  for (const n of names) {
    const trop = n === "Sun" ? sunTropical(jd) : n === "Moon" ? moonTropical(jd) : planetTropical(n, jd);
    const sid = rev(trop - lahiriAyanamsa(jd));
    out[n] = { lon: Math.round(sid * 10) / 10, rashi: rashiOf(sid), rashiIdx: rashiIndex(sid), vakri: isRetrograde(n, jd) };
  }
  const rahuSid = rev(rahuTropical(jd) - lahiriAyanamsa(jd));
  out.Rahu = { lon: Math.round(rahuSid * 10) / 10, rashi: rashiOf(rahuSid), rashiIdx: rashiIndex(rahuSid), vakri: true };
  const ketuSid = rev(rahuSid + 180);
  out.Ketu = { lon: Math.round(ketuSid * 10) / 10, rashi: rashiOf(ketuSid), rashiIdx: rashiIndex(ketuSid), vakri: true };
  return out;
}

export default { panchang, grahaSthiti, taraBala };
