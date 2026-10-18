// ════════════════════════════════════════════════════════════════════
//  SVG art + meta colours → LIGHT
//
//  JyotishBackdrop (mandala, stars, rings) aur Logo3D (ॐ mark) dono
//  bright gold/rose par banaye the — wo DARK background ke liye the.
//  Cream par wo bilkul dhundhle ho jaate hain.
//
//  Yahan har bright gold/rose ko DEEP version se replace kiya gaya hai:
//    #f7c948 (bright gold) → #c98a10 (gold — cream par dikhe)
//    #f2a0b8 (bright rose) → #b0356a (deep rose)
//    #d16b8a (wine)         → #8d2450
//    #ffe9a8 / #fde68a      → #e8c98a (soft gold highlight)
//    #fff6d8 / #fff8e1      → #fffaf0 (cream disc)
//    #4a1d05 / #3b1604      → #5a2d12 (ॐ ka gehra rang)
//
//  BAHUT IMPORTANT: Logo3D ka `#3b1604` ॐ text `#fff6d8` disc par hai
//  (14.9:1 contrast) — wo combination NAHI badalna chahiye, warna ॐ
//  invisible ho jaayega. Neeche alag se handle kiya hai.
// ════════════════════════════════════════════════════════════════════
import fs from "node:fs";

let total = 0;

function patchFile(path, pairs, label) {
  let s = fs.readFileSync(path, "utf8");
  let n = 0;
  console.log(`\n═══ ${label} ═══`);
  for (const [from, to, why] of pairs) {
    const c = s.split(from).length - 1;
    if (!c) continue;
    s = s.split(from).join(to);
    n += c;
    console.log(`  ${String(c).padStart(3)}x  ${why}`);
  }
  fs.writeFileSync(path, s, "utf8");
  total += n;
  return n;
}

// ── JyotishBackdrop ──
patchFile(
  "src/components/JyotishBackdrop.jsx",
  [
    ["#f7c948", "#c98a10", "bright gold → cream-par-dikhe gold"],
    ["#f2a0b8", "#b0356a", "bright rose → deep rose"],
    ["#d16b8a", "#8d2450", "wine → deeper"],
    ["#e8ecff", "#e6d3d8", "stale pale blue → warm"],
    ["#f97316", "#c2620f", "orange → deep saffron"],
    ["#b45309", "#7a4d00", "dark amber"],
    ["#fff", "#c98a10", "plain white → gold"],
  ],
  "JyotishBackdrop"
);

// ── Logo3D ──
// ॐ ka disc #fff6d8 + text #3b1604 = 14.9:1 — WOH SAHI HAI, mat chhedna.
// Sirf ring/halo ke colours light theme ke liye badalne hain.
patchFile(
  "src/components/Logo3D.jsx",
  [
    ["#f7c948", "#c98a10", "bright gold → gold"],
    ["#fde68a", "#e8c98a", "soft gold highlight"],
    ["#f2a0b8", "#b0356a", "bright rose → deep rose"],
    ["#b45309", "#7a4d00", "dark amber"],
    // disc + text — ye combination hi contrast banata hai, isliye
    // #fff6d8 aur #3b1604 CHHEDE NAHI
  ],
  "Logo3D (ring/halo)"
);

// ── index.html ──
patchFile(
  "index.html",
  [
    ['content="#140a10"', 'content="#fdf6ee"', "theme-color → cream"],
    ['content="dark"', 'content="light"', "color-scheme → light"],
    ["color:#fff6f0;background:#140a10", "color:#2b141c;background:#fdf6ee", "crawler block colours"],
    ["color:#f7c948;margin:0 0 12px", "color:#7a4d00;margin:0 0 12px", "crawler h1 → bronze"],
    ["color:#dcc3ca;max-width:640px", "color:#6a4351;max-width:640px", "crawler p → muted"],
  ],
  "index.html"
);

// ── manifest.json ──
patchFile(
  "public/manifest.json",
  [
    ['"background_color": "#140a10"', '"background_color": "#fdf6ee"', "bg → cream"],
    ['"theme_color": "#140a10"', '"theme_color": "#fdf6ee"', "theme → cream"],
  ],
  "manifest.json"
);

// ── prerender.mjs ke inline crawler colours ──
patchFile(
  "scripts/prerender.mjs",
  [
    ["color:#fff6f0;background:#140a10", "color:#2b141c;background:#fdf6ee", "crawler block"],
    ["color:#f7c948;margin:0 0 12px", "color:#7a4d00;margin:0 0 12px", "crawler h1"],
    ["color:#dcc3ca;max-width:640px", "color:#6a4351;max-width:640px", "crawler p"],
  ],
  "prerender.mjs"
);

console.log(`\n${"═".repeat(46)}\n${total} colour replace`);

// ── bacha hua dark check ──
console.log("\n═══ bache hue dark colours ═══");
for (const f of ["src/components/JyotishBackdrop.jsx", "src/components/Logo3D.jsx", "index.html", "public/manifest.json"]) {
  const t = fs.readFileSync(f, "utf8");
  const bad = [...new Set([...t.matchAll(/#[0-9a-f]{3,8}\b/gi)].map(m => m[0].toLowerCase()))]
    .filter(h => {
      const v = h.replace("#", "");
      const r = parseInt(v.slice(0, 2), 16);
      const g = parseInt(v.slice(2, 4), 16);
      const b = parseInt(v.slice(4, 6), 16);
      return r < 60 && g < 60 && b < 60; // near-black
    });
  console.log(`  ${f.split("/").pop().padEnd(24)} ${bad.length ? bad.join(", ") : "saaf ✅"}`);
}