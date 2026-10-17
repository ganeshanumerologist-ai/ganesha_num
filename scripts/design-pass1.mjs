// ── DESIGN PASS 1: background ka dobara architecture ──────────────────
//
// Screenshot me jo dikha, usme asli problem "dark" nahi thi — CLUTTER
// thi. Paanch layers ek saath: mandala + 2 kundali chart + kalash + stars.
// Sab ek dusre se compete kar rahe the aur mandala ki lines headline ke
// ANDAR se guzar rahi thi.
//
// Lighter karna = clean karna nahi hota. Yahan 3 kaam:
//   1. Kundali chart layers HATA diye (sabse zyada line-art yahi thi)
//   2. Mandala ko ek hi halka ring bana kar radial mask se fade kiya,
//      taaki wo text tak na aaye
//   3. Kalash ka clipping theek kiya
//
// Baaki: aurora colours thode kam, vignette softer.
import fs from "node:fs";

const F = "src/styles.css";
let css = fs.readFileSync(F, "utf8");

const REPL = [
  // ── 1. sky: kam rang, naram transitions (rainbow nahi) ──
  [
`.jy-sky {
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(1100px 760px at 78% -12%, rgba(139,92,246,.38), transparent 62%),
    radial-gradient(900px 620px at 8% 8%, rgba(34,211,238,.26), transparent 60%),
    radial-gradient(1000px 900px at 50% 118%, rgba(255,212,94,.22), transparent 62%),
    radial-gradient(900px 700px at 50% 34%, rgba(91,52,182,.34), transparent 70%),
    linear-gradient(170deg, #22275c 0%, #1b1f4a 45%, #33245f 100%);
}`,
`/* ── ULTRA CLEAN AURORA ──
   Sirf 3 rang, teeno aage-peechhe blend karte hue — rainbow nahi.
   Pehle 5 gradients the jo ek dusre ko kaat rahe the. */
.jy-sky {
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(1200px 820px at 72% -14%, rgba(124,92,220,.34), transparent 64%),
    radial-gradient(1000px 700px at 16% 6%, rgba(48,132,196,.22), transparent 62%),
    radial-gradient(1100px 900px at 50% 116%, rgba(96,72,168,.26), transparent 66%),
    linear-gradient(168deg, #21264f 0%, #191d44 48%, #241c48 100%);
}`,
  ],

  // ── 2. mandala: ek ring, fade-out ke saath ──
  [
`.jy-mandala-wrap {
  top: 46%;
  left: 50%;
  width: min(190vmin, 1750px);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  opacity: .34;
}
.jy-mandala {
  width: 100%;
  height: 100%;
  animation: jyspin 320s linear infinite;
  filter: drop-shadow(0 0 40px rgba(251,191,36,.12));
}`,
`/* ── MANDALA: ab sirf ek halki si ring ──
   Pehle poori kaali drawing thi aur uski lines text ke upar aa jaati
   thi. Ab: opacity .10, aur radial mask jo beech me 42% tak rakhta hai
   aur 72% pe poori tarah gaayab kar deta hai — yaani ring text tak
   pahunchti hi nahi. */
.jy-mandala-wrap {
  top: 42%;
  left: 50%;
  width: min(150vmin, 1500px);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  opacity: .11;
  -webkit-mask-image: radial-gradient(circle at 50% 50%,
      #000 0%, #000 42%, transparent 74%);
  mask-image: radial-gradient(circle at 50% 50%,
      #000 0%, #000 42%, transparent 74%);
}
.jy-mandala {
  width: 100%;
  height: 100%;
  animation: jyspin 480s linear infinite;
  filter: none;
}`,
  ],

  // ── 3. kundali chart layers: HATA diye ──
  [
`.jy-chart { width: min(52vw, 620px); height: auto; opacity: .44; }
.jy-chart-l { bottom: -14%; left: -13%; }
.jy-chart-r { top: -16%; right: -13%; transform: scaleX(-1); opacity: .30; }`,
`/* ── KUNDALI CHART BACKGROUND SE HATA DIYE ──
   Ye dono sabse zyada line-art the aur text ke peeche grid banakar
   dikh rahe the. Design me "clean" ka matlab hai: jo cheez padhne me
   takleef de, use hatao. Art Gallery page par maujood hai, wahan
   sahi jagah hai. */
.jy-chart { display: none; }
.jy-chart-l, .jy-chart-r { display: none; }`,
  ],

  // ── 4. kalash: clipping theek, halka ──
  [
`.jy-kalash {
  bottom: -6%; right: 6%;
  width: min(30vmin, 330px); height: auto;
  opacity: .32;
  animation: jyfloat 16s ease-in-out infinite;
}`,
`/* Pehle bottom -6% right 6% tha, jisse kalash ka aadha hissa screen
   se bahar chala jaata tha aur wo galti lagti thi. Ab poora dikhta hai
   aur halka hai. */
.jy-kalash {
  bottom: 2%; right: 3%;
  width: min(22vmin, 250px); height: auto;
  opacity: .14;
  animation: jyfloat 22s ease-in-out infinite;
}`,
  ],

  // ── 5. stars: bas thode sa ──
  [`.jy-stars { inset: 0; width: 100%; height: 100%; opacity: .72; }`,
   `.jy-stars { inset: 0; width: 100%; height: 100%; opacity: .55; }`],

  // ── 6. vignette: bahut halka, sirf godi maarta hai ──
  [
`.jy-vignette {
  position: absolute; inset: 0;
  background:
    radial-gradient(130% 90% at 50% 45%, transparent 62%, rgba(10,8,26,.24) 100%);
}`,
`.jy-vignette {
  position: absolute; inset: 0;
  background:
    radial-gradient(140% 100% at 50% 45%, transparent 74%, rgba(14,11,32,.22) 100%);
}`,
  ],

  // ── 7. mobile block: background aur bhi halka, cards strong ──
  [
`  .jy-mandala-wrap { opacity: .26; width: min(210vmin, 1400px); }
  .jy-chart { opacity: .30; width: min(78vw, 420px); }
  .jy-chart-r { opacity: .20; }
  .jy-kalash { opacity: .24; width: min(38vmin, 220px); }
  .jy-stars { opacity: .62; }`,
`  /* Mobile par art aur bhi kam — content ki padhai pehle. */
  .jy-mandala-wrap { opacity: .09; width: min(180vmin, 1300px); }
  .jy-kalash { opacity: .09; width: min(30vmin, 180px); }
  .jy-stars { opacity: .48; }`,
  ],
];

let n = 0;
for (const [from, to] of REPL) {
  if (css.includes(from)) { css = css.replace(from, to); n++; }
  else console.log("  (skip) " + from.trim().split("\n")[0].slice(0, 52));
}

fs.writeFileSync(F, css, "utf8");
console.log(`${n}/${REPL.length} design changes lage`);
