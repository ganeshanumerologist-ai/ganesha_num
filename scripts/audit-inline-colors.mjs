// Saare JSX/JS me inline colours — light theme me kaun invisible hain?
import fs from "node:fs";
import path from "node:path";

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

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(jsx?|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = [...walk("src")];
const bad = [];
const map = new Map();

for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => {
    for (const m of l.matchAll(/(#fff6f0|#dcc3ca|#e2e6ff|#c2c7ee|#9d9fc4|#e6d4da|#e6d3d8|#f6e8d9|#fff6d8|#fde68a|#[0-9a-f]{6})/gi)) {
      const hex = m[0].toLowerCase();
      if (hex.length !== 7) continue;
      let c;
      try { c = hex2rgb(hex); } catch { continue; }
      const r = ratio(c, BG);
      // 3.0 se kam = cream par invisible. Border/background me use
      // hota hai to theek hai — sirf `color:` ya `stroke=` me pakadte hain
      const isText = /color\s*[:=]\s*["']?#|fill\s*=\s*["']#|stroke\s*=\s*["']#/.test(l);
      if (isText && r < 3) {
        const k = f + "|" + hex;
        map.set(k, (map.get(k) || 0) + 1);
        bad.push({ f, line: i + 1, hex, r, text: l.trim().slice(0, 80) });
      }
    }
  });
}

console.log("═══ INVISIBLE TEXT colours (inline, cream par < 3:1) ═══\n");
if (!bad.length) console.log("  koi nahi ✅");
const byHex = {};
for (const b of bad) (byHex[b.hex] ||= []).push(b);
for (const [hex, list] of Object.entries(byHex)) {
  console.log(`  ${hex}  ${ratio(hex2rgb(hex), BG).toFixed(2)}:1   ${list.length} jagah`);
  list.slice(0, 3).forEach((b) =>
    console.log(`     ${b.f.replace("src\\", "").replace("\\", "/")}:${b.line}`)
  );
  console.log(`     ${list[0].text}`);
  console.log("");
}

// ── CSS me `color:` wale ──
const css = fs.readFileSync("src/styles.css", "utf8").split("\n");
console.log("═══ styles.css me `color:` wale light values ═══");
css.forEach((l, i) => {
  const m = /(?:^|[;{\s])color:\s*(#[0-9a-f]{3,8})\s*(;|\s)/i.exec(l);
  if (!m || m[1].length !== 7) return;
  let c;
  try { c = hex2rgb(m[1]); } catch { return; }
  const r = ratio(c, BG);
  if (r < 3) console.log(`  L${i + 1}  ${m[1]}  ${r.toFixed(2)}:1  ${l.trim().slice(0, 78)}`);
});