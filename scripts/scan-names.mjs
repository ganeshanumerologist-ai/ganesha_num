// Kahan-kahan astrology NAAM (rashi/graha/nakshatra/tithi/vaar/chog)
// seedha Latin text se render ho rahe hain — wo spots list karta hai.
//
// node scripts/scan-names.mjs
import { readFileSync, readdirSync } from "node:fs";

const NAMES = [
  // rashi
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula",
  "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
  // graha
  "Surya", "Chandra", "Mangal", "Budh", "Guru", "Shukra", "Shani", "Rahu", "Ketu",
  // nakshatra (sample — sab 27 nahi, pehle 12 kaafi hain signal ke liye)
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha",
  // vaar
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
  // paksha / choghadiya
  "Shukla", "Krishna", "Udveg", "Char", "Labh", "Amrit", "Rog",
];

const files = [];
for (const dir of ["src/pages", "src/components", "src/utils", "src/data", "src/i18n"]) {
  let list = [];
  try { list = readdirSync(dir); } catch { continue; }
  for (const f of list) if (f.endsWith(".jsx") || f.endsWith(".js")) files.push(`${dir}/${f}`);
}

let hits = 0;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  const found = [];
  lines.forEach((ln, i) => {
    // I18N dictionary files me naam allowed hain — wahi to source hai.
    if (file.startsWith("src/i18n/") || file.includes("names.js")) return;
    for (const n of NAMES) {
      // JSX me render: >Name<  ya {expr} jisme Name plain ho
      const re = new RegExp(`(^|[^\\w.])${n}([^\\w]|$)`);
      if (!re.test(ln)) continue;
      // ignore data definitions (RASHI_LORD keys etc.) aur comments
      const t = ln.trim();
      if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) continue;
      if (/^\s*["']?[A-Za-z ]+["']?\s*:/.test(t) && /[{[]/.test(t) === false) { /* fallthrough */ }
      found.push({ line: i + 1, name: n, text: t.slice(0, 96) });
      break;
    }
  });
  if (found.length) {
    hits += found.length;
    console.log(`\n[${file}]  ${found.length}`);
    for (const f of found.slice(0, 40)) console.log(`  L${String(f.line).padStart(4)}  ${f.text}`);
    if (found.length > 40) console.log(`  ... +${found.length - 40}`);
  }
}
console.log(`\nTOTAL name-leak candidates: ${hits}`);