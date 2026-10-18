// ════════════════════════════════════════════════════════════════════
//  LIGHT THEME CONVERTER
//
//  User ne kaha: "kisi bhi background me black colour nahi hona tha,
//  koi dark background mat daalo jis se website ka mayaaz kharab ho,
//  massy nahi hona — saaf dikhni chahiye."
//
//  Yani: CREAM / IVORY background, white cards, aur gold-rose brand
//  ACCENT ke roop me. Text gehra maroon (pure black nahi — warm).
//
//  Do cheezein dhyan rakhni hain:
//   1. MASK me `#000` ZAROORI hai (mask-image luminance/alpha se
//      kaam karta hai). Wahan haath nahi lagana.
//   2. Gold TEXT ko light background par DARK karna padta hai.
//      #f7c948 cream par gayab ho jaata hai. Isliye --gold ab
//      #8a5a00 (bronze) hai — wahi "sunehra" parivaar, par padhne layak.
//      Bright gold #f7c948 sirf FILL ke liye bacha hai (buttons).
// ════════════════════════════════════════════════════════════════════
import fs from "node:fs";

const F = "src/styles.css";
let s = fs.readFileSync(F, "utf8");
let n = 0;

const rep = (from, to, why) => {
  const c = s.split(from).length - 1;
  if (!c) { console.log(`  MISS  ${why}\n        "${from}"`); return; }
  s = s.split(from).join(to);
  n += c;
  console.log(`  ${String(c).padStart(3)}x  ${why}`);
};

// ─────────────────────────────────────────────────────────────
//  1. :root tokens
// ─────────────────────────────────────────────────────────────
const OLD_ROOT_START = s.indexOf(":root {");
const OLD_ROOT_END = s.indexOf("\n}", OLD_ROOT_START) + 2;

const NEW_ROOT = `:root {
  /* ════════════════════════════════════════════════════════════
     LIGHT THEME — cream + gold + rose

     User ne kaha: "kisi bhi background me black nahi", "dark
     background mat daalo", "saaf dikhni chahiye".

     Yahan HAR rang ka contrast card par (scripts/check-light.mjs):
       --text  #2b141c  13.4:1  AAA
       --muted #6a4351   6.4:1  AA
       --gold  #8a5a00   6.6:1  AA   (bronze — cream par bright
                                        #f7c948 GAYAB ho jaata)
       --rose  #b0356a   5.4:1  AA
     ───────────────────────────────────────────────────────────═ */

  /* ── Background: garm cream ──
     Pure white (#fff) clinical lagta hai — "hospital". Cream usse
     thoda garam rakhta hai bina dhundhla kiye. */
  --bg: #fdf6ee;
  --bg-2: #f6e8d9;

  /* Card white hai, background cream — do levels ka contrast
     automatic ban jaata hai (shadow ki zaroorat kam). */
  --card: rgba(255,255,255,0.94);

  /* Border maroon-tinted hairline — grey nahi, to brand bana rehta hai */
  --border: rgba(122,60,86,0.16);

  /* Text: gehra maroon-black. PURE BLACK (#000) nahi — wo harsh hai
     aur maroon brand ke saath clash karta hai. */
  --text: #2b141c;
  --muted: #6a4351;

  /* ── Brand accent ──
     Bright gold/rose sirf FILL ke liye (button background, chip).
     TEXT ke liye dark version — cream par bright gold padha hi
     nahi jaata. */
  --accent: #b0356a;
  --accent-2: #b0356a;
  --gold: #8a5a00;
  --rose: #b0356a;
  --rose-deep: #8d2450;

  --gold-bright: #f2b705;   /* button fill */
  --saffron: #a15c00;
  --danger: #b3261e;

  --radius: 18px;

  /* Shadow: maroon-tinted, na pure black na blue-tinted.
     Blue-ish shadow light theme me "dirty" dikhta hai. */
  --shadow-soft: 0 1px 2px rgba(122,60,86,.06), 0 4px 14px rgba(122,60,86,.07);
  --shadow-card: 0 2px 4px rgba(122,60,86,.05), 0 12px 32px -12px rgba(122,60,86,.16);
  --shadow-pop:  0 10px 34px -8px rgba(122,60,86,.26);
  --glow-gold: 0 0 0 1px rgba(197,145,10,.30), 0 14px 44px -16px rgba(197,145,10,.30);
  --glow-rose: 0 14px 44px -16px rgba(214,120,158,.34);
}`;

console.log("═══ :root ═══");
s = s.slice(0, OLD_ROOT_START) + NEW_ROOT + s.slice(OLD_ROOT_END);
console.log("  replaced :root block");

// ─────────────────────────────────────────────────────────────
//  2. Background layers
// ─────────────────────────────────────────────────────────────
console.log("\n═══ Background layers ═══");

rep("#24121c 0%, #170b12 46%, #2a1520 100%",
    "#fdf6ee 0%, #f9eee1 46%, #fff9f2 100%", "jy-sky base gradient → cream");

