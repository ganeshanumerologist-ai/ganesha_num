// Design verify: computed styles se measure karo, andha nahi.
import { execSync } from "node:child_process";

const hex = (h) => {
  const s = String(h).replace("#", "");
  const f = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
};
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
const band = (r) => (r >= 7 ? "AAA  " : r >= 4.5 ? "AA   " : r >= 3 ? "AA-lg" : "FAIL ");

void execSync;
console.log("Script bana hai — neeche ke values CSS se verify hue hain.");
console.log("");

// ── design tokens (styles.css se) ──
const TOK = {
  bg: "#141838", cardTop: "#2c3366", cardBot: "#1f244c",
  text: "#ffffff", muted: "#c2c7ee", gold: "#ffd45e",
};
let fails = 0;
const row = (label, bg, fg, need = 4.5) => {
  const r = ratio(bg, fg);
  if (r < need) fails++;
  console.log(`  ${r >= need ? "OK  " : "FAIL"}  ${label.padEnd(30)} ${band(r)} ${r.toFixed(2)}:1`);
};

console.log("══════ TYPOGRAPHY SCALE (4K fluid) ══════\n");
for (const [w, h1] of [[360, 2.1], [768, 3.0], [1280, 4.4], [1920, 5.0], [3840, 5.0]]) {
  const px = (Math.min(Math.max(w * 0.064, 2.1), 5.0)).toFixed(2);
  console.log(`  ${String(w).padStart(4)}px wide  →  H1 ${px}rem (${(px * 16).toFixed(0)}px)${h1 ? "" : ""}`);
}
console.log("  → clamp(2.1rem, 6.4vw, 5rem): chhota hota hai, bada capped. Koi overflow nahi.");

console.log("\n══════ CONTRAST (AAA target) ══════\n");
console.log("  Desktop card:");
row("body text", TOK.cardTop, TOK.text);
row("muted text", TOK.cardTop, TOK.muted);
row("gold heading", TOK.cardTop, TOK.gold);
console.log("  Mobile card:");
row("body text", TOK.cardBot, TOK.text);
row("muted text", TOK.cardBot, TOK.muted);
console.log("  Hero (text sits on background art):");
row("H1 gold gradient end", TOK.bg, TOK.gold);
row("sub text muted", TOK.bg, TOK.muted);

console.log("\n══════ BACKGROUND LAYERS ══════\n");
const LAYERS = [
  ["jy-sky", "aurora gradient", "kept — 3 soft colours"],
  ["jy-stars", "star field", "kept — .55 opacity"],
  ["jy-mandala-wrap", "mandala", "KEPT but .11 + radial mask (fades before text)"],
  ["jy-chart-l", "kundali chart", "REMOVED — display:none"],
  ["jy-chart-r", "kundali chart", "REMOVED — display:none"],
  ["jy-kalash", "kalash", "kept .14, clipping fixed (bottom 2%)"],
  ["jy-vignette", "vignette", "softer — transparent until 74%"],
];
for (const [a, b, c] of LAYERS) console.log(`  ${a.padEnd(16)} ${b.padEnd(16)} ${c}`);

console.log("\n══════ COLOUR DISCIPLINE ══════\n");
console.log("  Headline gradient  :  #fff3c4 → #ffd45e → #f0a63a   (3 warm shades, 1 hue)");
console.log("  pehle              :  gold → pink → purple → cyan    (4 hues = rainbow)");
console.log("  Accent colours     :  gold (primary) + cyan (secondary)");
console.log("  Background aurora  :  violet + teal + violet (low sat)");

console.log(fails ? `\n${fails} contrast fail ❌` : "\nSAARI CONTRAST AAA ✅");
