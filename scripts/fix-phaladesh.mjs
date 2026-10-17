// Brand spelling: "फलादेश" (phaladesh)
//
// Problem: nav me Hindi me "फलदेश" (आ missing) aur Marathi me "फळदेश"
// aa raha tha. User ne sahi maanga: "फलादेश" — दोनो bhasha me.
// (Reports.jsx me pehle se "फलादेश" sahi tha, sirf nav galat tha.)
import fs from "node:fs";

const FILE = "src/i18n/translations.js";
let src = fs.readFileSync(FILE, "utf8");

// bhasha -> galat value -> sahi value
const FIX = {
  hi: [["फलदेश", "फलादेश"]],
  mr: [["फळदेश", "फलादेश"]],
  pa: [["ਫਲਦੇਸ਼", "ਫਲਾਦੇਸ਼"]],
};

const lines = src.split("\n");
// translations.js me har bhasha ka block pata chalega:
// jis line me "nav_phaladesh" hai, us block ki language pehle dhundho
const BLOCK = /^  ([a-z]{2,4}): \{/;

// language -> line index ranges
let cur = null;
const ranges = {};
lines.forEach((l, i) => {
  const m = l.match(BLOCK);
  if (m) cur = m[1];
  if (cur && !ranges[cur]) ranges[cur] = [];
  if (cur) ranges[cur].push(i);
});

let fixed = 0;
const log = [];
for (const [lang, pairs] of Object.entries(FIX)) {
  const idxs = ranges[lang] || [];
  for (const [wrong, right] of pairs) {
    let hit = 0;
    for (const i of idxs) {
      if (!lines[i].includes("nav_phaladesh")) continue;
      if (!lines[i].includes(wrong)) continue;
      lines[i] = lines[i].split(wrong).join(right);
      hit++; fixed++;
    }
    log.push(`  ${lang.padEnd(4)} ${wrong} → ${right}  (${hit} jagah)`);
  }
}

fs.writeFileSync(FILE, lines.join("\n"), "utf8");
console.log(log.join("\n"));
console.log(`\n${fixed} jagah theek`);