import { kaalWindows, sunTimes } from "../src/utils/panchang.js";
import CITIES from "../src/data/cities.js";
import fs from "node:fs";

const lines = [];
const DATE = "2026-10-18";   // Ravivaar (Sunday)
const WD = new Date(DATE + "T12:00:00").getDay();

lines.push(`Tithi: ${DATE}  weekday=${WD} (0=Ravivaar)`);
lines.push("");
lines.push("  shehar        sunrise  sunset    Rahu Kaal      Yamaganda      Gulika Kaal");
lines.push("  " + "-".repeat(74));

const CITIES_WANTED = ["Delhi", "Nagpur", "Jaipur", "Chennai", "Kolkata", "Mumbai", "Guwahati", "Jalna", "Bhopal", "Lucknow"];
const rows = [];

for (const name of CITIES_WANTED) {
  const c = CITIES.find((x) => x[0] === name);
  if (!c) { lines.push(`  ${name.padEnd(12)} (shehar list me nahi)`); continue; }
  const sun = sunTimes(DATE, c[1], c[2]);
  const k = kaalWindows(sun.sunrise, sun.sunset, WD);
  rows.push({ name, sun, k });
  lines.push(
    `  ${name.padEnd(12)} ${String(sun.sunrise).padStart(6)}  ${String(sun.sunset).padStart(6)}   ` +
    `${k.rahu.text.padEnd(14)} ${k.yamaganda.text.padEnd(14)} ${k.gulika.text}`,
  );
}

// Delhi ke IST standard se compare
const RAHUKAAL_STD = { 0: "16:30 – 18:00", 1: "07:30 – 09:00", 2: "15:00 – 16:30", 3: "12:00 – 13:30", 4: "13:30 – 15:00", 5: "10:30 – 12:00", 6: "09:00 – 10:30" };
lines.push("");
lines.push(`  Purana fixed IST (Ravivaar): ${RAHUKAAL_STD[WD]}`);
lines.push("  ↑ Ye SAHI shehar ka IST standard hai. Baaki shehar me ye galat hota tha.");

const uniq = new Set(rows.map((r) => r.k.rahu.text));
lines.push("");
lines.push(`  ${rows.length} shehar me ${uniq.size} alag Rahu Kaal — matlab shehar ka asar dikhta hai ✅`);

fs.writeFileSync("scripts/_kaal.txt", lines.join("\n"), "utf8");
console.log(lines.join("\n"));
