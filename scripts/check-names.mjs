import * as n from "../src/i18n/names.js";
import { RATNA } from "../src/data/jyotish.js";

console.log("=== names.js me localization (hi) ===");
console.log("  grahaName(Sun, hi)     :", n.grahaName("Sun", "hi"));
console.log("  grahaName(Jupiter, hi)  :", n.grahaName("Jupiter", "hi"));
console.log("  grahaName(Saturn, hi)   :", n.grahaName("Saturn", "hi"));
console.log("  rashiName(10, hi)       :", n.rashiName(10, "hi"));
console.log("  rashiName(0, hi)        :", n.rashiName(0, "hi"));
console.log("  nakName(0, hi)          :", n.nakName(0, "hi"));
console.log("  vaarName(0, hi)         :", n.vaarName(0, "hi"));
console.log("  tithiName(3, hi)        :", n.tithiName(3, "hi"));
console.log("  pakshaName(Shukla, hi)  :", n.pakshaName("Shukla", "hi"));

console.log("\n=== RATNA (jyotish.js) — English me hai? ===");
console.log("  RATNA.Surya :", JSON.stringify(RATNA.Surya));
console.log("  RATNA.Chandra:", JSON.stringify(RATNA.Chandra));
console.log("  RATNA.Shani :", JSON.stringify(RATNA.Shani));

console.log("\n=== RASHIS (astro.js) ===");
import { RASHIS } from "../src/utils/astro.js";
console.log("  " + RASHIS.join(", "));

console.log("\n=== keys kya-kya hain? ===");
const missing = ["Stone", "stone", "GRAHA", "RASHI", "MUHURT"];
for (const m of missing) {
  console.log(`  names.js me "${m}":`, m in n ? "haan" : "nahi");
}
console.log("  names.js exports:", Object.keys(n).filter((k) => typeof n[k] === "function").join(", "));
