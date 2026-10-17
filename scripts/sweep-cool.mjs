// Violet/cyan ke aakhri bharchhe — styles.css + components dono.
// violet #8b5cf6 → rose  #f2a0b8
// cyan   #22d3ee → gold  #f7c948
// amber  #fbbf24 → gold  #f7c948
import fs from "node:fs";
import path from "node:path";

const MAP = [
  ["rgba(139,92,246", "rgba(242,160,184"],
  ["rgba(139, 92, 246", "rgba(242, 160, 184"],
  ["rgba(34,211,238", "rgba(247,201,72"],
  ["rgba(34, 211, 238", "rgba(247, 201, 72"],
  ["rgba(94,231,245", "rgba(242,160,184"],
  ["rgba(94, 231, 245", "rgba(242, 160, 184"],
  ["rgba(167,139,250", "rgba(242,160,184"],
  ["rgba(251,191,36", "rgba(247,201,72"],
  ["rgba(251, 191, 36", "rgba(247, 201, 72"],
  ["#8b5cf6", "#f2a0b8"],
  ["#22d3ee", "#f7c948"],
  ["#fbbf24", "#f7c948"],
  ["#a78bfa", "#f2a0b8"],
  ["#5ee7f5", "#f2a0b8"],
  ["#67e8f9", "#f2a0b8"],
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.jsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

let totalHits = 0;
const touched = [];

for (const f of walk(path.join(process.cwd(), "src"))) {
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  let hits = 0;
  for (const [from, to] of MAP) {
    const n = s.split(from).length - 1;
    if (n) { s = s.split(from).join(to); hits += n; }
  }
  if (s !== before) {
    fs.writeFileSync(f, s, "utf8");
    touched.push(`${path.relative(process.cwd(), f)}  (${hits})`);
    totalHits += hits;
  }
}

console.log(`${totalHits} jagah badle, ${touched.length} file:`);
for (const t of touched) console.log("  " + t);

// ── FINAL verify: live CSS me koi cool rang? ──
function hueOf(hexv) {
  const r = parseInt(hexv.slice(1, 3), 16), g = parseInt(hexv.slice(3, 5), 16), b = parseInt(hexv.slice(5, 7), 16);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx === 0 ? 0 : (mx - mn) / mx;
  if (sat < 0.15) return null;
  const d = mx - mn;
  let hue = 0;
  if (d) { if (mx === r) hue = 60 * (((g - b) / d) % 6); else if (mx === g) hue = 60 * ((b - r) / d + 2); else hue = 60 * ((r - g) / d + 4); }
  if (hue < 0) hue += 360;
  return hue;
}

console.log("\n══════ FINAL HUE AUDIT (comments chhod kar) ══════\n");
let bad = 0;
for (const f of walk(path.join(process.cwd(), "src"))) {
  const src = fs.readFileSync(f, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ")
    .replace(/^\s*\*.*$/gm, " ");
  const hits = new Set();
  let m;
  const re = /#([0-9a-f]{6})\b/gi;
  while ((m = re.exec(src))) {
    const h = hueOf("#" + m[1]);
    if (h !== null && h > 170 && h < 285) hits.add("#" + m[1] + " " + h.toFixed(0) + "°");
  }
  // rgb() form
  const re2 = /rgba?\((\d+),\s*(\d+),\s*(\d+)/g;
  while ((m = re2.exec(src))) {
    const h = hueOf("#" + [1, 2, 3].map((i) => (+m[i]).toString(16).padStart(2, "0")).join(""));
    if (h !== null && h > 170 && h < 285) hits.add(`rgb(${m[1]},${m[2]},${m[3]}) ${h.toFixed(0)}°`);
  }
  if (hits.size) { bad += hits.size; console.log(`  ${path.relative(process.cwd(), f)}\n    ${[...hits].join(", ")}`); }
}
console.log(bad ? `\n${bad} cool rang bache ❌` : "\nPOORE SRC ME ZERO BLUE / VIOLET / CYAN ✅");
