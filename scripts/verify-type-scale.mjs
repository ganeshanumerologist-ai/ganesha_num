// clamp() ko SAHI scale pe verify karo — pehle wala script px ko rem
// me convert nahi karta tha, isi liye har screen pe 5.00rem dikha raha tha.
const hero = { min: 2.1, prefVw: 4.6, max: 6.5 };
const h2 = { min: 1.35, prefVw: 2.6, max: 3.0 };
const base = 16;

function px({ min, prefVw, max }, w) {
  const rem = Math.min(Math.max((w * prefVw) / 100 / base, min), max);
  return { rem, px: rem * base };
}

console.log("══════ HERO H1 — clamp(2.1rem, 4.6vw, 6.5rem) ══════\n");
console.log("  screen      H1          note");
const rows = [
  [360, "phone"], [414, "phone lge"], [768, "tablet"],
  [1280, "laptop"], [1600, "desktop"], [1920, "1080p"],
  [2560, "1440p"], [3840, "4K UHD"],
];
for (const [w, name] of rows) {
  const r = px(hero, w);
  const note = r.rem === hero.min ? "min par (clamped)" : r.rem === hero.max ? "max par (clamped)" : "vw se";
  console.log(`  ${String(w).padStart(4)}px ${name.padEnd(10)} ${r.rem.toFixed(2)}rem / ${r.px.toFixed(0).padStart(3)}px   ${note}`);
}

console.log("\n══════ SECTION H2 — clamp(1.35rem, 2.6vw, 3rem) ══════\n");
for (const [w, name] of rows) {
  const r = px(h2, w);
  console.log(`  ${String(w).padStart(4)}px ${name.padEnd(10)} ${r.rem.toFixed(2)}rem / ${r.px.toFixed(0).padStart(3)}px`);
}

console.log("\n══════ CHECK ══════\n");
const checks = [
  ["phone par chhota hai (min)", px(hero, 360).px <= 36, `${px(hero, 360).px}px`],
  ["phone par line tootegi nahi", px(hero, 360).px < 360 * 0.14, `${px(hero, 360).px}px < 50px`],
  ["4K par bada lagta hai", px(hero, 3840).px >= 100, `${px(hero, 3840).px}px`],
  ["720p se 4K tak badhta hai", px(hero, 1280).px < px(hero, 3840).px, `${px(hero, 1280).px} → ${px(hero, 3840).px}`],
  ["H1 < H2 kabhi nahi", px(hero, 360).px >= px(h2, 360).px, `${px(hero,360).px} vs ${px(h2,360).px}`],
];
let bad = 0;
for (const [n, ok, d] of checks) {
  console.log(`  ${ok ? "OK  " : "FAIL"}  ${n.padEnd(30)} ${d}`);
  if (!ok) bad++;
}
console.log(bad ? `\n${bad} design check fail ❌` : "\nTYPE SCALE SAHI HAI ✅");
