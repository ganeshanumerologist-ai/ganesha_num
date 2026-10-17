// Kundli full-chart labels — per-language files ka checker.
// Script purity + shape. Brand/technical allowlist is EMPTY here —
// is page par koi brand ya file path nahi hai, sab ordinary words hain.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIR = path.join(process.cwd(), "src", "i18n", "kf");

const SCRIPT = {
  bn: [0x0980, 0x09ff], ta: [0x0b80, 0x0bff], te: [0x0c00, 0x0c7f],
  gu: [0x0a80, 0x0aff], ur: [0x0600, 0x06ff], kn: [0x0c80, 0x0cff],
  or: [0x0b00, 0x0b7f], ml: [0x0d00, 0x0d7f], pa: [0x0a00, 0x0a7f],
  as: [0x0980, 0x09ff],
};

const ALLOWED = [
  [0x0000, 0x007f], [0x0964, 0x0965], [0x060c, 0x060c], [0x061b, 0x061f],
  [0x200c, 0x200f], [0x2013, 0x2014], [0x2018, 0x201f], [0x2026, 0x2026],
  [0x00b7, 0x00b7], [0x2190, 0x2193], [0x2600, 0x27bf], [0x1f000, 0x1faff],
];
const inR = (cp, r) => cp >= r[0] && cp <= r[1];

const SRC = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "kf-source.json"), "utf8"));

if (!fs.existsSync(DIR)) { console.log("src/i18n/kf/ nahi hai"); process.exit(1); }
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".js")).sort();
if (!files.length) { console.log("src/i18n/kf/ khaali hai"); process.exit(1); }

let fails = 0;
for (const f of files) {
  const code = f.replace(/\.js$/, "");
  const d = (await import(pathToFileURL(path.join(DIR, f)).href)).default;
  const problems = [];

  const missing = SRC.keys.filter((k) => !(k in d));
  if (missing.length) problems.push(`${missing.length} MISSING: ${missing.slice(0, 6).join(", ")}`);
  const extra = Object.keys(d).filter((k) => !SRC.keys.includes(k));
  if (extra.length) problems.push(`EXTRA: ${extra.join(", ")}`);

  for (const [k, v] of Object.entries(d)) {
    const s = String(v ?? "");
    if (!s.trim()) { problems.push(`${k} khali`); continue; }
    // {p} (points) aur {h} (house) jaan-boojh kar rakhe jaate hain —
    // inhe rendering time par number se replace kiya jaata hai.
    // Pehle ye Latin samajh aa rahe the aur 40 false FAIL de rahe the.
    const withoutPh = s.replaceAll("{p}", "").replaceAll("{h}", "");
    if (/[A-Za-z]/.test(withoutPh)) {
      problems.push(`${k} me Latin: "${s.slice(0, 34)}"`);
      continue;
    }
    const range = SCRIPT[code];
    if (range) {
      for (const ch of s) {
        const cp = ch.codePointAt(0);
        if (cp < 0x80) continue;
        if (inR(cp, range)) continue;
        if (ALLOWED.some((r) => inR(cp, r))) continue;
        problems.push(`${k} galat script "${ch}" U+${cp.toString(16).toUpperCase()}`);
        break;
      }
    }
  }

  if (problems.length) {
    fails += problems.length;
    console.log(`\n[FAIL] ${code} — ${problems.length}`);
    for (const p of problems.slice(0, 8)) console.log("   " + p);
    if (problems.length > 8) console.log(`   ...aur ${problems.length - 8}`);
  } else {
    console.log(`[ OK ] ${code.padEnd(4)} ${Object.keys(d).length} keys — sab apni script me ✅`);
  }
}

const need = Object.keys(SCRIPT);
const have = files.map((f) => f.replace(/\.js$/, ""));
const notYet = need.filter((n) => !have.includes(n));
console.log(notYet.length ? `\nabhi bane hue: ${notYet.join(", ")} (${have.length}/10)` : "\nsaari 10 bhasha complete ✅");
console.log(fails ? `\n${fails} problem` : "\nSAARE LABELS SAHI HAIN ✅");
process.exit(fails ? 1 : 0);