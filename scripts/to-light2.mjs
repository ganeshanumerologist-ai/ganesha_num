// Gradient TEXT + bache hue light fixes
//
// Bright gold (#ffe9a8 → #f7c948 → #f2a0b8) CREAM background par
// bilkul invisible hai — text gayab. Isliye gradient ko gehra karna
// zaroori hai: bronze → deep rose. Brand wahi hai (gold→rose),
// sirf readable version.
import fs from "node:fs";

const F = "src/styles.css";
let s = fs.readFileSync(F, "utf8");
let n = 0;

const rep = (from, to, why) => {
  const c = s.split(from).length - 1;
  if (!c) { console.log(`  MISS  ${why}`); return; }
  s = s.split(from).join(to);
  n += c;
  console.log(`  ${String(c).padStart(3)}x  ${why}`);
};

console.log("═══ Gradient text ═══");
// Cream par: #7a4a00 (deep bronze) → #a1426b → #b0356a
rep("#ffe9a8 0%, #f7c948 38%, #f2a0b8 100%",
    "#6b3f00 0%, #9c3f68 40%, #b0356a 100%",
    "text-gradient: bright gold → deep bronze/rose");

rep("drop-shadow(0 6px 26px rgba(247,201,72,.28))",
    "drop-shadow(0 4px 14px rgba(122,60,86,.14))",
    "gradient text shadow");

// number-card wala gradient (L619 area)
rep("linear-gradient(135deg, var(--accent), var(--gold))",
    "linear-gradient(135deg, var(--rose-deep), var(--gold))",
    "number-card gradient (accent/gold)");

// gold thin lines — cream par bright gold low-alpha invisible hai
rep("rgba(247,201,72,.55), transparent",
    "rgba(154,106,20,.75), transparent", "hero hairline");
rep("rgba(247,201,72,.45)", "rgba(160,110,22,.72)", "gold border mid");
rep("rgba(247,201,72,.30)", "rgba(160,110,22,.55)", "gold border");
rep("rgba(247,201,72,.34)", "rgba(160,110,22,.58)", "gold border 34");
rep("rgba(247,201,72,.35)", "rgba(160,110,22,.58)", "gold border 35");
rep("rgba(247,201,72,.42)", "rgba(160,110,22,.62)", "gold border 42");
rep("rgba(247,201,72,.50)", "rgba(160,110,22,.66)", "gold border 50");
rep("rgba(247,201,72,.55)", "rgba(160,110,22,.70)", "gold border 55");
rep("rgba(247,201,72,.65)", "rgba(160,110,22,.76)", "gold border 65");
rep("rgba(247,201,72,.22)", "rgba(160,110,22,.42)", "gold border 22");
rep("rgba(247,201,72,.24)", "rgba(160,110,22,.44)", "gold border 24");
rep("rgba(247,201,72,.28)", "rgba(160,110,22,.48)", "gold border 28");
rep("rgba(247,201,72,.12)", "rgba(160,110,22,.28)", "gold border 12");
rep("rgba(247,201,72,.18)", "rgba(160,110,22,.34)", "gold border 18");
rep("rgba( 247, 201, 72, .28)", "rgba( 160, 110, 22, .48)", "gold border spaced");

// rose borders — thoda strong
rep("rgba(242,160,184,.34)", "rgba(196,80,128,.45)", "rose border 34");
rep("rgba(242,160,184,.36)", "rgba(196,80,128,.46)", "rose border 36");
rep("rgba(242,160,184,.15)", "rgba(196,80,128,.30)", "rose border 15");
rep("rgba(242,160,184,.16)", "rgba(196,80,128,.32)", "rose border 16");
rep("rgba(209,107,138,.18)", "rgba(170,50,95,.26)", "wine border");

fs.writeFileSync(F, s, "utf8");
console.log(`\n${n} replacement`);

// ─────────────────────────────────────────────────────────────
//  Verify: contrast
// ─────────────────────────────────────────────────────────────
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
console.log("\n═══ CONTRAST (light theme) ═══");
console.log("  rang                     cream      white     rating");
const TOKENS = {
  "--text  #2b141c": "#2b141c",
  "--muted #6a4351": "#6a4351",
  "--gold  #8a5a00": "#8a5a00",
  "--rose  #b0356a": "#b0356a",
  "--rose-deep #8d2450": "#8d2450",
  "--saffron #a15c00": "#a15c00",
  "--danger #b3261e": "#b3261e",
};
const grade = (r) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA " : r >= 3 ? "AA-large" : "FAIL");
let fail = 0;
for (const [name, hex] of Object.entries(TOKENS)) {
  const c = hex2rgb(hex);
  const r1 = ratio(c, BG), r2 = ratio(c, CARD);
  const bad = r1 < 4.5;
  if (bad) fail++;
  console.log(
    `  ${name.padEnd(24)} ${r1.toFixed(2)}:1   ${r2.toFixed(2)}:1   ${grade(r1)}${bad ? "  <<< FAIL" : ""}`
  );
}
// white text on gold button
const gb = ratio([255, 255, 255], hex2rgb("#8a5a00"));
console.log(`\n  white text on --gold fill   ${gb.toFixed(2)}:1   ${grade(gb)}`);
const gb2 = ratio(hex2rgb("#2b141c"), hex2rgb("#f2b705"));
console.log(`  dark text on bright gold    ${gb2.toFixed(2)}:1   ${grade(gb2)}`);

console.log(fail ? `\n${fail} FAIL` : "\nSab token AA+ hain ✅");