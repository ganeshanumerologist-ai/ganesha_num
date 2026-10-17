// Panchang ka shehar-aware times — jaanch.
// Check karta hai:
//   1. Abhijit / Godhuli / Hora / Choghadiya shehar ke saath badle
//   2. Sunrise/sunset sahi shehar ke hisaab se aaye
//   3. Koi static Delhi time bacha na ho
//   4. 6:00-18:00 jaisa fixed range nahi reh gaya ho
import { sunTimes, abhijitWindow, godhuliWindow, horaFromSunrise, choghadiyaFromSunrise, fmtMin } from "../src/utils/panchang.js";
import cities from "../src/data/cities.js";

const D = "2026-10-17";
const flat = cities;

const find = (n) => flat.find((x) => x[0] === n);
if (!find("Jalna")) { console.log("[FAIL] Jalna sheher ki list me nahi hai"); process.exit(1); }

const CITIES = ["Delhi", "Nagpur", "Wardha", "Mumbai", "Jalna", "Chennai", "Kolkata", "Guwahati"];
const rows = [];
for (const name of CITIES) {
  const e = find(name);
  const s = sunTimes(D, e[1], e[2]);
  const ab = abhijitWindow(s.sunrise, s.dayLength);
  const gd = godhuliWindow(s.sunset);
  const h0 = horaFromSunrise(s.sunrise);
  const ch = choghadiyaFromSunrise(s.sunrise, s.sunset);
  rows.push({
    name,
    sr: fmtMin(s.sunrise),
    ss: fmtMin(s.sunset),
    abhijit: `${fmtMin(ab.from)}-${fmtMin(ab.to)}`,
    godhuli: `${fmtMin(gd.from)}-${fmtMin(gd.to)}`,
    hora1: fmtMin(h0[0].from),
    chog1: `${fmtMin(ch[0].from)}-${fmtMin(ch[0].to)}`,
    chog8: `${fmtMin(ch[7].from)}-${fmtMin(ch[7].to)}`,
    // sanity
    hora24ends: fmtMin(h0[23].to),
    chogCovers: Math.abs(ch[7].to - s.sunset) < 0.01 && Math.abs(ch[0].from - s.sunrise) < 0.01,
  });
}

console.log(`${D}\n`);
console.log("Shehar      sunrise sunset  Abhijit       Godhuli       Hora-1  Chog-1           Chog-8");
for (const r of rows) {
  console.log(
    r.name.padEnd(11), r.sr.padEnd(6), r.ss.padEnd(6),
    r.abhijit.padEnd(13), r.godhuli.padEnd(13),
    r.hora1.padEnd(6), r.chog1.padEnd(16), r.chog8,
  );
}

let fails = 0;
const bad = (m) => { fails++; console.log("\n  [FAIL] " + m); };

// 1. har shehar ka sunrise alag hona chahiye
const sr = new Set(rows.map((r) => r.sr));
if (sr.size < 5) bad(`sirf ${sr.size} alag sunrise — shehar apply nahi ho raha`);

// 2. Delhi vs Mumbai vs Chennai me kaafi farq
const d = rows[0], m = rows[3], c = rows[5];
const mins = (a, b) => {
  const [ah, am] = a.split(":").map(Number); const [bh, bm] = b.split(":").map(Number);
  return Math.abs(ah * 60 + am - (bh * 60 + bm));
};
if (mins(d.abhijit.slice(0, 5), m.abhijit.slice(0, 5)) < 10) bad("Delli aur Mumbai ka Abhijit almost same");
if (mins(d.sr, c.sr) < 10) bad("Delhi aur Chennai ka sunrise almost same");

// 3. Choghadiya suryodaya se suryast tak poori tarah
for (const r of rows) if (!r.chogCovers) bad(`${r.name}: Choghadiya suryodaya-suryast cover nahi karti`);

// 4. Hora 24 ghante, sunrise se
if (rows.some((r) => r.hora1 !== r.sr)) bad("Hora suryodaya se shuru nahi ho raha");

// 5. koi static Delhi value nahi bachna chahiye
const delhiLike = rows.filter((r) => r.name !== "Delhi" && (r.sr === "06:38" || r.abhijit.startsWith("11:48")));
if (delhiLike.length) bad(`${delhiLike.map((r) => r.name).join(", ")} par ab bhi Delhi ka time hai`);

console.log(fails ? `\n${fails} problem` : "\nSAARE SHEHAR KA APNA TIME HAI ✅");
process.exit(fails ? 1 : 0);