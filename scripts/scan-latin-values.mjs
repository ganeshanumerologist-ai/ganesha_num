import fs from "node:fs";
const src = JSON.parse(fs.readFileSync("scripts/small-lang-source.json", "utf8"));

console.log("=== jin values me Latin hai (brand/technical — translate NAHI karna) ===");
const keep = [];
for (const [grp, d] of Object.entries(src)) {
  for (const [k, v] of Object.entries(d)) {
    if (/[A-Za-z]/.test(String(v))) keep.push({ grp, k, v });
  }
}
for (const x of keep) console.log(`  ${x.grp}.${x.k}`.padEnd(38), JSON.stringify(x.v).slice(0, 70));
console.log(`\ntotal ${keep.length} / 326 values me Latin hai`);

// numbers / punctuation sirf?
const onlyNum = keep.filter((x) => /^[\s\d:.,–—()/%+-]*[A-Za-z0-9\s:.,–—()/%+-]*$/.test(x.v));
console.log("\n=== inme se koi 'sirf number/technical' jaisa hai? ===");
for (const x of onlyNum) console.log("  " + x.grp + "." + x.k, "=", JSON.stringify(x.v));