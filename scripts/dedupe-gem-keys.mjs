// Purane CORRUPT (double-encoded) k_gem_/k_mu_/k_why_ lines ko
// PEHLE wala occurrence hata kar sahi wala rehne deta hai.
// Pichhli baar ka regex leading whitespace skip kar gaya tha, isliye
// duplicate keys ban gaye the — JS me aakhri jeetta hai, to corrupt jeetta tha.
import fs from "node:fs";

const TXT = "src/i18n/kundliFullTX.js";
const txt = fs.readFileSync(TXT, "utf8");

const lines = txt.split("\n");
const isTarget = (l) =>
  /^\s*(k_gem_[A-Za-z]+_(?:stone|metal|day|finger)|k_mu_[A-Za-z]+|k_why_[A-Za-z]+):/.test(l);

// double-encoded UTF-8 ka nishani: U+00C2/U+00C3 se aane wale akshar
const isCorrupt = (l) => /[\u00C2\u00C3]/.test(l);

let firstSeen = new Set();
let removedCorrupt = 0;
let removedDup = 0;

const out = lines.filter((l) => {
  if (!isTarget(l)) return true;

  const key = l.trim().match(/^([a-z0-9_]+):/i)[1];

  // pehla (corrupt) occurrence hata do
  if (isCorrupt(l)) { removedCorrupt++; return false; }

  // duplicate sahi occurrence bhi hata do (pehle wala rehne do)
  if (firstSeen.has(key)) { removedDup++; return false; }
  firstSeen.add(key);
  return true;
});

fs.writeFileSync(TXT, out.join("\n"), "utf8");
console.log(`${removedCorrupt} corrupt lines hataye, ${removedDup} duplicate hataye`);
console.log(`bache: ${firstSeen.size} sahi keys`);
