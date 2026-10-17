// rIdx() dependency hata dete hain — RASHIS.indexOf() seedha.
// Bundle me "rIdx is not defined" aa raha tha; isse ek kam ho gaya.
import fs from "node:fs";

const F = "src/pages/Kundli.jsx";
let s = fs.readFileSync(F, "utf8");

// 1. import badlo
const I_OLD = 'import { rIdx } from "../utils/rashiHelper.js";';
const I_NEW = 'import { RASHIS } from "../utils/astro.js";';
if (s.includes(I_OLD)) { s = s.replace(I_OLD, I_NEW); console.log("import badla"); }
else console.log("!! import nahi mila");

// 2. har rIdx(x) → RASHI_IDX(x) aur ek local helper banao
const COUNT = (s.match(/rIdx\(/g) || []).length;
s = s.replace(/rIdx\(/g, "RASHI_IDX(");
console.log(`${COUNT} rIdx() call replace hue`);

// 3. helper define karo (module top-level, BirthEyes se pehle)
const ANCHOR = "/**\n * Janm ki jhalak";
if (!s.includes("function RASHI_IDX(")) {
  s = s.replace(
    ANCHOR,
    "/** Rashi naam → index. RASHIS array astro.js se. */\n"
    + "const RASHI_IDX = (name) => RASHIS.indexOf(name);\n\n"
    + ANCHOR,
  );
  console.log("RASHI_IDX helper add hua");
}

fs.writeFileSync(F, s, "utf8");
