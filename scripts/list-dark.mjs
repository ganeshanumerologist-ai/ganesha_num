// Light theme ke liye — kaun se places dark hain (line numbers ke saath)
import fs from "node:fs";

const files = ["src/styles.css"];
for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  console.log(`\n═══ ${f} ═══`);
  lines.forEach((l, i) => {
    const isDark =
      /rgba\(\s*0\s*,\s*0\s*,\s*0/.test(l) ||
      /#[0-1][0-9a-f]{5}\b/i.test(l) ||
      /#[23][0-9a-f]{5}\b/i.test(l) ||
      /rgba\(255\s*,\s*255\s*,\s*255\s*,\s*0?\.\d/.test(l) ||
      /rgba\(\s*(1[0-9]|2[0-9]|3[0-9]|4[0-9]|[5-9][0-9])\s*,\s*\d+\s*,\s*\d+\s*,/.test(l) ||
      /#000\b/.test(l);
    if (isDark) {
      const t = l.trim().replace(/\s+/g, " ");
      console.log(`  L${String(i + 1).padStart(4)}  ${t.slice(0, 118)}`);
    }
  });
}