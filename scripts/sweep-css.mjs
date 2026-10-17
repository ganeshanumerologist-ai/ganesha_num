import fs from "node:fs";

const F = "src/styles.css";
let s = fs.readFileSync(F, "utf8");

const MAP = [
  ["rgba(139,92,246", "rgba(242,160,184"],
  ["rgba(34,211,238", "rgba(247,201,72"],
  ["rgba(94,231,245", "rgba(242,160,184"],
  ["rgba(167,139,250", "rgba(242,160,184"],
  ["rgba(251,191,36", "rgba(247,201,72"],
  ["#8b5cf6", "#f2a0b8"],
  ["#22d3ee", "#f7c948"],
  ["#fbbf24", "#f7c948"],
  ["#a78bfa", "#f2a0b8"],
  ["#5ee7f5", "#f2a0b8"],
  ["#67e8f9", "#f2a0b8"],
];

let total = 0;
for (const [from, to] of MAP) {
  const n = s.split(from).length - 1;
  if (n) {
    s = s.split(from).join(to);
    total += n;
    console.log(`  ${from} -> ${to}  (${n})`);
  }
}
fs.writeFileSync(F, s, "utf8");
console.log(`\nstyles.css: ${total} badle`);

// verify
const bad = [...s.matchAll(/#([0-9a-f]{6})\b/gi), ...s.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g)];
function hueOf(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx === 0 ? 0 : (mx - mn) / mx;
  if (sat < 0.15) return null;
  const d = mx - mn; let h = 0;
  if (d) { if (mx === r) h = 60 * (((g - b) / d) % 6); else if (mx === g) h = 60 * ((b - r) / d + 2); else h = 60 * ((r - g) / d + 4); }
  if (h < 0) h += 360;
  return h;
}
const hits = new Set();
let m;
const live = s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
let re = /#([0-9a-f]{6})\b/gi;
while ((m = re.exec(live))) {
  const h = hueOf(parseInt(m[1].slice(0,2),16), parseInt(m[1].slice(2,4),16), parseInt(m[1].slice(4,6),16));
  if (h !== null && h > 170 && h < 285) hits.add("#" + m[1] + " " + h.toFixed(0) + "°");
}
re = /rgba?\((\d+),\s*(\d+),\s*(\d+)/g;
while ((m = re.exec(live))) {
  const h = hueOf(+m[1], +m[2], +m[3]);
  if (h !== null && h > 170 && h < 285) hits.add(`rgb(${m[1]},${m[2]},${m[3]}) ` + h.toFixed(0) + "°");
}
console.log(hits.size ? "AB BHI: " + [...hits].join(", ") : "styles.css: ZERO cool rang ✅");
