// Do galtiyan fix:
//  1. closing paren wali form `rgba(42, 48, 100)` match nahi karti
//     kyunki file me `rgba(42, 48, 100, .94)` hai — alpha beech me.
//     Sirf PREFIX badalna hai.
//  2. space aur no-space dono cover karo.
import fs from "node:fs";
import path from "node:path";

const TRIPLES = [
  [[139, 92, 246], [242, 160, 184]],
  [[34, 211, 238], [247, 201, 72]],
  [[94, 231, 245], [242, 160, 184]],
  [[167, 139, 250], [242, 160, 184]],
  [[251, 191, 36], [247, 201, 72]],
  [[42, 48, 100], [32, 18, 25]],
  [[29, 34, 74], [24, 13, 19]],
  [[12, 10, 34], [11, 6, 9]],
  [[44, 51, 102], [32, 18, 25]],
  [[31, 36, 76], [24, 13, 19]],
  [[14, 11, 32], [12, 6, 9]],
  [[20, 16, 48], [14, 7, 11]],
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(jsx?|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

let total = 0;
const touched = [];
for (const f of walk(path.join(process.cwd(), "src"))) {
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  let hits = 0;
  for (const [a, b] of TRIPLES) {
    // PREFIX form — closing paren nahi, alpha bach jayega
    for (const fn of ["rgba", "rgb"]) {
      for (const sep of [",", ", "]) {
        const from = `${fn}(${a.join(sep)}`;
        const to = `${fn}(${b.join(sep)}`;
        const n = s.split(from).length - 1;
        if (n) { s = s.split(from).join(to); hits += n; }
      }
    }
  }
  if (s !== before) {
    fs.writeFileSync(f, s, "utf8");
    touched.push(`  ${path.relative(process.cwd(), f)}  (${hits})`);
    total += hits;
  }
}
console.log(`${total} jagah badle`);
for (const t of touched) console.log(t);

// ── FINAL ──
function hueOf(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx === 0 ? 0 : (mx - mn) / mx;
  if (sat < 0.15) return null;
  const d = mx - mn; let h = 0;
  if (d) { if (mx === r) h = 60 * (((g - b) / d) % 6); else if (mx === g) h = 60 * ((b - r) / d + 2); else h = 60 * ((r - g) / d + 4); }
  if (h < 0) h += 360;
  return h;
}
let bad = 0, checked = 0;
console.log("\n══════ FINAL VERIFY ══════\n");
for (const f of walk(path.join(process.cwd(), "src"))) {
  if (path.basename(f) === "social.js") continue;
  const src = fs.readFileSync(f, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ").replace(/^\s*\*.*$/gm, " ");
  const hits = new Set();
  let m;
  let re = /#([0-9a-f]{6})\b/gi;
  while ((m = re.exec(src))) {
    checked++;
    const h = hueOf(parseInt(m[1].slice(0,2),16), parseInt(m[1].slice(2,4),16), parseInt(m[1].slice(4,6),16));
    if (h !== null && h > 170 && h < 285) hits.add("#" + m[1]);
  }
  re = /rgba?\((\d+),\s*(\d+),\s*(\d+)/g;
  while ((m = re.exec(src))) {
    checked++;
    const h = hueOf(+m[1], +m[2], +m[3]);
    if (h !== null && h > 170 && h < 285) hits.add(`rgb(${m[1]},${m[2]},${m[3]})`);
  }
  if (hits.size) { bad += hits.size; console.log(`  ${path.relative(process.cwd(), f)}: ${[...hits].join(", ")}`); }
}
console.log(`\n  ${checked} values check kiye`);
console.log(bad ? `  ${bad} cool rang bache ❌` : "  ZERO blue / violet / cyan — GOLD + ROSE + MAROON ✅");
process.exit(bad ? 1 : 0);
