// Light theme audit #2 — TEXT colours jo cream par invisible hain.
//
// Pehle sirf background check kiya tha. Ab har `color:` value ka
// contrast cream (#fdf6ee) aur white card par dekhte hain.
import fs from "node:fs";

function hex2rgb(h) {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function lum([r, g, b]) {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const BG = hex2rgb("#fdf6ee");
const CARD = hex2rgb("#ffffff");

const files = ["src/styles.css", "src/components/JyotishBackdrop.jsx", "src/components/Logo3D.jsx"];
const bad = [];

for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => {
    // sirf `color:` (text) — background/fill ignore
    const m = /(^|[;{\s])color:\s*(#[0-9a-f]{3,8})\s*(;|\s|!)/i.exec(l);
    if (!m) return;
    const hex = m[2];
    if (hex.length === 8) return; // rgba hex — skip
    let c;
    try { c = hex2rgb(hex); } catch { return; }
    const r1 = ratio(c, BG), r2 = ratio(c, CARD);
    if (r1 < 4.5) {
      bad.push({ f, line: i + 1, hex, r1, r2, text: l.trim().slice(0, 88) });
    }
  });
}

console.log("═══ INVISIBLE TEXT (cream par contrast < 4.5:1) ═══\n");
if (!bad.length) console.log("  koi nahi ✅");
const seen = new Set();
for (const b of bad) {
  if (seen.has(b.hex)) continue;
  seen.add(b.hex);
  console.log(`  ${b.hex}  ${b.r1.toFixed(2)}:1  ${b.f.split("/").pop()}:L${b.line}`);
  console.log(`     ${b.text}`);
}

// ── CSS file me token-var colours bhi check karo ──
const css = fs.readFileSync("src/styles.css", "utf8");
const root = css.slice(css.indexOf(":root"), css.indexOf("\n}", css.indexOf(":root")) + 2);
console.log("\n═══ :root token contrast ═══");
for (const m of root.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6})/gi)) {
  const name = m[1];
  if (!/text|muted|gold|rose|saffron|danger|accent/.test(name)) continue;
  const r = ratio(hex2rgb(m[2]), BG);
  console.log(`  ${name.padEnd(12)} ${m[2]}  ${r.toFixed(2)}:1  ${r >= 7 ? "AAA" : r >= 4.5 ? "AA" : "FAIL"}`);
}