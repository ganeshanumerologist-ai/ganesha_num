// Panchang engine test
// node scripts/test-panchang.mjs
import {
  sunTimes, fmtMin, vikramSamvat, samvatsaraName, shakaSamvat,
  tithiAt, nakshatraAt, sthanikSamay,
} from "../src/utils/panchang.js";

console.log("=== Suryodaya / Suyast ===");
for (const [city, lat, lon] of [["Delhi", 28.61, 77.21], ["Mumbai", 19.08, 72.88], ["Chennai", 13.08, 80.27], ["Kolkata", 22.57, 88.36]]) {
  const s = sunTimes("2026-10-15", lat, lon);
  console.log(`  ${city.padEnd(9)} suryodaya ${fmtMin(s.sunrise)}  suyast ${fmtMin(s.sunset)}  daylight ${(s.dayLength/60).toFixed(1)} ghante`);
}

console.log("\n=== Samvatsara (shath) ===");
for (const y of [2024, 2025, 2026, 2027]) {
  console.log(`  ${y}: ${samvatsaraName(y)}  | Shaka ${shakaSamvat(y)} | Vikram ${vikramSamvat(`${y}-06-15`)}`);
}

console.log("\n=== Tithi / Nakshatra sanity ===");
for (const d of ["2026-10-15", "2026-01-15", "2026-07-04"]) {
  const t = tithiAt(d, 12);
  const n = nakshatraAt(d, 12);
  console.log(`  ${d}: ${t.paksha} tithi ${t.n} (idx ${t.index}) | ${n.name} pada ${n.pada}`);
}

console.log("\n=== Sthanik Samay ===");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
for (let d = 0; d < 7; d++) console.log(`  ${days[d].padEnd(10)}: ${sthanikSamay(d).join(" | ")}`);

// Known check: Amrit Kaal happens ~few times a year; Shravana Purnima etc.
console.log("\n=== Amrit Kaal scan (2026, janma nakshatra varies) ===");
import { amritKaal } from "../src/utils/panchang.js";
let found = 0;
for (let day = 1; day <= 365 && found < 5; day++) {
  const dt = new Date(2026, 0, day + 1);
  const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  // har janma nakshatra try karo
  for (let jn = 0; jn < 27 && found < 5; jn++) {
    const a = amritKaal(iso, jn, 0);
    if (a.exists) {
      console.log(`  ${iso} janma-nak ${jn}: ${fmtMin(a.from)} - ${fmtMin(a.to)}`);
      found++;
      break;
    }
  }
}
console.log(`  (kuch dhoonde: ${found})`);
console.log("\nDone.");