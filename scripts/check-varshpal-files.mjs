// Har bhasha ka varshpal file jaanchta hai:
//   - shape theek hai? (8 cat, 9 meaning, 9 detail)
//   - har value apni native script me hai? (Latin leak = 0)
//   - value khali to nahi?
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIR = path.join(process.cwd(), "src", "data", "varshpal");

// Har bhasha ko uske script range se validate karo
const SCRIPT = {
  en: null,
  hi: [0x0900, 0x097f], mr: [0x0900, 0x097f],
  bn: [0x0980, 0x09ff], ta: [0x0b80, 0x0bff], te: [0x0c00, 0x0c7f],
  gu: [0x0a80, 0x0aff], kn: [0x0c80, 0x0cff], ml: [0x0d00, 0x0d7f],
  pa: [0x0a00, 0x0a7f], ur: [0x0600, 0x06ff], or: [0x0b00, 0x0b7f],
};
const ALLOWED = [
  [0x0000, 0x0041], [0x005b, 0x0061], [0x007b, 0x007b], // A-Z a-z { }  (object keys)
  [0x0020, 0x002f], [0x003a, 0x003a], [0x005d, 0x005d], // space , . : ] " ' etc
  [0x0030, 0x0039],                                     // 0-9
  [0x2013, 0x2014], [0x2018, 0x201f], [0x2026, 0x2026], // – — '' "" …
  [0x00a0, 0x00a0], [0x060c, 0x060c], [0x061f, 0x061f],
  [0x0964, 0x0965], [0x0a3c, 0x0a3c], [0x0d4d, 0x0d4d], // । ॥ ਜ਼ ୍
  [0x200c, 0x200d], [0x00a0, 0x00a0],                   // ZWNJ / ZWJ — formatting, leak nahi
];

const inScript = (cp, range) => cp >= range[0] && cp <= range[1];

const files = fs.existsSync(DIR)
  ? fs.readdirSync(DIR).filter((f) => f.endsWith(".js")).sort()
  : [];

if (!files.length) { console.log("src/data/varshpal/ khaali hai"); process.exit(1); }

let fails = 0;
for (const f of files) {
  const code = f.replace(/\.js$/, "");
  const mod = await import(pathToFileURL(path.join(DIR, f)).href);
  const d = mod.default;
  const problems = [];

  // --- shape ---
  if (!d || typeof d !== "object") { console.log(`[FAIL] ${code}: default export object nahi`); fails++; continue; }
  if (d.code !== code) problems.push(`code "${d.code}" != filename "${code}"`);

  const CAT = ["edu", "mar", "share", "biz", "rep", "health", "color", "adv"];
  const MEAN = ["t", "d", "c", "love", "h", "col", "adv"];
  const DET = ["edu", "mar", "share", "biz", "rep"];

  for (const k of CAT) if (!(d.cat && k in d.cat)) problems.push(`cat.${k} missing`);

  const years = d.meaning ? Object.keys(d.meaning) : [];
  if (years.length !== 9) problems.push(`meaning me ${years.length} saal (9 chahiye)`);
  for (let n = 1; n <= 9; n++)
    for (const k of MEAN)
      if (!(d.meaning?.[n] && k in d.meaning[n])) problems.push(`meaning.${n}.${k} missing`);

  if (!Array.isArray(d.detail) || d.detail.length !== 9)
    problems.push(`detail me ${d.detail?.length ?? 0} item (9 chahiye)`);
  (d.detail || []).forEach((it, i) => DET.forEach((k) => {
    if (!(it && k in it)) problems.push(`detail[${i}].${k} missing`);
  }));

  // --- script purity (values only, keys ko nahi) ---
  const range = SCRIPT[code];
  const vals = [];
  if (d.cat) CAT.forEach((k) => vals.push([`cat.${k}`, d.cat[k]]));
  if (d.meaning) for (const n of years) MEAN.forEach((k) => vals.push([`meaning.${n}.${k}`, d.meaning[n]?.[k]]));
  (d.detail || []).forEach((it, i) => DET.forEach((k) => vals.push([`detail[${i}].${k}`, it?.[k]])));

  for (const [where, v] of vals) {
    if (v === undefined || v === null || String(v).trim() === "") { problems.push(`${where} khaali`); continue; }
    const s = String(v);
    if (range) {
      for (const ch of s) {
        const cp = ch.codePointAt(0);
        if (cp < 0x80) continue;                        // ASCII punctuation theek hai
        if (inScript(cp, range)) continue;
        if (ALLOWED.some((r) => inScript(cp, r))) continue;
        problems.push(`${where} me galat script: "${ch}" (U+${cp.toString(16).toUpperCase()}) → "${s.slice(0, 34)}"`);
        break;
      }
    } else {
      // English: koi bhi Latin word >2 char allowed hai
    }
  }

  if (problems.length) {
    fails += problems.length;
    console.log(`\n[FAIL] ${code} — ${problems.length} problem`);
    for (const p of problems.slice(0, 8)) console.log("   " + p);
    if (problems.length > 8) console.log(`   ...aur ${problems.length - 8}`);
  } else {
    console.log(`[ OK ] ${code}  ${vals.length} values, sab apni script me ✅`);
  }
}

console.log(files.length >= 12
  ? `\nsaare ${files.length} files perfect ✅`
  : `\n${fails} problem · abhi ${files.length}/12 file hai`);
process.exit(fails ? 1 : 0);