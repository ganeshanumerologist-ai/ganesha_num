// styles.css me kitni dark values hain — light theme banane se pehle pata
import fs from "node:fs";

const s = fs.readFileSync("src/styles.css", "utf8");
const count = (re) => (s.match(re) || []).length;

console.log("=== dark-ish values ===");
console.log("  rgba(0,0,0,…)      ", count(/rgba\(0,\s*0,\s*0[^)]*\)/gi));
console.log("  rgba(0,0,0,0)      ", count(/rgba\(0,\s*0,\s*0,\s*0\)/gi));
console.log("  #0xxxxx / #1xxxxx  ", count(/#[01][0-9a-f]{5}/gi));
console.log("  #2xxxxx            ", count(/#[23][0-9a-f]{5}/gi));
console.log("  white rgba(255,255 ", count(/rgba\(255,\s*255,\s*255/gi));
console.log("  #ffffff            ", count(/#ffffff/gi));
console.log("  linear-gradient    ", count(/linear-gradient/gi));
console.log("  radial-gradient    ", count(/radial-gradient/gi));

console.log("\n=== unique rgba values (top 30) ===");
const seen = {};
for (const m of s.matchAll(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/g)) {
  const k = m[0].replace(/\s+/g, " ");
  seen[k] = (seen[k] || 0) + 1;
}
Object.entries(seen)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .forEach(([k, v]) => console.log(`  ${String(v).padStart(3)}x  ${k}`));

console.log("\n=== unique hex ===");
const hex = {};
for (const m of s.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
  const k = m[0].toLowerCase();
  hex[k] = (hex[k] || 0) + 1;
}
Object.entries(hex).sort((a, b) => b[1] - a[1]).slice(0, 25)
  .forEach(([k, v]) => console.log(`  ${String(v).padStart(3)}x  ${k}`));

// SVG art me colours
for (const f of ["src/components/JyotishBackdrop.jsx", "src/components/Logo3D.jsx"]) {
  const t = fs.readFileSync(f, "utf8");
  const hx = {};
  for (const m of t.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
    const k = m[0].toLowerCase();
    hx[k] = (hx[k] || 0) + 1;
  }
  console.log(`\n=== ${f.split("/").pop()} hex ===`);
  Object.entries(hx).forEach(([k, v]) => console.log(`  ${String(v).padStart(3)}x  ${k}`));
}