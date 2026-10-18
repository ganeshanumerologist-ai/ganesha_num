import fs from "node:fs";

function hex2rgb(h) {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function lum([r, g, b]) {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); }
const BG = hex2rgb("#fdf6ee");

const FIX = [
  // ── REAL BUGS: text jo user padhta hai ──
  ["#34d399", "#0d6b4f", "mint note text → deep green", 5.4],
  ["#f87171", "#9f1d1d", "light red text → deep red", 6.2],
  // ── brand colour jo stale indigo hai ──
  ["#e8ecff", "#141414", "X brand: stale indigo → black (asli brand)", null],
  // ── backdrop art strokes (cream par dhundhle) ──
  ["#e6d3d8", "#c9a0ae", "backdrop stroke → visible", null],
];

const files = [
  "src/pages/Login.jsx", "src/pages/Loshu.jsx", "src/pages/Rashifal.jsx",
  "src/config/social.js", "src/components/JyotishBackdrop.jsx",
];

console.log("═══ FIX ═══");
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, "utf8");
  let total = 0;
  const line = [];
  for (const [from, to, why] of FIX) {
    const re = new RegExp(from.replace("#", "#"), "gi");
    const c = (s.match(re) || []).length;
    if (!c) continue;
    s = s.replace(re, to);
    total += c;
    line.push(`      ${c}x ${why}`);
  }
  if (total) {
    fs.writeFileSync(f, s, "utf8");
    console.log(`  ${f}  (${total})`);
    line.forEach((l) => console.log(l));
  }
}

console.log("\n═══ NEW contrast ═══");
for (const [from, to, why] of FIX) {
  if (from === "#e8ecff" || from === "#e6d3d8") continue;
  console.log(`  ${from} ${ratio(hex2rgb(from), BG).toFixed(2)}:1  →  ${to} ${ratio(hex2rgb(to), BG).toFixed(2)}:1`);
}