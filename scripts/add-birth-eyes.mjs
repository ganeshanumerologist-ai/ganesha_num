// Kundli.jsx: result ke niche ek bada, prominent "janm ki jhalak"
// strip. Pehle ye sab sirf neeche scroll karne par milta tha.
import fs from "node:fs";

const F = "src/pages/Kundli.jsx";
let s = fs.readFileSync(F, "utf8");

if (s.includes("bg-eyes")) {
  console.log("already present");
  process.exit(0);
}

const ANCHOR = `            {glance.length > 0 && (
              <div className="num-strip">`;

if (!s.includes(ANCHOR)) {
  console.log("!! anchor nahi mila");
  process.exit(1);
}

const BLOCK = `            {/* ══════════════════════════════════════════════════
                JANM KI JHALAK — rashi, nakshatra, gana, vara, tithi.
                User ne kaha ye "abhibhi nahi dikh rahi". Pehle ye sab
                sirf neeche scroll karne par milte the, isliye page khaali
                lagta tha. Ab seedha naam ke niche. */}
            <BirthEyes form={result} />

`;

s = s.replace(ANCHOR, BLOCK + ANCHOR);

// ── component: file ke end me ──
const COMPONENT = `

/**
 * Janm ki jhalak — ek nazar me poora birth chart.
 * Lagna, sun/moon rashi, nakshatra (pada + gana + nadi), vara (svami),
 * tithi, paksha, yoga, karana.
 */
function BirthEyes({ form }) {
  const { lang } = useLanguage();
  const S = siteTX(lang);
  const r = useMemo(() => {
    try { return kundliFull(form); } catch { return null; }
  }, [form.birthdate, form.time, form.place]);

  const g = r?.glance;
  if (!g) return null;

  const NAK = { Ashwini: 0, Bharani: 1, Krittika: 2, Rohini: 3, Mrigashira: 4, "Mrigashira": 4,
    Ardra: 5, Punarvasu: 6, Pushya: 7, Ashlesha: 8, Magha: 9, "Purva Phalguni": 10,
    "Uttara Phalguni": 11, Hasta: 12, Chitra: 13, Swati: 14, Vishakha: 15,
    Anuradha: 16, Jyeshtha: 17, Mula: 18, "Purva Ashadha": 19, "Uttara Ashadha": 20,
    Shravana: 21, Dhanishta: 22, Shatabhisha: 23, "Purva Bhadrapada": 24,
    "Uttara Bhadrapada": 25, Revati: 26 };
  void NAK;

  const GANA_HI = { Deva: "देव", Manushya: "मानव", Rakshasa: "राक्षस" };
  const GANA_MR = { Deva: "देव", Manushya: "माणूस", Rakshasa: "राक्षस" };
  const NADI_HI = { Adya: "आद्य", Madhya: "मध्य", Antya: "अंत्य" };

  const isMr = lang === "mr";
  const ganaTxt = isMr ? (GANA_MR[g.gana] || g.gana) : (GANA_HI[g.gana] || g.gana);
  const nadiTxt = isMr
    ? { Adya: "आद्य", Madhya: "मध्य", Antya: "अंत्य" }[g.nadi] || g.nadi
    : NADI_HI[g.nadi] || g.nadi;

  const cells = [
    { k: S.pg_lagna_full || "लग्न", v: g.lagna
        ? \`\${rashiName(rIdx(g.lagna), lang)} · \${grahaName(SANSK[g.lagnaLord], lang)}\`
        : S.pg_no_time || "समय नहीं" },
    { k: "सूर्य राशि", v: rashiName(rIdx(g.sunRashi), lang) },
    { k: "चंद्र राशि", v: \`\${rashiName(rIdx(g.moonRashi), lang)} \${g.moonDegree}\` },
    { k: "नक्षत्र", v: \`\${nakName(g.nakshatraIndex, lang)} · पाद \${g.nakPada}\` },
    { k: "गण", v: ganaTxt },
    { k: "नाडी", v: nadiTxt },
    { k: "राशि स्वामी", v: grahaName(SANSK[g.rashiLord], lang) },
    { k: "वार", v: \`\${vaarName(g.vara === "Ravivaar" ? 0 : g.vara === "Somvaar" ? 1 : g.vara === "Mangalvaar" ? 2 : g.vara === "Budhvaar" ? 3 : g.vara === "Guruvaar" ? 4 : g.vara === "Shukravaar" ? 5 : 6, lang)}\` },
    { k: "तिथि", v: \`\${tithiName(g.tithiNum - 1, lang)} · \${pakshaName(g.paksha, lang)}\` },
    { k: "योग", v: yogaName(g.yoga, lang) },
    { k: "करण", v: karanaName(g.karana, lang) },
  ];

  return (
    <div className="bg-eyes">
      <div className="bg-eyes-h">{S.pg_janm || "जन्म की झलक"}</div>
      <div className="bg-eyes-grid">
        {cells.map((c) => (
          <div className="bg-eye" key={c.k}>
            <span className="bg-eye-k">{c.k}</span>
            <span className="bg-eye-v">{c.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SANSK = {
  Mesha: "Mangal", Vrishabha: "Venus", Mithuna: "Mercury", Karka: "Moon",
  Simha: "Sun", Kanya: "Mercury", Tula: "Venus", Vrishchika: "Mars",
  Dhanu: "Jupiter", Makara: "Saturn", Kumbha: "Saturn", Meena: "Jupiter",
};
`;

s = s.replace(/\n*$/, "\n") + COMPONENT;

// ── imports ──
const IMP = [
  ['import ShareButtons from "../components/ShareButtons.jsx";',
   'import ShareButtons from "../components/ShareButtons.jsx";\n'
   + 'import { kundliFull } from "../utils/kundliFull.js";\n'
   + 'import { rIdx } from "../utils/rashiHelper.js";\n'
   + 'import { siteTX } from "../i18n/siteTx.js";\n'
   + 'import { grahaName, rashiName, nakName, vaarName, tithiName, pakshaName, yogaName, karanaName } from "../i18n/names.js";'],
];

for (const [from, to] of IMP) {
  if (s.includes(from)) { s = s.replace(from, to); console.log("import ok"); }
  else console.log("!! import nahi mila: " + from.slice(0, 40));
}

// useMemo chahiye
if (!/import React, \{[^}]*useMemo/.test(s)) {
  s = s.replace(/^import React, \{([^}]*)\} from "react";/m, 'import React, {$1, useMemo } from "react";');
  console.log("useMemo import");
}

fs.writeFileSync(F, s, "utf8");
console.log("BirthEyes component add ho gaya");
