// In 16 me se kitne REAL hain? Har ek ka exact context dikhaata hoon.
import fs from "node:fs";
import path from "node:path";

const FILES = [
  "src/data/remedies/pa.js", "src/data/remedies/ta.js", "src/data/remedies/te.js",
  "src/data/remedies/ur.js", "src/data/remediesTX.js",
  "src/utils/loshuYog.js", "src/utils/rashiHelper.js",
];

for (const f of FILES) {
  const src = fs.readFileSync(f, "utf8");
  const lines = src.split("\n");
  console.log(`\n═══ ${f} ═══`);
  for (const name of ["grahaName", "reduceNumber", "rashiIndex"]) {
    lines.forEach((l, i) => {
      const re = new RegExp(`(?<![\\w.$])${name}\\s*\\(`, "g");
      if (!re.test(l)) return;
      const isString = /["'`].*\(\s*$/.test(l) || /^\s*(\/\/|\*)/.test(l);
      console.log(`  ${isString ? "STRING/CMT" : "REAL CODE "} L${i + 1}: ${l.trim().slice(0, 88)}`);
    });
  }
  const hasImport = /import\s*\{[^}]*(grahaName|reduceNumber|rashiIndex)/.test(src);
  console.log(`  → import present: ${hasImport}`);
}