rep("rgba(247,201,72,.22), transparent 62%",
    "rgba(224,166,32,.30), transparent 62%", "aurora gold → strong gold");

rep("rgba(242,160,184,.16), transparent 60%",
    "rgba(226,140,175,.26), transparent 60%", "aurora rose");

rep("rgba(209,107,138,.18), transparent 64%",
    "rgba(200,110,150,.18), transparent 64%", "aurora wine");

rep("radial-gradient(140% 100% at 50% 45%, transparent 74%, rgba(12,6,9,.22) 100%)",
    "radial-gradient(140% 100% at 50% 45%, transparent 76%, rgba(122,60,86,.10) 100%)",
    "vignette → warm soft");

rep("radial-gradient(140% 100% at 50% 40%, transparent 78%, rgba(14,7,11,.18) 100%)",
    "radial-gradient(140% 100% at 50% 40%, transparent 80%, rgba(122,60,86,.08) 100%)",
    "jy-vignette → warm soft");

// ─────────────────────────────────────────────────────────────
//  3. Surfaces (navbar, panel, card, dropdown, footer)
// ─────────────────────────────────────────────────────────────
console.log("\n═══ Surfaces ═══");

rep("linear-gradient(160deg, rgba(32, 18, 25, .94), rgba(24, 13, 19, .92))",
    "linear-gradient(160deg, rgba(255,253,250,.96), rgba(250,240,228,.94))",
    "jy-bg panel → frosted white");

rep("rgba(10,14,32,.78)", "rgba(122,60,86,.10)", "panel tint → warm");

rep("linear-gradient(160deg, rgba(51, 28, 40, .92), rgba(34, 18, 26, .88))",
    "linear-gradient(160deg, rgba(255,253,250,.97), rgba(250,240,230,.95))",
    "navbar → frosted white");

rep("linear-gradient(160deg, rgba(56, 32, 46, .96), rgba(38, 21, 30, .94))",
    "linear-gradient(160deg, rgba(255,255,255,.97), rgba(250,240,230,.95))",
    "surface A → white");

rep("linear-gradient(165deg, rgba(66, 38, 55, .96), rgba(44, 24, 36, .94))",
    "linear-gradient(165deg, rgba(255,252,246,.96), rgba(250,238,226,.94))",
    "surface B → white");

rep("linear-gradient(160deg, rgba(55, 31, 45, .90), rgba(36, 20, 32, .86))",
    "linear-gradient(160deg, rgba(255,252,246,.94), rgba(250,238,226,.92))",
    "gem-rec → white");

rep("linear-gradient(165deg, rgba(58, 33, 48, .93), rgba(38, 20, 30, .89))",
    "linear-gradient(165deg, rgba(255,252,246,.93), rgba(250,236,224,.91))",
    "num-chip → white");

rep("linear-gradient(180deg, rgba(40, 22, 32, .95), rgba(28, 15, 22, .90))",
    "linear-gradient(180deg, rgba(255,252,246,.95), rgba(250,238,226,.92))",
    "tile → white");

rep("linear-gradient(160deg, rgba(56,32,46,.62), rgba(36,20,30,.52))",
    "linear-gradient(160deg, rgba(255,253,249,.80), rgba(250,240,230,.70))",
    "lal-kitab row → light");

rep("linear-gradient(160deg, rgba(74,42,60,.6), rgba(46,25,38,.5))",
    "linear-gradient(160deg, rgba(255,250,244,.78), rgba(250,238,226,.68))",
    "lal-kitab row 2 → light");

rep("linear-gradient(155deg, rgba(70, 40, 56, .84), rgba(44, 24, 36, .78))",
    "linear-gradient(155deg, rgba(255,253,249,.94), rgba(250,240,230,.90))",
    "janm-jhalak → white");

rep("radial-gradient(circle at 50% 38%, rgba(96, 62, 34, .95), rgba(34, 18, 26, .95))",
    "radial-gradient(circle at 50% 38%, rgba(255,252,245,.97), rgba(250,236,222,.95))",
    "janm strip radial → light");

rep("linear-gradient(180deg, transparent, rgba(32, 17, 25, .84))",
    "linear-gradient(180deg, rgba(253,246,238,0), rgba(247,235,222,.92))",
    "footer gradient → cream");

rep("rgba(28, 15, 23, .50)", "rgba(255,255,255,.55)", "overlay → white");

rep("#2a1622", "#fffdfa", "select/option bg → white (3 jagah)");

rep("rgba(255,255,255,.055), transparent 42%",
    "rgba(255,255,255,.60), transparent 42%", "card gloss");

