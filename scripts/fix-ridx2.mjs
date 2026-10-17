// KundliChart.jsx L473 par rIdx() use hota hai lekin uska import kabhi
// add nahi hua. Pichhle script me condition `!s.includes("rIdx")" thi —
// jo call-sites dekh ke false ho jaati thi, isliye import skip ho gaya.
import fs from "node:fs";

const F = "src/components/KundliChart.jsx";
let s = fs.readFileSync(F, "utf8");

if (/^import\s*\{[^}]*\brIdx\b[^}]*\}\s*from/m.test(s)) {
  console.log("rIdx import pehle se hai");
} else {
  const ANCHOR = 'import { RASHIS } from "../utils/astro.js";';
  if (!s.includes(ANCHOR)) {
    console.log("!! anchor nahi mila");
    process.exit(1);
  }
  // RASHIS already import hai — usi line me rIdx bhi daal do
  s = s.replace(
    ANCHOR,
    'import { RASHIS } from "../utils/astro.js";\nimport { rIdx } from "../utils/rashiHelper.js";',
  );
  fs.writeFileSync(F, s, "utf8");
  console.log("rIdx import add ho gaya");
}

// verify: har rIdx() call ka ek import hai
const calls = (s.match(/\brIdx\(/g) || []).length;
const imports = (s.match(/import\s*\{[^}]*\brIdx\b/g) || []).length;
console.log(`rIdx() calls: ${calls} | imports: ${imports}`);
console.log(calls > 0 && imports > 0 ? "OK" : "STILL BROKEN");
