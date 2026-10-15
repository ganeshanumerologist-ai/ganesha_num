import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import { pgX } from "../i18n/jyotish_c.js";
import kundliT from "../i18n/kundli.js";
import { destinyNumber, luckyNumber, reduceNumber } from "../utils/numerology.js";
import ShareButtons from "../components/ShareButtons.jsx";

const GRID = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];

const UPAY = {
  hi: {
    1: "आत्मविश्वास बढ़ाओ; रोज सूर्य-नमस्कार करो।", 2: "रिश्तों में धैर्य रखो; चांदी का प्रयोग करो।",
    3: "गुस्सा कंट्रोल करो; हनुमान-चालीसा पढ़ो।", 4: "काम लिखकर योजना बनाओ; हरे रंग का प्रयोग।",
    5: "संतुलन के लिए ध्यान करो।", 6: "परिवार को समय दो; सफेद वस्त्र पहनो।",
    7: "मीठा बोलना सीखो; जल-दान करो।", 8: "बचत की आदत डालो; शनिवार को शनि-सेवा।",
    9: "सेवा-भाव बढ़ाओ; लाल मसूर का दान करो।",
  },
  mr: {
    1: "आत्मविश्वास वाढवा; रोज सूर्यनमस्कार करा.", 2: "नात्यात संयम ठेवा; चांदी वापरा.",
    3: "रागावर ताबा ठेवा; हनुमान-चालिसा वाचा.", 4: "काम लिहून नियोजन करा; हिरवा रंग वापरा.",
    5: "संतुलनासाठी ध्यान करा.", 6: "कुटुंबाला वेळ द्या; पांढरे वस्त्र घाला.",
    7: "गोड बोलायला शिका; जलदान करा.", 8: "बचतीची सवय लावा; शनिवारी शनिसेवा.",
    9: "सेवाभाव वाढवा; लाल मसूर दान करा.",
  },
  en: {
    1: "Build confidence; do Surya-namaskar daily.", 2: "Be patient in relations; use silver.",
    3: "Control anger; read Hanuman-chalisa.", 4: "Plan in writing; use green.",
    5: "Meditate for balance.", 6: "Give time to family; wear white.",
    7: "Speak sweetly; donate water.", 8: "Save regularly; serve on Saturdays.",
    9: "Serve others; donate red lentils.",
  },
};
const VAAR_TX = {
  hi: { 1: "रविवार", 2: "सोमवार", 3: "गुरुवार", 4: "शनिवार", 5: "बुधवार", 6: "शुक्रवार", 7: "मंगलवार", 8: "शनिवार", 9: "मंगलवार" },
  mr: { 1: "रविवार", 2: "सोमवार", 3: "गुरुवार", 4: "शनिवार", 5: "बुधवार", 6: "शुक्रवार", 7: "मंगळवार", 8: "शनिवार", 9: "मंगळवार" },
  en: { 1: "Sunday", 2: "Monday", 3: "Thursday", 4: "Saturday", 5: "Wednesday", 6: "Friday", 7: "Tuesday", 8: "Saturday", 9: "Tuesday" },
};

function kuaNumber(year, gender) {
  let x = reduceNumber(year, false);
  let k = gender === "female"
    ? (year < 2000 ? 4 : 6) + x
    : (year < 2000 ? 11 : 10) - x;
  k = ((k - 1) % 9 + 9) % 9 + 1;
  if (k === 5) k = gender === "female" ? 8 : 2;
  return k;
}

