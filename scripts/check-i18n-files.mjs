// i18n/*.js me bhasha coverage aur script purity check.
// node scripts/check-i18n-files.mjs
import { readFileSync, readdirSync } from "node:fs";

const EXPECT = {
  bn: [0x0980, 0x09FF], as: [0x0980, 0x09FF],
  hi: [0x0900, 0x097F], mr: [0x0900, 0x097F],
  te: [0x0C00, 0x0C7F], ta: [0x0B80, 0x0BFF], gu: [0x0A80, 0x0AFF],
  ur: [0x0600, 0x06FF], kn: [0x0C80, 0x0CFF], or: [0x0B00, 0x0B7F],
  ml: [0x0D00, 0x0D7F], pa: [0x0A00, 0x0A7F],
};

function inRange(ch, r) {
  const c = ch.codePointAt(0);
  return c >= r[0] && c <= r[1];
}

let problems = 0;
for (const f of readdirSync("src/i18n").filter((x) => x.endsWith(".js")).sort()) {
  const src = readFileSync("src/i18n/" + f, "utf8");
  // top-level lang keys: "  xx:" or "  xx: mk(" or "  xx: {"
  const found = new Set();
  const re = /^\s{2,4}(en|hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as)\s*:\s*(mk\(|\{|[A-Z])/gm;
  let m;
  while ((m = re.exec(src)) !== null) found.add(m[1]);
  if (found.size === 0) { console.log(`\n${f}: (no top-level lang map — skip)`); continue; }

  const missing = ["en", "hi", "mr", "bn", "te", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as"].filter((l) => !found.has(l));
  console.log(`\n${f}: ${found.size}/13 bhasha  [${[...found].join(" ")}]`);
  if (missing.length) { problems++; console.log(`   missing: ${missing.join(", ")}`); }

  // Hinglish check in hi/mr blocks: pure-latin strings
  const lines = src.split(/\r?\n/);
  for (const lang of ["hi", "mr"]) {
    const start = lines.findIndex((l) => new RegExp(`^\\s{2,4}${lang}:`).test(l));
    if (start < 0) continue;
    let depth = 0, end = start;
    for (let i = start; i < lines.length; i++) {
      for (const ch of lines[i]) { if (ch === "{") depth++; else if (ch === "}") { depth--; if (depth === 0) { end = i; break; } } }
      if (depth === 0 && i > start) break;
    }
    const hits = [];
    for (let i = start; i <= end; i++) {
      const r2 = /:\s*"([^"]{12,})"/g;
      let mm;
      while ((mm = r2.exec(lines[i])) !== null) {
        const v = mm[1];
        if (!/[\u0900-\u0DFF\u0600-\u06FF]/.test(v) && (v.match(/[A-Za-z]{3,}/g) || []).length >= 3) hits.push(`L${i + 1}: ${v.slice(0, 50)}`);
      }
    }
    if (hits.length) { problems++; console.log(`   [${lang}] ${hits.length} Hinglish:`); for (const h of hits.slice(0, 6)) console.log("      " + h); }
  }
}
console.log(`\n=== Problems: ${problems} ===`);