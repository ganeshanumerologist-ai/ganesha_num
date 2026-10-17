// Rahu Kaal / Yamaganda / Gulika ab FIXED IST string the:
//   RAHUKAAL = { 0: "16:30 - 18:00", 1: "07:30 - 09:00", ... }
//
// Ye Delhi ke standard IST times hain, isliye har shehar me wahi dikhte
// the. Asli niyam ye hai:
//   • din ko 8 bhag me baanto
//   • har shehar me iska apna ek bhag Rahu Kaal hota hai
//   • wo bhag SURYODAY se shuru hota hai, 6:00 se nahi
//
// Toh Nagpur, Jaipur aur Delhi ke Rahu Kaal alag hone chahiye. Ye module
// wahi karta hai — aur output bhi wahi format me deta hai taaki
// Panchang.jsx ka layout na tode.
import fs from "node:fs";

const F = "src/utils/panchang.js";
let s = fs.readFileSync(F, "utf8");

if (s.includes("rahuKaalWindow")) {
  console.log("pehle se maujood");
  process.exit(0);
}

const CODE = `

// ════════════════════════════════════════════════════════════════════
//  RAHU KAAL / YAMAGANDA / GULIKA — SHEHAR KE HISAAB SE
//
//  User ne kaha: "Delhi ka kya kaam, sabhi jagah ka alag alag hota hai."
//  Pehle ye fixed IST strings the (RAHUKAAL["0"] = "16:30 - 18:00"),
//  to Nagpur aur Chennai me bhi wahi time dikhta tha — galat.
//
//  Niyam: din ko 8 chhote bhag me baanto (Ravivaar=0… Shanivaar=6).
//  Har shehar me inme se ek bhag Rahu Kaal, ek Yamaganda, ek Gulika.
//  Pehla bhag us shehar ki SURYODAY se shuru hota hai — 6:00 se nahi.
// ════════════════════════════════════════════════════════════════════

// Ravivaar=0 … Shanivaar=6 → kis bhag par kaunsa kaal
const KAAL_SEG = {
  0: { rahu: 7, yama: 4, guli: 5 },
  1: { rahu: 1, yama: 2, guli: 3 },
  2: { rahu: 5, yama: 6, guli: 4 },
  3: { rahu: 6, yama: 0, guli: 2 },
  4: { rahu: 4, yama: 5, guli: 0 },
  5: { rahu: 3, yama: 1, guli: 6 },
  6: { rahu: 2, yama: 3, guli: 1 },
};

/**
 * Rahu Kaal / Yamaganda / Gulika ki windows, shehar ke hisaab se.
 * @param sunrise  minutes from midnight (local)
 * @param sunset   minutes from midnight
 * @param weekday  0 = Ravivaar … 6 = Shanivaar
 * @returns { rahu:{from,to,text}, yamaganda:{...}, gulika:{...} }
 */
export function kaalWindows(sunrise, sunset, weekday) {
  const day = sunset - sunrise;
  const seg = day / 8;
  const at = (i) => [sunrise + seg * i, sunrise + seg * (i + 1)];
  const pick = (key) => {
    const [from, to] = at(KAAL_SEG[weekday][key]);
    return { from, to, text: \`\${fmtMin(from)} – \${fmtMin(to)}\` };
  };
  return { rahu: pick("rahu"), yamaganda: pick("yama"), gulika: pick("guli") };
}

/** Sirf ek: Rahu Kaal ka text. */
export function rahuKaalWindow(sunrise, sunset, weekday) {
  return kaalWindows(sunrise, sunset, weekday).rahu;
}
`;

s = s.replace(/\n*$/, "\n") + CODE;
fs.writeFileSync(F, s, "utf8");
console.log("panchang.js me kaalWindows + rahuKaalWindow add ho gaya");
