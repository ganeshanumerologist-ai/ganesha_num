// Chhoti bhashaon me jo values abhi bhi PURE English hain (brand/technical
// ko chhod kar) — unhe theek karna hai. User ko "Kundli" jaisa English
// dikhna nahi chahiye jab वो नेपाली चुन raha hai.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIR = path.join(process.cwd(), "src", "i18n", "small");
const GROUPS = ["translations", "site", "kundli", "pg"];

// Inhe English rakhna SAHI hai
const KEEP_EN = new Set([
  "app_name",            // GANESHA SUYOG ASTROLOGY — brand
  "footer_powered",      // React, Firebase
  "nav_chat", "chat_title",   // AI
  "nav_grid", "nav_loshu", "pg_grid",  // Lo Shu Grid — Chinese proper noun
  "pg_varga", "pg_lalkitab",           // Shodashvarga, Lal Kitab
  "admin_step1", "admin_step2", "admin_step3", // file paths
  "share_sub", "share_note", "share_default_msg", // Facebook/TikTok names
  "calc_ex_name", "calc_ex_mob",
  "google_signin",
]);

for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".js")).sort()) {
  const code = f.replace(/\.js$/, "");
  const d = (await import(pathToFileURL(path.join(DIR, f)).href)).default;
  const leftovers = [];

  for (const grp of GROUPS) {
    const mine = d[grp] || {};
    for (const [k, v] of Object.entries(mine)) {
      if (KEEP_EN.has(k)) continue;
      const s = String(v);
      // pure-English indicator: Latin letters AND no native script char
      const hasLatin = /[A-Za-z]{2,}/.test(s);
      const hasNative = /[^\x00-\x7F]/.test(s);
      if (hasLatin && !hasNative) leftovers.push(`${grp}.${k} = "${s.slice(0, 44)}"`);
    }
  }

  if (leftovers.length) {
    console.log(`\n[${code}] ${leftovers.length} pure-English value(s):`);
    for (const l of leftovers) console.log("   " + l);
  } else {
    console.log(`[${code}] koi pure-English value nahi ✅`);
  }
}