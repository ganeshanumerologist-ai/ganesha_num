// FINAL check: CSS me jo ASLI values lage hain, unka contrast.
// Yahan koi guess nahi — values styles.css se hi uthaye gaye hain.

const hex = (h) => {
  const s = h.replace("#", "");
  const f = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
};
const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const lum = (h) => {
  const [r, g, b] = hex(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const l1 = lum(a), l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const band = (r) => (r >= 7 ? "AAA  " : r >= 4.5 ? "AA   " : r >= 3 ? "AA-lg" : "FAIL ");

// ── Ye values abhi-kabhi ki styles.css / Logo3D.jsx me hain ──
const BG_OLD = "#070b18";
const SKY = ["#22275c", "#1b1f4a", "#33245f"];
const CARD_D = ["#262c5a", "#1b2344"];  // rgba(38,44,90,.90) over lighter bg
const CARD_M = ["#2c3366", "#1f244c"];  // mobile block
const TILE = ["#282e60", "#1c2148"];
const CHIP_D = ["#303769", "#20254c"];
const CHIP_M = ["#363e76", "#242a56"];
const DISC = "#fff6d8";      // logo ka solid disc
const OM = "#3b1604";        // ॐ

const TXT = {
  "--text  #ffffff": "#ffffff",
  "--muted #c2c7ee": "#c2c7ee",
  "--gold  #ffd45e": "#ffd45e",
  "--accent-2 #5ee7f5": "#5ee7f5",
  "badge #ffd45e": "#ffd45e",
  "num-chip span #e2e6ff": "#e2e6ff",
  "kv .k #e2e6ff": "#e2e6ff",
};

let fails = 0;
const row = (label, bg, fg, need = 4.5) => {
  const r = ratio(bg, fg);
  const ok = r >= need;
  if (!ok) fails++;
  console.log(`   ${ok ? "OK  " : "FAIL"}  ${label.padEnd(26)} ${band(r)} ${r.toFixed(2)}:1`);
};

console.log("══════ 1. ॐ (logo) ══════\n");
console.log(`   purana: ॐ #4a1d05 par background ${BG_OLD} = ${ratio(BG_OLD, "#4a1d05").toFixed(2)}:1  FAIL ❌`);
row("ॐ naya, solid disc par", DISC, OM, 7);

console.log("\n══════ 2. DESKTOP card par text ══════\n");
for (const bg of CARD_D) {
  console.log(`  card ${bg}`);
  for (const [n, c] of Object.entries(TXT)) row(n, bg, c);
  console.log("");
}

console.log("══════ 3. MOBILE card par text (jahan complaint thi) ══════\n");
for (const bg of CARD_M) {
  console.log(`  card ${bg}`);
  for (const [n, c] of Object.entries(TXT)) row(n, bg, c);
  console.log("");
}

console.log("══════ 4. num-chip ══════\n");
for (const bg of CHIP_D) row("desktop chip b (gold)", bg, "#ffd45e", 3);
for (const bg of CHIP_M) row("mobile  chip b (gold)", bg, "#ffd45e", 3);
for (const bg of CHIP_M) row("mobile  chip span", bg, "#e2e6ff", 4.5);

console.log("\n══════ 5. Background par gradient-text fallback ══════\n");
for (const bg of SKY) row(`gradient fbk gold`, bg, "#ffd45e", 3);
for (const bg of SKY) row(`tile text`, bg, "#ffffff", 4.5);

console.log("══════ 6. BACKGROUND kitna halka hua? ══════\n");
console.log(`   purana --bg  ${BG_OLD}  luminance ${lum(BG_OLD).toFixed(4)}`);
for (const s of SKY) console.log(`   naya  sky    ${s}  luminance ${lum(s).toFixed(4)}`);
const lo = lum(SKY[1]) / lum(BG_OLD);
console.log(`\n   → beech ka sky purane background se ${lo.toFixed(1)}× zyada chamakta hai`);

console.log("\n══════ NATA ══════");
console.log(fails ? `\n${fails} jagah contrast AA nahi paa rahi ❌` : `\nSAARI JAHAGAH contrast AA+ hai ✅`);
process.exit(fails ? 1 : 0);
