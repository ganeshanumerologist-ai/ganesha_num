// Ye 5 bach gaye hue "blue" values asal me SHADOW colours hain —
// rgba(14,11,32) jaise. Wo dikhte to kaale hain, lekin hue blue hai
// (249°). Shadow me hue ka koi matlab nahi — woh neutral hona chahiye.
import fs from "node:fs";

const F = "src/styles.css";
let s = fs.readFileSync(F, "utf8");

const MAP = [
  ["rgba(14,11,32", "rgba(12,6,9"],     // text-shadow — neutral warm black
  ["rgba(20,16,48", "rgba(14,7,11"],     // aurora vignette
  ["rgba(42,48,100", "rgba(32,18,25"],   // aakhri sky layer
  ["rgba(29,34,74", "rgba(24,13,19"],    // gradient stop
  ["rgba(12,10,34", "rgba(11,6,9"],      // hero text-shadow
];

let total = 0;
for (const [from, to] of MAP) {
  const n = s.split(from).length - 1;
  if (n) { s = s.split(from).join(to); total += n; console.log(`  ${from} -> ${to}  (${n})`); }
}
fs.writeFileSync(F, s, "utf8");
console.log(`\n${total} shadow colours neutral hue par laaye`);

// verify
function hueOf(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx === 0 ? 0 : (mx - mn) / mx;
  if (sat < 0.15) return null;
  const d = mx - mn; let h = 0;
  if (d) { if (mx === r) h = 60 * (((g - b) / d) % 6); else if (mx === g) h = 60 * ((b - r) / d + 2); else h = 60 * ((r - g) / d + 4); }
  if (h < 0) h += 360;
  return h;
}
const live = s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
const hits = new Set();
let m;
let re = /#([0-9a-f]{6})\b/gi;
while ((m = re.exec(live))) {
  const h = hueOf(parseInt(m[1].slice(0,2),16), parseInt(m[1].slice(2,4),16), parseInt(m[1].slice(4,6),16));
  if (h !== null && h > 170 && h < 285) hits.add("#" + m[1]);
}
re = /rgba?\((\d+),\s*(\d+),\s*(\d+)/g;
while ((m = re.exec(live))) {
  const h = hueOf(+m[1], +m[2], +m[3]);
  if (h !== null && h > 170 && h < 285) hits.add(`rgb(${m[1]},${m[2]},${m[3]})`);
}
console.log(hits.size ? "AB BHI: " + [...hits].join(", ") : "\nstyles.css: ZERO blue/violet/cyan ✅");