export default function Loshu() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const X = pgX(lang);
  const L = kundliT(lang);
  const U = UPAY[lang] || UPAY.en;
  const V = VAAR_TX[lang] || VAAR_TX.en;
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [mobile, setMobile] = useState("");
  const [r, setR] = useState(null);

  const calc = (e) => {
    e.preventDefault();
    if (!dob) return;
    const digits = dob.replace(/\D/g, "").split("").map(Number).filter((d) => d !== 0);
    const digitSum = digits.reduce((a, b) => a + b, 0);
    const counts = {};
    digits.forEach((d) => { counts[d] = (counts[d] || 0) + 1; });
    const day = Number(dob.split("-")[2]);
    const year = Number(dob.split("-")[0]);
    const moolank = reduceNumber(day, false);
    const bhagyank = reduceNumber(digitSum, false);
    const grid = { ...counts };
    grid[moolank] = (grid[moolank] || 0) + 1;
    grid[bhagyank] = (grid[bhagyank] || 0) + 1;
    const kua = kuaNumber(year, gender);
    const nameNum = name.trim() ? destinyNumber(name.trim()) : null;
    const lucky = bhagyank;
    const luckyMob = mobile.trim() ? luckyNumber(mobile.trim()) : null;
    const luckyVaar = V[moolank];
    const luckyDates = [];
    for (let d = 1; d <= 31; d++) {
      if (reduceNumber(d, false) === moolank) luckyDates.push(d);
    }
    const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !grid[n]);
    setR({ counts, grid, digitSum, moolank, bhagyank, kua, nameNum, lucky, luckyMob, luckyVaar, luckyDates, missing });
  };

  return (
    <div>
      <h1 className="text-gradient">{P.pg_grid} + {P.pg_lucky}</h1>
      <p>{P.pg_moolank}, {P.pg_bhagyank}, {P.pg_kua}, {P.pg_namank}, {P.pg_lucky} — {P.pg_grid}.</p>

      <div className="card" style={{ marginTop: 16 }}>
        <form onSubmit={calc} className="grid grid-2">
          <div>
            <label className="label">{L.k_name}</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">{L.k_dob} *</label>
            <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </div>
          <div>
            <label className="label">{L.k_gender}</label>
            <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">{L.k_male}</option>
              <option value="female">{L.k_female}</option>
            </select>
          </div>
          <div>
            <label className="label">{X.pg_mobile}</label>
            <input className="input" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g. 9876543210" />
          </div>
          <div>
            <button className="btn" type="submit">{P.pg_grid} {X.pg_build}</button>
          </div>
        </form>
      </div>

      {r && (
        <div style={{ marginTop: 20 }}>
          <div className="grid grid-2">
            <div className="card" style={{ textAlign: "center" }}>
              <h3>{P.pg_grid}</h3>
              <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(3, 84px)", gap: 8, marginTop: 12 }}>
                {GRID.flat().map((n) => (
                  <div key={n} style={{
                    width: 84, height: 84, borderRadius: 12, border: "1px solid var(--border)",
                    background: r.grid[n] ? "linear-gradient(135deg, rgba(139,92,246,.35), rgba(34,211,238,.25))" : "rgba(255,255,255,.03)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "1.7rem", fontWeight: 800, opacity: r.grid[n] ? 1 : 0.35 }}>{n}</span>
                    {r.grid[n] > 1 && <span style={{ fontSize: ".75rem", color: "var(--gold)" }}>×{r.grid[n]}</span>}
                    {(n === r.moolank || n === r.bhagyank) && (
                      <span style={{ fontSize: ".7rem", color: "var(--accent-2)" }}>
                        {n === r.moolank && n === r.bhagyank ? "M+B" : n === r.moolank ? "M" : "B"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: ".8rem", marginTop: 8 }}>M = {P.pg_moolank}, B = {P.pg_bhagyank}.</p>
            </div>

            <div className="card">
              <h3>{P.pg_lucky}</h3>
              <p style={{ fontSize: ".85rem", marginTop: 6 }}>{P.pg_bhagyank} = {r.digitSum} → {r.bhagyank}</p>
              <div style={{ marginTop: 8 }}>
                <div className="kv"><span className="k">{P.pg_moolank}</span><span className="v">{r.moolank}</span></div>
                <div className="kv"><span className="k">{P.pg_bhagyank}</span><span className="v">{r.bhagyank}</span></div>
                <div className="kv"><span className="k">{P.pg_kua}</span><span className="v">{r.kua}</span></div>
                {r.nameNum && <div className="kv"><span className="k">{P.pg_namank}</span><span className="v">{r.nameNum}</span></div>}
                <div className="kv"><span className="k">{P.pg_luckynum}</span><span className="v">{r.lucky}</span></div>
                {r.luckyMob && <div className="kv"><span className="k">{P.pg_luckynum} (mobile)</span><span className="v">{r.luckyMob}</span></div>}
                <div className="kv"><span className="k">{P.pg_luckyvaar}</span><span className="v">{r.luckyVaar}</span></div>
                <div className="kv"><span className="k">{P.pg_dates}</span><span className="v">{r.luckyDates.join(", ")}</span></div>
              </div>
            </div>
          </div>

          {r.missing.length > 0 && (
            <div className="card" style={{ marginTop: 20 }}>
              <h3>{P.pg_missing} ({r.missing.join(", ")}) + {L.k_upay}</h3>
              {r.missing.map((n) => (
                <div key={n} className="kv"><span className="k">{n}</span><span className="v">{U[n]}</span></div>
              ))}
            </div>
          )}

          <ShareButtons title={P.pg_grid} text={`${P.pg_moolank} ${r.moolank}, ${P.pg_bhagyank} ${r.bhagyank}, ${P.pg_kua} ${r.kua}!`} />
        </div>
      )}
    </div>
  );
}
