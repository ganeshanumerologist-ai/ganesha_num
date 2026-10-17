// add-gem-keys-all.mjs me ek line me nested double-quote aa gayi thi
// ("kyun" string ke andar) — use theek karta hai.
import fs from "node:fs";

const F = "scripts/add-gem-keys-all.mjs";
const lines = fs.readFileSync(F, "utf8").split("\n");

let n = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("ratna + muhurat + gem")) {
    lines[i] = "  const line = NEWLINE + \"  // ratna + muhurat + gem reason (naya feature)\" + NEWLINE + \"  \"";
    n++;
  }
}

// NEWLINE constant define karo (us file me, block() se pehle)
if (!lines.some((l) => l.includes("const NEWLINE"))) {
  const at = lines.findIndex((l) => l.startsWith("const FIELDS"));
  lines.splice(at, 0, "const NEWLINE = String.fromCharCode(10);", "");
}

fs.writeFileSync(F, lines.join("\n"), "utf8");
console.log(`${n} line fix hui, NEWLINE constant add hua`);