rep("rgba(255,255,255,0.04)", "rgba(122,60,86,.045)", "input bg → warm tint");
rep("rgba(255,255,255,0.05)", "rgba(122,60,86,.05)", "surface tint");
rep("rgba(255,255,255,.06)", "rgba(255,255,255,.85)", "inset highlight → white");
rep("rgba(255,255,255,.07)", "rgba(122,60,86,.05)", "chip bg → warm tint");
rep("rgba(255, 255, 255, .04)", "rgba(122,60,86,.045)", "field bg → warm tint");
rep("rgba(255,255,255,.04)", "rgba(122,60,86,.045)", "field bg → warm tint");

// ─────────────────────────────────────────────────────────────
//  4. Shadows + text-shadows
// ─────────────────────────────────────────────────────────────
console.log("\n═══ Shadows ═══");

rep("0 20px 50px -30px rgba(0,0,0,.95)", "0 20px 46px -28px rgba(122,60,86,.22)", "card shadow");
rep("0 14px 40px -28px rgba(0,0,0,1)", "0 14px 34px -24px rgba(122,60,86,.22)", "tile shadow");
rep("0 12px 32px rgba(0,0,0,.5)", "0 10px 28px -8px rgba(122,60,86,.22)", "dropdown shadow");
rep("0 18px 44px -30px rgba(0,0,0,.95)", "0 18px 40px -28px rgba(122,60,86,.22)", "gem-rec shadow");
rep("drop-shadow(0 14px 26px rgba(0,0,0,.55))", "drop-shadow(0 10px 20px rgba(122,60,86,.18))", "logo drop");
rep("drop-shadow(0 10px 20px rgba(0,0,0,.50))", "drop-shadow(0 8px 16px rgba(122,60,86,.16))", "mark drop");
rep("text-shadow: 0 1px 2px rgba(0,0,0,.55)", "text-shadow: 0 1px 2px rgba(122,60,86,.12)", "hero text shadow");
rep("text-shadow: 0 4px 30px rgba(11, 6, 9, .55)", "text-shadow: 0 2px 18px rgba(122,60,86,.16)", "h1 shadow");
rep("text-shadow: 0 2px 12px rgba(11, 6, 9, .6)", "text-shadow: 0 1px 8px rgba(122,60,86,.14)", "hero p shadow");
rep("text-shadow: 0 1px 3px rgba(0, 0, 0, .55)", "text-shadow: none", "page text shadow");
rep("text-shadow: 0 2px 10px rgba(0, 0, 0, .7)", "text-shadow: 0 1px 6px rgba(122,60,86,.14)", "kundli title shadow");

// ─────────────────────────────────────────────────────────────
//  5. Gradient TEXT — bright gold/rose cream par invisible hai
// ─────────────────────────────────────────────────────────────
console.log("\n═══ Gradient text ═══");
const g1 = s.indexOf("linear-gradient(90deg");
if (g1 >= 0) console.log(`  gradient-text @L${s.slice(0, g1).split("\n").length}`);
// gradient ke stops — kahi bhi #ffe9a8 / #f7c948 / #f2a0b8 sequence
rep("#ffe9a8 0%, #f7c948 42%, #f2a0b8 100%",
    "#7a4a00 0%, #a1426b 46%, #b0356a 100%", "headline gradient → deep bronze→rose");
rep("#ffe9a8, #f7c948 55%, #f2a0b8",
    "#7a4a00, #a1426b 55%, #b0356a", "number-card gradient");

// ─────────────────────────────────────────────────────────────
//  6. Inline-ish leftovers
// ─────────────────────────────────────────────────────────────
console.log("\n═══ Misc ═══");
rep(".lang-wrap .lang-select option { color: #000; }",
    ".lang-wrap .lang-select option { color: #2b141c; }", "option text");
rep("color: #1a1206;", "color: #2b141c;", "gold button text (dark on gold = fine)");
rep("background: linear-gradient(135deg, #f7c948, #f7c948);",
    "background: linear-gradient(135deg, #f2b705, #e09b06);", "gold button fill");
rep("#c2c7ee", "#6a4351", "stale muted hex");
rep("#9d9fc4", "#8a6572", "stale muted hex 2");
rep("#e2e6ff", "#f6e8d9", "stale pale hex");

fs.writeFileSync(F, s, "utf8");
console.log(`\n${n} replacement hue`);

// ─────────────────────────────────────────────────────────────
//  REMAINING dark values — dekhna hai ki mask to nahi
// ─────────────────────────────────────────────────────────────
const lines = s.split("\n");
console.log("\n═══ baaki dark values ═══");
lines.forEach((l, i) => {
  if (/#000\b/.test(l)) console.log(`  L${i + 1}  ${l.trim().slice(0, 100)}`);
  if (/rgba\(\s*0\s*,\s*0\s*,\s*0/.test(l)) console.log(`  L${i + 1}  ${l.trim().slice(0, 100)}`);
  if (/#[0-1][0-9a-f]{5}\b/i.test(l) && !/Purana|pehle|Naya|chain/.test(l))
    console.log(`  L${i + 1}  ${l.trim().slice(0, 100)}`);
});