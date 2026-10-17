// SVG art bhi indigo/purple tha — mandala ke stops aur logo ka ring.
// Ab gold + rose.
import fs from "node:fs";

const MAP = [
  // ── JyotishBackdrop: mandala ke stops ──
  ['<stop offset="0%" stopColor="#fff6d8" />', '<stop offset="0%" stopColor="#ffeaa8" />'],
  ['<stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.40" />', '<stop offset="50%" stopColor="#f2a0b8" stopOpacity="0.40" />'],
  ['<stop offset="100%" stopColor="#22d3ee" stopOpacity="0.55" />', '<stop offset="100%" stopColor="#f7c948" stopOpacity="0.55" />'],
  ['<stop offset="0%" stopColor="#f7c948" stopOpacity="0.22" />', '<stop offset="0%" stopColor="#f7c948" stopOpacity="0.20" />'],
  ['stroke="#22d3ee"', 'stroke="#f2a0b8"'],
  ['stroke="#8b5cf6"', 'stroke="#d16b8a"'],

  // ── Logo3D: ring gradient me purple tha ──
  ['<stop offset="100%" stopColor="#a78bfa" />', '<stop offset="100%" stopColor="#f2a0b8" />'],
];

let total = 0;
for (const [file, pairs] of [
  ["src/components/JyotishBackdrop.jsx", MAP],
  ["src/components/Logo3D.jsx", MAP.slice(-1)],
]) {
  let s = fs.readFileSync(file, "utf8");
  let n = 0;
  for (const [from, to] of pairs) {
    if (s.includes(from)) { s = s.split(from).join(to); n++; }
  }
  fs.writeFileSync(file, s, "utf8");
  console.log(`${file}: ${n} rang badle`);
  total += n;
}

// ── verify: koi cool hex bacha? ──
const hexRe = /#([0-9a-f]{6})\b/gi;
for (const file of ["src/components/JyotishBackdrop.jsx", "src/components/Logo3D.jsx"]) {
  const src = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const bad = [];
  let m;
  while ((m = hexRe.exec(src))) {
    const v = m[1];
    const r = parseInt(v.slice(0, 2), 16), g = parseInt(v.slice(2, 4), 16), b = parseInt(v.slice(4, 6), 16);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    if (sat < 0.15) continue;
    let hue = 0;
    if (max !== min) {
      if (max === r) hue = 60 * (((g - b) / (max - min)) % 6);
      else if (max === g) hue = 60 * ((b - r) / (max - min) + 2);
      else hue = 60 * ((r - g) / (max - min) + 4);
    }
    if (hue < 0) hue += 360;
    if (hue > 170 && hue < 285) bad.push(`#${v} ${hue.toFixed(0)}°`);
  }
  console.log(`  ${file}: ${bad.length ? "COOL BACHE → " + [...new Set(bad)].join(", ") : "sab warm ✅"}`);
}

console.log(`\nkul ${total} rang badle`);
