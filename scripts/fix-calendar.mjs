// Calendar <lang>.js files ka closing-brace fix + verification.
// Agent ne `guide: { ... },` ko `],` se band kar diya tha — ye script use theek karti hai.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const DIR = "src/data/calendar";
let fixed = [];
for (const f of readdirSync(DIR)) {
  if (!f.endsWith(".js")) continue;
  const p = `${DIR}/${f}`;
  const src = readFileSync(p, "utf8");
  const before = src;
  // last non-empty line "  ]," + "};"  ->  "  }," + "};"
  // (CRLF-safe: line break ke beech \r bhi ho sakta hai)
  const fixedSrc = src.replace(/(\r?\n)[ ]*\]\r?\n\};(\r?\n)?\s*$/, "$1  },$1};$2");
  if (fixedSrc !== before) {
    writeFileSync(p, fixedSrc);
    fixed.push(f);
  }
}
console.log(fixed.length ? `fixed: ${fixed.join(", ")}` : "no closing-brace bug found");

// ab syntax check
let bad = 0;
for (const f of readdirSync(DIR)) {
  if (!f.endsWith(".js")) continue;
  try {
    await import(`../${DIR}/${f}`);
  } catch (e) {
    bad++;
    console.log(`[SYNTAX FAIL] ${f}: ${e.message.slice(0, 90)}`);
  }
}
console.log(`syntax: ${bad === 0 ? "all OK" : bad + " broken"}`);