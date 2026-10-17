// 4 LIVE blue values bache the (comment me 6 the, woh theek hain):
//   #151b36  x3  — select / textarea ka background
//   #c3c6e6  x1  — ek muted text color
import fs from "node:fs";

const F = "src/styles.css";
let css = fs.readFileSync(F, "utf8");

const MAP = [
  // select/textarea/input — ab गहरा मारून
  ["#151b36", "#2a1622"],
  // muted text — ab गुन-गुलाबी
  ["#c3c6e6", "#e6d4da"],
];

for (const [from, to] of MAP) {
  const n = css.split(from).length - 1;
  css = css.split(from).join(to);
  console.log(`${from} -> ${to}   (${n} jagah)`);
}

fs.writeFileSync(F, css, "utf8");

// ── final hue scan ──
const hexRe = /#([0-9a-f]{6})\b/gi;
const bad = [];
let m, total = 0;
while ((m = hexRe.exec(css))) {
  total++;
  const v = m[1];
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
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
console.log(`\n${total} hex values scan kiye`);
console.log(bad.length ? "ab bhi cool: " + [...new Set(bad)].join(", ") : "LIVE CSS me koi blue/purple NAHI ✅");
