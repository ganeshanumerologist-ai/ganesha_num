// Gana (Dev / Manushya / Rakshas) kahan se aata hai — ye astro engine me
// nahi tha. Nakshatra ke hisaab se standard table hai.
import { nakshatraOf } from "../src/utils/astro.js";
import { nakName } from "../src/i18n/names.js";
import fs from "node:fs";

// index 0 = Ashwini … 26 = Revati
const GANA = [
  "Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva", "Deva",
  "Rakshasa", "Rakshasa", "Manushya", "Deva", "Deva", "Rakshasa", "Deva", "Rakshasa",
  "Deva", "Rakshasa", "Rakshasa", "Manushya", "Deva", "Deva", "Rakshasa", "Rakshasa",
  "Manushya", "Deva", "Deva",
];

const lines = [];
lines.push("Nakshatra index → Gana");
lines.push("");
lines.push("  #   nakshatra (hi)          gana");
lines.push("  " + "-".repeat(46));
for (let i = 0; i < 27; i++) {
  lines.push(`  ${String(i).padStart(2)}   ${nakName(i, "hi").padEnd(22)} ${GANA[i]}`);
}
const cnt = GANA.reduce((a, g) => { a[g] = (a[g] || 0) + 1; return a; }, {});
lines.push("");
lines.push(`  Deva ${cnt.Deva} · Manushya ${cnt.Manushya} · Rakshasa ${cnt.Rakshasa} = ${27}`);
lines.push(cnt.Deva === 12 && cnt.Manushya === 6 && cnt.Rakshasa === 9 ? "  ✅ count sahi" : "  ❌ count galat");

// ek real nakshatra se verify
const n = nakshatraOf(280.5);
lines.push("");
lines.push(`  nakshatraOf(280.5°) = ${n.name} (index ${n.index}) → ${GANA[n.index]}`);

fs.writeFileSync("scripts/_gana.txt", lines.join("\n"), "utf8");
console.log(lines.join("\n"));
