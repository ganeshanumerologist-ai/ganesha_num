// Panchang.jsx: Rahu Kaal / Yamaganda / Gulika ab shehar-aware honge.
// Pehle fixed IST strings the — har shehar me wahi.
import fs from "node:fs";

const F = "src/pages/Panchang.jsx";
let s = fs.readFileSync(F, "utf8");

// ── 1. import ──
const I_OLD = "  abhijitWindow, godhuliWindow, horaFromSunrise, choghadiyaFromSunrise,\n} from \"../utils/panchang.js\";";
const I_NEW = "  abhijitWindow, godhuliWindow, horaFromSunrise, choghadiyaFromSunrise,\n  kaalWindows,\n} from \"../utils/panchang.js\";";
if (s.includes(I_OLD)) { s = s.replace(I_OLD, I_NEW); console.log("import ok"); }
else console.log("!! import nahi mila");

// ── 2. KAAL compute karo (ABHIJIT_WIN ke paas) ──
const C_OLD = "  const ABHIJIT_WIN = abhijitWindow(sun.sunrise, sun.dayLength);";
const C_NEW = `  const ABHIJIT_WIN = abhijitWindow(sun.sunrise, sun.dayLength);

  // Rahu Kaal / Yamaganda / Gulika — shehar ke hisaab se. Pehle fixed
  // IST strings the (RAHUKAAL[weekday]), to Nagpur me bhi Delhi ka time
  // dikhta tha. Ab har shehar ka apna hota hai.
  const KAAL = kaalWindows(sun.sunrise, sun.sunset, weekday);`;
if (s.includes(C_OLD)) { s = s.replace(C_OLD, C_NEW); console.log("compute ok"); }
else console.log("!! compute anchor nahi mila");

// ── 3. render: teeno jagah ──
const R = [
  [`{S.pan_rahu_kaal}: {RAHUKAAL[weekday]}`, `{S.pan_rahu_kaal}: {KAAL.rahu.text}`],
  [`<div className="card"><h3>{S.pan_yamaganda}</h3><p style={{ marginTop: 8 }}>{YAMAGANDA[weekday]}</p></div>`,
   `<div className="card"><h3>{S.pan_yamaganda}</h3><p style={{ marginTop: 8 }}>{KAAL.yamaganda.text}</p></div>`],
  [`<div className="card"><h3>{S.pan_gulika}</h3><p style={{ marginTop: 8 }}>{GULIKA[weekday]}</p></div>`,
   `<div className="card"><h3>{S.pan_gulika}</h3><p style={{ marginTop: 8 }}>{KAAL.gulika.text}</p></div>`],
];

for (const [from, to] of R) {
  if (s.includes(from)) { s = s.replace(from, to); console.log("render ok: " + from.slice(0, 42)); }
  else console.log("!! render nahi mila: " + from.slice(0, 42));
}

fs.writeFileSync(F, s, "utf8");
