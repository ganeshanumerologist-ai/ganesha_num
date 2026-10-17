// NAYA THEME — नीला/काला हटा, सुनहरा + गुलाबी + गहरा मारून.
//
// Astrological basis:
//   पीला/सुनहरा  = गुरु (गुरुवार, तपस्विनी, मंगलों का पीला)
//   गुलाबी        = शुक्र + गणेश का वर्ण (शुक्रवार, सौंदर्य)
//   गहरा मारून    = शनि की गंभीरता + वेदी/पंचाङ्ग का पारंपरिक वर्ण
//
// User ne kaha: "blue or black ka combination nahi, yellow, light gulabi,
// aur design thoda dark karo".
import fs from "node:fs";

const hex = (h) => { const s = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
const band = (r) => (r >= 7 ? "AAA  " : r >= 4.5 ? "AA   " : r >= 3 ? "AA-lg" : "FAIL ");

// ── नया palette ──
const P = {
  bgDeep:  "#140a10",   // सबसे गहरा — मारून-काला
  bgMid:   "#24121c",
  bgWarm:  "#2e1826",
  cardHi:  "#331c28",   // card ऊपर वाला
  cardLo:  "#22121a",   // card नीचे वाला
  chipHi:  "#3a2130",
  chipLo:  "#26141e",
  tileHi:  "#371f2d",
  tileLo:  "#241420",

  gold:     "#f7c948",  // मुख्य — गुरु
  goldHi:   "#ffe08a",  // gradient ka उजला सिरा
  goldDeep: "#d99a1e",
  rose:     "#f2a0b8",  // दूसरा — शुक्र/गणेश
  roseDeep: "#d16b8a",

  text:  "#fff6f0",     // गुन-सफ़ेद (ठंडा नहीं)
  muted: "#dcc3ca",
  accent: "#f2a0b8",    // cyan की जगह rose
  danger: "#ff8f9a",
};

const row = (l, bg, fg, need = 4.5) => {
  const r = ratio(bg, fg);
  console.log(`  ${r >= need ? "OK  " : "FAIL"}  ${l.padEnd(26)} ${band(r)} ${r.toFixed(2)}:1`);
  return r >= need;
};

let fails = 0;
const chk = (l, bg, fg, need) => { if (!row(l, bg, fg, need)) fails++; };

console.log("══════ BASE: purana (blue) vs naya (maroon) ══════\n");
console.log(`  purana bg  #141838   luminance ${lum("#141838").toFixed(4)}`);
console.log(`  naya   bg  ${P.bgDeep}   luminance ${lum(P.bgDeep).toFixed(4)}`);
console.log(`  naya   bg  ${P.bgMid}   luminance ${lum(P.bgMid).toFixed(4)}`);
console.log(`  → ${(lum("#141838") / lum(P.bgMid)).toFixed(1)}× gehra, aur RUNG badli (blue → maroon)`);
console.log("");

console.log("══════ DESKTOP CARD ══════\n");
chk("body text", P.cardHi, P.text);
chk("muted text", P.cardHi, P.muted);
chk("gold", P.cardHi, P.gold);
chk("rose", P.cardHi, P.rose);
chk("accent-2 (rose)", P.cardHi, P.rose);
console.log("");

console.log("══════ MOBILE CARD ══════\n");
chk("body text", P.cardLo, P.text);
chk("muted text", P.cardLo, P.muted);
chk("gold", P.cardLo, P.gold);
chk("rose", P.cardLo, P.rose);
console.log("");

console.log("══════ NUM CHIP ══════\n");
chk("number (gold)", P.chipHi, P.gold, 3);
chk("label", P.chipLo, P.text, 4.5);
console.log("");

console.log("══════ HERO (background art ke upar) ══════\n");
chk("H1 gradient — gold end", P.bgMid, P.goldHi);
chk("H1 gradient — rose end", P.bgMid, P.rose);
chk("sub text", P.bgMid, P.muted);
chk("badge", P.bgMid, P.gold);
console.log("");

console.log("══════ LOGO ॐ ══════\n");
chk("ॐ on cream disc", "#fff6d8", "#3b1604", 7);
console.log(`  gold ring on bg: ${ratio(P.bgMid, P.gold).toFixed(2)}:1`);
console.log("");

console.log("══════ HUE CHECK — koi blue nahi bachna chahiye ══════\n");
for (const [n, c] of Object.entries(P)) {
  const [r, g, b] = hex(c);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  let hue = 0;
  if (max !== min) {
    if (max === r) hue = 60 * (((g - b) / (max - min)) % 6);
    else if (max === g) hue = 60 * ((b - r) / (max - min) + 2);
    else hue = 60 * ((r - g) / (max - min) + 4);
  }
  if (hue < 0) hue += 360;
// Blue/cyan = 180–280 deg. Uske bahar sab warm hai:
// magenta/rose 300–360, red 355–20, orange/gold 20–90.
  const inBlue = hue > 170 && hue < 285;
  const warm = !inBlue || sat < 0.10;
  console.log(`  ${n.padEnd(9)} ${c}  hue ${hue.toFixed(0).padStart(3)}°  sat ${(sat * 100).toFixed(0)}%  ${warm ? "warm ✅" : "❌ COOL"}`);
  if (!warm && sat >= 0.12) fails++;
}

console.log("\n══════ NATA ══════");
console.log(fails ? `\n${fails} problem ❌` : "\nTHEME READY ✅");
process.exit(fails ? 1 : 0);
