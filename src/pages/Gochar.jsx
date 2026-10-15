import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import { grahaName, rashiName } from "../i18n/charts.js";
import { grahaSthiti, RASHIS } from "../utils/astro.js";

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const TX = {
  hi: {
    title: "गोचर 2026", sub: "आज की ग्रह-स्थिति गणना से।",
    vakriT: "वक्री ग्रह (आज)", sadeT: "साढ़ेसाती जांच (2026 — शनि मीन में)", grahanT: "ग्रहण 2026",
    sade: {
      peak: ["साढ़ेसाती चरम पर", "शनि आपकी ही राशि में — सबसे कठिन चरण। हनुमान-उपासना, धैर्य।"],
      last: ["साढ़ेसाती अंतिम चरण", "परीक्षा खत्म होने वाली — पुरस्कार शुरू।"],
      first: ["साढ़ेसाती प्रथम चरण", "शुरुआती चरण — बचत करो, सेहत का ध्यान रखो।"],
      dhaiya: ["शनि ढैया", "शनि 4थे/8वें — सावधानी रखें।"],
      none: ["साढ़ेसाती नहीं", "समय अनुकूल है।"],
    },
    grahan: [
      ["2026-02-17", "सूर्य ग्रहण", "भारत में दृश्य नहीं।"],
      ["2026-03-03", "चंद्र ग्रहण (पूर्ण)", "पूर्वी भारत में आंशिक दृश्य।"],
      ["2026-08-12", "सूर्य ग्रहण (पूर्ण)", "भारत में दृश्य नहीं।"],
      ["2026-08-28", "चंद्र ग्रहण (आंशिक)", "भारत में दृश्य नहीं।"],
    ],
    vakriYes: (l) => `${l.join(", ")} वक्री गति में हैं।`,
    vakriNo: "आज कोई प्रमुख ग्रह वक्री नहीं है।",
    retro: "वक्री",
  },
  mr: {
    title: "गोचर 2026", sub: "आजची ग्रह-स्थिती गणनेतून.",
    vakriT: "वक्री ग्रह (आज)", sadeT: "साडेसाती तपासणी (2026 — शनी मीन राशीत)", grahanT: "ग्रहणे 2026",
    sade: {
      peak: ["साडेसाती शिखरावर", "शनी तुमच्याच राशीत — सर्वात कठीण टप्पा. हनुमान-उपासना, धीरज."],
      last: ["साडेसाती शेवटचा टप्पा", "परीक्षा संपत आहे — बक्षीस सुरू."],
      first: ["साडेसाती पहिला टप्पा", "सुरुवातीचा टप्पा — बचत करा, आरोग्याची काळजी घ्या."],
      dhaiya: ["शनी धैया", "शनी 4थ्या/8व्या स्थानी — सावधगिरी बाळगा."],
      none: ["साडेसाती नाही", "वेळ अनुकूल आहे."],
    },
    grahan: [
      ["2026-02-17", "सूर्यग्रहण", "भारतात दिसणार नाही."],
      ["2026-03-03", "चंद्रग्रहण (पूर्ण)", "पूर्व भारतात अंशतः दिसेल."],
      ["2026-08-12", "सूर्यग्रहण (पूर्ण)", "भारतात दिसणार नाही."],
      ["2026-08-28", "चंद्रग्रहण (अंशतः)", "भारतात दिसणार नाही."],
    ],
    vakriYes: (l) => `${l.join(", ")} वक्री गतीत आहेत.`,
    vakriNo: "आज कोणताही प्रमुख ग्रह वक्री नाही.",
    retro: "वक्री",
  },
  en: {
    title: "Transits 2026", sub: "Today's planetary positions, calculated.",
    vakriT: "Retrograde Planets (today)", sadeT: "Sadesati Check (2026 — Saturn in Pisces)", grahanT: "Eclipses 2026",
    sade: {
      peak: ["Sadesati at Peak", "Saturn in your own sign — toughest phase. Hanuman worship, patience."],
      last: ["Sadesati Final Phase", "Trials ending — rewards begin."],
      first: ["Sadesati First Phase", "Starting phase — save money, care for health."],
      dhaiya: ["Saturn Dhaiya", "Saturn 4th/8th — stay careful."],
      none: ["No Sadesati", "Time is favourable."],
    },
    grahan: [
      ["2026-02-17", "Solar Eclipse", "Not visible in India."],
      ["2026-03-03", "Total Lunar Eclipse", "Partially visible in east India."],
      ["2026-08-12", "Total Solar Eclipse", "Not visible in India."],
      ["2026-08-28", "Partial Lunar Eclipse", "Not visible in India."],
    ],
    vakriYes: (l) => `${l.join(", ")} are retrograde.`,
    vakriNo: "No major planet is retrograde today.",
    retro: "Retro",
  },
};

function sadesati(moonRashi, T) {
  if (moonRashi === "Meena") return T.sade.peak;
  if (moonRashi === "Kumbha") return T.sade.last;
  if (moonRashi === "Mesha") return T.sade.first;
  if (moonRashi === "Mithuna" || moonRashi === "Tula") return T.sade.dhaiya;
  return T.sade.none;
}

export default function Gochar() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const T = TX[lang] || TX.en;
  const [moon, setMoon] = useState("Meena");
  const g = grahaSthiti(todayISO());
  const vakri = Object.entries(g).filter(([, v]) => v.vakri).map(([k]) => grahaName(k, lang));
  const sd = sadesati(moon, T);

  return (
    <div>
      <h1 className="text-gradient">{T.title} — Guru, Shani</h1>
      <p>{T.sub}</p>

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {Object.entries(g).map(([k, v]) => (
          <div key={k} className="card" style={{ textAlign: "center" }}>
            <h3>{grahaName(k, lang)} {v.vakri ? <span className="badge">{T.retro}</span> : null}</h3>
            <div className="num" style={{ fontSize: "1.6rem", fontWeight: 800 }}><span className="text-gradient">{rashiName(v.rashi, lang)}</span></div>
            <p style={{ fontSize: ".8rem" }}>{v.lon}°</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>{T.vakriT}</h3>
        <p style={{ marginTop: 8 }}>{vakri.length ? T.vakriYes(vakri) : T.vakriNo}</p>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>{T.sadeT}</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {RASHIS.map((r) => (
            <button key={r} className={moon === r ? "btn" : "btn secondary"} style={{ padding: "8px 14px" }} onClick={() => setMoon(r)}>
              {rashiName(r, lang)}
            </button>
          ))}
        </div>
        <h3 style={{ marginTop: 14 }}>{sd[0]}</h3>
        <p style={{ marginTop: 6 }}>{sd[1]}</p>
      </div>

      <h2 style={{ marginTop: 30 }}>{T.grahanT}</h2>
      <div className="grid grid-2" style={{ marginTop: 12 }}>
        {T.grahan.map((gr) => (
          <div key={gr[0]} className="card">
            <h3>{gr[0]} — {gr[1]}</h3>
            <p style={{ marginTop: 6 }}>{gr[2]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
