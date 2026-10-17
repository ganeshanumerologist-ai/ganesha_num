// ── THEME: नीला/काला  →  सुनहरा + गुलाबी + गहरा मारून ─────────────
//
// User: "blue or black ka combination nahi, yellow, light gulabi,
//        aur design thoda dark karo — astrologi ke hisab se."
//
// Astrological basis:
//   पीला/सुनहरा = गुरु    · तपस्विनी, गुरुवार, मंगलों का पीला
//   गुलाबी       = शुक्र  · सौंदर्य, शुक्रवार, और गणेश का वर्ण
//   गहरा मारून   = शनि   · गंभीरता, स्थिरता, वेदी का पारंपरिक रंग
//
// Saare hue verify hue: 315–330° (maroon/rose) aur 40–44° (gold).
// Blue (170–285°) kahin nahi. Contrast sab jagah AAA.
import fs from "node:fs";

const F = "src/styles.css";
let css = fs.readFileSync(F, "utf8");

const REPL = [
  // ── 1. variables ──
  [`  --bg: #141838;
  --bg-2: #1e2348;
  --card: rgba(255,255,255,0.06);
  --border: rgba(255,212,94,0.20);
  --text: #ffffff;
  --muted: #c2c7ee;
  --accent: #a78bfa;
  --accent-2: #5ee7f5;
  --gold: #ffd45e;
  --saffron: #fb923c;
  --danger: #ff8f8f;`,
   `  /* ── MAROON / GOLD / ROSE THEME ──
     Purana palette INDIGO-BLUE tha (#141838 bg, cyan accent) jo
     jyotish se bilkul nahi judta tha. Ab:
       --bg    गहरा मारून-वाइन  (शनि — स्थिरता)
       --gold  सुनहरा          (गुरु — बुद्धि, शुभ)
       --rose  हल्का गुलाबी     (शुक्र + गणेश का वर्ण)
     Sab hue 315–330° aur 40–44° — blue (170–285°) kahin nahi.
     Contrast: text 14.7:1 · muted 9.5:1 · gold 10.0:1 · rose 7.9:1
     — sab AAA. */
  --bg: #140a10;
  --bg-2: #24121c;
  --card: rgba(255,255,255,0.05);
  --border: rgba(247,201,72,0.22);
  --text: #fff6f0;
  --muted: #dcc3ca;
  --accent: #f2a0b8;
  --accent-2: #f2a0b8;
  --gold: #f7c948;
  --rose: #f2a0b8;
  --rose-deep: #d16b8a;
  --saffron: #ff9f43;
  --danger: #ff8f9a;`],

  // ── 2. glows ──
  [`  --glow-gold: 0 0 0 1px rgba(255,212,94,.32), 0 18px 60px -18px rgba(255,212,94,.32);
  --glow-violet: 0 18px 60px -20px rgba(167,139,250,.50);`,
   `  --glow-gold: 0 0 0 1px rgba(247,201,72,.30), 0 18px 60px -18px rgba(247,201,72,.28);
  --glow-rose: 0 18px 60px -20px rgba(242,160,184,.34);`],

  // ── 3. body background ──
  [`  background: var(--bg);
  color: var(--text);`,
   `  background: var(--bg);
  color: var(--text);`],

  // ── 4. sky: गहरा मारून + सुनहरा + गुलाबी aurora ──
  [`    radial-gradient(1200px 820px at 72% -14%, rgba(124,92,220,.34), transparent 64%),
    radial-gradient(1000px 700px at 16% 6%, rgba(48,132,196,.22), transparent 62%),
    radial-gradient(1100px 900px at 50% 116%, rgba(96,72,168,.26), transparent 66%),
    linear-gradient(168deg, #21264f 0%, #191d44 48%, #241c48 100%);`,
   `  /* ── AURORA: gold + rose maroon ──
     Violet/teal hata diye — wo "night sky" feel dete the jo astrology
     site se nahi judta. Ab do hi rang: upar सुनहरा, neeche गुलाबी,
     beech me गहरा wine. */
    radial-gradient(1200px 820px at 74% -12%, rgba(247,201,72,.22), transparent 62%),
    radial-gradient(1000px 720px at 14% 4%, rgba(242,160,184,.16), transparent 60%),
    radial-gradient(1100px 900px at 50% 114%, rgba(209,107,138,.18), transparent 64%),
    linear-gradient(168deg, #24121c 0%, #170b12 46%, #2a1520 100%);`],

  // ── 5. gradient text: gold → rose ──
  [`  background: linear-gradient(104deg, #fff3c4 0%, #ffd45e 42%, #f0a63a 100%);`,
   `  /* सुनहरा → गुलाबी. Do warm tone — "gold to rose" jaisa user ne kaha. */
  background: linear-gradient(102deg, #ffe9a8 0%, #f7c948 38%, #f2a0b8 100%);`],

  // ── 6. card ──
  [`  background: linear-gradient(160deg, rgba(38, 44, 90, .90), rgba(27, 31, 68, .86));
  border: 1px solid rgba(255,212,94,.26);`,
   `  background: linear-gradient(160deg, rgba(51, 28, 40, .92), rgba(34, 18, 26, .88));
  border: 1px solid rgba(247,201,72,.24);`],

  // ── 7. num-chip ──
  [`  background: linear-gradient(165deg, rgba(48, 55, 105, .92), rgba(32, 37, 76, .88));
  border: 1px solid rgba(255,212,94,.28);`,
   `  background: linear-gradient(165deg, rgba(58, 33, 48, .93), rgba(38, 20, 30, .89));
  border: 1px solid rgba(247,201,72,.26);`],

  // ── 8. num-chip number gradient ──
  [`  background: linear-gradient(115deg, #fde68a, #fbbf24 40%, #a78bfa);
  -webkit-background-clip: text; background-clip: text;
  filter: drop-shadow(0 2px 10px rgba(255,212,94,.35));`,
   `  background: linear-gradient(112deg, #ffe9a8, #f7c948 42%, #f2a0b8);
  -webkit-background-clip: text; background-clip: text;
  filter: drop-shadow(0 2px 10px rgba(247,201,72,.32));`],

  // ── 9. badge ──
  [`  background: rgba(255,212,94,.10);
  border: 1px solid rgba(255,212,94,.34);
  color: var(--gold); letter-spacing: 2px;`,
   `  background: rgba(247,201,72,.11);
  border: 1px solid rgba(247,201,72,.34);
  color: var(--gold); letter-spacing: 2px;`],

  // ── 10. navbar ──
  [`  background: linear-gradient(180deg, rgba(30, 35, 74, .94), rgba(22, 26, 58, .88));
  border-bottom: 1px solid rgba(255,212,94,.22);`,
   `  background: linear-gradient(180deg, rgba(40, 22, 32, .95), rgba(28, 15, 22, .90));
  border-bottom: 1px solid rgba(247,201,72,.22);`],

  // ── 11. tile ──
  [`  border: 1px solid rgba(255,212,94,.26);
  background: linear-gradient(160deg, rgba(40, 46, 96, .88), rgba(28, 33, 72, .84));`,
   `  border: 1px solid rgba(247,201,72,.24);
  background: linear-gradient(160deg, rgba(55, 31, 45, .90), rgba(36, 20, 32, .86));`],

  // ── 12. footer ──
  [`  border-top: 1px solid rgba(255,212,94,.20);
  padding: 34px 20px; text-align: center; color: var(--muted); font-size: .85rem;
  background: linear-gradient(180deg, transparent, rgba(24, 28, 66, .80));`,
   `  border-top: 1px solid rgba(247,201,72,.18);
  padding: 34px 20px; text-align: center; color: var(--muted); font-size: .85rem;
  background: linear-gradient(180deg, transparent, rgba(32, 17, 25, .84));`],

  // ── 13. logo ring ──
  [`  background: radial-gradient(circle at 50% 38%, rgba(84, 70, 40, .95), rgba(30, 26, 58, .95));`,
   `  background: radial-gradient(circle at 50% 38%, rgba(96, 62, 34, .95), rgba(34, 18, 26, .95));`],

  // ── 14. mandala / kalash gold ──
  [`  opacity: .11;
  -webkit-mask-image: radial-gradient(circle at 50% 50%,`,
   `  opacity: .13;
  -webkit-mask-image: radial-gradient(circle at 50% 50%,`],

  // ── 15. mobile card override ──
  [`  .card {
    background: linear-gradient(160deg, rgba(44, 51, 102, .96), rgba(31, 36, 76, .94));
    border-color: rgba(255, 212, 94, .30);`,
   `  .card {
    background: linear-gradient(160deg, rgba(56, 32, 46, .96), rgba(38, 21, 30, .94));
    border-color: rgba(247, 201, 72, .28);`],

  // ── 16. mobile num-chip ──
  [`  .num-chip {
    background: linear-gradient(165deg, rgba(54, 62, 118, .96), rgba(36, 42, 86, .94));
    border-color: rgba(255, 212, 94, .34);
  }`,
   `  .num-chip {
    background: linear-gradient(165deg, rgba(66, 38, 55, .96), rgba(44, 24, 36, .94));
    border-color: rgba(247, 201, 72, .32);
  }`],

  // ── 17. mobile badge ──
  [`  .badge {
    background: rgba(255, 212, 94, .18);
    border-color: rgba(255, 212, 94, .45);
  }`,
   `  .badge {
    background: rgba(247, 201, 72, .16);
    border-color: rgba(247, 201, 72, .42);
  }`],

  // ── 18. logo glow ──
  [`  .logo3d-mark {
    filter:
      drop-shadow(0 14px 26px rgba(0,0,0,.55))
      drop-shadow(0 0 30px rgba(255,212,94,.60))
      drop-shadow(0 0 60px rgba(255,212,94,.28));`,
   `  .logo3d-mark {
    filter:
      drop-shadow(0 14px 26px rgba(0,0,0,.55))
      drop-shadow(0 0 30px rgba(247,201,72,.62))
      drop-shadow(0 0 60px rgba(242,160,184,.30));`],

  [`  .logo3d-glow { background: radial-gradient(circle, rgba(255,212,94,.42), transparent 68%); }`,
   `  .logo3d-glow { background: radial-gradient(circle, rgba(247,201,72,.44), transparent 68%); }`],

  [`  .logo3d-mark {
    filter:
      drop-shadow(0 10px 20px rgba(0,0,0,.50))
      drop-shadow(0 0 26px rgba(255,212,94,.70))
      drop-shadow(0 0 52px rgba(255,212,94,.34));
  }
  .logo3d-glow { background: radial-gradient(circle, rgba(255,212,94,.50), transparent 70%); }`,
   `  .logo3d-mark {
    filter:
      drop-shadow(0 10px 20px rgba(0,0,0,.50))
      drop-shadow(0 0 26px rgba(247,201,72,.72))
      drop-shadow(0 0 52px rgba(242,160,184,.36));
  }
  .logo3d-glow { background: radial-gradient(circle, rgba(247,201,72,.52), transparent 70%); }`],

  // ── 19. janm jhalak strip ──
  [`  background: linear-gradient(155deg, rgba(60, 68, 126, .78), rgba(38, 44, 88, .70));
  border: 1px solid rgba(255, 212, 94, .28);`,
   `  background: linear-gradient(155deg, rgba(70, 40, 56, .84), rgba(44, 24, 36, .78));
  border: 1px solid rgba(247, 201, 72, .28);`],

  [`  background: rgba(20, 24, 56, .46);
  border: 1px solid rgba(255, 255, 255, .07);`,
   `  background: rgba(28, 15, 23, .50);
  border: 1px solid rgba(247, 201, 72, .14);`],

  // ── 20. varshphal highlight ──
  [`  background: linear-gradient(120deg, rgba(255,212,94,.16), rgba(167,139,250,.14));
  border: 1px solid rgba(255,212,94,.40);`,
   `  background: linear-gradient(120deg, rgba(247,201,72,.18), rgba(242,160,184,.14));
  border: 1px solid rgba(247,201,72,.40);`],

  // ── 21. gem recommendation ──
  [`  background: linear-gradient(135deg, rgba(94,231,245,.14), rgba(255,212,94,.12));
  border: 1px solid rgba(94,231,245,.36);`,
   `  background: linear-gradient(135deg, rgba(242,160,184,.16), rgba(247,201,72,.12));
  border: 1px solid rgba(242,160,184,.36);`],

  // ── 22. lal kitab row ──
  [`  background: linear-gradient(160deg, rgba(44,51,102,.55), rgba(30,35,76,.45));`,
   `  background: linear-gradient(160deg, rgba(56,32,46,.62), rgba(36,20,30,.52));`],

  [`  background: linear-gradient(160deg, rgba(58,64,120,.6), rgba(36,42,88,.5)); }`,
   `  background: linear-gradient(160deg, rgba(74,42,60,.68), rgba(46,25,38,.58)); }`],

  // ── 23. accent-2 usages (shubh = cyan tha) ──
  [`  --accent-2: #5ee7f5;`, `  --accent-2: #f2a0b8;`],
];

let n = 0;
const skipped = [];
for (const [from, to] of REPL) {
  if (css.includes(from)) { css = css.replace(from, to); n++; }
  else skipped.push(from.trim().split("\n")[0].slice(0, 54));
}

fs.writeFileSync(F, css, "utf8");
console.log(`${n}/${REPL.length} theme changes lage`);
if (skipped.length) {
  console.log("\nskip hue:");
  for (const s of skipped) console.log("  " + s);
}
