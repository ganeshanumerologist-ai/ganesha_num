// Saare pages ke hi/mr blocks me Hinglish (pure-Latin) strings dhoondo.
// node scripts/scan-hinglish.mjs
import { readFileSync, readdirSync } from "node:fs";

function findBlock(lines, lang) {
  const re = new RegExp(`^\\s{2,6}${lang}:\\s*\\{`);
  const start = lines.findIndex((l) => re.test(l));
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === "{") depth++;
      else if (ch === "}") { depth--; if (depth === 0) return [start, i]; }
    }
  }
  return null;
}

let total = 0;
const files = readdirSync("src/pages").filter((f) => f.endsWith(".jsx")).sort();

for (const f of files) {
  const lines = readFileSync("src/pages/" + f, "utf8").split(/\r?\n/);
  for (const lang of ["hi", "mr"]) {
    const span = findBlock(lines, lang);
    if (!span) continue;
    const hits = [];
    // (a) Object values — sirf hi/mr block ke andar
    for (let i = span[0]; i <= span[1]; i++) {
      const re = /:\s*"([^"]{12,})"/g;
      let m;
      while ((m = re.exec(lines[i])) !== null) {
        const v = m[1];
        if (!/[\u0900-\u0DFF\u0600-\u06FF]/.test(v) && (v.match(/[A-Za-z]{3,}/g) || []).length) {
          hits.push(`L${i + 1}: ${v.slice(0, 55)}`);
        }
      }
    }
    // (b) Ternaries — poori file me (JSX me bhi hoti hain)
    for (let i = 0; i < lines.length; i++) {
      const re2 = /lang === "(hi|mr)"\s*\?\s*"([^"]{10,})"/g;
      let m2;
      while ((m2 = re2.exec(lines[i])) !== null) {
        const v = m2[2];
        if (!/[\u0900-\u0DFF\u0600-\u06FF]/.test(v) && (v.match(/[A-Za-z]{3,}/g) || []).length) {
          hits.push(`L${i + 1} [ternary]: ${v.slice(0, 55)}`);
        }
      }
    }
    if (hits.length) {
      total += hits.length;
      console.log(`\n${f} [${lang}] — ${hits.length} Hinglish`);
      for (const h of hits) console.log("   " + h);
    }
  }
}
console.log(`\n=== Total Hinglish strings in hi/mr: ${total} ===`);