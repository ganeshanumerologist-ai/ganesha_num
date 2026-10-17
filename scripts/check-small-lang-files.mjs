// Chhoti bhashon ke file ka shape + script purity check.
//
// Kya jaanta hai:
//   1. Chaaron group (translations / site / kundli / pg) poore hain
//   2. Har value apni bhasha ki script me hai (Latin = leak, EXCEPT
//      whitelist — brand/technical words jaise "GANESHA SUYOG ASTROLOGY",
//      "Lo Shu Grid", "React + Firebase", "WhatsApp")
//   3. Koi value khali to nahi
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIR = path.join(process.cwd(), "src", "i18n", "small");
const GROUPS = ["translations", "site", "kundli", "pg"];

// Har bhasha ka script range (registry ke fontFor se match)
const SCRIPT = {
  ne: [0x0900, 0x097f], doi: [0x0900, 0x097f], mai: [0x0900, 0x097f],
  sa: [0x0900, 0x097f], brx: [0x0900, 0x097f],
  ks: [0x0600, 0x06ff], sd: [0x0600, 0x06ff],
  sat: [0x1c50, 0x1c7f],   // Ol Chiki
  mni: [0xabc0, 0xabff],   // Meitei Mayek
};

// In keys me Latin rehne ki ijazat hai (brand / technical / proper noun)
const LATIN_OK = new Set([
  "app_name",             // GANESHA SUYOG ASTROLOGY
  "footer_powered",       // React, Firebase
  "nav_chat",             // AI
  "chat_title",           // AI
  "nav_grid", "nav_loshu", "pg_grid",       // Lo Shu Grid (Chinese proper noun)
  "nav_kundli", "nav_kundli_page", "nav_charts", "kundli_word",
  "k_title", "k_open", "k_new", "k_save", "k_open_saved",
  "pg_varga",             // Shodashvarga
  "pg_lalkitab",          // Lal Kitab
  "admin_step1", "admin_step2", "admin_step3",  // file paths
  "share_title", "share_sub", "share_note", "share_default_msg",
  "share_copy_link", "share_copy_caption", "share_phone", "share_copied",
  "share_copy_fail",
  "calc_ex_name", "calc_ex_mob",   // e.g. Rahul Sharma / 9876543210
  "google_signin",
  "blog_back", "blog_all",
  "city_choose",
  "admin_title", "admin_activate", "admin_refresh",
]);

// ASCII punctuation + digits + formatting — leak nahi
const ALLOWED = [
  [0x0000, 0x002f], [0x003a, 0x0040], [0x005b, 0x0060], [0x007b, 0x007e],
  [0x00a0, 0x00a0], [0x00b1, 0x00b1],                    // ±
  [0x0964, 0x0965], [0x060c, 0x060c], [0x061b, 0x061f],
  [0x200c, 0x200f], [0x2013, 0x2014], [0x2018, 0x201f], [0x2026, 0x2026],
  [0x00b7, 0x00b7],                                      // ·
  [0x2190, 0x2193],                                      // ← ↑ → ↓
  [0x2600, 0x27bf],                                      // dingbats / arrows w/ emoji
  [0x1f000, 0x1faff],                                    // emoji
  [0x0980, 0x09ff], [0x0900, 0x097f],                    // sat: Ol Chiki ke liye Bengali/Devanagari
];

const inR = (cp, r) => cp >= r[0] && cp <= r[1];

if (!fs.existsSync(DIR)) {
  console.log("src/i18n/small/ folder hi nahi hai");
  process.exit(1);
}
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".js")).sort();
if (!files.length) { console.log("src/i18n/small/ khaali hai"); process.exit(1); }

// English source se key-count compare karne ke liye
const SRC = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "small-lang-source.json"), "utf8"));

let fails = 0;
const rows = [];

for (const f of files) {
  const code = f.replace(/\.js$/, "");
  const mod = await import(pathToFileURL(path.join(DIR, f)).href);
  const d = mod.default;
  const problems = [];

  if (!d || typeof d !== "object") { console.log(`[FAIL] ${code}: default export nahi`); fails++; continue; }
  if (d.code !== code) problems.push(`code "${d.code}" != file "${code}"`);

  const range = SCRIPT[code];
  let total = 0;
  let missing = 0;
  let latin = 0;
  let wrongScript = 0;
  let empty = 0;

  for (const grp of GROUPS) {
    const mine = d[grp] || {};
    const en = SRC[grp] || {};
    for (const [k, v] of Object.entries(en)) {
      total++;
      const mv = mine[k];
      if (mv === undefined) { missing++; problems.push(`${grp}.${k} MISSING`); continue; }
      const s = String(mv);
      if (!s.trim()) { empty++; problems.push(`${grp}.${k} khali`); continue; }

      // Latin check
      if (/[A-Za-z]/.test(s) && !LATIN_OK.has(k)) {
        latin++;
        problems.push(`${grp}.${k} me Latin: "${s.slice(0, 40)}"`);
        continue;
      }
      // script check
      if (range) {
        for (const ch of s) {
          const cp = ch.codePointAt(0);
          if (cp < 0x80) continue;
          if (inR(cp, range)) continue;
          if (ALLOWED.some((r) => inR(cp, r))) continue;
          wrongScript++;
          problems.push(`${grp}.${k} galat script "${ch}" U+${cp.toString(16).toUpperCase()} → "${s.slice(0, 34)}"`);
          break;
        }
      }
    }
  }

  const extra = [];
  for (const grp of GROUPS) {
    const mine = d[grp] || {};
    for (const k of Object.keys(mine)) {
      if (!(k in (SRC[grp] || {}))) extra.push(`${grp}.${k}`);
    }
  }
  if (extra.length) problems.push(`${extra.length} EXTRA key(s): ${extra.slice(0, 5).join(", ")}`);

  if (problems.length) {
    fails += problems.length;
    console.log(`\n[FAIL] ${code} — ${problems.length} problem`);
    for (const p of problems.slice(0, 10)) console.log("   " + p);
    if (problems.length > 10) console.log(`   ...aur ${problems.length - 10}`);
  } else {
    rows.push(`  ${code.padEnd(4)} ${total} values — sab apni script me ✅`);
    console.log(`[ OK ] ${code.padEnd(4)} ${total} values ✅`);
  }
}

const need = ["ne", "doi", "mai", "sa", "brx", "ks", "sd", "sat", "mni"];
const have = files.map((f) => f.replace(/\.js$/, ""));
const notYet = need.filter((n) => !have.includes(n));
console.log(notYet.length
  ? `\nabhi bane hue: ${notYet.join(", ")}  (${have.length}/9)`
  : `\nsaari 9 chhoti bhasha complete ✅`);

console.log(fails ? `\n${fails} problem — theek karo` : "\nSAARE FILES SAHI HAIN ✅");
process.exit(fails ? 1 : 0);