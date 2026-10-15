// Reports.jsx ke hi/mr block me Hinglish (romanized) strings dhoondo.
// node scripts/find-hinglish.mjs <file> <lang>
import { readFileSync } from "node:fs";

const file = process.argv[2] || "src/pages/Reports.jsx";
const lang = process.argv[3] || "hi";
const src = readFileSync(file, "utf8");

const lines = src.split(/\r?\n/);
// "  hi: {" ya "    hi: {" se block shuru
const startRe = new RegExp(`^\\s{2,6}${lang}:\\s*\\{`);
let start = lines.findIndex((l) => startRe.test(l));
if (start < 0) { console.log(`No ${lang} block found`); process.exit(0); }

// brace-match
let depth = 0, end = start;
for (let i = start; i < lines.length; i++) {
  for (const ch of lines[i]) {
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (depth === 0 && i > start) break;
}

// Block ke andar jo strings PURE latin hain (koi Indic char nahi) — wo Hinglish hain
const out = [];
for (let i = start; i <= end; i++) {
  const line = lines[i];
  // quoted values capture karo
  const re = /:\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(line)) !== null) {
    const v = m[1];
    if (!v.trim()) continue;
    const hasIndic = /[\u0900-\u0DFF\u0600-\u06FF]/.test(v);
    const letters = v.match(/[A-Za-z]{3,}/g) || [];
    if (!hasIndic && letters.length > 0) {
      out.push({ line: i + 1, value: v });
    }
  }
}

console.log(`\n${file} — ${lang} block (lines ${start + 1}-${end + 1})`);
console.log(`Pure-Latin (Hinglish/English) values: ${out.length}\n`);
for (const o of out) console.log(`  L${o.line}: ${o.value.slice(0, 70)}`);