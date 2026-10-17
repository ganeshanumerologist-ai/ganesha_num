import fs from "node:fs";

const F = "src/utils/kundliFull.js";
const lines = fs.readFileSync(F, "utf8").split("\n");

// purana hata do (dobara chalane par duplicate na ho)
const old = lines.findIndex((l) => l.trim().startsWith("glance: birthGlance("));
if (old >= 0) { lines.splice(old, 1); console.log("purana glance hata di"); }

// varshphal line dhundho — dhyan do: "varshphal", "varshpal" nahi
const i = lines.findIndex((l) => l.trim().startsWith("varshphal: varshphalScope("));
if (i < 0) {
  console.log("!! nahi mila. Jo hai wo:");
  lines.forEach((l, k) => { if (l.includes("varsh")) console.log(`  ${k + 1}: ${JSON.stringify(l)}`); });
  process.exit(1);
}

lines.splice(i, 0,
  "    // 0. JANM KI JHALAK - rashi, nakshatra, gana, vara. Ye upar",
  "    //    result ke niche dikhti hai; pehle sirf neeche scroll karne",
  "    //    par milti thi, isliye user ko laga chart hi nahi hai.",
  "    glance: birthGlance(lagIdx, lons, nak, tithi, yoga, karana, wd, lagLon !== null),",
  "",
);
fs.writeFileSync(F, lines.join("\n"), "utf8");
console.log(`glance insert hui, line ${i + 1}`);
