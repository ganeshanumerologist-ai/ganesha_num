// 4 chhoot gaye the — har ek ka actual text dhoondh kar replace karo.
import fs from "node:fs";

const F = "src/styles.css";
let css = fs.readFileSync(F, "utf8");

// 1. --accent-2 (variable block me already tha, shayad duplicate)
css = css.replace(/--accent-2:\s*#5ee7f5;/g, "--accent-2: #f2a0b8;");
css = css.replace(/rgba\(94,\s*231,\s*245/g, "rgba(242,160,184");
css = css.replace(/rgba\(255,\s*212,\s*94/g, "rgba(247,201,72");
css = css.replace(/rgba\(167,\s*139,\s*250/g, "rgba(242,160,184");
css = css.replace(/rgba\(58,\s*64,\s*120/g, "rgba(74,42,60");
css = css.replace(/rgba\(36,\s*42,\s*88/g, "rgba(46,25,38");
css = css.replace(/rgba\(44,\s*51,\s*102/g, "rgba(56,32,46");
css = css.replace(/rgba\(30,\s*35,\s*76/g, "rgba(36,20,30");
css = css.replace(/rgba\(24,\s*28,\s*66/g, "rgba(32,17,25");
css = css.replace(/rgba\(40,\s*46,\s*96/g, "rgba(55,31,45");
css = css.replace(/rgba\(28,\s*33,\s*72/g, "rgba(36,20,32");
css = css.replace(/rgba\(30,\s*35,\s*74/g, "rgba(40,22,32");
css = css.replace(/rgba\(22,\s*26,\s*58/g, "rgba(28,15,22");
css = css.replace(/rgba\(60,\s*68,\s*126/g, "rgba(70,40,56");
css = css.replace(/rgba\(38,\s*44,\s*88/g, "rgba(44,24,36");
css = css.replace(/rgba\(20,\s*24,\s*56/g, "rgba(28,15,23");
css = css.replace(/rgba\(44,\s*51,\s*102/g, "rgba(56,32,46");
css = css.replace(/rgba\(31,\s*36,\s*76/g, "rgba(38,21,30");
css = css.replace(/rgba\(54,\s*62,\s*118/g, "rgba(66,38,55");
css = css.replace(/rgba\(36,\s*42,\s*86/g, "rgba(44,24,36");
css = css.replace(/rgba\(48,\s*55,\s*105/g, "rgba(58,33,48");
css = css.replace(/rgba\(32,\s*37,\s*76/g, "rgba(38,20,30");

// gold hex bhi update
css = css.replace(/#ffd45e/gi, "#f7c948");

fs.writeFileSync(F, css, "utf8");

// ── verify: koi blue/purple bacha? ──
const COOL = [
  [/\b#(1[0-9a-f]{2}|2[0-9a-f]{2}|3[0-9a-f]{2}|4[0-9a-f]{2}|5[0-9a-f]{2}|6[0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\b/gi, "hex"],
];
const bad = [];
const hexRe = /#([0-9a-f]{6})\b/gi;
let m;
while ((m = hexRe.exec(css))) {
  const v = m[1];
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (sat < 0.15) continue;          // grey/white — theek hai
  let hue = 0;
  if (max !== min) {
    if (max === r) hue = 60 * (((g - b) / (max - min)) % 6);
    else if (max === g) hue = 60 * ((b - r) / (max - min) + 2);
    else hue = 60 * ((r - g) / (max - min) + 4);
  }
  if (hue < 0) hue += 360;
  if (hue > 170 && hue < 285) bad.push(`#${v}  hue ${hue.toFixed(0)}°`);
}

console.log(`scanned ${(css.match(/#[0-9a-f]{6}\b/gi) || []).length} hex values`);
console.log(bad.length ? "COOL RANG BACHE:\n  " + [...new Set(bad)].join("\n  ") : "koi blue/purple nahi bacha ✅");
