// ── DESIGN PASS 2: typography ────────────────────────────────────────
//
// Screenshot me 3 problems the:
//   1. Headline ka gradient gold → pink → purple → cyan tha — 4 rang,
//      jo "rainbow" dikhta hai, classy nahi. Ab 2 warm rang.
//   2. H1 poori screen le raha tha — hierarchy nahi, breathing nahi.
//   3. Subtext pehli line ke end me cut ho raha tha (overflow).
//
// 4K/UHD ke liye: clamp() se fluid sizing, tight line-height, aur
// letter-spacing chhota — bade display text me chhota tracking
// professional lagta hai.
import fs from "node:fs";

const F = "src/styles.css";
let css = fs.readFileSync(F, "utf8");

const REPL = [
  // ── 1. gradient text: 2 rang, warm ──
  [
`  background: linear-gradient(115deg, #fde68a 0%, #fbbf24 28%, #a78bfa 62%, #67e8f9 100%);
  -webkit-background-clip: text; background-clip: text;
  filter: drop-shadow(0 4px 22px rgba(251,191,36,.25));`,
`  /* Sirf 2 rang — gold se halka gold. 4 rang "rainbow" dete hain,
     jo cheap lagta hai; brand ke liye ek hi khada rang + uska
     highlight kafi hai. */
  background: linear-gradient(104deg, #fff3c4 0%, #ffd45e 42%, #f0a63a 100%);
  -webkit-background-clip: text; background-clip: text;
  filter: drop-shadow(0 6px 26px rgba(255,212,94,.28));`,
  ],

  // ── 2. hero: spacing + hierarchy ──
  [
`.hero {
  position: relative;
  padding: 92px 20px 56px;
  text-align: center;
  isolation: isolate;
}`,
`/* ── HERO ──
   Pehle 92px top + bada H1 = poori screen khaali. Ab upar se thoda
   kam, neeche zyada — isse "saans" milti hai aur agli section ka
   hint bhi dikhta hai (scroll affordance). */
.hero {
  position: relative;
  padding: 68px 20px 76px;
  text-align: center;
  isolation: isolate;
}`,
  ],

  // ── 3. H1: fluid, tighter, wala look ──
  [
`/* Kundli: saare numbers ek saath, upar ki strip me */`,
`/* ── FLUID DISPLAY TYPE ──
   clamp(min, preferred, max) — 360px phone se 4K monitor tak ek hi
   rule chalti hai, koi breakpoint chain nahi. Display text me
   line-height 1.05 aur tracking -0.02em "premium" feel deta hai. */
.hero h1 {
  font-size: clamp(2.1rem, 6.4vw, 5rem);
  line-height: 1.06;
  letter-spacing: -0.022em;
  font-weight: 800;
  margin: 18px auto 0;
  max-width: 16ch;
  /* gradient ke neeche halka shadow — art ke upar bhi text khada rahe */
  text-shadow: 0 4px 30px rgba(12, 10, 34, .55);
}
.hero p {
  font-size: clamp(.98rem, 1.55vw, 1.16rem);
  line-height: 1.72;
  max-width: 62ch;
  margin: 18px auto 0;
  color: var(--muted);
  text-shadow: 0 2px 12px rgba(12, 10, 34, .6);
}

/* Kundli: saare numbers ek saath, upar ki strip me */`,
  ],

  // ── 4. badge: thoda premium ──
  [
`.badge {
  display: inline-block; padding: 5px 16px; border-radius: 999px; font-size: .75rem;
  background: rgba(251,191,36,.10); border: 1px solid rgba(251,191,36,.38);
  color: var(--gold); letter-spacing: 1.4px; text-transform: uppercase; font-weight: 700;
}`,
`.badge {
  display: inline-block; padding: 6px 18px; border-radius: 999px;
  font-size: .72rem;
  background: rgba(255,212,94,.10);
  border: 1px solid rgba(255,212,94,.34);
  color: var(--gold); letter-spacing: 2px;
  text-transform: uppercase; font-weight: 700;
  backdrop-filter: blur(8px);
}`,
  ],

  // ── 5. section headings: bhi consistent scale ──
  [
`/* ══════════════════════════════════════════════════════════════
   पूरी कुंडली — navigator chips + tables`,
`/* ── SECTION HEADINGS: bhi same fluid scale ── */
.sec-head h2, .card h2 {
  font-size: clamp(1.35rem, 2.9vw, 2.1rem);
  line-height: 1.18;
  letter-spacing: -0.014em;
}
.sec-head .kicker {
  font-size: .72rem; letter-spacing: 3px; color: var(--gold);
  opacity: .8; margin-bottom: 6px;
}

/* ══════════════════════════════════════════════════════════════
   पूरी कुंडली — navigator chips + tables`,
  ],
];

let n = 0;
for (const [from, to] of REPL) {
  if (css.includes(from)) { css = css.replace(from, to); n++; }
  else console.log("  (skip) " + from.trim().split("\n")[0].slice(0, 52));
}

fs.writeFileSync(F, css, "utf8");
console.log(`${n}/${REPL.length} typography changes lage`);
