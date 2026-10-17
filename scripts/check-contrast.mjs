// WCAG contrast ratio — pehle colors change karne se pehle NAAPA lo.
// Dark background par dim grey text = invisible phone par.
//
// Rules:
//   AA normal text = 4.5:1
//   AA large text  = 3:1
//   AAA            = 7:1

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

export function ratio(a, b) {
  const l1 = lum(a);
  const l2 = lum(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

const band = (r) =>
  r >= 7 ? "AAA  " : r >= 4.5 ? "AA   " : r >= 3 ? "AA-lg" : "FAIL ";

// ── Abhi kya hai ──
const BG_NOW = ["#0f1428", "#101438", "#161a3d", "#1c1436"];
const TEXT_NOW = {
  body: "#c3c6e6",
  muted: "#9d9fc4",
  gold: "#fbbf24",
  accent: "#22d3ee",
  white: "#ffffff",
  logo_om: "#4a1d05",
};

console.log("══════ ABKI STHAAT (yehi problem hai) ══════\n");
for (const bg of BG_NOW) {
  console.log(`background ${bg}  (luminance ${lum(bg).toFixed(4)})`);
  for (const [k, v] of Object.entries(TEXT_NOW)) {
    const r = ratio(bg, v);
    console.log(`   ${k.padEnd(9)} ${v}  ${band(r)} ${r.toFixed(2)}:1`);
  }
  console.log("");
}

console.log("══════ SAMAJH ══════");
console.log("Mera 'halka' kiya hua #101438 = RGB(16,20,56) — yeh BHI");
console.log("qareeb kaala hai. Sach me asafal hua. Screens par jyada dikhta hai");
console.log("kyunki wo cards ke upar text hai, background par nahi.\n");
console.log(`Muted grey #c3c6e6 par #101438 ka ratio = ${ratio("#101438", "#c3c6e6").toFixed(2)}:1`);
console.log("— dekhne layak hai par phone par chhota aur dim padhta hai.\n");

console.log("══════ NAYA RANGE (theory) ══════");
const BG_NEW = ["#1d2450", "#26215c", "#302866", "#241a4d"];
for (const bg of BG_NEW) {
  const rows = Object.entries(TEXT_NOW)
    .map(([k, v]) => `   ${k.padEnd(9)} ${v}  ${band(ratio(bg, v))} ${ratio(bg, v).toFixed(2)}:1`)
    .join("\n");
  console.log(`background ${bg}  (lum ${lum(bg).toFixed(4)})\n${rows}\n`);
}

console.log("══════ BRIGHTER TEXT KE SAATH ══════");
const TEXT_BRIGHTER = { body: "#e8eaff", muted: "#b9bde0", gold: "#ffd45e", accent: "#5ee7f5", white: "#ffffff" };
for (const bg of ["#101438", "#1d2450", "#26215c"]) {
  const rows = Object.entries(TEXT_BRIGHTER)
    .map(([k, v]) => `   ${k.padEnd(9)} ${v}  ${band(ratio(bg, v))} ${ratio(bg, v).toFixed(2)}:1`)
    .join("\n");
  console.log(`background ${bg} (lum ${lum(bg).toFixed(4)})\n${rows}\n`);
}