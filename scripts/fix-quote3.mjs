// for-loop ka andar ka pura block replace — duplicate `const line`, galat
// order (d se pehle use), aur NEWLINE/NL dono mix the.
import fs from "node:fs";

const F = "scripts/add-gem-keys-all.mjs";
const lines = fs.readFileSync(F, "utf8").split("\n");

const start = lines.findIndex((l) => l.includes('const i = s.indexOf("export default {"'));
if (start < 0) { console.log("!! start nahi mila"); process.exit(1); }

const end = lines.findIndex((l, i) => i > start && l.trim() === "}");
if (end < 0) { console.log("!! end nahi mila"); process.exit(1); }

console.log(`block: line ${start + 1} .. ${end + 1}`);

const CLEAN = [
  '  const i = s.indexOf("export default {");',
  '  if (i < 0) { console.log(`  ${code}: !! export default nahi mila`); continue; }',
  "",
  "  const d = block(code);",
  "  const nl = s.indexOf(NEWLINE, i);",
  "  const line =",
  '    NEWLINE + "  // ratna + muhurat + gem reason (naya feature)" + NEWLINE + "  "',
  '    + Object.entries(d).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("," + NEWLINE + "  ") + ",";',
  "",
  "  s = s.slice(0, nl) + line + s.slice(nl);",
  '  fs.writeFileSync(F, s, "utf8");',
  "  total += Object.keys(d).length;",
  '  console.log(`  ${code}: +${Object.keys(d).length} keys`);',
];

lines.splice(start, end - start + 1, ...CLEAN);
fs.writeFileSync(F, lines.join("\n"), "utf8");
console.log("block replace ho gaya");
