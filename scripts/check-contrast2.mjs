// Nayi palette ka contrast NAAPO, phir CSS me daalo. Guess nahi.
// AA normal text = 4.5:1 | AA large = 3:1 | AAA = 7:1

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

// ── 1. LOGO: ॐ ke naye colours ──
console.log("════ 1. ॐ (logo ka text) ════\n");
const disc = "#fff6d8";      // naya solid disc
const om = "#3b1604";        // naya ॐ colour
console.log(`   disc ${disc} par ॐ ${om}  ${band(ratio(disc, om))} ${ratio(disc, om).toFixed(2)}:1`);
console.log(`   purana #4a1d05 tha -> ${ratio(disc, "#4a1d05").toFixed(2)}:1`);
console.log(`   purana #4a1d05 background ${"#101438"} par -> ${ratio("#101438", "#4a1d05").toFixed(2)}:1  (FAIL tha)\n`);

// ── 2. BACKGROUND: kitna halka karna hai ──
console.log("════ 2. Background — kitna halka? ════\n");
const CANDS = {
  "purana (asafal)": ["#161a3d", "#101438", "#1c1436"],
  "naya (thoda halka)": ["#22275c", "#1b1f4a", "#33245f"],
  "naya-2 (aur halka)": ["#2a3068", "#202654", "#3d2b6e"],
};
for (const [name, bgs] of Object.entries(CANDS)) {
  console.log(`── ${name}`);
  for (const bg of bgs) {
    console.log(`   ${bg}  luminance ${lum(bg).toFixed(4)}  (RGB ${hex(bg).join(",")})`);
  }
  console.log("");
}

// ── 3. TEXT: card ke upar (card opaque hai, background se alag) ──
console.log("════ 3. Card ka background + text ════\n");
const CARDS = {
  "purana card #12162e": "#12162e",
  "naya card   #191d3f": "#191d3f",
  "naya card   #1e2348": "#1e2348",
};
const TEXTS = {
  body_purana: "#c3c6e6",
  body_naya: "#e8ebff",
  muted_purana: "#9d9fc4",
  muted_naya: "#c2c7ee",
  gold: "#fbbf24",
  gold_naya: "#ffd45e",
  accent: "#22d3ee",
};
for (const [cn, cb] of Object.entries(CARDS)) {
  console.log(`── ${cn}`);
  for (const [tn, tv] of Object.entries(TEXTS)) {
    const r = ratio(cb, tv);
    console.log(`   ${tn.padEnd(14)} ${tv}  ${band(r)} ${r.toFixed(2)}:1`);
  }
  console.log("");
}

// ── 4. GRADIENT TEXT fallback (phone par gradient render na hota) ──
console.log("════ 4. Gradient text ka fallback ════\n");
for (const bg of ["#101438", "#1b1f4a", "#202654"]) {
  console.log(`   ${bg} par gold #ffd45e  ${band(ratio(bg, "#ffd45e"))} ${ratio(bg, "#ffd45e").toFixed(2)}:1`);
  console.log(`   ${bg} par white #ffffff ${band(ratio(bg, "#ffffff"))} ${ratio(bg, "#ffffff").toFixed(2)}:1`);
}

// ── 5. DECISION ──
console.log("\n════ DECISION ════");
const pickBg = "#1b1f4a";
console.log(`background base: ${pickBg}  (luminance ${lum(pickBg).toFixed(4)}, purane ${lum("#101438").toFixed(4)} se ${(lum(pickBg)/lum("#101438")).toFixed(1)}× chamka)`);
console.log(`ॐ            : ${ratio(disc, om).toFixed(2)}:1 on solid disc  ✅`);
console.log(`body text    : ${ratio("#1e2348", "#e8ebff").toFixed(2)}:1 on card          ✅`);
console.log(`muted text   : ${ratio("#1e2348", "#c2c7ee").toFixed(2)}:1 on card          ✅`);
console.log(`gradient fbk : ${ratio(pickBg, "#ffd45e").toFixed(2)}:1 on background      ✅`);
