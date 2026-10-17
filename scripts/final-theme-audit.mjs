// 4 cool values bache:
//   social.js  — Facebook/LinkedIn/WhatsApp ke BRAND colours. Inhe
//                badalna brand identity tod dega. Whitelist.
//   Home.jsx   — ek bhooli hui muted colour, asli galti.
import fs from "node:fs";

const MAP = [
  ["#c3c6e6", "#e6d4da"],   // purana indigo-muted → warm rose-muted
  ["#c2c7ee", "#dcc3ca"],
  ["rgba(195,198,230", "rgba(230,212,218"],
  ["rgba(194,199,238", "rgba(220,195,202"],
];

let hits = 0;
for (const f of ["src/pages/Home.jsx", "src/components/JyotishBackdrop.jsx"]) {
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  for (const [from, to] of MAP) {
    const n = s.split(from).length - 1;
    if (n) { s = s.split(from).join(to); hits += n; }
  }
  if (s !== before) { fs.writeFileSync(f, s, "utf8"); console.log(`${f}: badla`); }
}

// ── social.js pe comment daal do taaki koi baad me "fix" na kare ──
{
  const F = "src/config/social.js";
  let s = fs.readFileSync(F, "utf8");
  if (!s.includes("BRAND COLOURS")) {
    const NOTE = [
      "// ─────────────────────────────────────────────────────────────",
      "// BRAND COLOURS — inhe JAAN-BOOJH kar mat badalna.",
      "// Facebook #1877F2, LinkedIn #0A66C2, WhatsApp #25D366.",
      "// Ye blue/cyan HAIN aur hona bhi chahiye — inhe badalne se",
      "// unka pehchan hi khatam ho jayega. Baaki site puri tarah",
      "// gold + rose + maroon hai, ye sirf official brand colours hain.",
      "// ─────────────────────────────────────────────────────────────",
      "",
    ].join("\n");
    fs.writeFileSync(F, NOTE + s, "utf8");
    console.log("social.js: brand-colour warning comment add hua");
  }
}

console.log(`\n${hits} colour fix hue`);

// ── final audit with social.js excluded ──
import path from "node:path";
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.jsx?$/.test(e.name)) out.push(p);
  }
  return out;
}
function hueOf(h) {
  const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx === 0 ? 0 : (mx - mn) / mx;
  if (sat < 0.15) return null;
  const d = mx - mn; let hue = 0;
  if (d) { if (mx === r) hue = 60 * (((g - b) / d) % 6); else if (mx === g) hue = 60 * ((b - r) / d + 2); else hue = 60 * ((r - g) / d + 4); }
  if (hue < 0) hue += 360;
  return hue;
}

const ALLOW = new Set(["src\\config\\social.js", "src/config/social.js"]);
let bad = 0, total = 0;
console.log("\n══════ FINAL AUDIT ══════\n");
for (const f of walk(path.join(process.cwd(), "src"))) {
  if (ALLOW.has(f.replace(/\\/g, "/"))) continue;
  const src = fs.readFileSync(f, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ").replace(/^\s*\*.*$/gm, " ");
  const hits = new Set();
  let m;
  const re = /#([0-9a-f]{6})\b/gi;
  while ((m = re.exec(src))) { total++; const h = hueOf("#" + m[1]); if (h !== null && h > 170 && h < 285) hits.add("#" + m[1]); }
  const re2 = /rgba?\((\d+),\s*(\d+),\s*(\d+)/g;
  while ((m = re2.exec(src))) { total++; const hh = hueOf("#" + [1,2,3].map(i => (+m[i]).toString(16).padStart(2,"0")).join("")); if (hh !== null && hh > 170 && hh < 285) hits.add(`rgb(${m[1]},${m[2]},${m[3]})`); }
  if (hits.size) { bad += hits.size; console.log(`  ${f}: ${[...hits].join(", ")}`); }
}
console.log(`\n${total} colour values check kiye (social.js chhod kar)`);
console.log(bad ? `${bad} cool rang bache ❌` : "SITE PURI TARAH GOLD + ROSE + MAROON ✅");
process.exit(bad ? 1 : 0);
