import fs from "node:fs";
import path from "node:path";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.jsx?$/.test(e.name)) out.push(p);
  }
  return out;
}
function hueOf(h) {
  const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx === 0 ? 0 : (mx - mn) / mx;
  if (sat < 0.15) return null;
  const d = mx - mn; let hue = 0;
  if (d) { if (mx === r) hue = 60 * (((g - b) / d) % 6); else if (mx === g) hue = 60 * ((b - r) / d + 2); else hue = 60 * ((r - g) / d + 4); }
  if (hue < 0) hue += 360;
  return hue;
}

// Sirf official brand colours — Facebook, LinkedIn, WhatsApp.
// Inke blue/cyan HONA chahiye, warna unka pehchan hi nahi rehta.
const BRAND_OK = ["social.js"];

let bad = 0, total = 0, skipped = 0;
console.log("══════ FINAL HUE AUDIT ══════\n");
for (const f of walk(path.join(process.cwd(), "src"))) {
  if (BRAND_OK.includes(path.basename(f))) { skipped++; continue; }
  const src = fs.readFileSync(f, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ").replace(/^\s*\*.*$/gm, " ");
  const hits = new Set();
  let m;
  let re = /#([0-9a-f]{6})\b/gi;
  while ((m = re.exec(src))) { total++; const h = hueOf("#" + m[1]); if (h !== null && h > 170 && h < 285) hits.add("#" + m[1] + " " + h.toFixed(0) + "°"); }
  re = /rgba?\((\d+),\s*(\d+),\s*(\d+)/g;
  while ((m = re.exec(src))) { total++; const hh = hueOf("#" + [1,2,3].map(i => (+m[i]).toString(16).padStart(2,"0")).join("")); if (hh !== null && hh > 170 && hh < 285) hits.add(`rgb(${m[1]},${m[2]},${m[3]}) ` + hh.toFixed(0) + "°"); }
  if (hits.size) { bad += hits.size; console.log(`  ${path.relative(process.cwd(), f)}\n    ${[...hits].join(", ")}`); }
}
console.log(`\n  ${total} colour values check kiye`);
console.log(`  ${skipped} file chhodi (official brand colours — Facebook/LinkedIn/WhatsApp)`);
console.log(bad ? `\n  ${bad} cool rang bache ❌` : "\n  SITE PURI TARAH GOLD + ROSE + MAROON ✅");
