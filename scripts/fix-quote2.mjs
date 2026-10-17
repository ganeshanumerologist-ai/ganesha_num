// add-gem-keys-all.mjs ka beech: `const line = ...` galti se line 1 pe chala
// gaya tha (data tables theek hain). Use wapas sahi jagah rakhta hai.
import fs from "node:fs";

const F = "scripts/add-gem-keys-all.mjs";
let lines = fs.readFileSync(F, "utf8").split("\n");

// 1. line 1 pe galat line hata do
const BAD = '  const line = NEWLINE + "  // ratna + muhurat + gem reason (naya feature)" + NEWLINE + "  "';
const bi = lines.findIndex((l) => l.trim() === BAD.trim());
if (bi >= 0) { lines.splice(bi, 1); console.log(`line ${bi + 1} hata di`); }

// 2. for-loop ke andar sahi jagah daalo — "const i = s.indexOf" ke baad
const NEEDLE = '  const nl = s.indexOf("\\n", i);';
const ni = lines.findIndex((l) => l.includes("const nl = s.indexOf"));
if (ni < 0) { console.log("!! anchor nahi mila"); process.exit(1); }

const NL = 'String.fromCharCode(10)';
lines.splice(ni + 1, 0,
  '  const line = NL + "  // ratna + muhurat + gem reason (naya feature)" + NL + "  "',
  '    + Object.entries(d).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("," + NL + "  ") + ",";',
);
console.log(`sahi jagah daal di (line ${ni + 2})`);

// 3. purana (ab shifted) jodi-wali lines bhi hata do
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('Object.entries(d).map') && lines[i].includes('join("," + NL')) continue;
  if (lines[i].includes('const line = "\\n  //') || lines[i].includes('ratna + muhurat + gem "kyun"')) {
    lines.splice(i, 1);
    console.log(`stale line ${i + 1} hata di`);
  }
}

fs.writeFileSync(F, lines.join("\n"), "utf8");
console.log("done");
